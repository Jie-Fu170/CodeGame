import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function HammingAgent() {
  const [phase, setPhase] = useState(1); // 1: Encode, 2: Correct, 3: Success
  const [dataBits] = useState([0, 1, 1, 0, 1, 0, 0, 1]); // Original 8 bits
  
  // Encoding phase state
  const [parityInputs, setParityInputs] = useState({ P1: null, P2: null, P4: null, P8: null });
  const [encodeError, setEncodeError] = useState('');

  // Decoding phase state
  const [errorPosition, setErrorPosition] = useState(0); // 1-12
  const [receivedBits, setReceivedBits] = useState<number[]>([]);
  const [syndromeInputs, setSyndromeInputs] = useState({ G1: null, G2: null, G4: null, G8: null });
  const [correctError, setCorrectError] = useState('');

  // Helper to calculate correct parity (Even parity)
  const calculateParities = (data: number[]) => {
    // Bits at: 3(D0), 5(D1), 6(D2), 7(D3), 9(D4), 10(D5), 11(D6), 12(D7)
    const b3 = data[0], b5 = data[1], b6 = data[2], b7 = data[3], b9 = data[4], b10 = data[5], b11 = data[6], b12 = data[7];
    const p1 = b3 ^ b5 ^ b7 ^ b9 ^ b11;
    const p2 = b3 ^ b6 ^ b7 ^ b10 ^ b11;
    const p4 = b5 ^ b6 ^ b7 ^ b12;
    const p8 = b9 ^ b10 ^ b11 ^ b12;
    return { p1, p2, p4, p8 };
  };

  const verifyEncoding = () => {
    const correct = calculateParities(dataBits);
    if (
      parityInputs.P1 === correct.p1 &&
      parityInputs.P2 === correct.p2 &&
      parityInputs.P4 === correct.p4 &&
      parityInputs.P8 === correct.p8
    ) {
      setEncodeError('');
      const fullBits = [
        correct.p1, correct.p2, dataBits[0], correct.p4, 
        dataBits[1], dataBits[2], dataBits[3], correct.p8,
        dataBits[4], dataBits[5], dataBits[6], dataBits[7]
      ];
      const errPos = Math.floor(Math.random() * 12) + 1;
      const corrupted = [...fullBits];
      corrupted[errPos - 1] ^= 1;
      setReceivedBits(corrupted);
      setErrorPosition(errPos);
      setPhase(2);
    } else {
      setEncodeError('校验位计算有误，请重新检查异或逻辑！');
    }
  };

  const verifyCorrection = () => {
    const G1 = syndromeInputs.G1, G2 = syndromeInputs.G2, G4 = syndromeInputs.G4, G8 = syndromeInputs.G8;
    if (G1 === null || G2 === null || G4 === null || G8 === null) {
      setCorrectError('请先计算完整的指错字 G8 G4 G2 G1');
      return;
    }
    const errPosCalc = (G8 << 3) | (G4 << 2) | (G2 << 1) | G1;
    if (errPosCalc === errorPosition) {
      setCorrectError('');
      setPhase(3);
    } else {
      setCorrectError(`指错字解析出的位置 (${errPosCalc}) 不对，特工！`);
    }
  };

  const toggleParity = (p: string) => {
    setParityInputs(prev => ({ ...prev, [p]: prev[p as keyof typeof prev] === 1 ? 0 : 1 }));
  };

  const toggleSyndrome = (g: string) => {
    setSyndromeInputs(prev => ({ ...prev, [g]: prev[g as keyof typeof prev] === 1 ? 0 : 1 }));
  };

  const reset = () => {
    setPhase(1);
    setParityInputs({ P1: null, P2: null, P4: null, P8: null });
    setSyndromeInputs({ G1: null, G2: null, G4: null, G8: null });
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <ShieldAlert size={28} /> 海明码特工 (Hamming Agent)
          </h1>
          <p className="text-slate-400 mt-1 text-sm">任务：植入 parity 校验位，并利用指错字实施纠错。</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">当前阶段</div>
          <div className="text-lg font-bold text-cyan-400">
            {phase === 1 ? 'Phase 1: 植入校验位' : phase === 2 ? 'Phase 2: 截获与纠错' : 'Mission Accomplished'}
          </div>
        </div>
      </div>

      {phase === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-600">
            <h3 className="text-emerald-300 font-semibold mb-3 flex items-center gap-2"><Zap size={18}/> 原始数据 (n=8)</h3>
            <div className="flex justify-center gap-2">
              {dataBits.map((b, i) => (
                <div key={i} className="w-10 h-10 flex items-center justify-center bg-emerald-900 text-emerald-300 rounded font-bold border border-emerald-700">
                  {b}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-cyan-300 font-semibold mb-3">计算校验位 (k=4) - 偶校验</h3>
            <p className="text-xs text-slate-400 mb-4">
              P1 负责位: 1, 3, 5, 7, 9, 11<br/>
              P2 负责位: 2, 3, 6, 7, 10, 11<br/>
              P4 负责位: 4, 5, 6, 7, 12<br/>
              P8 负责位: 8, 9, 10, 11, 12
            </p>
            <div className="flex gap-4 mb-4">
              {['P1', 'P2', 'P4', 'P8'].map(p => (
                <div key={p} className="flex-1 bg-slate-800 p-3 rounded-xl border border-slate-600 text-center flex flex-col items-center">
                  <div className="text-slate-400 text-sm mb-2">{p}</div>
                  <button 
                    onClick={() => toggleParity(p)}
                    className={`w-12 h-12 rounded-lg text-xl font-bold transition-colors ${parityInputs[p as keyof typeof parityInputs] === null ? 'bg-slate-700 text-slate-500' : 'bg-cyan-600 text-white border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'}`}
                  >
                    {parityInputs[p as keyof typeof parityInputs] !== null ? parityInputs[p as keyof typeof parityInputs] : '?'}
                  </button>
                </div>
              ))}
            </div>
            
            {encodeError && <div className="text-rose-400 text-sm mb-4 text-center">{encodeError}</div>}
            
            <button 
              onClick={verifyEncoding}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              提交校验位并启动传输
            </button>
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-rose-950 p-4 rounded-xl border border-rose-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse"></div>
            <h3 className="text-rose-400 font-semibold mb-3 flex items-center gap-2"><Activity size={18}/> 警告：截获到被干扰的数据流！</h3>
            <p className="text-sm text-slate-300 mb-4">有一位比特在传输中发生了翻转。特工，请计算指错字 (Syndrome) G8 G4 G2 G1 以锁定错误位置。</p>
            
            <div className="flex justify-between gap-1 mb-2 text-xs text-slate-500 text-center">
              {Array.from({length:12}).map((_, i) => <div key={i} className="flex-1">#{i+1}</div>)}
            </div>
            <div className="flex justify-between gap-1 text-center">
              {receivedBits.map((b, i) => {
                const isP = i===0 || i===1 || i===3 || i===7;
                return (
                  <div key={i} className={`flex-1 aspect-square flex items-center justify-center rounded font-bold ${isP ? 'bg-cyan-900 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-300 border border-slate-600'}`}>
                    {b}
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-amber-300 font-semibold mb-3">计算指错字 G8 G4 G2 G1</h3>
            <div className="flex gap-4 justify-center mb-6">
              {['G8', 'G4', 'G2', 'G1'].map(g => (
                <div key={g} className="flex flex-col items-center">
                  <div className="text-slate-400 text-sm mb-2">{g}</div>
                  <button 
                    onClick={() => toggleSyndrome(g)}
                    className={`w-14 h-14 rounded-lg text-2xl font-bold transition-colors ${syndromeInputs[g as keyof typeof syndromeInputs] === null ? 'bg-slate-700 text-slate-500' : 'bg-amber-600 text-white border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'}`}
                  >
                    {syndromeInputs[g as keyof typeof syndromeInputs] !== null ? syndromeInputs[g as keyof typeof syndromeInputs] : '?'}
                  </button>
                </div>
              ))}
            </div>

            {correctError && <div className="text-rose-400 text-sm mb-4 text-center">{correctError}</div>}
            
            <button 
              onClick={verifyCorrection}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              锁定错误并执行翻转！
            </button>
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="text-center py-12 animate-fade-in">
          <ShieldCheck size={80} className="mx-auto text-emerald-400 mb-6 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
          <h2 className="text-3xl font-bold text-white mb-4">数据修正完毕！</h2>
          <p className="text-slate-400 mb-8">错误位 #{errorPosition} 已被精准锁定。海明码机制验证成功。</p>
          <button onClick={reset} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors">
            重新执行任务
          </button>
        </div>
      )}
    </div>
  );
}
