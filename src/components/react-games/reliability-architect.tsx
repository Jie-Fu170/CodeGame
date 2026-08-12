import React, { useState } from 'react';
import { ShieldCheck, HardDrive, Cpu, Activity, CheckCircle, ArrowRight } from 'lucide-react';

export default function ReliabilityArchitect() {
  const [step, setStep] = useState(1);
  const [inputBC, setInputBC] = useState('');
  const [inputTotal, setInputTotal] = useState('');
  const [error, setError] = useState('');

  const RA = 0.9;
  const RB = 0.8;
  const RC = 0.8;
  const TARGET_BC = '0.96';
  const TARGET_TOTAL = '0.864';

  const checkStep1 = () => {
    if (inputBC === TARGET_BC) {
      setStep(2);
      setError('');
    } else {
      setError(`计算错误。并联公式：R = 1 - (1 - R_B) × (1 - R_C) = 1 - (1 - ${RB}) × (1 - ${RC})`);
    }
  };

  const checkStep2 = () => {
    if (inputTotal === TARGET_TOTAL) {
      setStep(3);
      setError('');
    } else {
      setError(`计算错误。串联公式：R = R_A × R_BC = ${RA} × 0.96`);
    }
  };

  const reset = () => {
    setStep(1);
    setInputBC('');
    setInputTotal('');
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col font-sans min-h-[600px] relative">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center gap-3">
            <ShieldCheck size={32} className="text-emerald-500" /> 可靠度大厦架构师
          </h1>
          <p className="text-slate-400 mt-2">任务：计算串并联混合系统架构的总可靠度。</p>
        </div>
        <div className="text-right font-mono">
          <div className="text-sm font-bold text-slate-500 uppercase">进度</div>
          <div className="text-2xl font-bold text-emerald-400">{step} / 3</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* System Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-10 w-full max-w-3xl mb-8 relative flex flex-col items-center shadow-inner">
          <h3 className="absolute top-4 left-6 text-sm font-bold text-slate-500 uppercase tracking-widest">系统架构图</h3>
          
          <div className="flex items-center w-full justify-center mt-6">
            <div className="text-slate-500 font-bold px-4">INPUT</div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            
            {/* Subsystem A */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-800 border-2 border-emerald-500/50 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Cpu className="text-emerald-400 mb-2" />
                <span className="font-bold text-white">子系统 A</span>
                <span className="text-xs text-emerald-400 font-mono">R = 0.9</span>
              </div>
            </div>

            <div className="w-12 h-0.5 bg-slate-600 relative">
              <ArrowRight size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {/* Parallel Subsystem B & C */}
            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-xs font-bold text-slate-400">并联集群</div>
              
              <div className="flex flex-col gap-6 relative">
                {/* Lines before nodes */}
                <div className="absolute top-1/2 -left-6 w-6 h-0.5 bg-slate-600"></div>
                <div className="absolute top-[20%] -left-6 w-0.5 h-[60%] bg-slate-600"></div>
                <div className="absolute top-[20%] -left-6 w-6 h-0.5 bg-slate-600"></div>
                <div className="absolute bottom-[20%] -left-6 w-6 h-0.5 bg-slate-600"></div>

                {/* Node B */}
                <div className="w-24 h-20 bg-slate-800 border-2 border-blue-500/50 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <HardDrive size={20} className="text-blue-400 mb-1" />
                  <span className="font-bold text-sm text-white">节点 B</span>
                  <span className="text-xs text-blue-400 font-mono">R = 0.8</span>
                </div>
                
                {/* Node C */}
                <div className="w-24 h-20 bg-slate-800 border-2 border-indigo-500/50 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <HardDrive size={20} className="text-indigo-400 mb-1" />
                  <span className="font-bold text-sm text-white">节点 C</span>
                  <span className="text-xs text-indigo-400 font-mono">R = 0.8</span>
                </div>

                {/* Lines after nodes */}
                <div className="absolute top-1/2 -right-6 w-6 h-0.5 bg-slate-600"></div>
                <div className="absolute top-[20%] -right-6 w-0.5 h-[60%] bg-slate-600"></div>
                <div className="absolute top-[20%] right-0 w-6 h-0.5 bg-slate-600"></div>
                <div className="absolute bottom-[20%] right-0 w-6 h-0.5 bg-slate-600"></div>
              </div>
            </div>

            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="text-slate-500 font-bold px-4">OUTPUT</div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col items-center animate-in slide-in-from-bottom">
              <h3 className="text-xl font-bold text-blue-300 mb-2">步骤 1: 计算并联集群的可靠度</h3>
              <p className="text-slate-400 mb-6 text-center text-sm">
                只要节点 B 和节点 C 中<strong>任意一个</strong>存活，集群就能正常工作。<br/>
                公式：\( R = 1 - (1 - R_B) \times (1 - R_C) \)
              </p>
              
              <div className="flex items-center gap-3 font-mono text-xl mb-4">
                <span className="text-slate-300">R<sub>BC</sub> =</span>
                <input 
                  type="text" 
                  value={inputBC} 
                  onChange={e => setInputBC(e.target.value)} 
                  className="w-32 bg-slate-900 border-2 border-blue-500 rounded-lg py-2 px-3 text-white text-center outline-none focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  placeholder="0.xx"
                  autoFocus
                />
              </div>

              {error && <div className="text-rose-400 font-bold mb-4">{error}</div>}

              <button onClick={checkStep1} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                验证计算
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col items-center animate-in slide-in-from-bottom">
              <h3 className="text-xl font-bold text-emerald-300 mb-2">步骤 2: 计算系统总可靠度</h3>
              <p className="text-slate-400 mb-6 text-center text-sm">
                子系统 A 必须存活，<strong>且</strong> 并联集群也必须存活，系统才能输出。<br/>
                串联公式：\( R = R_A \times R_{BC} \)
              </p>
              
              <div className="flex items-center gap-3 font-mono text-xl mb-4">
                <span className="text-slate-300">R<sub>total</sub> =</span>
                <input 
                  type="text" 
                  value={inputTotal} 
                  onChange={e => setInputTotal(e.target.value)} 
                  className="w-32 bg-slate-900 border-2 border-emerald-500 rounded-lg py-2 px-3 text-white text-center outline-none focus:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  placeholder="0.xxx"
                  autoFocus
                />
              </div>

              {error && <div className="text-rose-400 font-bold mb-4">{error}</div>}

              <button onClick={checkStep2} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                提交总可靠度
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-emerald-500/50 flex flex-col items-center text-center animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <Activity size={64} className="text-emerald-400 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">架构评审通过！</h2>
              <div className="text-3xl font-mono font-bold text-emerald-400 bg-slate-950 p-4 rounded-xl border border-emerald-900 mb-6">
                R = 0.864
              </div>
              <p className="text-slate-400 max-w-lg mb-8">
                完美！你利用串并联模型准确评估了系统的可靠性。<br/>
                （注意：即便每个节点的可靠度都有 0.8 或 0.9，整体系统的可靠度也会受到架构的深刻影响。）
              </p>
              <button onClick={reset} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg">
                重置系统
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
