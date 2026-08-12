import React, { useState } from 'react';
import { LayoutGrid, GripHorizontal, CheckCircle, ArrowRight, XCircle } from 'lucide-react';

export default function MatrixCompressor() {
  const [selectedCell, setSelectedCell] = useState<{i: number, j: number} | null>(null);
  const [inputK, setInputK] = useState('');
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [error, setError] = useState('');

  // 4x4 lower triangular matrix
  const matrix = [
    [1, 0, 0, 0],
    [2, 3, 0, 0],
    [4, 5, 6, 0],
    [7, 8, 9, 10]
  ];

  const targetI = 4;
  const targetJ = 3;
  // K = 4*3/2 + 3 = 6 + 3 = 9
  const TARGET_K = 9;

  const handleCellClick = (i: number, j: number) => {
    if (j > i) return; // Upper part is 0
    setSelectedCell({ i, j });
    setError('');
  };

  const checkAnswer = () => {
    if (!selectedCell) {
      setError('请先在左侧矩阵中选中目标元素 A(4,3)！');
      return;
    }
    if (selectedCell.i !== targetI || selectedCell.j !== targetJ) {
      setError('你选中的元素不对，请选中 A(4,3)。');
      return;
    }

    if (parseInt(inputK) === TARGET_K) {
      setStatus('won');
      setError('');
    } else {
      setError(`计算错误。代入公式: i=${targetI}, j=${targetJ}。`);
    }
  };

  const reset = () => {
    setStatus('playing');
    setSelectedCell(null);
    setInputK('');
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border-2 border-indigo-900/50 shadow-2xl flex flex-col font-sans min-h-[600px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
            <LayoutGrid size={32} className="text-indigo-500" /> 压缩矩阵一维收纳盒
          </h1>
          <p className="text-slate-400 mt-2">任务：将二维的下三角矩阵压缩存储到一维数组中，节省内存。</p>
        </div>
      </div>

      <div className="flex-1 flex gap-8 relative z-10">
        {/* Left: 2D Matrix */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-inner">
          <h3 className="text-lg font-bold text-slate-300 mb-6 uppercase tracking-widest flex items-center gap-2">
            二维下三角矩阵 A
          </h3>
          
          <div className="flex flex-col gap-2 bg-slate-900 p-6 rounded-2xl border-2 border-slate-800">
            {matrix.map((row, iIdx) => {
              const i = iIdx + 1;
              return (
                <div key={iIdx} className="flex gap-2 items-center">
                  <div className="w-8 text-right text-slate-600 font-bold mr-2 text-sm">i={i}</div>
                  {row.map((val, jIdx) => {
                    const j = jIdx + 1;
                    const isLower = j <= i;
                    const isSelected = selectedCell?.i === i && selectedCell?.j === j;
                    const isTarget = i === targetI && j === targetJ;
                    
                    return (
                      <button
                        key={jIdx}
                        onClick={() => handleCellClick(i, j)}
                        disabled={!isLower}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg transition-all relative
                          ${!isLower ? 'bg-slate-950 border border-slate-800 text-slate-700 cursor-not-allowed' : 
                            isSelected ? 'bg-indigo-600 border-2 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110 z-10' :
                            'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-indigo-300 hover:scale-105'
                          }
                        `}
                      >
                        {val === 0 ? '0' : `a${i}${j}`}
                        {isTarget && !isSelected && status !== 'won' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })}
            <div className="flex gap-2 mt-2 ml-10">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="w-14 text-center text-slate-600 font-bold text-sm">j={j}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 1D Array & Calculation */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-8 flex-1 flex flex-col relative overflow-hidden">
            {status === 'won' ? (
              <div className="absolute inset-0 bg-slate-900/95 z-20 flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-300">
                <CheckCircle size={64} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                <h2 className="text-3xl font-bold text-white mb-2">压缩寻址成功！</h2>
                <div className="bg-emerald-950/50 border border-emerald-900 px-6 py-3 rounded-xl font-mono text-emerald-400 text-2xl font-bold mb-6">
                  k = 9
                </div>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  你成功掌握了下三角矩阵的一维压缩存储公式：<br/>
                  <code className="text-white bg-black/30 px-2 py-1 rounded mx-1">k = i(i-1)/2 + j</code><br/>
                  通过数学公式计算偏移量，我们可以省去一半的内存空间！
                </p>
                <button onClick={reset} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-white transition-colors">
                  重新挑战
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-indigo-300 mb-4">压缩地址计算</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  下三角矩阵压缩至一维数组（按行优先，下标从 1 开始）。<br/>
                  已知公式：<br/>
                  <code className="block bg-slate-950 border border-slate-700 p-3 rounded-lg mt-2 text-indigo-200 font-mono text-base font-bold shadow-inner">
                    k = i × (i - 1) / 2 + j
                  </code>
                </p>

                <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-5 mb-6">
                  <div className="font-bold text-slate-300 mb-3 text-sm uppercase">目标元素</div>
                  <div className="flex items-center gap-4 text-xl font-mono">
                    <div className="bg-slate-900 px-4 py-2 rounded-lg text-white">A(4, 3)</div>
                    <ArrowRight className="text-slate-600" />
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400">k =</span>
                      <input 
                        type="number"
                        value={inputK}
                        onChange={e => setInputK(e.target.value)}
                        className="w-20 bg-slate-900 border-2 border-indigo-500 rounded-lg py-2 px-2 text-center text-white outline-none focus:shadow-[0_0_15px_rgba(99,102,241,0.5)] font-bold"
                        placeholder="?"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-950/50 border border-rose-900 text-rose-300 p-3 rounded-lg flex items-center gap-2 text-sm mb-4 animate-in slide-in-from-right">
                    <XCircle size={16} /> {error}
                  </div>
                )}

                <button 
                  onClick={checkAnswer}
                  className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-[0_5px_20px_rgba(79,70,229,0.4)] transition-all"
                >
                  <GripHorizontal /> 写入一维收纳盒
                </button>
              </>
            )}
          </div>

          {/* 1D Array Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">一维收纳盒 B[k] 预览</h4>
            <div className="flex flex-wrap gap-1">
              {[1,2,3,4,5,6,7,8,9,10].map(k => {
                const isActive = status === 'won' && k === TARGET_K;
                return (
                  <div key={k} className={`flex flex-col items-center w-10 ${isActive ? 'animate-bounce' : ''}`}>
                    <div className="text-[10px] text-slate-600 mb-1">k={k}</div>
                    <div className={`w-full aspect-square rounded flex items-center justify-center font-mono text-sm font-bold border
                      ${isActive ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                    >
                      {isActive ? 'a43' : ''}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
