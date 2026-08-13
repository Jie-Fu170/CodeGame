import React, { useState } from 'react';
import { Cpu, CheckCircle2, RefreshCw, Layers, Calculator, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export default function MemoryAddressing() {
  const { addScore } = useGameStore();

  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  // Phase 1 inputs
  const [p1Start] = useState('80000H');
  const [p1End] = useState('BFFFFH');
  const [p1CapacityInput, setP1CapacityInput] = useState('');
  const [p1Feedback, setP1Feedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);

  // Phase 2 inputs
  const [p2AddressMode, setP2AddressMode] = useState<'byte' | 'word'>('byte');
  const [p2Answer, setP2Answer] = useState('');
  const [p2Feedback, setP2Feedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);

  // Phase 3 inputs
  const [p3ChipSize] = useState('16K x 8bit');
  const [p3ChipCountInput, setP3ChipCountInput] = useState('');
  const [p3Feedback, setP3Feedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);

  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // Verification P1
  const checkPhase1 = () => {
    // 0xBFFFF - 0x80000 + 1 = 0x40000 = 262144 bytes = 256 KB
    const val = parseInt(p1CapacityInput.trim());
    if (val === 256) {
      setP1Feedback({ msg: '正确！0xBFFFF - 0x80000 + 1 = 40000H = 262,144 B = 256 KB', isCorrect: true });
      if (!completedPhases.includes(1)) {
        setCompletedPhases([...completedPhases, 1]);
        addScore(30);
      }
    } else {
      setP1Feedback({ msg: '计算错误。提示：BFFFF - 80000 + 1 = 40000H，4 * 16^4 = 262,144 字节 = 256 KB', isCorrect: false });
    }
  };

  // Verification P2
  const checkPhase2 = () => {
    // If 256KB capacity: Byte mode = 256K, Word mode (16-bit = 2 bytes) = 128K
    const val = parseInt(p2Answer.trim());
    const expected = p2AddressMode === 'byte' ? 256 : 128;
    if (val === expected) {
      setP2Feedback({ msg: `正确！在按${p2AddressMode === 'byte' ? '字节(8bit)' : '字(16bit)'}编址下，可寻址单元数为 ${expected}K 个。`, isCorrect: true });
      if (!completedPhases.includes(2)) {
        setCompletedPhases([...completedPhases, 2]);
        addScore(35);
      }
    } else {
      setP2Feedback({ msg: `计算有误。提示：256KB 按${p2AddressMode === 'byte' ? '字节(8bit)' : '字(16bit)'}编址，需除以 ${p2AddressMode === 'byte' ? '1' : '2'}。`, isCorrect: false });
    }
  };

  // Verification P3
  const checkPhase3 = () => {
    // Target 256KB (256K x 8bit). Chip: 16K x 8bit. Chips needed: 256/16 = 16 chips.
    const val = parseInt(p3ChipCountInput.trim());
    if (val === 16) {
      setP3Feedback({ msg: '完美！总容量 256KB / 单芯片容量 16KB = 16 片！拓展成功！', isCorrect: true });
      if (!completedPhases.includes(3)) {
        setCompletedPhases([...completedPhases, 3]);
        addScore(35);
      }
      setShowFinishedModal(true);
    } else {
      setP3Feedback({ msg: '计算有误。提示：(256K * 8bit) / (16K * 8bit) = 16 片。', isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/40">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-300">内存编址与芯片扩展</h2>
            <p className="text-xs text-slate-400">计算机组成原理 · 地址区间、字/字节编址与 RAM 芯片扩展</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <span
              key={num}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                completedPhases.includes(num)
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : phase === num
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              阶段 {num}
            </span>
          ))}
        </div>
      </div>

      {/* Phase Navigator */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setPhase(1)}
          className={`px-4 py-2 text-sm rounded-lg border font-mono transition-all ${
            phase === 1 ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          Phase 1: 地址空间容量
        </button>
        <button
          onClick={() => setPhase(2)}
          disabled={!completedPhases.includes(1)}
          className={`px-4 py-2 text-sm rounded-lg border font-mono transition-all ${
            phase === 2
              ? 'bg-cyan-600 text-white border-cyan-400'
              : !completedPhases.includes(1)
              ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-800'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          Phase 2: 编址单位换算
        </button>
        <button
          onClick={() => setPhase(3)}
          disabled={!completedPhases.includes(2)}
          className={`px-4 py-2 text-sm rounded-lg border font-mono transition-all ${
            phase === 3
              ? 'bg-cyan-600 text-white border-cyan-400'
              : !completedPhases.includes(2)
              ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-800'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
          }`}
        >
          Phase 3: 芯片扩展计算
        </button>
      </div>

      {/* Content Area */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <h3 className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              任务说明：计算十六进制地址区间的内存容量
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              已知某存储器芯片的起始地址为 <span className="font-mono text-amber-400 font-bold">{p1Start}</span>，结束地址为 <span className="font-mono text-amber-400 font-bold">{p1End}</span>，且该存储器按字节(Byte)编址。
              请计算该地址区间的总存储容量（以 <span className="text-cyan-400 font-bold">KB</span> 为单位）。
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-cyan-400/90 border border-slate-700">
              <p>💡 软考核心公式：容量 (字节数) = 结束地址 - 起始地址 + 1</p>
              <p className="text-slate-400 mt-1">例如: 0xBFFFF - 0x80000 + 1 = 0x40000</p>
            </div>
          </div>

          <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
            <label className="text-sm text-slate-300 font-medium">请输入内存总容量 (KB):</label>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={p1CapacityInput}
                onChange={(e) => setP1CapacityInput(e.target.value)}
                placeholder="例如: 256"
                className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400 w-full sm:w-44"
              />
              <span className="text-sm font-mono text-slate-400">KB</span>
            </div>
            <button
              onClick={checkPhase1}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-cyan-500/20"
            >
              提交验证
            </button>
          </div>

          {p1Feedback && (
            <div className={`p-4 rounded-xl border ${p1Feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-mono">{p1Feedback.msg}</p>
              </div>
              {p1Feedback.isCorrect && (
                <button onClick={() => setPhase(2)} className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md">
                  进入 Phase 2 →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {phase === 2 && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <h3 className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              任务说明：按字节 (Byte) vs 按字 (Word) 编址寻址转换
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              已知总存储容量为 <span className="font-mono text-amber-400 font-bold">256 KB</span>。
              若机器字长为 <span className="text-emerald-400 font-bold">16 比特 (Bit)</span>，即 1 字 = 2 字节。
            </p>
          </div>

          <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-300">切换编址模式：</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setP2AddressMode('byte')}
                  className={`px-3 py-1.5 text-xs rounded-md border font-mono ${p2AddressMode === 'byte' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-700'}`}
                >
                  按字节 (8-bit) 编址
                </button>
                <button
                  onClick={() => setP2AddressMode('word')}
                  className={`px-3 py-1.5 text-xs rounded-md border font-mono ${p2AddressMode === 'word' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-700'}`}
                >
                  按字 (16-bit) 编址
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <label className="text-sm text-slate-300">在此模式下，可寻址单元数是？</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={p2Answer}
                  onChange={(e) => setP2Answer(e.target.value)}
                  placeholder={p2AddressMode === 'byte' ? '如: 256' : '如: 128'}
                  className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400 w-36"
                />
                <span className="text-sm font-mono text-slate-400">K 个</span>
              </div>
              <button
                onClick={checkPhase2}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg"
              >
                确认解答
              </button>
            </div>
          </div>

          {p2Feedback && (
            <div className={`p-4 rounded-xl border ${p2Feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-mono">{p2Feedback.msg}</p>
              </div>
              {p2Feedback.isCorrect && (
                <button onClick={() => setPhase(3)} className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md">
                  进入 Phase 3 →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {phase === 3 && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <h3 className="text-base font-semibold text-cyan-300 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              任务说明：RAM 存储芯片扩展与片数求解
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              系统需要构建总量为 <span className="font-mono text-amber-400 font-bold">256 KB</span>（即 <span className="font-mono text-amber-400">256K × 8bit</span>）的内存空间。
              现采用规格为 <span className="font-mono text-emerald-400 font-bold">{p3ChipSize}</span> 的 RAM 芯片进行扩充。
            </p>
            <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs text-cyan-400/90 border border-slate-700">
              <p>💡 芯片数计算公式：所需芯片数 = (目标总容量 in bits) / (单块芯片容量 in bits)</p>
            </div>
          </div>

          <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
            <label className="text-sm text-slate-300 font-medium">需要多少片 RAM 芯片？</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={p3ChipCountInput}
                onChange={(e) => setP3ChipCountInput(e.target.value)}
                placeholder="例如: 16"
                className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400 w-36"
              />
              <span className="text-sm font-mono text-slate-400">片</span>
            </div>
            <button
              onClick={checkPhase3}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
            >
              提交通关
            </button>
          </div>

          {p3Feedback && (
            <div className={`p-4 rounded-xl border ${p3Feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-mono">{p3Feedback.msg}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Victory Modal */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400">通关成功！</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              恭喜你掌握了软考中级《计算机组成原理》高频计算大题：内存地址空间计算、按字/按字节编址转换以及 RAM 芯片扩展片数求解！
            </p>
            <button
              onClick={() => setShowFinishedModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
            >
              完成关卡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
