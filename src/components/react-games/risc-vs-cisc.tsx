import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, Layers, Award } from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  correctCategory: 'RISC' | 'CISC';
}

const FEATURES: FeatureCard[] = [
  {
    id: 'controller',
    title: '控制器实现方式',
    desc: '采用硬布线控制器 (组合逻辑)，指令执行速度极快',
    correctCategory: 'RISC'
  },
  {
    id: 'microcode',
    title: '微程序控制器',
    desc: '采用微程序 ROM 存储微指令，灵活易扩展但速度稍慢',
    correctCategory: 'CISC'
  },
  {
    id: 'instruction_len',
    title: '指令长度与格式',
    desc: '指令长度固定、格式种类少，便于流水线译码',
    correctCategory: 'RISC'
  },
  {
    id: 'cisc_instruction',
    title: '指令数量与变长',
    desc: '包含大量复杂指令，指令长度不固定，寻址方式丰富',
    correctCategory: 'CISC'
  },
  {
    id: 'registers',
    title: '通用寄存器数量',
    desc: '内置大量通用寄存器，减少对主存的访问频次',
    correctCategory: 'RISC'
  },
  {
    id: 'load_store',
    title: 'Load/Store 架构',
    desc: '只有 Load 和 Store 指令可以访存，其余指令在寄存器间操作',
    correctCategory: 'RISC'
  },
  {
    id: 'addressing',
    title: '丰富复杂的寻址方式',
    desc: '支持直接、间接、变址、基址等多种复杂寻址模式',
    correctCategory: 'CISC'
  },
  {
    id: 'pipeline',
    title: '重叠流水线效率',
    desc: '绝大多数单周期指令，非常容易实现高效重叠流水线',
    correctCategory: 'RISC'
  }
];

export default function RiscVsCisc() {
  const [userAssignments, setUserAssignments] = useState<Record<string, 'RISC' | 'CISC'>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAssign = (featureId: string, category: 'RISC' | 'CISC') => {
    if (submitted) return;
    setUserAssignments(prev => ({ ...prev, [featureId]: category }));
  };

  const handleCheck = () => {
    let correctCount = 0;
    FEATURES.forEach(f => {
      if (userAssignments[f.id] === f.correctCategory) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const resetGame = () => {
    setUserAssignments({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Cpu size={28} /> RISC vs CISC 计算机体系结构对决
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：精简指令集 (RISC) 与 复杂指令集 (CISC) 在控制器、寻址、流水线与寄存器上的对比
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Main Boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* RISC Board */}
        <div className="bg-cyan-950/40 border border-cyan-700/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-800 pb-2">
            <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <Layers size={20} /> RISC (精简指令集)
            </h2>
            <span className="text-xs text-cyan-400 bg-cyan-900/60 px-2 py-0.5 rounded">例如: ARM, RISC-V, MIPS</span>
          </div>
          <p className="text-xs text-slate-300">
            特征：指令少而定长、Load/Store访存、硬布线控制器、大量寄存器、单周期易流水线。
          </p>
          <div className="min-h-[220px] space-y-2 pt-2">
            {FEATURES.filter(f => userAssignments[f.id] === 'RISC').map(f => (
              <div
                key={f.id}
                onClick={() => handleAssign(f.id, 'CISC')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  submitted
                    ? f.correctCategory === 'RISC'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/80 border-red-500 text-red-200'
                    : 'bg-cyan-900/40 border-cyan-600 text-cyan-100 hover:bg-cyan-900/60'
                }`}
              >
                <div className="font-bold flex justify-between">
                  <span>{f.title}</span>
                  <span className="text-[10px] opacity-75">点击切至 CISC</span>
                </div>
                <div className="mt-1 opacity-90">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CISC Board */}
        <div className="bg-purple-950/40 border border-purple-700/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-purple-800 pb-2">
            <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
              <Layers size={20} /> CISC (复杂指令集)
            </h2>
            <span className="text-xs text-purple-400 bg-purple-900/60 px-2 py-0.5 rounded">例如: x86 (Intel / AMD)</span>
          </div>
          <p className="text-xs text-slate-300">
            特征：指令多而变长、寻址方式极多、微程序控制器、指令可直接访问内存。
          </p>
          <div className="min-h-[220px] space-y-2 pt-2">
            {FEATURES.filter(f => userAssignments[f.id] === 'CISC').map(f => (
              <div
                key={f.id}
                onClick={() => handleAssign(f.id, 'RISC')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  submitted
                    ? f.correctCategory === 'CISC'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/80 border-red-500 text-red-200'
                    : 'bg-purple-900/40 border-purple-600 text-purple-100 hover:bg-purple-900/60'
                }`}
              >
                <div className="font-bold flex justify-between">
                  <span>{f.title}</span>
                  <span className="text-[10px] opacity-75">点击切至 RISC</span>
                </div>
                <div className="mt-1 opacity-90">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unassigned Pool */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3 mb-6">
        <h3 className="text-xs font-bold text-slate-400 flex items-center justify-between">
          <span>待分类的核心特性卡片池 ({FEATURES.filter(f => !userAssignments[f.id]).length} 项未分配)：</span>
          <span className="text-slate-500">点击下方按钮将卡片归类到对应架构</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FEATURES.filter(f => !userAssignments[f.id]).map(f => (
            <div key={f.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-xs space-y-2">
              <div className="font-bold text-amber-300">{f.title}</div>
              <div className="text-slate-300">{f.desc}</div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleAssign(f.id, 'RISC')}
                  className="flex-1 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 rounded font-bold transition-colors"
                >
                  归入 RISC
                </button>
                <button
                  onClick={() => handleAssign(f.id, 'CISC')}
                  className="flex-1 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded font-bold transition-colors"
                >
                  归入 CISC
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button & Results */}
      {!submitted ? (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            disabled={Object.keys(userAssignments).length < FEATURES.length}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              Object.keys(userAssignments).length === FEATURES.length
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle2 size={18} /> 提交分类裁决 (已分配 {Object.keys(userAssignments).length}/{FEATURES.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            score === FEATURES.length ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' : 'bg-amber-950/80 border-amber-600 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <Award size={32} />
              <div>
                <h3 className="font-bold text-base">裁决得分: {score} / {FEATURES.length}</h3>
                <p className="text-xs opacity-90">
                  {score === FEATURES.length ? '🎉 完美通过！完全吃透了 RISC 与 CISC 的硬核考查逻辑！' : '仍有混淆考项，查看上方红框卡片修正思路。'}
                </p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600"
            >
              重新分类
            </button>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-amber-400 text-sm">💡 软考中级单选题解题口诀（必背）：</h4>
            <p>1. <strong>控制器机制</strong>：RISC $\rightarrow$ <strong>硬布线（组合逻辑）</strong>；CISC $\rightarrow$ <strong>微程序控制器</strong>。</p>
            <p>2. <strong>访存规则</strong>：RISC 属于 <strong>Load/Store 架构</strong>（只有加载/存储指令可访存，其他均为寄存器操作）。</p>
            <p>3. <strong>通用寄存器</strong>：RISC 内部放置了<strong>大量通用寄存器</strong>以减少对慢速主存的访问。</p>
          </div>
        </div>
      )}
    </div>
  );
}
