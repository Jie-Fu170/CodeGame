import React, { useState } from 'react';
import { ShieldCheck, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

export default function CRCChecksum() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Calculation, 2: Transmission Test, 3: Success
  const [dataStream] = useState('101001'); // 6-bit data
  const [generatorPoly] = useState('1011'); // G(X) = X^3 + X + 1, r = 3

  // CRC Inputs (3-bit remainder)
  const [crcInput, setCrcInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Transmission Phase
  const [corruptedBitIndex, setCorruptedBitIndex] = useState<number | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ isCorrect: boolean; remainder: string } | null>(null);

  // Correct CRC calculation for 101001 + 000 with divisor 1011
  // 101001000 / 1011 = 100111 remainder 011
  const correctCRC = '011';

  // Modulo-2 division function
  const modulo2Div = (dividend: string, divisor: string) => {
    let pick = divisor.length;
    let tmp = dividend.slice(0, pick).split('');
    const n = dividend.length;

    while (pick < n) {
      if (tmp[0] === '1') {
        // XOR with divisor
        for (let i = 0; i < divisor.length; i++) {
          tmp[i] = tmp[i] === divisor[i] ? '0' : '1';
        }
      } else {
        // XOR with zeros
        for (let i = 0; i < divisor.length; i++) {
          tmp[i] = tmp[i] === '0' ? '0' : '1';
        }
      }
      // Remove leading zero and append next bit
      tmp.shift();
      tmp.push(dividend[pick]);
      pick++;
    }

    // Final XOR step
    if (tmp[0] === '1') {
      for (let i = 0; i < divisor.length; i++) {
        tmp[i] = tmp[i] === divisor[i] ? '0' : '1';
      }
    }
    tmp.shift();
    return tmp.join('');
  };

  const handleVerifyCRC = () => {
    if (crcInput.trim() === correctCRC) {
      setErrorMsg('');
      setPhase(2);
    } else {
      setErrorMsg(`计算错误！被除数补 0 后为 101001000，除数为 1011，请仔细计算模 2 除法余数！`);
    }
  };

  const handleSimulateTransmission = () => {
    const fullFrame = dataStream + correctCRC; // 101001011
    let transmitted = fullFrame.split('');

    if (corruptedBitIndex !== null) {
      transmitted[corruptedBitIndex] = transmitted[corruptedBitIndex] === '1' ? '0' : '1';
    }

    const frameStr = transmitted.join('');
    const remainder = modulo2Div(frameStr, generatorPoly);
    const isCorrect = remainder === '000';

    setVerifyResult({ isCorrect, remainder });
    if (isCorrect && corruptedBitIndex === null) {
      setPhase(3);
    }
  };

  const resetGame = () => {
    setPhase(1);
    setCrcInput('');
    setErrorMsg('');
    setCorruptedBitIndex(null);
    setVerifyResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <ShieldCheck size={28} /> CRC 循环冗余校验码 (Cyclic Redundancy Check)
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：多项式展开 $G(X) = X^3+X+1 \Rightarrow 1011$、模 2 异或除法与余数校验
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className={`p-2.5 rounded-lg border ${phase === 1 ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          1. 模 2 除法求 CRC 码
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 数据帧传输与检错验证
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          3. 通关与考点总结
        </div>
      </div>

      {/* Phase 1: Modulo-2 Calculation */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu size={18} className="text-cyan-400" /> 步骤 1：构造被除数与除数
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
                <span className="text-slate-400">原始数据 stream ($M$):</span>
                <div className="text-xl font-bold text-emerald-400 tracking-wider mt-1">{dataStream} (6 位)</div>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
                <span className="text-slate-400">生成多项式 $G(X) = X^3 + X + 1$:</span>
                <div className="text-xl font-bold text-amber-400 tracking-wider mt-1">{generatorPoly} (4 位, 阶数 $r=3$)</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-lg text-xs text-slate-300 space-y-2 border border-slate-700/60">
              <p className="text-cyan-300 font-semibold">💡 软考解题解法要领：</p>
              <p>1. 生成多项式最高次幂为 3 ($r=3$)，故需在原始数据 $M$ 尾部补 <strong>3 个 0</strong> 得到：<span className="text-emerald-300 font-bold">101001000</span>。</p>
              <p>2. 用 <span className="text-emerald-300 font-bold">101001000</span> 除以除数 <span className="text-amber-300 font-bold">1011</span>，按<strong>模 2 减法（不进位/不借位异或 XOR）</strong>求 3 位余数。</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">提交计算所得的 3 位 CRC 校验码 (余数)：</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                maxLength={3}
                value={crcInput}
                onChange={(e) => setCrcInput(e.target.value.replace(/[^01]/g, ''))}
                placeholder="例如: 000"
                className="bg-slate-950 border border-slate-600 rounded-lg px-4 py-2 text-xl font-bold text-cyan-300 tracking-widest focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleVerifyCRC}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Play size={16} /> 验证余数
              </button>
            </div>
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {errorMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 2: Frame Transmission */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-400" /> 步骤 2：数据帧传输与检错机理测试
            </h2>
            <p className="text-xs text-slate-300">
              完整的发出的数据帧 = 原始数据 + CRC校验码 = <span className="text-emerald-400 font-bold">{dataStream}</span> + <span className="text-cyan-400 font-bold">{correctCRC}</span> = <span className="text-yellow-300 font-bold">{dataStream + correctCRC}</span>
            </p>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 space-y-3">
              <span className="text-xs text-slate-400">点击下方任意比特位模拟网络信道噪声（篡改 0/1 位）：</span>
              <div className="flex gap-2 justify-center my-2">
                {(dataStream + correctCRC).split('').map((bit, idx) => {
                  const isCorrupted = corruptedBitIndex === idx;
                  const currentBit = isCorrupted ? (bit === '1' ? '0' : '1') : bit;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCorruptedBitIndex(corruptedBitIndex === idx ? null : idx)}
                      className={`w-10 h-12 rounded-lg font-bold text-lg border transition-all flex flex-col items-center justify-center ${
                        isCorrupted
                          ? 'bg-red-900/80 border-red-500 text-red-200 animate-pulse'
                          : idx >= 6
                          ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300'
                          : 'bg-slate-800 border-slate-600 text-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{currentBit}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{idx < 6 ? `D${idx}` : `C${idx - 6}`}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-slate-400">
                {corruptedBitIndex !== null ? (
                  <span className="text-red-400">⚠️ 已在第 {corruptedBitIndex} 位植入噪声干扰！</span>
                ) : (
                  <span className="text-emerald-400">✅ 当前信道正常，无噪声干扰。</span>
                )}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSimulateTransmission}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Play size={16} /> 接收端执行 CRC 校验
              </button>
            </div>

            {verifyResult && (
              <div className={`p-4 rounded-xl border ${verifyResult.isCorrect ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200' : 'bg-red-950/70 border-red-700 text-red-200'}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {verifyResult.isCorrect ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  校验余数: R = {verifyResult.remainder}
                </div>
                <p className="text-xs mt-1">
                  {verifyResult.isCorrect
                    ? '余数为 000！接收端判定数据传输无误，解包成功！请保持无噪声状态点击校验直接通关。'
                    : '余数不等于 000！接收端成功检测到数据传输发生错误，丢弃坏包！'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 3: Success & Summary */}
      {phase === 3 && (
        <div className="bg-emerald-950/40 p-6 rounded-xl border border-emerald-700 space-y-4 text-center">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-300">通关！彻底掌握 CRC 校验码！</h2>
          
          <div className="bg-slate-900/80 p-4 rounded-lg text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-cyan-300 text-sm">📘 软考核心真题密押卡片：</h4>
            <p>1. <strong>生成多项式与阶数</strong>：$G(X) = X^k + ... + 1$ 的最高次幂 $k$ 为余数位数，尾部补 $k$ 个 0。</p>
            <p>2. <strong>模 2 运算规则</strong>：加减法等价于异或 XOR（不进位也不借位，同 0 异 1）。</p>
            <p>3. <strong>检错与纠错能力</strong>：CRC 具备强大的<strong>检错能力</strong>（余数为 0 接收，非 0 丢弃重传），但无自动纠错能力（海明码具备单比特纠错能力）。</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
          >
            再次挑战
          </button>
        </div>
      )}
    </div>
  );
}
