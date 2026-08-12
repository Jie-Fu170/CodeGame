import { useState } from 'react';
import { HardDrive, Server, ArrowRight } from 'lucide-react';

const LEVELS = [
  { target: 5, expectedLevel: 'direct', desc: '小型文件，存储在最初的几个块中。' },
  { target: 1000, expectedLevel: 'single', desc: '中型文件，超出直接索引容量，需通过一级映射表。' },
  { target: 2000, expectedLevel: 'double', desc: '大型文件，需启动二级间接索引映射电梯。', calc: true }
];

export default function UnixInode() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<'select' | 'calc' | 'success'>('select');
  const [l1Input, setL1Input] = useState('');
  const [l2Input, setL2Input] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentLevel = LEVELS[levelIdx];

  const handleSelect = (sel: string) => {
    if (sel === currentLevel.expectedLevel) {
      setErrorMsg('');
      if (currentLevel.calc) {
        setPhase('calc');
      } else {
        if (levelIdx + 1 < LEVELS.length) {
          setLevelIdx(l => l + 1);
        } else {
          setPhase('success');
        }
      }
    } else {
      setErrorMsg(`寻址失败！逻辑块号 ${currentLevel.target} 不在所选索引层级的覆盖范围内。`);
    }
  };

  const handleCalcSubmit = () => {
    // Target = 2000
    // Direct = 10 (0-9)
    // Single = 1024 (10-1033)
    // Double = start at 1034
    // Offset in double = 2000 - 1034 = 966
    // L1 index = floor(966 / 1024) = 0
    // L2 index = 966 % 1024 = 966
    if (parseInt(l1Input) === 0 && parseInt(l2Input) === 966) {
      setErrorMsg('');
      if (levelIdx + 1 < LEVELS.length) {
        setLevelIdx(l => l + 1);
        setPhase('select');
      } else {
        setPhase('success');
      }
    } else {
      setErrorMsg(`计算错误！\n提示: 偏移量 = ${currentLevel.target} - 1034 = 966。\n每页 1024 项。L1 = 偏移量/1024，L2 = 偏移量%1024。`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
            <HardDrive size={32} /> UNIX 多级索引寻宝
          </h1>
          <p className="text-slate-400 mt-2">物理块大小: 4KB | 地址项大小: 4B | 每个索引块含 1024 个地址项</p>
        </div>
        <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">目标逻辑块号</div>
          <div className="text-3xl font-mono text-white font-black">{currentLevel ? currentLevel.target : 'DONE'}</div>
        </div>
      </div>

      {phase === 'success' ? (
        <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in duration-500 relative z-10">
          <div className="w-24 h-24 bg-cyan-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)]">
            <Database size={48} className="text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">全部寻址成功！</h2>
          <p className="text-slate-400 text-lg">你完美掌握了 UNIX i-node 多级索引的映射边界和偏移量计算。</p>
          <button onClick={() => { setLevelIdx(0); setPhase('select'); setL1Input(''); setL2Input(''); }} className="mt-8 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg">
            重新寻宝
          </button>
        </div>
      ) : phase === 'select' ? (
        <div className="flex flex-col gap-6 relative z-10">
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-bold text-slate-300 mb-2">任务:</h3>
            <p className="text-slate-400">{currentLevel.desc}</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-800 text-rose-300 p-4 rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => handleSelect('direct')} className="group flex flex-col p-6 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-600 hover:border-cyan-500 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <h4 className="text-xl font-bold text-white mb-2">直接地址索引</h4>
              <p className="text-sm text-slate-400 mb-4">i-node 的第 0-9 项</p>
              <div className="mt-auto bg-slate-900 px-3 py-2 rounded-lg text-xs font-mono text-slate-400">
                覆盖范围: 0 ~ 9
              </div>
            </button>

            <button onClick={() => handleSelect('single')} className="group flex flex-col p-6 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-600 hover:border-cyan-500 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <h4 className="text-xl font-bold text-white mb-2">一级间接索引</h4>
              <p className="text-sm text-slate-400 mb-4">i-node 的第 10 项。指向一个索引块，含有 1024 个直接物理块地址。</p>
              <div className="mt-auto bg-slate-900 px-3 py-2 rounded-lg text-xs font-mono text-slate-400">
                覆盖范围: 10 ~ 1033
              </div>
            </button>

            <button onClick={() => handleSelect('double')} className="group flex flex-col p-6 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-600 hover:border-cyan-500 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full transition-transform group-hover:scale-150"></div>
              <h4 className="text-xl font-bold text-white mb-2">二级间接索引</h4>
              <p className="text-sm text-slate-400 mb-4">i-node 的第 11 项。指向 1024 个一级索引块，共可寻址 1024*1024 个块。</p>
              <div className="mt-auto bg-slate-900 px-3 py-2 rounded-lg text-xs font-mono text-slate-400">
                覆盖范围: 1034 ~ 1049609
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative z-10 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-cyan-700/50 flex flex-col items-center">
            <Server size={40} className="text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">启动二级间接电梯</h3>
            <p className="text-slate-400 text-center max-w-2xl mb-8">
              逻辑块号 <strong>{currentLevel.target}</strong> 落入二级间接索引区域。
              我们首先跨过了前 1034 个块 (直接+一级)。现在我们需要在二级电梯中寻找偏移量。<br/>
              二级电梯相当于一个 2D 矩阵：第一级有 1024 个项 (L1)，每个项指向 1024 个终端项 (L2)。
            </p>

            <div className="flex gap-4 items-center bg-slate-900 p-6 rounded-2xl border border-slate-700 w-full max-w-lg mx-auto">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm text-slate-400 font-bold">L1 索引号 (0-1023)</label>
                <input 
                  type="number" 
                  value={l1Input} 
                  onChange={e => setL1Input(e.target.value)}
                  className="bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-xl focus:border-cyan-500 focus:outline-none"
                  placeholder="?"
                />
              </div>
              <ArrowRight className="text-slate-500 mt-6" />
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm text-slate-400 font-bold">L2 索引号 (0-1023)</label>
                <input 
                  type="number" 
                  value={l2Input} 
                  onChange={e => setL2Input(e.target.value)}
                  className="bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-xl focus:border-cyan-500 focus:outline-none"
                  placeholder="?"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="mt-6 bg-rose-950/50 border border-rose-800 text-rose-300 p-4 rounded-xl font-bold w-full max-w-lg text-sm whitespace-pre-line">
                {errorMsg}
              </div>
            )}

            <button onClick={handleCalcSubmit} className="mt-8 px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg text-lg">
              提交坐标寻址
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
