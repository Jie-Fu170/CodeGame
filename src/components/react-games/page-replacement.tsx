import React, { useState } from 'react';
import { Layers, ArrowRight, RotateCcw, CheckCircle2, Info, Trophy, AlertCircle } from 'lucide-react';

const ACCESS_SEQ = [7, 0, 1, 2, 0, 3, 0, 4];
const BLOCK_COUNT = 3;

export default function PageReplacement() {
  const [algo, setAlgo] = useState<'FIFO' | 'LRU' | 'OPT'>('LRU');
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [frames, setFrames] = useState<(number | null)[]>([null, null, null]);
  const [pageFaults, setPageFaults] = useState<number>(0);
  const [faultHistory, setFaultHistory] = useState<boolean[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentPage = ACCESS_SEQ[stepIdx];

  const handleNextStep = () => {
    if (stepIdx >= ACCESS_SEQ.length) {
      setIsCompleted(true);
      return;
    }

    const p = currentPage;
    const existingIdx = frames.indexOf(p);

    if (existingIdx !== -1) {
      // Hit!
      setSuccessMsg(`🎯 页面 ${p} 已在内存物理块 ${existingIdx} 中，【页面命中 (Hit)】，未发生缺页！`);
      setFaultHistory(prev => [...prev, false]);
    } else {
      // Page Fault!
      const nextFaults = pageFaults + 1;
      setPageFaults(nextFaults);
      setFaultHistory(prev => [...prev, true]);

      // Check empty slot first
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        setFrames(prev => {
          const next = [...prev];
          next[emptyIdx] = p;
          return next;
        });
        setSuccessMsg(`⚠️ 页面 ${p} 不在内存中，【缺页中断】！直接装入空物理块 ${emptyIdx}。`);
      } else {
        // Must Replace!
        let replaceSlot = 0;

        if (algo === 'FIFO') {
          replaceSlot = (nextFaults - 1) % BLOCK_COUNT;
        } else if (algo === 'LRU') {
          // Find page in frames used longest time ago
          const historySlice = ACCESS_SEQ.slice(0, stepIdx);
          let oldestLastUsed = Infinity;
          frames.forEach((f, idx) => {
            const lastUsed = historySlice.lastIndexOf(f!);
            if (lastUsed < oldestLastUsed) {
              oldestLastUsed = lastUsed;
              replaceSlot = idx;
            }
          });
        } else if (algo === 'OPT') {
          // Find page used furthest in future
          const futureSlice = ACCESS_SEQ.slice(stepIdx + 1);
          let furthestUse = -1;
          frames.forEach((f, idx) => {
            const nextUse = futureSlice.indexOf(f!);
            if (nextUse === -1) {
              replaceSlot = idx;
              furthestUse = Infinity;
            } else if (nextUse > furthestUse && furthestUse !== Infinity) {
              furthestUse = nextUse;
              replaceSlot = idx;
            }
          });
        }

        const evicted = frames[replaceSlot];
        setFrames(prev => {
          const next = [...prev];
          next[replaceSlot] = p;
          return next;
        });
        setSuccessMsg(`⚠️ 页面 ${p} 不在内存，【缺页中断】！基于 ${algo} 算法置换淘汰了物理块 ${replaceSlot} 中的页面 ${evicted}！`);
      }
    }

    const nextStep = stepIdx + 1;
    setStepIdx(nextStep);
    if (nextStep >= ACCESS_SEQ.length) {
      setTimeout(() => setIsCompleted(true), 600);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setFrames([null, null, null]);
    setPageFaults(0);
    setFaultHistory([]);
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
        .pr-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .pr-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="pr-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Layers className="text-cyan-400" size={22} />
            页面置换算法缺页实验室
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            FIFO 先进先出、LRU 最近最少使用、OPT 最佳置换算法与缺页率计算
          </p>
        </div>

        {/* Algo Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['LRU', 'FIFO', 'OPT'].map((a) => (
            <button
              key={a}
              onClick={() => { setAlgo(a as any); handleReset(); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                algo === a ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {a} 算法
            </button>
          ))}
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                页面访问请求序列
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {ACCESS_SEQ.map((p, i) => (
                  <span
                    key={i}
                    className={`pr-mono text-xs px-2.5 py-1.5 rounded-lg font-bold ${
                      i === stepIdx
                        ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/30'
                        : i < stepIdx
                        ? faultHistory[i]
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}>
                    {p}
                  </span>
                ))}
              </div>

              {stepIdx < ACCESS_SEQ.length && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>当前请求页面: <span className="pr-mono text-cyan-400 font-bold">{currentPage}</span></div>
                  <div>当前缺页总数: <span className="pr-mono text-rose-400 font-bold">{pageFaults} 次</span></div>
                  <div>缺页率: <span className="pr-mono text-amber-300 font-bold">{stepIdx > 0 ? `${((pageFaults / stepIdx) * 100).toFixed(1)}%` : '0%'}</span></div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20">
              <ArrowRight size={14} /> 访问下一个页面 {currentPage}
            </button>
          </div>

          {/* Right Panel: Memory Blocks Visual */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                内存物理块状态 (Physical Frame Slots: 3)
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {frames.map((f, i) => (
                  <div
                    key={i}
                    className={`h-24 rounded-xl border flex flex-col items-center justify-center p-2 transition-all ${
                      f !== null
                        ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200 shadow-lg'
                        : 'border-dashed border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                    <span className="text-[10px] text-slate-500 pr-mono mb-1">物理块 {i}</span>
                    <span className="pr-mono text-xl font-bold">{f !== null ? f : '空闲'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toast */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-cyan-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="pr-display text-2xl font-bold text-cyan-400 mb-2">🎉 恭喜通关：页面置换实验室大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            基于 <span className="text-cyan-300">{algo} 算法</span>，在 8 次访问中共发生 <span className="pr-mono text-rose-400 font-bold">{pageFaults} 次</span> 缺页中断，缺页中断率为 <span className="pr-mono text-amber-300 font-bold">{((pageFaults / ACCESS_SEQ.length) * 100).toFixed(1)}%</span>！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
