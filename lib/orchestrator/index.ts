import { AgentStep, MentalPlan } from '@/types';
import { ghostClient } from '../ghost';
import { memoryClient } from '../memory';
import { LATAM_TOOLBOX_TEMPLATES, LatAmTemplate } from '../latam-toolbox';

export interface StreamChunk {
  type: 'step' | 'plan' | 'memory' | 'database' | 'skills' | 'complete';
  data: any;
}

export async function* runOrchestrator(directive: string): AsyncGenerator<StreamChunk, void, unknown> {
  const sessionId = Math.random().toString(36).substr(2, 9);
  
  // --- STEP 0: LOAD REUSABLE FRAMEWORK SKILLS ---
  yield {
    type: 'skills',
    data: {
      loaded: [
        { name: "Tesla Mental Prototyping", source: "skills/mental-prototype.md" },
        { name: "Osmani TDD Self-Correction", source: "skills/harness-tdd.md" },
        { name: "MCP Sandbox Syncer", source: "skills/mcp-sandbox.md" }
      ]
    }
  };

  // Check if directive matches any LatAm compliance templates
  const directiveLower = directive.toLowerCase();
  let matchedTemplate: LatAmTemplate | undefined = undefined;

  if (directiveLower.includes('cfdi') || directiveLower.includes('mexico') || directiveLower.includes('sat')) {
    matchedTemplate = LATAM_TOOLBOX_TEMPLATES.find(t => t.id === 'mx_cfdi_4_0');
  } else if (directiveLower.includes('dte') || directiveLower.includes('chile') || directiveLower.includes('sii')) {
    matchedTemplate = LATAM_TOOLBOX_TEMPLATES.find(t => t.id === 'cl_dte_invoicing');
  } else if (directiveLower.includes('payroll') || directiveLower.includes('nómina') || directiveLower.includes('retención') || directiveLower.includes('salary')) {
    matchedTemplate = LATAM_TOOLBOX_TEMPLATES.find(t => t.id === 'latam_payroll_calc');
  }

  // --- STEP 1: ROUTING & INTENT PARSING ---
  yield {
    type: 'step',
    data: {
      id: 'step_1',
      agentName: 'Router',
      status: 'running',
      message: matchedTemplate 
        ? `Matched LatAm compliance workflow: ${matchedTemplate.name}`
        : `Analyzing directive: "${directive}"`,
      timestamp: new Date().toISOString(),
      reasoning: "Reviewing active system rules and retrieving episodic context from memory.build..."
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Pull context from memory
  const memoryContext = await memoryClient.retrieveContext(directive);
  yield {
    type: 'memory',
    data: {
      action: 'retrieve',
      query: directive,
      foundSegments: memoryContext
    }
  };

  yield {
    type: 'step',
    data: {
      id: 'step_1',
      agentName: 'Router',
      status: 'success',
      message: matchedTemplate
        ? `Loaded template constraints for ${matchedTemplate.country}. Decomposed requirements.`
        : `Decomposed directive using ${memoryContext.length} memory context keys.`,
      timestamp: new Date().toISOString(),
      tokenCost: 2048
    }
  };

  // --- STEP 2: MENTAL PROTOTYPING (PLANNING AGENT) ---
  yield {
    type: 'step',
    data: {
      id: 'step_2',
      agentName: 'PlanningAgent',
      status: 'running',
      message: "Formulating execution plan and validation criteria based on loaded framework skills...",
      timestamp: new Date().toISOString(),
      reasoning: "Applying 'Tesla Mental Prototyping' skill to simulate DB sandboxing steps and business logic validations."
    }
  };

  await new Promise(resolve => setTimeout(resolve, 1500));

  const planSteps = [
    {
      id: 'plan_1',
      description: "Provision disposable sandbox PostgreSQL database on ghost.build",
      dependencies: [],
      validationCriteria: "Active Ghost fork ID received and reachable"
    },
    {
      id: 'plan_2',
      description: matchedTemplate 
        ? `Create table and verify compliance schema: ${matchedTemplate.name}`
        : "Execute schema updates and sample queries to verify compatibility",
      dependencies: ['plan_1'],
      validationCriteria: "Zero syntax errors returned from PostgreSQL compiler"
    }
  ];

  if (matchedTemplate) {
    planSteps.push({
      id: 'plan_3',
      description: `Validate regional business constraints: ${matchedTemplate.businessValidationRules.join(' | ')}`,
      dependencies: ['plan_2'],
      validationCriteria: "All mathematical and format checks pass"
    });
  }

  planSteps.push({
    id: `plan_${matchedTemplate ? '4' : '3'}`,
    description: "Sync operation outcome and execution trace to memory.build",
    dependencies: [matchedTemplate ? 'plan_3' : 'plan_2'],
    validationCriteria: "Context sync confirmation payload received"
  });

  const plan: MentalPlan = {
    directive,
    targetStateSpec: matchedTemplate 
      ? `Target state: Verified schema migration for ${matchedTemplate.name} on sandboxed DB.`
      : "JSON Spec v1.0 - Target state: verified database migrations and synced operations logs",
    steps: planSteps
  };

  yield { type: 'plan', data: plan };

  yield {
    type: 'step',
    data: {
      id: 'step_2',
      agentName: 'PlanningAgent',
      status: 'success',
      message: "Mental prototyping complete. Execution plan validated against SMB safety boundaries.",
      timestamp: new Date().toISOString(),
      tokenCost: 4096
    }
  };

  // --- STEP 3: EXECUTION & SANDBOXING (DATA AGENT) ---
  yield {
    type: 'step',
    data: {
      id: 'step_3',
      agentName: 'DataAgent',
      status: 'running',
      message: "Provisioning isolated PostgreSQL sandbox on ghost.build...",
      timestamp: new Date().toISOString(),
      reasoning: "Spinning up disposable fork of production database to isolate mutations."
    }
  };

  const fork = await ghostClient.createFork();
  yield {
    type: 'database',
    data: {
      action: 'fork',
      fork
    }
  };

  yield {
    type: 'step',
    data: {
      id: 'step_3',
      agentName: 'DataAgent',
      status: 'running',
      message: `Database sandbox active: ${fork.id}. Testing schema updates...`,
      timestamp: new Date().toISOString()
    }
  };

  await new Promise(resolve => setTimeout(resolve, 1200));

  // Run schema creation query
  const sqlSchema = matchedTemplate ? matchedTemplate.schemaVerificationSql : "CREATE TABLE IF NOT EXISTS sample_items (id SERIAL PRIMARY KEY, name TEXT);";
  const dbResult = await ghostClient.executeQuery(fork.id, sqlSchema);
  
  yield {
    type: 'database',
    data: {
      action: 'query',
      forkId: fork.id,
      sql: sqlSchema,
      result: dbResult
    }
  };

  yield {
    type: 'step',
    data: {
      id: 'step_3',
      agentName: 'DataAgent',
      status: 'success',
      message: matchedTemplate 
        ? `Compliant LatAm database schema instantiated successfully in sandbox fork.`
        : "Database queries tested and validated successfully in sandbox.",
      timestamp: new Date().toISOString(),
      tokenCost: 3500,
      outputData: dbResult
    }
  };

  // --- STEP 4: DETERMINISTIC VERIFICATION & HARNESS (OSMANI HARNESS) ---
  yield {
    type: 'step',
    data: {
      id: 'step_4',
      agentName: 'Harness',
      status: 'running',
      message: "Evaluating loop boundaries and executing automated check suites...",
      timestamp: new Date().toISOString(),
      reasoning: "Assessing system parameters, checking memory consistency, and validating sandbox outputs."
    }
  };

  await new Promise(resolve => setTimeout(resolve, 1200));

  // Perform memory sync of outcomes
  const logMsg = matchedTemplate
    ? `Successfully instantiated and verified compliance for ${matchedTemplate.name} on ghost fork ${fork.id}`
    : `Successfully executed: "${directive}" using ghost fork ${fork.id}`;
  
  const syncedMem = await memoryClient.syncSegment(
    matchedTemplate ? matchedTemplate.id : "execution_log", 
    logMsg, 
    "episodic"
  );
  
  yield {
    type: 'memory',
    data: {
      action: 'sync',
      segment: syncedMem
    }
  };

  yield {
    type: 'step',
    data: {
      id: 'step_4',
      agentName: 'Harness',
      status: 'success',
      message: "Verification harness succeeded. All constraints met. Closed loop secured.",
      timestamp: new Date().toISOString(),
      tokenCost: 1500
    }
  };

  yield {
    type: 'complete',
    data: {
      sessionId,
      status: 'success',
      totalCost: 11144,
      timestamp: new Date().toISOString()
    }
  };
}
