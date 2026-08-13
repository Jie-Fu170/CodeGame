import React, { useState } from 'react';
import { GitBranch, RotateCcw, CheckCircle2, Info, Trophy, Zap } from 'lucide-react';

interface Edge {
  id: string;
  u: string;
  v: string;
  weight: number;
}

const EDGES: Edge[] = [
  { id: 'e1', u: 'A', v: 'B', weight: 2 },
  { id: 'e2', u: 'A', v: 'C', weight: 4 },
  { id: 'e3', u: 'B', v: 'C', weight: 1 },
  { id: 'e4', u: 'B', v: 'D', weight: 7 },
  { id: 'e5', u: 'C', v: 'D', weight: 3 },
  { id: 'e6', u: 'C', v: 'E', weight: 5 },
  { id: 'e7', u: 'D', v: 'E', weight: 6 },
];

const CORRECT_MST_EDGES = ['e3', 'e1', 'e5', 'e6']; // BC(1), AB(2), CD(3), CE(5) -> Total: 11

export default function MinSpanningTree() {
  const [algo, setAlgo] = useState<'PRIM' | 'KRUSKAL'>('KRUSKAL');
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const totalWeight = selectedEdges.reduce((acc, id) => {
    const e = EDGES.find(item => item.id === id);
    return acc + (e ? e.weight : 0);
  }, 0);

  const handlePickEdge = (edge: Edge) => {
    if (selectedEdges.includes(edge.id)) return;

    // Check if adding this edge causes a cycle
    if (algo === 'KRUSKAL') {
      const sorted = [...EDGES].sort((a, b) => a.weight - b.weight);
      const currentNext = sorted.find(e => !selectedEdges.includes(e.id));

      if (currentNext && currentNext.id !== edge.id) {
        if (edge.weight > currentNext.weight) {
          setErrorMsg(`Kruskal 算法要求按权值从小到大升序挑选！应该优先选择权值更小的边【${currentNext.u}-${currentNext.v} (权值: ${currentNext.weight})】！`);
          return;
        }
      }
    }

    setErrorMsg(null);
    const updated = [...selectedEdges, edge.id];
    setSelectedEdges(updated);

    if (updated.length === 4) {
      if (updated.sort().join(',') === [...CORRECT_MST_EDGES].sort().join(',')) {
        setSuccessMsg(`🎉 成功构造最小生成树 (MST)！总权值和为 ${totalWeight + edge.weight}！`);
        setTimeout(() => setIsCompleted(true), 800);
      }
    }
  };

  const handleReset = () => {
    setSelectedEdges([]);
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
        .mst-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .mst-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="mst-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <GitBranch className="text-cyan-400" size={22} />
            图论最小生成树工程
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prim 算法与 Kruskal 算法生成最小生成树 (MST)
          </p>
        </div>

        {/* Algo Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { setAlgo('KRUSKAL'); handleReset(); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${algo === 'KRUSKAL' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            Kruskal 算法 (加边法)
          </button>
          <button
            onClick={() => { setAlgo('PRIM'); handleReset(); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${algo === 'PRIM' ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            Prim 算法 (加点法)
          </button>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                加权无向图边列表 (按权值选择)
              </div>

              <div className="space-y-2 mb-4">
                {EDGES.map((edge) => {
                  const isSelected = selectedEdges.includes(edge.id);
                  return (
                    <button
                      key={edge.id}
                      disabled={isSelected}
                      onClick={() => handlePickEdge(edge)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 opacity-60 cursor-not-allowed'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
                      }`}>
                      <span className="mst-mono font-bold text-slate-100">
                        边 {edge.u} - {edge.v}
                      </span>
                      <span className="mst-mono text-cyan-300">权值: {edge.weight}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              提示：含有 5 个顶点的无向图，最小生成树包含 <strong className="text-cyan-300">4 条边</strong>。已选: {selectedEdges.length} / 4。
            </div>
          </div>

          {/* Right Panel: Graph & Tree Stats */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-cyan-400" />
                  已生成树分支与权重
                </span>
                <span className="mst-mono text-xs text-cyan-300 font-bold">
                  总权重: {totalWeight}
                </span>
              </div>

              {/* Selected Edges Card Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {selectedEdges.map((id) => {
                  const e = EDGES.find(item => item.id === id)!;
                  return (
                    <div key={id} className="p-3 bg-slate-950 rounded-xl border border-cyan-500/40 text-xs">
                      <div className="mst-mono font-bold text-cyan-300">{e.u} &mdash; {e.v}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">权值: {e.weight}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-cyan-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-cyan-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="mst-display text-2xl font-bold text-cyan-400 mb-2">🎉 恭喜通关：最小生成树工程大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 Prim 算法与 Kruskal 算法构造最小生成树的完整推导过程！最小总权值为 <span className="mst-mono text-amber-300 font-bold">11</span>！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
