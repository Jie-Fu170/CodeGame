import React, { useState } from 'react';
import { Share2, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface Node {
  id: string;
  name: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

export default function DijkstraShortestPath() {
  const { addScore } = useGameStore();

  const nodes: Node[] = [
    { id: 'A', name: '起点 (A)' },
    { id: 'B', name: '节点 B' },
    { id: 'C', name: '节点 C' },
    { id: 'D', name: '节点 D' },
    { id: 'E', name: '终点 (E)' }
  ];

  const edges: Edge[] = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 }
  ];

  // Correct shortest path from A:
  // A -> C: 2
  // C -> B: A->C(2) + C->B(1) = 3 (shorter than A->B = 4!)
  // B -> D: 3 + 5 = 8
  // D -> E: 8 + 2 = 10 (or A->B(4)+B->D(5)+D->E(2) = 11, A->C(2)+C->B(1)+B->D(5)+D->E(2) = 10)
  // Shortest distance A to E is 10 (Path: A -> C -> B -> D -> E)

  const [userDistInput, setUserDistInput] = useState('');
  const [userPathInput, setUserPathInput] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkAnswer = () => {
    const dist = parseInt(userDistInput.trim());
    const path = userPathInput.trim().toUpperCase().replace(/\s*->\s*/g, '');

    const isDistCorrect = dist === 10;
    const isPathCorrect = path === 'ACBDE';

    if (isDistCorrect && isPathCorrect) {
      setFeedback({
        msg: '完美解答！Dijkstra 最短路径为 A -> C -> B -> D -> E，总权值 10！松弛过程完全正确！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      let errReason = '';
      if (!isDistCorrect) errReason += '最短距离数值计算有误（提示：注意 C->B 的反向松弛）；';
      if (!isPathCorrect) errReason += '路径顺序写错（格式如：A->C->B->D->E）；';
      setFeedback({ msg: errReason, isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/40">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-300">Dijkstra 最短路径算法</h2>
            <p className="text-xs text-slate-400">数据结构与算法 · 单源加权图贪心松弛与 dist[] 动态更新</p>
          </div>
        </div>
      </div>

      {/* Graph Visualizer */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">加权有向图结构:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Edge List */}
          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700/80 text-xs font-mono">
            <div className="text-amber-400 font-semibold mb-2">边与权值列表 (Weights):</div>
            <ul className="space-y-1 text-slate-300">
              {edges.map((e, idx) => (
                <li key={idx} className="flex justify-between border-b border-slate-800 pb-1">
                  <span>{e.from} → {e.to}</span>
                  <span className="text-cyan-400 font-bold">权值 = {e.weight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Algorithm step help */}
          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-300 space-y-2">
            <div className="text-cyan-400 font-semibold">💡 Dijkstra 核心算法步骤：</div>
            <p>1. 初始化 dist[A]=0, 其余为 ∞。</p>
            <p>2. 挑选当前未访问集合中 dist 最小的节点 u。</p>
            <p>3. 对 u 的相邻节点 v 实施松弛操作：<br /><span className="text-amber-300">dist[v] = min(dist[v], dist[u] + w(u,v))</span>。</p>
            <p>4. 重复直到到达终点 E。</p>
          </div>
        </div>
      </div>

      {/* User Input & Verification */}
      <div className="p-5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">起点 A 到终点 E 的最短路径距离:</label>
            <input
              type="number"
              value={userDistInput}
              onChange={(e) => setUserDistInput(e.target.value)}
              placeholder="例如: 10"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">最短路径序列 (如 A-&gt;C-&gt;B-&gt;D-&gt;E):</label>
            <input
              type="text"
              value={userPathInput}
              onChange={(e) => setUserPathInput(e.target.value)}
              placeholder="A->C->B->D->E"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={checkAnswer}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-5 h-5" /> 验证最短路径
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
