import React, { useState } from 'react';
import { Database, RotateCcw, CheckCircle2, Info, Trophy, Split } from 'lucide-react';

const STEPS = [
  {
    targetNF: '2NF (消除部分函数依赖)',
    problem: '在未规范化关系 1NF 中，主键为 (OrderID, ItemID)。而 ItemName 与 Price 仅依赖于 ItemID (部分函数依赖)。',
    question: '如何将表规范化提升至 2NF？',
    opts: [
      '保持单表不变，仅增加索引',
      '拆分为订单主表与独立商品表 (ItemID -> ItemName, Price)，消除部分依赖',
      '直接删除 ItemName 与 Price 列'
    ],
    correct: 1,
    explain: '2NF 要求在 1NF 的基础上，消除非主属性对主键的【部分函数依赖】。必须将 ItemID -> ItemName 拆分至独立商品表中！'
  },
  {
    targetNF: '3NF (消除传递函数依赖)',
    problem: '在 2NF 的订单表中，主键为 OrderID。其中 CustName 依赖 OrderID，而 CustAddress 依赖 CustName (传递依赖 OrderID -> CustName -> CustAddress)。',
    question: '如何将表规范化提升至 3NF？',
    opts: [
      '保持原表不变',
      '将客户信息拆分至独立客户表 (CustID -> CustName, CustAddress)，订单表仅保留外键 CustID',
      '将 OrderID 修改为字符串'
    ],
    correct: 1,
    explain: '3NF 要求在 2NF 的基础上，消除非主属性对主键的【传递函数依赖】。将客户属性抽出独立客户表即可达到 3NF！'
  }
];

export default function DBNormalForms() {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentStep = STEPS[stepIdx];

  const handleSelect = (optIdx: number) => {
    setSelectedOpt(optIdx);
    if (optIdx === currentStep.correct) {
      setErrorMsg(null);
      setSuccessMsg(`🎯 正确！${currentStep.explain}`);
      if (stepIdx < STEPS.length - 1) {
        setTimeout(() => {
          setStepIdx(i => i + 1);
          setSelectedOpt(null);
          setSuccessMsg(null);
        }, 1600);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`拆分错误！${currentStep.explain}`);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setSelectedOpt(null);
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
        .dbf-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .dbf-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="dbf-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Database className="text-blue-400" size={22} />
            数据库 3NF 范式分解工坊
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            1NF &rarr; 2NF (消除部分依赖) &rarr; 3NF (消除传递依赖) 规范化拆表实战
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              范式分解阶段 ({stepIdx + 1} / {STEPS.length}): {currentStep.targetNF}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 mb-4 leading-relaxed">
            异常问题分析：{currentStep.problem}
          </div>

          <div className="text-xs font-bold text-slate-300 mb-3">❓ {currentStep.question}</div>

          <div className="space-y-2.5 mb-4">
            {currentStep.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedOpt === i
                    ? 'border-blue-400 bg-blue-950/40 text-blue-200'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                <span className="dbf-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
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
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-blue-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-blue-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="dbf-display text-2xl font-bold text-blue-400 mb-2">🎉 恭喜通关：范式分解大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            关系表已成功规范化至 <span className="text-blue-300 font-bold">3NF 范式</span>，彻底消除了更新异常、插入异常与删除异常！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
