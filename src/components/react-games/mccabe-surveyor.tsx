import React, { useState } from 'react';
import { Route, CircleDot, Network, Target, CheckCircle } from 'lucide-react';

export default function McCabeSurveyor() {
  const [edges, setEdges] = useState('');
  const [nodes, setNodes] = useState('');
  const [predicates, setPredicates] = useState('');
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [error, setError] = useState('');

  // CFG Properties:
  // N = 6, E = 7, P = 2
  // V(G) = E - N + 2 = 7 - 6 + 2 = 3
  // V(G) = P + 1 = 2 + 1 = 3

  const TARGET_E = '7';
  const TARGET_N = '6';
  const TARGET_P = '2';

  const checkAnswers = () => {
    if (edges !== TARGET_E) {
      setError('边数 (E) 计算错误。请仔细数一数有几条带箭头的连线。');
      return;
    }
    if (nodes !== TARGET_N) {
      setError('节点数 (N) 计算错误。请仔细数一数有几个圆圈。');
      return;
    }
    if (predicates !== TARGET_P) {
      setError('判定节点数 (P) 计算错误。判定节点是指引出 2 条或以上分支的节点。');
      return;
    }

    setError('');
    setStatus('won');
  };

  const reset = () => {
    setEdges('');
    setNodes('');
    setPredicates('');
    setError('');
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border-2 border-fuchsia-900 shadow-2xl flex flex-col font-sans min-h-[650px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-500 flex items-center gap-3">
            <Route size={32} className="text-fuchsia-500" /> McCabe 环路复杂度勘测员
          </h1>
          <p className="text-slate-400 mt-2">任务：计算控制流图 (CFG) 的 McCabe 环路复杂度 V(G)。</p>
        </div>
      </div>

      <div className="flex-1 flex gap-8 relative z-10">
        {/* Left Side: CFG Graph */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-inner relative">
          <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Network size={18}/> 控制流图 (CFG)
          </h3>

          <div className="relative w-full max-w-[300px] aspect-[3/4] border-2 border-slate-800 rounded-xl bg-slate-900/50 flex items-center justify-center">
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 400">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#d946ef" />
                </marker>
              </defs>
              {/* 1 -> 2 */}
              <line x1="150" y1="50" x2="150" y2="100" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 2 -> 3 */}
              <line x1="150" y1="120" x2="75" y2="190" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 2 -> 4 */}
              <line x1="150" y1="120" x2="225" y2="190" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 3 -> 5 */}
              <line x1="75" y1="210" x2="150" y2="280" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 4 -> 5 */}
              <line x1="225" y1="210" x2="150" y2="280" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 5 -> 6 */}
              <line x1="150" y1="300" x2="150" y2="350" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
              {/* 5 -> 2 (Loop back) */}
              <path d="M 170 290 Q 280 205 170 120" fill="none" stroke="#d946ef" strokeWidth="3" markerEnd="url(#arrow)" />
            </svg>

            {/* HTML Nodes */}
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-fuchsia-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ top: '40px', left: '150px', transform: 'translate(-50%, -50%)' }}>1</div>
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-amber-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ top: '110px', left: '150px', transform: 'translate(-50%, -50%)' }}>2</div>
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-fuchsia-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ top: '200px', left: '75px', transform: 'translate(-50%, -50%)' }}>3</div>
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-fuchsia-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ top: '200px', left: '225px', transform: 'translate(-50%, -50%)' }}>4</div>
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-amber-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ top: '290px', left: '150px', transform: 'translate(-50%, -50%)' }}>5</div>
            <div className="absolute w-8 h-8 bg-slate-800 border-2 border-fuchsia-500 rounded-full flex items-center justify-center font-bold font-mono text-sm shadow-[0_0_10px_rgba(217,70,239,0.5)]" style={{ top: '360px', left: '150px', transform: 'translate(-50%, -50%)' }}>6</div>
          </div>
          
          <div className="mt-6 text-sm text-slate-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
            提示：图中有分支、有循环。节点 2 和节点 5 有两条出边，被称为<strong className="text-amber-400">判定节点</strong>。
          </div>
        </div>

        {/* Right Side: Calculation Form */}
        <div className="flex-1 flex flex-col gap-6">
          {status === 'won' ? (
             <div className="flex-1 bg-fuchsia-950/20 border border-fuchsia-900/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
               <CheckCircle size={80} className="text-fuchsia-400 mb-6 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]" />
               <h2 className="text-4xl font-bold text-white mb-6">测量精准无误！</h2>
               <div className="flex flex-col gap-4 text-left w-full max-w-sm bg-slate-950 p-6 rounded-2xl border border-fuchsia-500 shadow-lg mb-8">
                 <div className="text-slate-300 font-mono">公式一: <span className="text-white font-bold">V(G) = E - N + 2</span></div>
                 <div className="text-fuchsia-300 font-mono text-xl font-bold ml-6">= 7 - 6 + 2 = <span className="text-fuchsia-400 text-3xl">3</span></div>
                 <div className="h-px bg-slate-800 my-2"></div>
                 <div className="text-slate-300 font-mono">公式二: <span className="text-white font-bold">V(G) = P + 1</span></div>
                 <div className="text-fuchsia-300 font-mono text-xl font-bold ml-6">= 2 + 1 = <span className="text-fuchsia-400 text-3xl">3</span></div>
               </div>
               <p className="text-slate-400 leading-relaxed mb-8">
                 环路复杂度为 3，意味着这段代码中至少包含 3 条独立执行路径。在设计白盒测试用例时，你至少需要准备 3 个测试用例来覆盖所有独立路径！
               </p>
               <button onClick={reset} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all shadow-lg">
                 重新勘测
               </button>
             </div>
          ) : (
            <div className="flex-1 bg-slate-800/50 rounded-3xl border border-slate-700 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2">
                <Target size={24} /> 复杂度计算器
              </h3>
              
              <div className="flex flex-col gap-8 mb-8">
                {/* Formula 1 */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">计算方法 1: 点边公式</h4>
                  <div className="flex items-center gap-4 text-xl font-mono text-slate-300 mb-4">
                    V(G) = E - N + 2
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-xs text-slate-500 font-bold">边数 (E)</label>
                      <input 
                        type="number" 
                        value={edges}
                        onChange={e => setEdges(e.target.value)}
                        className="bg-slate-950 border border-fuchsia-500/50 rounded-lg py-2 px-3 text-white outline-none focus:border-fuchsia-500" 
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-xs text-slate-500 font-bold">节点数 (N)</label>
                      <input 
                        type="number" 
                        value={nodes}
                        onChange={e => setNodes(e.target.value)}
                        className="bg-slate-950 border border-fuchsia-500/50 rounded-lg py-2 px-3 text-white outline-none focus:border-fuchsia-500" 
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Formula 2 */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">计算方法 2: 判定节点公式</h4>
                  <div className="flex items-center gap-4 text-xl font-mono text-slate-300 mb-4">
                    V(G) = P + 1
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-xs text-slate-500 font-bold">判定节点数 (P)</label>
                      <input 
                        type="number" 
                        value={predicates}
                        onChange={e => setPredicates(e.target.value)}
                        className="bg-slate-950 border border-fuchsia-500/50 rounded-lg py-2 px-3 text-white outline-none focus:border-fuchsia-500" 
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="text-rose-400 font-bold mb-4 bg-rose-950/30 p-3 rounded-xl border border-rose-900/50">{error}</div>}

              <button 
                onClick={checkAnswers} 
                className="mt-auto py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-2xl flex justify-center items-center gap-2 shadow-[0_5px_20px_rgba(217,70,239,0.4)] transition-all text-lg"
              >
                <CircleDot /> 交叉验证并提交
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
