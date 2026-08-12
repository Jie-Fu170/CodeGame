import React from 'react';
import { SystemScenario } from '../config/umlTempleScenarios';
import { GitBranch, Layers } from 'lucide-react';

interface UMLBlueprintPanelProps {
  scenario: SystemScenario;
  isUnlocked: boolean;
}

export const UMLBlueprintPanel: React.FC<UMLBlueprintPanelProps> = ({ scenario, isUnlocked }) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-2xl w-80 text-slate-200 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span>UML 实时架构蓝图</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isUnlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
          {isUnlocked ? '✓ 模式匹配完成' : '待构建防御架构'}
        </span>
      </div>

      {/* Recommended Solution Pattern Badge */}
      <div className="mb-3 p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
        <span className="text-[11px] text-purple-200 font-semibold flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          架构目标：
        </span>
        <span className="text-xs font-bold text-yellow-300 font-mono">{scenario.patternName}</span>
      </div>

      {/* Class diagram visualization */}
      <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
        {scenario.umlNodes.map((node) => (
          <div
            key={node.id}
            className={`p-2 rounded border transition-all duration-300 ${
              isUnlocked
                ? 'bg-purple-950/30 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.2)] text-purple-200'
                : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
            }`}
          >
            {/* Node stereotype & name */}
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80 mb-1">
              <span className="font-bold text-xs text-purple-300">{node.name}</span>
              <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                {node.type === 'interface' ? '<<interface>>' : node.type === 'abstract' ? '<<abstract>>' : 'class'}
              </span>
            </div>

            {/* Fields */}
            {node.fields && node.fields.length > 0 && (
              <div className="text-[10px] text-slate-400 space-y-0.5 mb-1">
                {node.fields.map((f, idx) => (
                  <div key={idx}>{f}</div>
                ))}
              </div>
            )}

            {/* Methods */}
            {node.methods && node.methods.length > 0 && (
              <div className="text-[10px] text-emerald-400/90 space-y-0.5">
                {node.methods.map((m, idx) => (
                  <div key={idx}>{m}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Links / Relations */}
        <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
          <div className="text-[10px] text-slate-500 font-sans font-semibold mb-1">UML 类间关联连线：</div>
          {scenario.umlLinks.map((link, idx) => (
            <div key={idx} className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">{link.from} ──► {link.to}</span>
              <span className={`font-mono text-[9px] px-1 py-0.5 rounded ${isUnlocked ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'}`}>
                {link.relation} {link.label ? `(${link.label})` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
