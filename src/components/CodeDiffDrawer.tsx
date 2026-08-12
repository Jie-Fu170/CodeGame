import React from 'react';
import { SystemScenario } from '../config/umlTempleScenarios';
import { Code2, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface CodeDiffDrawerProps {
  scenario: SystemScenario;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeDiffDrawer: React.FC<CodeDiffDrawerProps> = ({ scenario, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto flex items-end justify-center z-50 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t-2 border-purple-500/80 rounded-t-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-y-auto p-6 flex flex-col animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-slate-100">
              真实架构重构对比：{scenario.patternName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Bad Code */}
          <div className="bg-slate-950/80 border border-red-500/40 rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2 text-red-400 font-bold mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>重构前 (Bad Code 恶心臃肿代码)</span>
            </div>
            
            <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 mb-3 flex-grow leading-relaxed">
              <code>{scenario.badCode}</code>
            </pre>
            
            <div className="bg-red-950/30 border border-red-500/30 p-3 rounded-lg text-xs text-red-200 leading-relaxed">
              <strong>痛点分析：</strong> {scenario.badCodeExplanation}
            </div>
          </div>

          {/* Good Code */}
          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>重构后 (Good Code 设计模式优雅落解)</span>
            </div>
            
            <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-emerald-300/90 overflow-x-auto border border-slate-800 mb-3 flex-grow leading-relaxed">
              <code>{scenario.goodCode}</code>
            </pre>
            
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg text-xs text-emerald-200 leading-relaxed">
              <strong>架构优势：</strong> {scenario.goodCodeExplanation}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
          >
            理解完毕，继续防御战斗
          </button>
        </div>

      </div>
    </div>
  );
};
