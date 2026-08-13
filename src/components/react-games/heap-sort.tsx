import React, { useState } from 'react';
import { GitBranch, ArrowRight, RotateCcw, CheckCircle2, Info, Trophy, Sparkles } from 'lucide-react';

const INITIAL_ARRAY = [4, 10, 3, 5, 1];
const TARGET_MAX_HEAP = [10, 5, 3, 4, 1];

export default function HeapSort() {
  const [heap, setHeap] = useState<number[]>([...INITIAL_ARRAY]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleNodeClick = (idx: number) => {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }
      // Swap elements
      const updated = [...heap];
      const temp = updated[selectedIdx];
      updated[selectedIdx] = updated[idx];
      updated[idx] = temp;
      setHeap(updated);
      setSelectedIdx(null);

      // Check if it satisfies Max Heap property
      if (updated.join(',') === TARGET_MAX_HEAP.join(',')) {
        setSuccessMsg('🎉 大顶堆 (Max Heap) 重构完成！根节点 10 成为最大值！');
        setTimeout(() => setIsCompleted(true), 800);
      }
    }
  };

  const handleReset = () => {
    setHeap([...INITIAL_ARRAY]);
    setSelectedIdx(null);
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
        .hs-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .hs-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="hs-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <GitBranch className="text-amber-400" size={22} />
            堆排序与大顶堆重构
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            大顶堆性质 $A[i] \ge A[2i+1]$ 与完全二叉树 Heapify 调整实战
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel: Instructions */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                任务：将二叉树调整为【大顶堆】
              </div>

              <div className="text-xs text-slate-300 mb-4 leading-relaxed">
                点击选择两个节点进行交换，使每个父节点的值都<strong className="text-amber-300">大于或等于</strong>其左右子节点的值。
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-slate-400 mb-1">一维数组表示：</div>
                <div className="flex gap-1.5 font-bold hs-mono">
                  {heap.map((val, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-700 text-amber-300 rounded">
                      [{i}]:{val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all">
              重置节点
            </button>
          </div>

          {/* Right Panel: Tree Visual */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                完全二叉树节点 Visual (点击节点交换)
              </div>

              {/* Tree Nodes Visual */}
              <div className="flex flex-col items-center gap-6 py-4">
                {/* Level 0: Root (idx 0) */}
                <button
                  onClick={() => handleNodeClick(0)}
                  className={`w-12 h-12 rounded-full border-2 font-bold hs-mono text-sm flex items-center justify-center transition-all ${
                    selectedIdx === 0
                      ? 'border-amber-400 bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/40'
                      : 'border-slate-700 bg-slate-950 text-amber-300 hover:border-amber-500'
                  }`}>
                  {heap[0]}
                </button>

                {/* Level 1: idx 1, 2 */}
                <div className="flex justify-around w-full max-w-xs">
                  {[1, 2].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNodeClick(idx)}
                      className={`w-12 h-12 rounded-full border-2 font-bold hs-mono text-sm flex items-center justify-center transition-all ${
                        selectedIdx === idx
                          ? 'border-amber-400 bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/40'
                          : 'border-slate-700 bg-slate-950 text-amber-300 hover:border-amber-500'
                      }`}>
                      {heap[idx]}
                    </button>
                  ))}
                </div>

                {/* Level 2: idx 3, 4 */}
                <div className="flex justify-around w-full max-w-xs px-4">
                  {[3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNodeClick(idx)}
                      className={`w-12 h-12 rounded-full border-2 font-bold hs-mono text-sm flex items-center justify-center transition-all ${
                        selectedIdx === idx
                          ? 'border-amber-400 bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/40'
                          : 'border-slate-700 bg-slate-950 text-amber-300 hover:border-amber-500'
                      }`}>
                      {heap[idx]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toast */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-amber-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="hs-display text-2xl font-bold text-amber-400 mb-2">🎉 恭喜通关：大顶堆重构大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            大顶堆已构造成功，根节点 <span className="hs-mono text-amber-300 font-bold">10</span> 为全局最大值！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
