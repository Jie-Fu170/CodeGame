import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, RotateCcw, CheckCircle2, Info, Trophy, FileText, ArrowRight } from 'lucide-react';

export default function DigitalSignature() {
  const [step, setStep] = useState<number>(0);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const STEPS = [
    {
      title: '任务 1：发送方 Alice 进行数字签名 (防否认 / 验证身份)',
      question: 'Alice 需要对计算出的报文 Hash 摘要进行加密签名，应该使用哪一把密钥？',
      opts: [
        { key: 'ALICE_PRIV', label: 'Alice 的私钥 (Alice Private Key)' },
        { key: 'ALICE_PUB', label: 'Alice 的公钥 (Alice Public Key)' },
        { key: 'BOB_PUB', label: 'Bob 的公钥 (Bob Public Key)' },
      ],
      correctKey: 'ALICE_PRIV',
      explain: '数字签名必须使用【发送者的私钥】加密 Hash 摘要！因为只有 Alice 本人拥有该私钥，才能确保不可否认性！'
    },
    {
      title: '任务 2：接收方 Bob 进行签名验证 (验签)',
      question: 'Bob 收到数据包与签名后，需要解密签名恢复 Hash 值，应该使用哪一把密钥？',
      opts: [
        { key: 'ALICE_PUB', label: 'Alice 的公钥 (Alice Public Key)' },
        { key: 'BOB_PRIV', label: 'Bob 的私钥 (Bob Private Key)' },
        { key: 'BOB_PUB', label: 'Bob 的公钥 (Bob Public Key)' },
      ],
      correctKey: 'ALICE_PUB',
      explain: '验签必须使用【发送者的公钥】解密签名！若能用 Alice 的公钥成功解开，证明签名必定来自 Alice 本人！'
    }
  ];

  const currentStep = STEPS[step];

  const handleSelectKey = (keyName: string) => {
    setSelectedKey(keyName);
    if (keyName === currentStep.correctKey) {
      setErrorMsg(null);
      setSuccessMsg(`🎯 正确！${currentStep.explain}`);
      if (step < STEPS.length - 1) {
        setTimeout(() => {
          setStep(s => s + 1);
          setSelectedKey(null);
          setSuccessMsg(null);
        }, 1600);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`密钥匹配错误！${currentStep.explain}`);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelectedKey(null);
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
        .dsig-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .dsig-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="dsig-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Lock className="text-indigo-400" size={22} />
            数字签名与 PKI 信任链
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            公钥/私钥对称与非对称机制、数字签名 (发送方私钥) 与验签 (发送方公钥) 实战
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {currentStep.title}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 mb-4 leading-relaxed">
            ❓ {currentStep.question}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {currentStep.opts.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelectKey(opt.key)}
                className={`p-4 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedKey === opt.key
                    ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200 shadow-lg'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                <Key size={16} className="text-indigo-400 mb-2" />
                <div>{opt.label}</div>
              </button>
            ))}
          </div>

          {/* Toast */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && !errorMsg && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-indigo-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-indigo-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="dsig-display text-2xl font-bold text-indigo-400 mb-2">🎉 恭喜通关：数字签名安全大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 <span className="text-indigo-300 font-bold">私钥签名（发送方）</span> 与 <span className="text-cyan-300 font-bold">公钥验签（发送方）</span> 的完美非对称安全准则！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
