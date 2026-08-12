import React, { useState } from 'react';
import { Route, CheckCircle, XCircle, ChevronRight, Play } from 'lucide-react';

const DFA = {
  S0: { name: 'S0 (Start)', isAccept: false, x: 20, y: 50 },
  S1: { name: 'S1', isAccept: false, x: 50, y: 50 },
  S2: { name: 'S2 (Accept)', isAccept: true, x: 80, y: 50 },
  S3: { name: 'S3 (Trap)', isAccept: false, x: 50, y: 80 },
};

const TRANSITIONS = [
  { from: 'S0', to: 'S1', char: '0', path: 'M 25 50 Q 37 40 45 50', type: 'curve' },
  { from: 'S0', to: 'S3', char: '1', path: 'M 22 55 Q 35 75 45 80', type: 'curve' },
  { from: 'S1', to: 'S1', char: '0', path: 'M 48 45 C 45 30 55 30 52 45', type: 'loop' },
  { from: 'S1', to: 'S2', char: '1', path: 'M 55 50 Q 67 40 75 50', type: 'curve' },
  { from: 'S2', to: 'S1', char: '0', path: 'M 75 55 Q 67 65 55 55', type: 'curve' },
  { from: 'S2', to: 'S2', char: '1', path: 'M 78 45 C 75 30 85 30 82 45', type: 'loop' },
  { from: 'S3', to: 'S3', char: '0,1', path: 'M 48 85 C 45 100 55 100 52 85', type: 'loop' },
];

const TARGET_STRINGS = ['01', '101', '00101', '0'];

export default function DFAMaze() {
  const [level, setLevel] = useState(0);
  const [currentState, setCurrentState] = useState('S0');
  const [charIndex, setCharIndex] = useState(0);
  const [status, setStatus] = useState('playing'); // playing, won, lost_invalid, lost_reject, finished

  const targetString = TARGET_STRINGS[level];
  const currentChar = targetString ? targetString[charIndex] : null;

  const handleNodeClick = (nodeId: string) => {
    if (status !== 'playing') return;

    // Determine expected next state based on rules for 0(0|1)*1
    let expectedNext = 'S3';
    if (currentState === 'S0' && currentChar === '0') expectedNext = 'S1';
    else if (currentState === 'S0' && currentChar === '1') expectedNext = 'S3';
    else if (currentState === 'S1' && currentChar === '0') expectedNext = 'S1';
    else if (currentState === 'S1' && currentChar === '1') expectedNext = 'S2';
    else if (currentState === 'S2' && currentChar === '0') expectedNext = 'S1';
    else if (currentState === 'S2' && currentChar === '1') expectedNext = 'S2';
    else if (currentState === 'S3') expectedNext = 'S3';

    if (nodeId !== expectedNext) {
      setStatus('lost_invalid');
      return;
    }

    // Move
    setCurrentState(nodeId);
    
    if (charIndex + 1 < targetString.length) {
      setCharIndex(i => i + 1);
    } else {
      // String consumed. Is it accept state?
      if (DFA[nodeId as keyof typeof DFA].isAccept) {
        setStatus('won');
      } else {
        setStatus('lost_reject');
      }
    }
  };

  const nextLevel = () => {
    if (level + 1 >= TARGET_STRINGS.length) {
      setStatus('finished');
    } else {
      setLevel(l => l + 1);
      resetState();
    }
  };

  const resetState = () => {
    setCurrentState('S0');
    setCharIndex(0);
    setStatus('playing');
  };

  if (status === 'finished') {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl p-10 bg-slate-900 flex flex-col items-center justify-center text-center shadow-2xl border border-slate-700 min-h-[500px]">
        <Route size={80} className="text-emerald-400 mb-6" />
        <h2 className="text-4xl font-bold text-white mb-4">迷宫破解完成！</h2>
        <p className="text-slate-400 max-w-lg mb-8 text-lg">
          你成功掌握了正规式 0(0|1)*1 的状态转换。词法分析器的核心机制已被你彻底洞悉。
        </p>
        <button onClick={() => { setLevel(0); resetState(); }} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition-all">
          重新挑战
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-950 text-slate-200 border border-slate-800 shadow-2xl flex flex-col min-h-[600px] font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
            <Route size={28} className="text-blue-400" /> 有限自动机 DFA 迷宫
          </h1>
          <p className="text-slate-400 mt-1">引导探测器通过状态节点。正规式: <code className="text-emerald-300 bg-emerald-900/30 px-2 py-0.5 rounded">0(0|1)*1</code></p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">测试用例</div>
          <div className="text-xl font-mono text-white">{level + 1} / {TARGET_STRINGS.length}</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-800">
        <div className="flex flex-col">
          <span className="text-slate-500 text-sm mb-2">输入字符串流</span>
          <div className="flex gap-2 font-mono text-2xl font-bold">
            {targetString.split('').map((char, idx) => (
              <span key={idx} className={`w-10 h-12 flex items-center justify-center rounded-lg border-2 ${
                idx < charIndex ? 'border-slate-700 text-slate-600 bg-slate-800' : 
                idx === charIndex ? 'border-blue-500 text-blue-300 bg-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.5)] transform scale-110' : 
                'border-slate-600 text-slate-300'
              }`}>
                {char}
              </span>
            ))}
          </div>
        </div>
        
        {status === 'playing' && (
          <div className="text-right">
            <div className="text-slate-400 text-sm">当前读取字符</div>
            <div className="text-4xl font-black text-blue-400 font-mono">'{currentChar}'</div>
          </div>
        )}
      </div>

      <div className="flex-1 relative bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden select-none">
        {/* SVG Drawing for edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
          </defs>
          
          {TRANSITIONS.map((t, i) => (
            <g key={i}>
              <path 
                d={t.path} 
                fill="transparent" 
                stroke="#334155" 
                strokeWidth="3" 
                markerEnd="url(#arrow)"
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-300"
                style={{ transformOrigin: 'center' }}
                transform="scale(10) translate(0, 0)" // Adjust based on viewBox if we used one
              />
              {/* Note: In a real robust SVG, we'd calculate exact positions. For this UI, we rely on absolute positioned divs for nodes and approximate SVG paths */}
            </g>
          ))}
        </svg>

        {/* Since absolute SVG paths are tricky to align with relative DOM elements across screen sizes, 
            let's just use CSS flex/grid layout and stylized arrows instead of raw SVG paths for simplicity and robustness.
            Wait, I'll replace the SVG with a logical layout map. */}
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-2xl h-64 border border-dashed border-slate-700 rounded-3xl p-8 flex justify-between items-center bg-slate-950/50">
            {/* Visual background paths */}
            <div className="absolute top-1/2 left-24 right-24 h-1 bg-slate-700 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-1/2 w-1 h-24 bg-slate-700 z-0"></div>
            
            {Object.entries(DFA).map(([id, state]) => (
              <button
                key={id}
                onClick={() => handleNodeClick(id)}
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold text-lg transition-all border-4 shadow-xl ${
                  currentState === id 
                    ? 'bg-blue-900 border-blue-400 text-blue-100 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.6)]' 
                    : state.isAccept 
                      ? 'bg-slate-800 border-emerald-600 text-slate-300 hover:border-emerald-400' 
                      : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                } ${id === 'S3' ? 'absolute bottom-8 left-1/2 -translate-x-1/2' : ''}`}
                style={id !== 'S3' ? {} : {}} // Inline for S3 position
              >
                {state.isAccept && <div className="absolute inset-[-8px] border-2 border-emerald-600/50 rounded-full animate-pulse pointer-events-none"></div>}
                {id}
                <span className="text-[10px] font-normal text-slate-400 opacity-80 mt-1 px-2 text-center leading-tight">
                  {state.name.split(' ')[1] || ''}
                </span>
              </button>
            ))}

            {/* Labels for paths (simplified CSS placement) */}
            <div className="absolute top-1/2 left-[28%] -translate-y-6 text-slate-400 font-bold bg-slate-900 px-2 rounded-full border border-slate-700 z-10 text-sm">0</div>
            <div className="absolute top-1/2 left-[72%] -translate-y-6 text-slate-400 font-bold bg-slate-900 px-2 rounded-full border border-slate-700 z-10 text-sm">1</div>
            <div className="absolute top-1/2 left-[50%] -translate-x-4 -translate-y-6 text-slate-400 font-bold bg-slate-900 px-2 rounded-full border border-slate-700 z-10 text-sm">0</div>
            <div className="absolute top-[65%] left-[38%] text-slate-400 font-bold bg-slate-900 px-2 rounded-full border border-slate-700 z-10 text-sm">1</div>
          </div>
        </div>
      </div>

      {status !== 'playing' && (
        <div className={`mt-6 p-6 rounded-2xl flex items-center justify-between border-2 ${
          status === 'won' ? 'bg-emerald-950/80 border-emerald-500' : 'bg-rose-950/80 border-rose-500'
        }`}>
          <div className="flex items-center gap-4">
            {status === 'won' ? <CheckCircle size={40} className="text-emerald-400" /> : <XCircle size={40} className="text-rose-400" />}
            <div>
              <h3 className={`text-xl font-bold ${status === 'won' ? 'text-emerald-300' : 'text-rose-300'}`}>
                {status === 'won' ? '字符串被成功识别！' : status === 'lost_invalid' ? '路径错误，这不是合法的状态迁移！' : '到达终点，但不在 Accept 状态 (S2)，拒绝！'}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {status === 'won' ? '正确匹配了 0(0|1)*1' : '请根据正规式重新推导状态流转。'}
              </p>
            </div>
          </div>
          <button 
            onClick={status === 'won' ? nextLevel : resetState}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              status === 'won' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {status === 'won' ? <>下一组测试 <ChevronRight size={18} /></> : '重新尝试'}
          </button>
        </div>
      )}
    </div>
  );
}
