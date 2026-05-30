'use client';

import React from 'react';
import { LATAM_TOOLBOX_TEMPLATES, LatAmTemplate } from '@/lib/latam-toolbox';
import { Globe, ArrowRight, CheckCircle, FileCode } from 'lucide-react';

interface LatAmToolboxPanelProps {
  onRunTemplate: (directive: string) => void;
  isRunning: boolean;
}

export const LatAmToolboxPanel: React.FC<LatAmToolboxPanelProps> = ({ onRunTemplate, isRunning }) => {
  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-950/50 border border-blue-800/50 rounded-lg text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">LatAm Toolbox</h2>
            <p className="text-xs text-neutral-400">Compliance & regional SMB database templates</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-1">
        {LATAM_TOOLBOX_TEMPLATES.map((template) => (
          <div key={template.id} className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 flex flex-col gap-3.5 transition hover:border-blue-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-900/50">
                  {template.country}
                </span>
                <span className="text-xs font-semibold text-neutral-200">
                  {template.name}
                </span>
              </div>
              <button
                onClick={() => onRunTemplate(`Instantiate and verify compliance rules for ${template.name}`)}
                disabled={isRunning}
                className="p-1 px-2.5 text-[10px] font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition flex items-center gap-1 disabled:opacity-50"
              >
                Deploy Fork
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-neutral-450 leading-relaxed font-mono">
              {template.description}
            </p>

            <div className="space-y-1.5 border-t border-neutral-900 pt-3">
              <div className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                Compliance Validation Rules
              </div>
              {template.businessValidationRules.map((rule, index) => (
                <div key={index} className="text-[10px] text-neutral-400 font-mono leading-normal flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
