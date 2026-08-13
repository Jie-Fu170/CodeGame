import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Database } from 'lucide-react';

interface PageTableEntry {
  pageNo: number;
  frameNo: number | null; // null if not in memory
  valid: boolean; // 1 = present in RAM, 0 = missing (Page Fault)
  dirty: boolean;
}

export default function MMUTranslator() {
  const [pageSize] = useState(4096); // 4KB = 0x1000 bytes
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Translation, 2: Fault & Exception, 3: Success

  // Page Table Definition
  const [pageTable] = useState<PageTableEntry[]>([
    { pageNo: 0, frameNo: 5, valid: true, dirty: false },
    { pageNo: 1, frameNo: 12, valid: true, dirty: true },
    { pageNo: 2, frameNo: 8, valid: true, dirty: false },
    { pageNo: 3, frameNo: null, valid: false, dirty: false }, // Page fault
    { pageNo: 4, frameNo: 19, valid: true, dirty: false },
  ]);

  // Phase 1 Target: Logical Address 0x2E4C (Decimal 11852)
  // Page No = 0x2 = 2, Offset = 0xE4C = 3660
  // Frame No = 8 -> Physical Address = 8 * 4096 + 3660 = 36428 = 0x8E4C
  const [inputPageNo, setInputPageNo] = useState('');
  const [inputOffsetHex, setInputOffsetHex] = useState('');
  const [inputPhysHex, setInputPhysHex] = useState('');
  const [phase1Error, setPhase1Error] = useState('');

  // Phase 2 Target: Logical Address 0x310A (Page No 3 -> Valid=false)
  const [phase2Choice, setPhase2Choice] = useState<'NORMAL' | 'PAGE_FAULT' | 'OUT_OF_BOUNDS' | null>(null);
  const [phase2Error, setPhase2Error] = useState('');

  const handleVerifyPhase1 = () => {
    const p = parseInt(inputPageNo, 10);
    const off = inputOffsetHex.trim().toLowerCase();
    const phys = inputPhysHex.trim().toLowerCase();

    if (p === 2 && (off === 'e4c' || off === '0xe4c') && (phys === '8e4c' || phys === '0x8e4c')) {
      setPhase1Error('');
      setPhase(2);
    } else {
      setPhase1Error('转换有误！逻辑地址 0x2E4C 拆解：页号为 2，页内偏移为 E4C。查页表得块号 8，拼接后物理地址为 0x8E4C！');
    }
  };

  const handleVerifyPhase2 = () => {
    if (phase2Choice === 'PAGE_FAULT') {
      setPhase2Error('');
      setPhase(3);
    } else {
      setPhase2Error('判定错误！页号 3 在页表中的有效位标志为 0 (Valid=false)，此时 MMU 必须触发缺页中断 (Page Fault)！');
    }
  };

  const resetGame = () => {
    setPhase(1);
    setInputPageNo('');
    setInputOffsetHex('');
    setInputPhysHex('');
    setPhase1Error('');
    setPhase2Choice(null);
    setPhase2Error('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Cpu size={28} /> MMU 虚拟内存逻辑地址转物理地址
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：页号与页内偏移提取、页表映射、物理块号拼接与缺页中断判定
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
          1. 正常逻辑地址转换
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 缺页中断与异常诊断
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          3. 通关与考点总结
        </div>
      </div>

      {/* Page Table Spec Banner */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-slate-400">系统页面规格：</span>
          <span className="text-amber-300 font-bold ml-1">页面大小 = 4KB ($2^{12}$ B = 0x1000)</span>
          <span className="text-slate-400 ml-3">页内偏移位数 = </span>
          <span className="text-cyan-300 font-bold">12 位 (3 位十六进制)</span>
        </div>
        {/* Page Table Snapshot */}
        <div className="flex gap-2 text-[11px] overflow-x-auto">
          {pageTable.map(entry => (
            <div
              key={entry.pageNo}
              className={`px-2.5 py-1.5 rounded border text-center ${
                entry.valid ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-red-950/60 border-red-800 text-red-300'
              }`}
            >
              <div>页 {entry.pageNo} $\rightarrow$ 块 {entry.frameNo ?? '无'}</div>
              <div className="text-[9px] opacity-75">{entry.valid ? '状态:在内存' : '状态:未调入'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 1 */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database size={18} className="text-cyan-400" /> 步骤 1：转换逻辑地址 0x2E4C
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">提炼出的逻辑页号 (Page No):</label>
                <input
                  type="number"
                  value={inputPageNo}
                  onChange={e => setInputPageNo(e.target.value)}
                  placeholder="例如: 2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">页内偏移 (Offset in Hex):</label>
                <input
                  type="text"
                  value={inputOffsetHex}
                  onChange={e => setInputOffsetHex(e.target.value)}
                  placeholder="例如: E4C 或 0xE4C"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">拼接计算后的物理地址 (Phys Addr):</label>
                <input
                  type="text"
                  value={inputPhysHex}
                  onChange={e => setInputPhysHex(e.target.value)}
                  placeholder="例如: 8E4C 或 0x8E4C"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-base font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
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
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} /> 验证 MMU 转换逻辑
            </button>
          </div>
        </div>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" /> 步骤 2：针对逻辑地址 0x310A 的响应诊断
            </h2>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 text-xs space-y-2">
              <p><span className="text-slate-400">输入逻辑地址：</span><strong className="text-amber-300">0x310A</strong> (拆解页号 = 3, 偏移 = 0x10A)</p>
              <p><span className="text-slate-400">查页表状态：</span><span className="text-red-400 font-bold">页号 3 对应 Valid = 0 (不在内存中)</span></p>
            </div>

            <p className="text-xs text-slate-300 font-bold">请问此时 MMU 硬件与操作系统内核会触发什么行为？</p>

            <div className="space-y-3">
              <button
                onClick={() => setPhase2Choice('NORMAL')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  phase2Choice === 'NORMAL' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>A. 正常完成地址拼接并从物理内存读写数据</span>
                {phase2Choice === 'NORMAL' && <CheckCircle2 size={16} />}
              </button>

              <button
                onClick={() => setPhase2Choice('PAGE_FAULT')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  phase2Choice === 'PAGE_FAULT' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>B. 触发“缺页中断” (Page Fault Interrupt)，挂起当前进程并由 OS 调入外存页面</span>
                {phase2Choice === 'PAGE_FAULT' && <CheckCircle2 size={16} />}
              </button>

              <button
                onClick={() => setPhase2Choice('OUT_OF_BOUNDS')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  phase2Choice === 'OUT_OF_BOUNDS' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span>C. 触发“越界中断” (Segment Fault)，直接终止系统</span>
                {phase2Choice === 'OUT_OF_BOUNDS' && <CheckCircle2 size={16} />}
              </button>
            </div>

            {phase2Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase2Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase2}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
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
          <h2 className="text-xl font-bold text-emerald-300">通关！彻底理清 MMU 虚拟内存映射机制！</h2>
          
          <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-cyan-300 text-sm">📘 软考真题快速秒杀公式：</h4>
            <p>1. <strong>页号与物理块号高位替换</strong>：物理地址 = 物理块号 $\times$ 页面大小 + 页内偏移。</p>
            <p>2. <strong>十六进制快捷法则</strong>：页面大小 4KB ($2^{12}$) 时，后 3 位十六进制为页内偏移，前面部分为页号。<strong>页内偏移在转换过程中保持绝对不变</strong>！</p>
            <p>3. <strong>中断区别</strong>：未调入内存 (Valid=0) 触发<strong>缺页中断</strong>；页号超出页表最大长度触发<strong>越界中断</strong>。</p>
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
