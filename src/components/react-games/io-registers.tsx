import React, { useState } from 'react';
import { Cpu, ArrowRight, RotateCcw, CheckCircle2, Info, Trophy, HardDrive, ShieldCheck } from 'lucide-react';

export default function IORegisters() {
  const [stage, setStage] = useState<1 | 2>(1);

  // Stage 1: CPU Register Fetch Flow
  const [regStep, setRegStep] = useState<number>(0);

  // Stage 2: I/O Control Mode Picker
  const [ioMode, setIoMode] = useState<'POLLING' | 'INTERRUPT' | 'DMA'>('POLLING');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const FETCH_STEPS = [
    { from: 'PC (程序计数器)', to: 'MAR (地址寄存器)', desc: '1. 将 PC 中保存的下一条指令内存地址送入 MAR' },
    { from: 'MAR', to: 'RAM (主内存)', desc: '2. MAR 将地址通过地址总线送往 RAM 主存' },
    { from: 'RAM', to: 'MDR (数据寄存器)', desc: '3. 从 RAM 取出的机器指令读入 MDR' },
    { from: 'MDR', to: 'IR (指令寄存器)', desc: '4. 将 MDR 中的指令送入 IR 进行译码执行' },
  ];

  const handleNextRegStep = () => {
    if (regStep < FETCH_STEPS.length) {
      const step = FETCH_STEPS[regStep];
      setSuccessMsg(step.desc);
      const next = regStep + 1;
      setRegStep(next);
      if (next >= FETCH_STEPS.length) {
        setTimeout(() => {
          setSuccessMsg('🎉 阶段 1 完成！指令取指流程 (PC -> MAR -> RAM -> MDR -> IR) 验证完毕！进入 I/O 控制模式对比。');
        }, 400);
      }
    }
  };

  const handleSelectIoMode = (mode: 'POLLING' | 'INTERRUPT' | 'DMA') => {
    setIoMode(mode);
    if (mode === 'DMA') {
      setErrorMsg(null);
      setSuccessMsg('🎯 正确！DMA (直接内存存取) 方式由 DMA 控制器直接在主存与外设间传送成块数据，传输期间完全不占用 CPU，CPU 效率最高！');
      setTimeout(() => setIsCompleted(true), 1200);
    } else if (mode === 'POLLING') {
      setErrorMsg('错误！程序查询方式中 CPU 处于死等轮询状态，无法执行其他任务，CPU 利用率最低！');
    } else {
      setErrorMsg('中断驱动方式虽然释放了等待时间，但每传输一个字节/字都要中断 CPU 一次，在大数据块传输时 CPU 开销仍高于 DMA！');
    }
  };

  const handleReset = () => {
    setStage(1);
    setRegStep(0);
    setIoMode('POLLING');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800"
      style={{
        background: '#090d16',
        backgroundImage: 'radial-gradient(circle, #1a2438 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#e2e8f0'
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .ior-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ior-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ior-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Cpu className="text-cyan-400" size={22} />
            I/O 控制与 CPU 寄存器探秘
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            PC/IR/MAR/MDR 取指周期与程序查询、中断驱动、DMA 控制权转移实战
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setStage(1)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${stage === 1 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}>
            阶段 1: 寄存器取指
          </button>
          <button
            onClick={() => setStage(2)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${stage === 2 ? 'bg-indigo-500 text-slate-950' : 'text-slate-400'}`}>
            阶段 2: I/O 控制模式
          </button>
        </div>
      </div>

      {!isCompleted && (
        <>
          {/* STAGE 1: REGISTERS */}
          {stage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    CPU 取指周期 4 大核心寄存器
                  </div>

                  <div className="space-y-2 mb-4">
                    {[
                      { reg: 'PC (Program Counter)', role: '保存下一条待执行指令的内存地址' },
                      { reg: 'MAR (Memory Address Reg)', role: '保存 CPU 正在访问的内存物理地址' },
                      { reg: 'MDR (Memory Data Reg)', role: '暂存从内存读出或写入内存的数据/指令' },
                      { reg: 'IR (Instruction Reg)', role: '保存当前正在译码并执行的指令' },
                    ].map((item, i) => (
                      <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div className="ior-mono font-bold text-cyan-300">{item.reg}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNextRegStep}
                  disabled={regStep >= FETCH_STEPS.length}
                  className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 ${
                    regStep >= FETCH_STEPS.length
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  }`}>
                  <ArrowRight size={14} /> 下一步取指 ({regStep}/{FETCH_STEPS.length})
                </button>
              </div>

              {/* Data Flow Visual */}
              <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    指令流动路线 Visual
                  </div>

                  <div className="space-y-3">
                    {FETCH_STEPS.map((step, i) => {
                      const isActive = i === regStep - 1;
                      const isDone = i < regStep;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border transition-all text-xs ${
                            isActive
                              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md'
                              : isDone
                              ? 'border-slate-800 bg-slate-900/40 opacity-50 text-slate-400'
                              : 'border-slate-800 bg-slate-950 text-slate-600'
                          }`}>
                          <div className="ior-mono font-bold">{step.from} &rarr; {step.to}</div>
                          <div className="mt-0.5">{step.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {regStep >= FETCH_STEPS.length && (
                  <button
                    onClick={() => setStage(2)}
                    className="w-full mt-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                    进入阶段 2：I/O 控制模式效率对决 &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 2: I/O CONTROL MODES */}
          {stage === 2 && (
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
                I/O 控制方式效率对决 (软考必考点)
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 mb-4 leading-relaxed font-medium">
                ❓ 问题：要在大容量硬盘与主存之间传输 100MB 大块数据，哪种 I/O 控制方式的 CPU 利用效率最高且对 CPU 开销最小？
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[
                  { mode: 'POLLING', title: '程序查询方式', desc: 'CPU 在死循环中反复轮询外设状态标志。CPU 完全无法做别的事。' },
                  { mode: 'INTERRUPT', title: '中断驱动方式', desc: '外设准备好后发中断通知 CPU，但每传输一个字仍要中断 CPU 一次。' },
                  { mode: 'DMA', title: 'DMA 直接内存存取', desc: 'DMA 控制器接管总线直接与 RAM 传数据，CPU 仅在起始和结束时参与！' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => handleSelectIoMode(item.mode as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      ioMode === item.mode
                        ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200 shadow-lg'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}>
                    <div className="ior-display text-sm font-bold text-slate-100 mb-1">{item.title}</div>
                    <div className="text-[11px] text-slate-400 leading-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          <div className="mt-4 min-h-[40px]">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs flex items-start gap-2">
                <ShieldCheck size={16} className="shrink-0 mt-0.5 text-cyan-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-cyan-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ior-display text-2xl font-bold text-cyan-400 mb-2">🎉 恭喜通关：I/O 与寄存器探秘大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 <span className="text-cyan-300">PC -> MAR -> RAM -> MDR -> IR</span> 取指流程与 <span className="text-indigo-300">DMA 方式</span> 的高效率原理！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
