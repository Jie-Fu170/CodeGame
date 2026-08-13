import React, { useState } from 'react';
import { Network, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';

interface NodeItem {
  id: string;
  inDegree: number;
  targets: string[]; // Edges outgoing to target node IDs
}

export default function TopologicalSort() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: DAG Sorting, 2: Cycle Diagnosis, 3: Success

  // Initial DAG nodes (V1 -> V2, V3; V2 -> V4; V3 -> V4, V5; V4 -> V6; V5 -> V6)
  const initialNodes: Record<string, NodeItem> = {
    V1: { id: 'V1', inDegree: 0, targets: ['V2', 'V3'] },
    V2: { id: 'V2', inDegree: 1, targets: ['V4'] },
    V3: { id: 'V3', inDegree: 1, targets: ['V4', 'V5'] },
    V4: { id: 'V4', inDegree: 2, targets: ['V6'] },
    V5: { id: 'V5', inDegree: 1, targets: ['V6'] },
    V6: { id: 'V6', inDegree: 2, targets: [] },
  };

  const [currentNodes, setCurrentNodes] = useState<Record<string, NodeItem>>(initialNodes);
  const [topologicalSeq, setTopologicalSeq] = useState<string[]>([]);
  const [phase1Error, setPhase1Error] = useState('');

  // Phase 2 Cycle Diagnosis Choice
  const [cycleChoice, setCycleChoice] = useState<'CAN_SORT' | 'CYCLE_EXISTS' | null>(null);
  const [phase2Error, setPhase2Error] = useState('');

  const handlePopZeroNode = (nodeId: string) => {
    const node = currentNodes[nodeId];
    if (!node || node.inDegree > 0) {
      setPhase1Error(`节点 ${nodeId} 的入度为 ${node?.inDegree}，无法作为起始节点！只有入度为 0 的节点才能入栈/出栈。`);
      return;
    }
    setPhase1Error('');

    // Add to sequence
    const newSeq = [...topologicalSeq, nodeId];
    setTopologicalSeq(newSeq);

    // Update graph: remove node and decrement targets' in-degree
    const nextNodes = { ...currentNodes };
    delete nextNodes[nodeId];

    node.targets.forEach(tId => {
      if (nextNodes[tId]) {
        nextNodes[tId] = {
          ...nextNodes[tId],
          inDegree: Math.max(0, nextNodes[tId].inDegree - 1),
        };
      }
    });

    setCurrentNodes(nextNodes);

    if (newSeq.length === 6) {
      setPhase(2);
    }
  };

  const handleVerifyPhase2 = () => {
    if (cycleChoice === 'CYCLE_EXISTS') {
      setPhase2Error('');
      setPhase(3);
    } else {
      setPhase2Error('诊断错误！有向图只要存在环路 (Directed Cycle)，便无法消去环上节点的入度，导致拓扑排序失败！');
    }
  };

  const resetGame = () => {
    setPhase(1);
    setCurrentNodes(initialNodes);
    setTopologicalSeq([]);
    setPhase1Error('');
    setCycleChoice(null);
    setPhase2Error('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Network size={28} /> AOV 网拓扑排序 (Topological Sorting)
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：顶点表示活动 (AOV)、节点入度计算、零入度出栈与有向环死锁诊断
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className={`p-2.5 rounded-lg border ${phase === 1 ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          1. 零入度节点弹出与序列生成
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 有向回路 (死锁环) 诊断
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          3. 通关与考点总结
        </div>
      </div>

      {/* Phase 1 */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Play size={18} className="text-cyan-400" /> 步骤 1：依次选择入度为 0 的节点弹出
            </h2>

            {/* Current Topological Output */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto min-h-[60px]">
              <span className="text-xs text-slate-500 font-bold mr-2">生成的拓扑序列:</span>
              {topologicalSeq.length === 0 && <span className="text-xs text-slate-600">点击下方入度为 0 的节点开始出栈...</span>}
              {topologicalSeq.map((nodeId, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-cyan-900/80 border border-cyan-500 text-cyan-200 font-bold text-sm rounded-lg">
                    {nodeId}
                  </span>
                  {idx < 5 && <ArrowRight size={14} className="text-slate-600" />}
                </div>
              ))}
            </div>

            {/* Node Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.values(currentNodes).map(n => {
                const isZero = n.inDegree === 0;
                return (
                  <button
                    key={n.id}
                    onClick={() => handlePopZeroNode(n.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      isZero
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 hover:bg-cyan-900 cursor-pointer shadow-lg hover:scale-105'
                        : 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed opacity-75'
                    }`}
                  >
                    <span className="text-lg font-bold">{n.id}</span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${isZero ? 'bg-cyan-800 text-cyan-100' : 'bg-slate-800 text-slate-400'}`}>
                      当前入度 (In-Degree) = {n.inDegree}
                    </div>
                    {n.targets.length > 0 && (
                      <span className="text-[10px] text-slate-400">出边后继: {n.targets.join(', ')}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {phase1Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase1Error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" /> 步骤 2：有向回路 (Cycle) 诊断挑战
            </h2>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 text-xs space-y-2 text-slate-300">
              <p><span className="text-slate-400">假设新有向图中存在依赖关系：</span><strong className="text-amber-300">A $\rightarrow$ B $\rightarrow$ C $\rightarrow$ A</strong></p>
              <p className="text-slate-400">对此有向图执行拓扑排序算法，尝试寻找合法拓扑序列...</p>
            </div>

            <p className="text-xs text-slate-200 font-bold">请问此图能否完成拓扑排序？</p>

            <div className="space-y-3">
              <button
                onClick={() => setCycleChoice('CAN_SORT')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  cycleChoice === 'CAN_SORT' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>A. 可以完成拓扑排序，包含 A, B, C 的全部节点</span>
                {cycleChoice === 'CAN_SORT' && <CheckCircle2 size={16} />}
              </button>

              <button
                onClick={() => setCycleChoice('CYCLE_EXISTS')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  cycleChoice === 'CYCLE_EXISTS' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>B. 无法完成拓扑排序！因图中包含“有向环”，环上所有节点入度均不能降为 0，排序算法中断</span>
                {cycleChoice === 'CYCLE_EXISTS' && <CheckCircle2 size={16} />}
              </button>
            </div>

            {phase2Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase2Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase2}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              提交诊断结论
            </button>
          </div>
        </div>
      )}

      {/* Phase 3 */}
      {phase === 3 && (
        <div className="bg-emerald-950/40 p-6 rounded-xl border border-emerald-700 space-y-4 text-center">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-300">通关！彻底掌握拓扑排序与 AOV 网！</h2>
          
          <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-cyan-300 text-sm">📘 软考必背判定要点：</h4>
            <p>1. <strong>拓扑序列不唯一</strong>：只要某一时刻图中同时存在多个入度为 0 的节点，则拓扑序列的排列顺序可能不唯一。</p>
            <p>2. <strong>有向无环图 (DAG) 充要条件</strong>：若最终输出的顶点个数少于总顶点数 $n$，说明图中必存在有向环 (Cycle)。</p>
            <p>3. <strong>复杂度</strong>：采用邻接表存储时，拓扑排序的时间复杂度为 $O(V + E)$。</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
          >
            再次演练
          </button>
        </div>
      )}
    </div>
  );
}
