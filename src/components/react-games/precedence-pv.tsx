import React, { useState } from 'react';
import { GitCommit, CheckCircle2, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface SlotState {
  p1_finish: string;
  p2_start: string;
  p2_finish: string;
  p3_start: string;
  p3_finish: string;
  p4_start: string;
}

export default function PrecedencePV() {
  const { addScore } = useGameStore();

  // Semaphores: S1 (P1->P2), S2 (P1->P3), S3 (P2->P4), S4 (P3->P4)
  const [slots, setSlots] = useState<SlotState>({
    p1_finish: '',
    p2_start: '',
    p2_finish: '',
    p3_start: '',
    p3_finish: '',
    p4_start: ''
  });

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const options = ['P(S1)', 'V(S1)', 'P(S2)', 'V(S2)', 'P(S3)', 'V(S3)', 'P(S4)', 'V(S4)'];

  const handleSelect = (key: keyof SlotState, val: string) => {
    setSlots((prev) => ({ ...prev, [key]: val }));
  };

  const handleVerify = () => {
    // Correct answers:
    // P1 ends: V(S1), V(S2) (or V(S1) / V(S2))
    // P2 starts: P(S1)
    // P2 ends: V(S3)
    // P3 starts: P(S2)
    // P3 ends: V(S4)
    // P4 starts: P(S3), P(S4) (or P(S3) wait P(S4))
    const isP1Valid = slots.p1_finish === 'V(S1)' || slots.p1_finish === 'V(S2)';
    const isP2StartValid = slots.p2_start === 'P(S1)';
    const isP2FinishValid = slots.p2_finish === 'V(S3)';
    const isP3StartValid = slots.p3_start === 'P(S2)';
    const isP3FinishValid = slots.p3_finish === 'V(S4)';
    const isP4StartValid = slots.p4_start === 'P(S3)' || slots.p4_start === 'P(S4)';

    if (
      isP1Valid &&
      isP2StartValid &&
      isP2FinishValid &&
      isP3StartValid &&
      isP3FinishValid &&
      isP4StartValid
    ) {
      setFeedback({
        msg: '答案完全正确！PV 信号量匹配无误，前趋关系完美同步！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      setFeedback({
        msg: '校验未通过。提示：前趋节点执行结束放 V 信号，后继节点执行开始等 P 信号。',
        isCorrect: false
      });
    }
  };

  const handleReset = () => {
    setSlots({
      p1_finish: '',
      p2_start: '',
      p2_finish: '',
      p3_start: '',
      p3_finish: '',
      p4_start: ''
    });
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/40">
            <GitCommit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-300">进程前趋图与 PV 信号量</h2>
            <p className="text-xs text-slate-400">操作系统 · 有向无环图 (DAG) 进程同步与 P/V 操作映射填空</p>
          </div>
        </div>
      </div>

      {/* Process DAG Visualization */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">前趋依赖关系图 (DAG):</h3>
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
          <div className="p-4 bg-slate-800 border-2 border-cyan-500/60 rounded-xl font-mono text-center shadow-lg">
            <div className="text-cyan-300 font-bold text-base">Process P1</div>
            <div className="text-[10px] text-slate-400 mt-1">发号施令者</div>
          </div>

          <div className="flex flex-col gap-8 text-center text-xs font-mono text-amber-400">
            <div className="flex items-center gap-2">
              <span>S1 →</span>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-amber-300">
                <span className="font-bold">Process P2</span>
              </div>
              <span>→ S3</span>
            </div>
            <div className="flex items-center gap-2">
              <span>S2 →</span>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-amber-300">
                <span className="font-bold">Process P3</span>
              </div>
              <span>→ S4</span>
            </div>
          </div>

          <div className="p-4 bg-slate-800 border-2 border-emerald-500/60 rounded-xl font-mono text-center shadow-lg">
            <div className="text-emerald-300 font-bold text-base">Process P4</div>
            <div className="text-[10px] text-slate-400 mt-1">最终汇合节点</div>
          </div>
        </div>
      </div>

      {/* Code Slots Fill-in */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* P1 */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
          <div className="text-sm font-bold text-cyan-300 font-mono">P1 代码逻辑</div>
          <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-400">L1: 执行 P1 核心工作;</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L2: 离开前通知 P2:</span>
            <select
              value={slots.p1_finish}
              onChange={(e) => handleSelect('p1_finish', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-cyan-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* P2 */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
          <div className="text-sm font-bold text-amber-300 font-mono">P2 代码逻辑</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L1: 等待 P1 完成:</span>
            <select
              value={slots.p2_start}
              onChange={(e) => handleSelect('p2_start', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-amber-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-400">L2: 执行 P2 核心工作;</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L3: 完成后通知 P4:</span>
            <select
              value={slots.p2_finish}
              onChange={(e) => handleSelect('p2_finish', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-amber-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* P3 */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
          <div className="text-sm font-bold text-amber-300 font-mono">P3 代码逻辑</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L1: 等待 P1 完成:</span>
            <select
              value={slots.p3_start}
              onChange={(e) => handleSelect('p3_start', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-amber-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-400">L2: 执行 P3 核心工作;</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L3: 完成后通知 P4:</span>
            <select
              value={slots.p3_finish}
              onChange={(e) => handleSelect('p3_finish', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-amber-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* P4 */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
          <div className="text-sm font-bold text-emerald-300 font-mono">P4 代码逻辑</div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">L1: 等待前趋信号:</span>
            <select
              value={slots.p4_start}
              onChange={(e) => handleSelect('p4_start', e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-emerald-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择 --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-400">L2: 执行 P4 最终汇合;</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleVerify}
          className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" /> 校验 PV 信号量配置
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> 重置
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-6 p-4 rounded-xl border ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-sm">
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
