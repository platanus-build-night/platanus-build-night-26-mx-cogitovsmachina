'use client';

import React from 'react';
import { Terminal, Shield, List, Cpu, BookOpen } from 'lucide-react';

interface SkillItem {
  name: string;
  source: string;
}

interface McpSkillsPanelProps {
  loadedSkills: SkillItem[];
  mcpUrl: string;
}

const MCP_TOOLS_LIST = [
  {
    name: "ghost_fork_db",
    desc: "Clones primary DB to clean PostgreSQL instance",
    params: "{ sourceDb?: string }"
  },
  {
    name: "ghost_run_sql",
    desc: "Executes SQL statements in the sandbox",
    params: "{ forkId: string, sql: string }"
  },
  {
    name: "memory_sync",
    desc: "Syncs context to memory.build episodic layer",
    params: "{ key: string, value: string }"
  },
  {
    name: "memory_retrieve",
    desc: "Queries past episodic memory vectors",
    params: "{ query: string }"
  },
  {
    name: "latam_get_template",
    desc: "Fetches tax, CFDI 4.0 or SII schemas",
    params: "{ country?: string }"
  }
];

export const McpSkillsPanel: React.FC<McpSkillsPanelProps> = ({ loadedSkills, mcpUrl }) => {
  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-950/50 border border-indigo-800/50 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">Model Context Protocol</h2>
            <p className="text-xs text-neutral-400">Local HTTP JSON-RPC 2.0 MCP server</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Connection endpoint info */}
        <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
              Server URL
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="font-mono text-xs text-indigo-400 truncate bg-neutral-900 p-2 rounded border border-neutral-850">
            {mcpUrl}
          </div>
        </div>

        {/* Tools list */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
            <List className="w-4 h-4" />
            Exposed MCP Tools
          </div>
          <div className="space-y-2">
            {MCP_TOOLS_LIST.map((tool, idx) => (
              <div key={idx} className="bg-neutral-950/60 border border-neutral-850/80 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-200">{tool.name}</span>
                  <span className="text-[9px] font-mono text-neutral-500">{tool.params}</span>
                </div>
                <span className="text-[11px] text-neutral-400 leading-normal">{tool.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loaded Skills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" />
            Active Framework Skills
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {loadedSkills.map((skill, idx) => (
              <div key={idx} className="bg-neutral-950/60 border border-neutral-850/80 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-neutral-300">{skill.name}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">{skill.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
