import React, { useState } from 'react';
import { Network, Activity, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

type Node = {
  id: string;
  type: 'process' | 'entity' | 'datastore';
  label: string;
  x: number;
  y: number;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  label: string;
  isUserAdded?: boolean;
};

const INITIAL_NODES: Node[] = [
  { id: 'E1', type: 'entity', label: '客户', x: 10, y: 50 },
  { id: 'P1', type: 'process', label: '1.0 接收订单', x: 40, y: 20 },
  { id: 'D1', type: 'datastore', label: 'D1 订单库', x: 70, y: 20 },
  { id: 'P2', type: 'process', label: '2.0 处理发货', x: 40, y: 80 }, // Black hole
  { id: 'P3', type: 'process', label: '3.0 生成账单', x: 70, y: 80 }, // Miracle
  { id: 'E2', type: 'entity', label: '财务部', x: 90, y: 50 },
];

const INITIAL_EDGES: Edge[] = [
  { id: 'e1', source: 'E1', target: 'P1', label: '订单信息' },
  { id: 'e2', source: 'P1', target: 'D1', label: '格式化订单' },
  { id: 'e3', source: 'D1', target: 'P2', label: '待发货订单' },
  { id: 'e4', source: 'P3', target: 'E2', label: '账单明细' },
];

export default function DFDInspector() {
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'won'>('playing');

  const checkFlaws = (currentEdges: Edge[]) => {
    let hasBlackHole = false;
    let hasMiracle = false;

    INITIAL_NODES.filter(n => n.type === 'process').forEach(p => {
      const inputs = currentEdges.filter(e => e.target === p.id);
      const outputs = currentEdges.filter(e => e.source === p.id);
      
      if (inputs.length > 0 && outputs.length === 0) hasBlackHole = true;
      if (inputs.length === 0 && outputs.length > 0) hasMiracle = true;
    });

    if (!hasBlackHole && !hasMiracle) {
      setStatus('won');
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (status === 'won') return;

    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else {
      if (selectedNode !== nodeId) {
        // Prevent duplicate edges
        if (!edges.find(e => e.source === selectedNode && e.target === nodeId)) {
          const newEdge: Edge = {
            id: `user_${Date.now()}`,
            source: selectedNode,
            target: nodeId,
            label: '数据流',
            isUserAdded: true
          };
          const newEdges = [...edges, newEdge];
          setEdges(newEdges);
          checkFlaws(newEdges);
        }
      }
      setSelectedNode(null);
    }
  };

  const reset = () => {
    setEdges(INITIAL_EDGES);
    setSelectedNode(null);
    setStatus('playing');
  };

  const getDiagnostics = () => {
    const flaws = [];
    INITIAL_NODES.filter(n => n.type === 'process').forEach(p => {
      const inputs = edges.filter(e => e.target === p.id);
      const outputs = edges.filter(e => e.source === p.id);
      
      if (inputs.length > 0 && outputs.length === 0) {
        flaws.push(`加工 ${p.label} 是"黑洞" (只有输入无输出)`);
      }
      if (inputs.length === 0 && outputs.length > 0) {
        flaws.push(`加工 ${p.label} 是"奇迹" (只有输出无输入)`);
      }
    });
    return flaws;
  };

  const diagnostics = getDiagnostics();

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col font-sans min-h-[600px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 flex items-center gap-3">
            <Activity size={32} className="text-orange-500" /> DFD 数据流图检修师
          </h1>
          <p className="text-slate-400 mt-2">任务：连接节点，修复 DFD 中的"黑洞"与"奇迹"加工错误。</p>
        </div>
        <button onClick={reset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-300 transition-colors">
          重置画布
        </button>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Canvas */}
        <div className="flex-[2] bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
          {/* SVG for edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow-default" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
              <marker id="arrow-user" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
              </marker>
            </defs>
            {edges.map(e => {
              const src = INITIAL_NODES.find(n => n.id === e.source);
              const tgt = INITIAL_NODES.find(n => n.id === e.target);
              if (!src || !tgt) return null;
              
              // Simple straight line calculation
              return (
                <g key={e.id}>
                  <line 
                    x1={`${src.x}%`} y1={`${src.y}%`} 
                    x2={`${tgt.x}%`} y2={`${tgt.y}%`}
                    stroke={e.isUserAdded ? '#f97316' : '#475569'}
                    strokeWidth={e.isUserAdded ? '3' : '2'}
                    strokeDasharray={e.isUserAdded ? '5,5' : 'none'}
                    markerEnd={`url(#${e.isUserAdded ? 'arrow-user' : 'arrow-default'})`}
                    className={e.isUserAdded ? 'animate-pulse' : ''}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {INITIAL_NODES.map(node => (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-sm transition-all z-10 
                ${selectedNode === node.id ? 'ring-4 ring-orange-500/50 scale-110 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'hover:scale-105 hover:ring-2 hover:ring-slate-500'}
                ${node.type === 'process' ? 'w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 text-slate-200' : 
                  node.type === 'entity' ? 'w-20 h-16 rounded bg-slate-700 border-2 border-slate-500 text-slate-300' :
                  'w-28 h-12 rounded-sm border-t-2 border-b-2 border-slate-500 bg-slate-800/80 text-cyan-300' // datastore style
                }
              `}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
            </button>
          ))}
          
          {/* Instructions Overlay */}
          {selectedNode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-950/80 border border-orange-500/50 text-orange-200 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              点击目标节点建立数据流连接...
            </div>
          )}
        </div>

        {/* Diagnostics Panel */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-rose-400" /> 诊断报告
            </h3>
            
            {status === 'won' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in">
                <CheckCircle size={64} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                <h4 className="text-xl font-bold text-emerald-300 mb-2">系统运转正常！</h4>
                <p className="text-slate-400 text-sm">所有黑洞与奇迹已被消除，数据流图平衡校验通过。</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-3">
                {diagnostics.length > 0 ? (
                  diagnostics.map((diag, i) => (
                    <div key={i} className="bg-rose-950/30 border border-rose-800 p-3 rounded-lg flex items-start gap-3 animate-in slide-in-from-right">
                      <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                      <span className="text-rose-300 text-sm">{diag}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-center mt-10">
                    分析中...
                  </div>
                )}
                
                <div className="mt-auto bg-slate-900 p-4 rounded-xl border border-slate-700 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300 block mb-1">提示：</strong>
                  黑洞：该节点像黑洞一样吸入数据，但没有任何产出。<br/>
                  奇迹：该节点没有任何输入，却凭空产生了输出。<br/>
                  请在它们之间建立合理的数据流。
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
