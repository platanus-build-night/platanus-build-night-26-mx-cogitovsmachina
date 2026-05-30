import { NextRequest, NextResponse } from 'next/server';
import { MCPRequest, MCPResponse } from '@/types/mcp';
import { ghostClient } from '@/lib/ghost';
import { memoryClient } from '@/lib/memory';
import { LATAM_TOOLBOX_TEMPLATES } from '@/lib/latam-toolbox';

export const runtime = 'edge';

const AVAILABLE_TOOLS = [
  {
    name: "ghost_fork_db",
    description: "Creates an isolated, disposable PostgreSQL database fork via ghost.build",
    inputSchema: {
      type: "object",
      properties: {
        sourceDb: { type: "string", description: "The database name to clone. Defaults to production_main." }
      }
    }
  },
  {
    name: "ghost_run_sql",
    description: "Executes a SQL query or schema migration against a sandboxed Ghost fork",
    inputSchema: {
      type: "object",
      properties: {
        forkId: { type: "string", description: "The ID of the active database fork." },
        sql: { type: "string", description: "The raw SQL statement to run." }
      },
      required: ["forkId", "sql"]
    }
  },
  {
    name: "memory_sync",
    description: "Persists working memory segments into memory.build episodic memory",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string", description: "Context label or identifier." },
        value: { type: "string", description: "Detailed text payload to save." }
      },
      required: ["key", "value"]
    }
  },
  {
    name: "memory_retrieve",
    description: "Retrieves contextually relevant episodic memory blocks from memory.build",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search terms or keywords." }
      },
      required: ["query"]
    }
  },
  {
    name: "latam_get_template",
    description: "Retrieves localized LatAm compliance database and business rules templates",
    inputSchema: {
      type: "object",
      properties: {
        country: { type: "string", description: "Filter by country (MX, CL, CO, BR, Regional)." }
      }
    }
  }
];

export async function POST(req: NextRequest) {
  try {
    const requestBody: MCPRequest = await req.json();
    const { jsonrpc, id, method, params } = requestBody;

    if (jsonrpc !== '2.0') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: id || null,
        error: { code: -32600, message: "Invalid JSON-RPC version. Expected '2.0'." }
      } as MCPResponse, { status: 400 });
    }

    let result: any = null;

    switch (method) {
      case 'tools/list':
        result = { tools: AVAILABLE_TOOLS };
        break;

      case 'tools/call':
        const { name, arguments: toolArgs } = params || {};
        if (!name) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: "Tool name is required for tools/call." }
          } as MCPResponse, { status: 400 });
        }

        try {
          if (name === 'ghost_fork_db') {
            const fork = await ghostClient.createFork(toolArgs?.sourceDb);
            result = {
              content: [{ type: 'text', text: `Provisioned database fork: ${fork.id} forked from ${fork.forkedFrom}` }]
            };
          } else if (name === 'ghost_run_sql') {
            const queryRes = await ghostClient.executeQuery(toolArgs.forkId, toolArgs.sql);
            result = {
              content: [{
                type: 'text',
                text: queryRes.success 
                  ? `SQL ran successfully. Rows affected: ${queryRes.rowsAffected}. Output: ${JSON.stringify(queryRes.result)}`
                  : `SQL error: ${queryRes.error}`
              }],
              isError: !queryRes.success
            };
          } else if (name === 'memory_sync') {
            const segment = await memoryClient.syncSegment(toolArgs.key, toolArgs.value, 'episodic');
            result = {
              content: [{ type: 'text', text: `Episodic memory synced. Key: ${segment.key}, ID: ${segment.id}` }]
            };
          } else if (name === 'memory_retrieve') {
            const segments = await memoryClient.retrieveContext(toolArgs.query);
            result = {
              content: [{ type: 'text', text: `Found ${segments.length} matching contexts: ${JSON.stringify(segments)}` }]
            };
          } else if (name === 'latam_get_template') {
            const filtered = toolArgs?.country 
              ? LATAM_TOOLBOX_TEMPLATES.filter(t => t.country.toLowerCase() === toolArgs.country.toLowerCase())
              : LATAM_TOOLBOX_TEMPLATES;
            result = {
              content: [{ type: 'text', text: JSON.stringify(filtered) }]
            };
          } else {
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              error: { code: -32601, message: `Tool '${name}' not found.` }
            } as MCPResponse, { status: 404 });
          }
        } catch (toolError: any) {
          result = {
            content: [{ type: 'text', text: `Execution failed: ${toolError.message}` }],
            isError: true
          };
        }
        break;

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method '${method}' not found.` }
        } as MCPResponse, { status: 404 });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      result
    } as MCPResponse);

  } catch (err: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: `Parse error: ${err.message}` }
    } as MCPResponse, { status: 500 });
  }
}
