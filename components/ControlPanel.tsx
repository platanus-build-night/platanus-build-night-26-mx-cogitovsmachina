'use client';

import React from 'react';
import { Play, Sparkles, AlertCircle, Database, FileText, Globe } from 'lucide-react';
import { LatAmTemplates } from '@/lib/toolbox';

interface ControlPanelProps {
  onRunDirective: (directive: string) => void;
  isRunning: boolean;
}

const PRESETS = [
  {
    title: "Setup Inventory Sync & DB Fork",
    description: "Fork PostgreSQL on ghost.build and test schema for stock management, then sync endpoints.",
    directive: "Create stock_items table (id, name, quantity) in Ghost DB, run test SELECT, and sync outcome to memory.build."
  },
  {
    title: "LatAm Invoice System Audit",
    description: "Check transaction history within memory.build and mock-verify invoice parser via Osmani Harness.",
    directive: "Analyze active invoice schemas, perform schema validation on billing fork, and query test records."
  },
  {
    title: "Clean Context & Discard Sandboxes",
    description: "Clean contextual token buffers and discard active DB forks to save token costs.",
    directive: "Discard active postgres database forks and clean working memory nodes from memory.build."
  }
];

export const ControlPanel: React.FC<ControlPanelProps> = ({ onRunDirective, isRunning }) => {
  const [customDirective, setCustomDirective] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState<'presets' | 'latam'>('presets');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDirective.trim() && !isRunning) {
      onRunDirective(customDirective.trim());
    }
  };

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-950/50 border border-violet-800/50 rounded-lg text-violet-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-neutral-100">Closed-Loop Controller</h2>
          <p className="text-[11px] text-neutral-400">Input instructions or run pre-made LatAm SMB templates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            AI Agent Directive
          </label>
          <textarea
            value={customDirective}
            onChange={(e) => setCustomDirective(e.target.value)}
            disabled={isRunning}
            placeholder="Type your autonomous company objective (e.g., 'Verify client schema updates on Ghost DB and update episodic memory')..."
            className="w-full h-24 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition disabled:opacity-50 resize-none font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isRunning || !customDirective.trim()}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-violet-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Agent Core Executing...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Initiate Closed-Loop
            </>
          )}
        </button>
      </form>

      <div className="border-t border-neutral-800/80 pt-4">
        <div className="flex gap-2 mb-4 p-0.5 bg-neutral-950 border border-neutral-850 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedTab('presets')}
            className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition ${
              selectedTab === 'presets' 
                ? 'bg-neutral-850 text-violet-400 border border-neutral-800' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Core Presets
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('latam')}
            className={`flex-1 py-1.5 text-[10px] font-semibold rounded-md transition flex items-center justify-center gap-1 ${
              selectedTab === 'latam' 
                ? 'bg-neutral-850 text-violet-400 border border-neutral-800' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3 h-3 text-blue-400" />
            LatAm Toolbox
          </button>
        </div>

        {selectedTab === 'presets' ? (
          <div className="space-y-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isRunning}
                onClick={() => {
                  setCustomDirective(preset.directive);
                  onRunDirective(preset.directive);
                }}
                className="w-full text-left p-3 bg-neutral-950 hover:bg-neutral-800/40 border border-neutral-850 rounded-xl transition flex flex-col gap-1 group disabled:opacity-50"
              >
                <span className="text-[11px] font-bold text-neutral-200 group-hover:text-violet-400 transition flex items-center gap-1.5">
                  {idx === 0 && <Database className="w-3 h-3 text-blue-400" />}
                  {idx === 1 && <AlertCircle className="w-3 h-3 text-yellow-400" />}
                  {idx === 2 && <FileText className="w-3 h-3 text-red-400" />}
                  {preset.title}
                </span>
                <span className="text-[10px] text-neutral-400 leading-normal">
                  {preset.description}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {LatAmTemplates.map((template) => (
              <button
                key={template.code}
                type="button"
                disabled={isRunning}
                onClick={() => {
                  const d = `Run ${template.code} template: ${template.description} Execute verification: ${template.validationRules.join(', ')}`;
                  setCustomDirective(d);
                  onRunDirective(d);
                }}
                className="w-full text-left p-3 bg-neutral-950 hover:bg-neutral-800/40 border border-neutral-850 rounded-xl transition flex flex-col gap-1 group disabled:opacity-50"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold text-neutral-200 group-hover:text-violet-400 transition">
                    {template.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono border text-blue-400 bg-blue-950/30 border-blue-900/40">
                    {template.country}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 leading-normal">
                  {template.description}
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[8px] text-neutral-500 font-mono">
                    Limit: {template.tokenCostLimit.toLocaleString()} tokens
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
