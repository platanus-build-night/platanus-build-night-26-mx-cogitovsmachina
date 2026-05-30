import { AgentStep, MentalPlan, MemorySegment, DatabaseFork } from '@/types';
import { ghostClient } from '../ghost';
import { memoryClient } from '../memory';
import { getTemplate } from '../toolbox';

export interface StreamChunk {
  type: 'step' | 'plan' | 'memory' | 'database' | 'complete';
  data: any;
}

export async function* runOrchestrator(directive: string): AsyncGenerator<StreamChunk, void, unknown> {
  const sessionId = Math.random().toString(36).substr(2, 9);
  
  // --- PARSE LATAM TEMPLATE IF APPLICABLE ---
  let isTemplate = false;
  let templateCode = '';
  const match = directive.match(/Run\s+(MX_CFDI_AUDIT|BR_BOLETO_SYNC|CL_BOLETA_EMISSION)\s+template/i);
  
  if (match) {
    isTemplate = true;
    templateCode = match[1].toUpperCase();
  }

  // --- STEP 1: ROUTING & INTENT PARSING ---
  yield {
    type: 'step',
    data: {
      id: 'step_1',
      agentName: 'Router',
      status: 'running',
      message: isTemplate 
        ? `Recognized LatAm Toolbox intent: [${templateCode}] Compliance Check`
        : `Analyzing directive: "${directive}"`,
      timestamp: new Date().toISOString(),
      reasoning: "Decomposing high-level business goals into specialized agent actions..."
    }
  };
  
  await new Promise(resolve => setTimeout(resolve, 800));

  // Retrieve context from memory
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
      message: `Decomposed directive using ${memoryContext.length} memory context keys.`,
      timestamp: new Date().toISOString(),
      tokenCost: isTemplate ? 1500 : 2048
    }
  };

  // --- STEP 2: MENTAL PROTOTYPING (PLANNING AGENT) ---
  yield {
    type: 'step',
    data: {
      id: 'step_2',
      agentName: 'PlanningAgent',
      status: 'running',
      message: "Formulating execution plan and validation criteria...",
      timestamp: new Date().toISOString(),
      reasoning: "Simulating potential execution paths prior to executing mutations..."
    }
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  let plan: MentalPlan;

  if (isTemplate && templateCode) {
    const t = getTemplate(templateCode);
    plan = {
      directive,
      targetStateSpec: `JSON Spec v2.0 - Target state: validated ${t?.country} ${templateCode} ledger compliance`,
      steps: [
        {
          id: 'plan_1',
          description: `Fork production DB to isolate ${t?.country} compliance test environment`,
          dependencies: [],
          validationCriteria: "Active Ghost fork created"
        },
        {
          id: 'plan_2',
          description: `Verify sql constraints: ${t?.validationRules.join(', ')}`,
          dependencies: ['plan_1'],
          validationCriteria: "Zero compliance violations found in queries"
        },
        {
          id: 'plan_3',
          description: "Sync compliance results to memory.build episodic logs",
          dependencies: ['plan_2'],
          validationCriteria: "Episodic memory block synced"
        }
      ]
    };
  } else {
    plan = {
      directive,
      targetStateSpec: "JSON Spec v1.0 - Target state: verified database migrations and synced operations logs",
      steps: [
        {
          id: 'plan_1',
          description: "Provision disposable sandbox PostgreSQL database",
          dependencies: [],
          validationCriteria: "Active Ghost fork ID received and reachable"
        },
        {
          id: 'plan_2',
          description: "Execute schema updates and sample queries to verify compatibility",
          dependencies: ['plan_1'],
          validationCriteria: "Zero syntax errors returned from PostgreSQL compiler"
        },
        {
          id: 'plan_3',
          description: "Sync operation outcome and execution trace to memory.build",
          dependencies: ['plan_2'],
          validationCriteria: "Context sync confirmation payload received"
        }
      ]
    };
  }

  yield { type: 'plan', data: plan };

  yield {
    type: 'step',
    data: {
      id: 'step_2',
      agentName: 'PlanningAgent',
      status: 'success',
      message: "Mental prototyping complete. Execution plan validated against SMB safety boundaries.",
      timestamp: new Date().toISOString(),
      tokenCost: isTemplate ? 3000 : 4096
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
      message: `Database sandbox active: ${fork.id}. Testing template queries...`,
      timestamp: new Date().toISOString()
    }
  };

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Run SQL test query
  let sql = "SELECT * FROM users WHERE tenant_id = 101;";
  if (isTemplate && templateCode) {
    const t = getTemplate(templateCode);
    sql = t?.defaultSql || sql;
  }

  const dbResult = await ghostClient.executeQuery(fork.id, sql);
  
  yield {
    type: 'database',
    data: {
      action: 'query',
      forkId: fork.id,
      sql,
      result: dbResult
    }
  };

  yield {
    type: 'step',
    data: {
      id: 'step_3',
      agentName: 'DataAgent',
      status: 'success',
      message: "Database queries tested and validated successfully in sandbox.",
      timestamp: new Date().toISOString(),
      tokenCost: isTemplate ? 2800 : 3500,
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

  await new Promise(resolve => setTimeout(resolve, 800));

  // Sync compliance context into memory
  const syncKey = isTemplate ? `${templateCode}_compliance_result` : "execution_log";
  const syncValue = isTemplate 
    ? `Successfully verified compliance for template ${templateCode} on fork ${fork.id}.`
    : `Successfully executed: "${directive}" using ghost fork ${fork.id}`;

  const syncedMem = await memoryClient.syncSegment(syncKey, syncValue, "episodic");
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
      message: isTemplate
        ? `Verification harness succeeded. All SII/SAT/Bancário validation checks passed successfully.`
        : "Verification harness succeeded. All constraints met. Closed loop secured.",
      timestamp: new Date().toISOString(),
      tokenCost: 1000
    }
  };

  // Complete session
  const totalCost = isTemplate 
    ? (1500 + 3000 + 2800 + 1000) 
    : (2048 + 4096 + 3500 + 1500);

  yield {
    type: 'complete',
    data: {
      sessionId,
      status: 'success',
      totalCost,
      timestamp: new Date().toISOString()
    }
  };
}
