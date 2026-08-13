import React, { useState } from 'react';
import { GitCommit, RotateCcw, CheckCircle2, Info, Trophy, ShieldAlert } from 'lucide-react';

const CASES = [
  {
    code: 'ModuleA 调用 ModuleB.getUserName(userId: string)，只传递了基本类型变量 userId。',
    coupling: '数据耦合 (Data Coupling)',
    cohesion: '功能内聚 (Functional)',
    isGood: true,
    explain: '模块间仅传递基础类型参数，互不侵入内部细节，属于最理想的高内聚低耦合！'
  },
  {
    code: 'ModuleA 修改了 ModuleB 中的全局公用变量 g_SystemState，使得 ModuleC 的逻辑改变。',
    coupling: '公共耦合 (Common Coupling)',
    cohesion: '时间内聚 (Temporal)',
    isGood: false,
    explain: '多个模块共享或修改全局全局数据区属于公共耦合，非常隐蔽且容易引发 Bug！'
  },
  {
    code: 'ModuleA 直接跳入 ModuleB 的内部代码行并强行修改其私有成员变量 _privateCount。',
    coupling: '内容耦合 (Content Coupling)',
    cohesion: '巧合内聚 (Coincidental)',
    isGood: false,
    explain: '直接访问或修改另一个模块的内部私有数据是【内容耦合】，属于最差的一种耦合关系！'
  }
];

export default function CohesionCoupling() {
  const [caseIdx, setCaseIdx] = useState<number>(0);
  const [selectedCoupling, setSelectedCoupling] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentCase = CASES[caseIdx];

  const handleSelect = (couplingName: string) => {
    setSelectedCoupling(couplingName);
    if (couplingName === currentCase.coupling) {
      setErrorMsg(null);
      setSuccessMsg(`🎯 正确！${currentCase.explain}`);
      if (caseIdx < CASES.length - 1) {
        setTimeout(() => {
          setCaseIdx(i => i + 1);
          setSelectedCoupling(null);
          setSuccessMsg(null);
        }, 1500);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`判断错误！再仔细看代码描述：${currentCase.explain}`);
    }
  };

  const handleReset = () => {
    setCaseIdx(0);
    setSelectedCoupling(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800"
      style={{
        background: '#090d16',
        backgroundImage: 'radial-gradient(circle, #1a2438 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#e2e8f0'
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .cc-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .cc-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="cc-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <GitCommit className="text-purple-400" size={22} />
            模块内聚与耦合裁判所
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            数据耦合、控制耦合、公共耦合、内容耦合与功能内聚判定
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              模块交互案例诊断 ({caseIdx + 1} / {CASES.length})
            </span>
          </div>

          {/* Case Description Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 mb-5 leading-relaxed font-medium">
            <code>{currentCase.code}</code>
          </div>

          <div className="text-xs font-bold text-slate-300 mb-3">❓ 请判定该模块间的【耦合类型】属于：</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              '数据耦合 (Data Coupling)',
              '控制耦合 (Control Coupling)',
              '公共耦合 (Common Coupling)',
              '内容耦合 (Content Coupling)',
            ].map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedCoupling === option
                    ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                {option}
              </button>
            ))}
          </div>

          {/* Toast */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && !errorMsg && (
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-purple-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-purple-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="cc-display text-2xl font-bold text-purple-400 mb-2">🎉 恭喜通关：内聚与耦合裁判大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 <span className="text-purple-300">高内聚、低耦合</span> 的设计原则与 7 种耦合度/内聚度的判定！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
