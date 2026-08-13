import React, { useState } from 'react';
import { HardDrive, RefreshCw, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';

export default function BitmapDisk() {
  const [wordSize] = useState(32); // 32 bits per word
  const [totalWords] = useState(8); // 8 words = 256 disk blocks (0-255)
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Single Block Mapping, 2: Free Space Calculation, 3: Success

  // Target for Phase 1
  const [targetBlock] = useState(158); // Block #158
  const [inputWord, setInputWord] = useState('');
  const [inputBit, setInputBit] = useState('');
  const [phase1Error, setPhase1Error] = useState('');

  // Target for Phase 2: Bitmap grid state (1 = allocated, 0 = free)
  // Let's create a deterministic bitmap state for Phase 2
  const [bitmapGrid] = useState<number[][]>(() => {
    const grid: number[][] = [];
    for (let w = 0; w < 8; w++) {
      const word: number[] = [];
      for (let b = 0; b < 32; b++) {
        // Pattern: word 0-2 mostly allocated, 3-5 half, 6-7 mostly free
        const val = (w * 32 + b) % 3 === 0 || (w * 32 + b) % 5 === 1 ? 1 : 0;
        word.push(val);
      }
      grid.push(word);
    }
    return grid;
  });

  const [inputFreeCount, setInputFreeCount] = useState('');
  const [phase2Error, setPhase2Error] = useState('');

  // Calculations:
  // For Block 158 starting at 0: Word = floor(158/32) = 4, Bit = 158 % 32 = 30
  const correctWord = Math.floor(targetBlock / wordSize);
  const correctBit = targetBlock % wordSize;

  // Calculate actual free count (zeros)
  const actualFreeCount = bitmapGrid.reduce(
    (sum, word) => sum + word.filter(b => b === 0).length,
    0
  );

  const handleVerifyPhase1 = () => {
    const w = parseInt(inputWord, 10);
    const b = parseInt(inputBit, 10);

    if (w === correctWord && b === correctBit) {
      setPhase1Error('');
      setPhase(2);
    } else {
      setPhase1Error(
        `公式提示：字号 $i = \\lfloor N / 32 \\rfloor = \\lfloor ${targetBlock} / 32 \\rfloor = ${correctWord}$，位号 $j = N \\bmod 32 = ${targetBlock} \\bmod 32 = ${correctBit}$ (注意从 0 编号开始)。`
      );
    }
  };

  const handleVerifyPhase2 = () => {
    const freeCount = parseInt(inputFreeCount, 10);
    if (freeCount === actualFreeCount) {
      setPhase2Error('');
      setPhase(3);
    } else {
      setPhase2Error(`统计错误！实际空闲比特 (0 的个数) 为 ${actualFreeCount}，请重新数清或计算！`);
    }
  };

  const resetGame = () => {
    setPhase(1);
    setInputWord('');
    setInputBit('');
    setPhase1Error('');
    setInputFreeCount('');
    setPhase2Error('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <HardDrive size={28} /> 位示图法 (Bitmap) 磁盘空闲管理
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：物理块号与位示图字号 $i$、位号 $j$ 的换算，以及容量与空闲盘块计算
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Progress Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className={`p-2.5 rounded-lg border ${phase === 1 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          1. 块号与字/位号转换
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 位示图空闲块统计
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
              <Calculator size={18} className="text-amber-400" /> 任务 1：定位磁盘块在位示图中的具体位置
            </h2>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 text-xs space-y-2">
              <p><span className="text-slate-400">系统位示图规格：</span><strong>字长 $W = 32$ 位</strong> (即每个字 Word 包含 32 比特，编号 0~31)</p>
              <p><span className="text-slate-400">编号起始规定：</span><strong>字号 $i$ 从 0 开始，位号 $j$ 从 0 开始，块号 $N$ 从 0 开始。</strong></p>
              <p className="text-amber-300 font-bold text-sm pt-1">现系统收到分配请求：需要分配物理磁盘块号 N = {targetBlock}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">输入对应字号 $i$ (Word Index):</label>
                <input
                  type="number"
                  value={inputWord}
                  onChange={e => setInputWord(e.target.value)}
                  placeholder={`例如: ${correctWord}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">输入对应位号 $j$ (Bit Index):</label>
                <input
                  type="number"
                  value={inputBit}
                  onChange={e => setInputBit(e.target.value)}
                  placeholder={`例如: ${correctBit}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {phase1Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase1Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase1}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> 验证索引坐标
            </button>
          </div>
        </div>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <HardDrive size={18} className="text-cyan-400" /> 任务 2：全盘位示图空闲容量扫描
            </h2>
            <p className="text-xs text-slate-300">
              在位示图中，<span className="text-red-400 font-bold">1 代表已分配磁盘块</span>，<span className="text-emerald-400 font-bold">0 代表空闲可分配块</span>。
            </p>

            {/* Bitmap Interactive Visualization Grid */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 overflow-x-auto">
              <div className="text-[10px] text-slate-500 font-bold grid grid-cols-33 gap-1 min-w-[600px]">
                <span>字号</span>
                {Array.from({ length: 32 }, (_, b) => (
                  <span key={b} className="text-center">{b}</span>
                ))}
              </div>
              {bitmapGrid.map((word, wIdx) => (
                <div key={wIdx} className="grid grid-cols-33 gap-1 items-center min-w-[600px] text-xs">
                  <span className="text-slate-400 font-bold text-[10px]">W{wIdx}</span>
                  {word.map((bit, bIdx) => (
                    <div
                      key={bIdx}
                      className={`h-6 rounded flex items-center justify-center text-[10px] font-bold border ${
                        bit === 1
                          ? 'bg-red-950/60 border-red-800 text-red-400'
                          : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                      }`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 space-y-3">
              <label className="block text-xs text-slate-200 font-bold">
                请输入当前位示图包含的空闲磁盘块总数 (提示：数出位示图中所有 0 的个数)：
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={inputFreeCount}
                  onChange={e => setInputFreeCount(e.target.value)}
                  placeholder="例如: 120"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleVerifyPhase2}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-sm transition-all"
                >
                  验证统计
                </button>
              </div>
              {phase2Error && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle size={16} /> {phase2Error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Phase 3 */}
      {phase === 3 && (
        <div className="bg-emerald-950/40 p-6 rounded-xl border border-emerald-700 space-y-4 text-center">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-300">通关！完美攻克位示图全套计算！</h2>
          
          <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-amber-400 text-sm">📘 软考机考必背避坑公式：</h4>
            <p>1. <strong>编号从 0 开始</strong>：字号 $i = \lfloor N / W \rfloor$，位号 $j = N \bmod W$。</p>
            <p>2. <strong>编号从 1 开始（重要考点坑点）</strong>：字号 $i = \lfloor (N-1) / W \rfloor + 1$，位号 $j = (N-1) \bmod W + 1$。</p>
            <p>3. <strong>位示图总字数需求</strong>：若总盘块数 $M$，字长 $W$，则所需字数 $N_{word} = \lceil M / W \rceil$。</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
          >
            再次训练
          </button>
        </div>
      )}
    </div>
  );
}
