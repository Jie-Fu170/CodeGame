import React, { useState } from 'react';
import { Calculator, ArrowRight, ArrowRightToLine, CheckCircle, Cpu } from 'lucide-react';

export default function FloatOperator() {
  const [step, setStep] = useState(1);
  const [expDiff, setExpDiff] = useState('');
  const [shiftCount, setShiftCount] = useState(0);
  const [sumInput, setSumInput] = useState('');
  const [error, setError] = useState('');

  // X = 0.1101 * 2^3
  // Y = 0.1011 * 2^1
  const X_MANTISSA = '0.110100';
  const Y_MANTISSA_ORIGINAL = '0.101100';
  const TARGET_EXP_DIFF = 2;
  const TARGET_SUM = '0.111111';

  const getCurrentY = () => {
    if (shiftCount === 0) return '0.101100';
    if (shiftCount === 1) return '0.010110';
    if (shiftCount === 2) return '0.001011';
    if (shiftCount > 2) return '0.000101'; // approximate for visualization
    return '0.101100';
  };

  const checkStep1 = () => {
    if (parseInt(expDiff) === TARGET_EXP_DIFF) {
      setStep(2);
      setError('');
    } else {
      setError('阶差计算错误。公式：大阶 - 小阶 (3 - 1)');
    }
  };

  const checkStep2 = () => {
    if (shiftCount === TARGET_EXP_DIFF) {
      setStep(3);
      setError('');
    } else {
      setError(`移位次数不对，阶差为 ${TARGET_EXP_DIFF}，应该右移几次？`);
    }
  };

  const checkStep3 = () => {
    if (sumInput === TARGET_SUM) {
      setStep(4);
      setError('');
    } else {
      setError('二进制加法错误。请对齐小数点进行相加。');
    }
  };

  const reset = () => {
    setStep(1);
    setExpDiff('');
    setShiftCount(0);
    setSumInput('');
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-[#0a0f1c] text-slate-200 border border-slate-700 shadow-2xl flex flex-col font-sans min-h-[650px] relative">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3">
            <Cpu size={32} className="text-cyan-500" /> 浮点数极速对阶工厂
          </h1>
          <p className="text-slate-400 mt-2">任务：将两个 IEEE 754 风格的浮点数进行对阶与加法运算。</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s ? 'bg-cyan-900 border-cyan-500 text-cyan-300' : 'border-slate-700 text-slate-600'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* The Numbers */}
        <div className="flex gap-12 w-full justify-center mb-10">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col items-center min-w-[250px] shadow-lg">
            <span className="text-slate-500 font-bold mb-2 uppercase tracking-widest">操作数 X</span>
            <div className="text-3xl font-mono font-bold text-white">
              <span className="text-emerald-400">{X_MANTISSA}</span> × 2<sup className="text-amber-400">3</sup>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col items-center min-w-[250px] shadow-lg">
            <span className="text-slate-500 font-bold mb-2 uppercase tracking-widest">操作数 Y</span>
            <div className="text-3xl font-mono font-bold text-white">
              <span className="text-rose-400">{getCurrentY()}</span> × 2<sup className="text-amber-400">{1 + shiftCount}</sup>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-inner flex flex-col relative">
          
          {step === 1 && (
            <div className="animate-in slide-in-from-right flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">第一步：求阶差</h3>
              <p className="text-slate-300 mb-6">
                为了将两个浮点数相加，必须先让它们的指数（阶码）相同。<br/>
                规则：<strong>小阶向大阶看齐</strong>。<br/>
                请计算阶差（\(\Delta E = E_X - E_Y\)）。
              </p>
              
              <div className="flex items-center gap-4 text-2xl font-mono font-bold mb-6">
                <span className="text-amber-400">3</span> - <span className="text-amber-400">1</span> = 
                <input 
                  type="number" 
                  value={expDiff} 
                  onChange={e => setExpDiff(e.target.value)} 
                  className="w-20 bg-slate-900 border-2 border-cyan-500 text-center rounded-lg py-2 text-white outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  autoFocus
                />
              </div>

              {error && <div className="text-rose-400 font-bold mb-4">{error}</div>}

              <button onClick={checkStep1} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl transition-all w-full max-w-xs">
                确认阶差
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">第二步：对阶（尾数右移）</h3>
              <p className="text-slate-300 mb-6">
                既然阶差为 2，小阶 Y 的阶码需要增加 2，变为 3。<br/>
                阶码每增加 1，尾数就要<strong>右移 1 位</strong>，以保持数值不变。<br/>
                请点击右移按钮，将 Y 的尾数对齐。
              </p>

              <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full flex items-center justify-between mb-6">
                <div className="font-mono text-xl">
                  Y = <span className="text-rose-400">{getCurrentY()}</span> × 2<sup className="text-amber-400">{1 + shiftCount}</sup>
                </div>
                <button 
                  onClick={() => setShiftCount(s => s + 1)} 
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 font-bold transition-all"
                >
                  尾数右移 <ArrowRightToLine size={18} />
                </button>
              </div>

              {error && <div className="text-rose-400 font-bold mb-4">{error}</div>}

              <button onClick={checkStep2} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl transition-all w-full max-w-xs">
                确认对齐
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">第三步：尾数相加</h3>
              <p className="text-slate-300 mb-6">
                对阶完成！两者的阶码现在都是 3。你可以安全地将它们的尾数相加了。<br/>
                注意：逢二进一。
              </p>

              <div className="font-mono text-2xl bg-slate-900 border border-slate-700 p-8 rounded-xl w-full max-w-sm flex flex-col items-end mb-6">
                <div>&nbsp;&nbsp;<span className="text-emerald-400">{X_MANTISSA}</span></div>
                <div className="border-b-2 border-slate-600 pb-2 mb-2 w-full text-right flex justify-between">
                  <span>+</span>
                  <span className="text-rose-400">{getCurrentY()}</span>
                </div>
                <div className="w-full flex">
                  <input 
                    type="text" 
                    value={sumInput} 
                    onChange={e => setSumInput(e.target.value)} 
                    className="w-full bg-slate-950 border-2 border-cyan-500 text-right rounded-lg py-1 px-2 text-white outline-none font-bold"
                    placeholder="0.xxxxxx"
                    autoFocus
                  />
                </div>
              </div>

              {error && <div className="text-rose-400 font-bold mb-4">{error}</div>}

              <button onClick={checkStep3} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl transition-all w-full max-w-xs">
                提交结果
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <CheckCircle size={64} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <h2 className="text-3xl font-bold text-white mb-2">相加成功！</h2>
              <div className="text-4xl font-mono font-bold text-white bg-slate-900 p-6 rounded-2xl border border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-8">
                <span className="text-cyan-400">0.111111</span> × 2<sup className="text-amber-400">3</sup>
              </div>
              <p className="text-slate-400 max-w-lg mb-8">
                由于尾数最高位已经是 1（形式为 0.1...），所以不需要额外进行"规格化"操作。<br/>
                浮点数加法 <strong>求阶差、对阶、尾数相加、规格化</strong> 四步法全部完成。
              </p>
              <button onClick={reset} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all">
                初始化并重来
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
