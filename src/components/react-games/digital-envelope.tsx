import React, { useState } from 'react';
import { Key, Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface StepSelection {
  dataEncryptKey: string;
  keyEncryptKey: string;
  envelopeDecryptKey: string;
  dataDecryptKey: string;
}

export default function DigitalEnvelope() {
  const { addScore } = useGameStore();

  const [steps, setSteps] = useState<StepSelection>({
    dataEncryptKey: '',
    keyEncryptKey: '',
    envelopeDecryptKey: '',
    dataDecryptKey: ''
  });

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const keyOptions = [
    '随机生成的对称密钥 K',
    '发送方 Alice 的公钥 PA',
    '发送方 Alice 的私钥 SA',
    '接收方 Bob 的公钥 PB',
    '接收方 Bob 的私钥 SB'
  ];

  const checkEnvelope = () => {
    // Correct Digital Envelope Workflow:
    // 1. Data Encrypt: 随机生成的对称密钥 K
    // 2. Key (Envelope) Encrypt: 接收方 Bob 的公钥 PB
    // 3. Envelope Decrypt: 接收方 Bob 的私钥 SB
    // 4. Data Decrypt: 解开得到的对称密钥 K
    const isStep1 = steps.dataEncryptKey === '随机生成的对称密钥 K';
    const isStep2 = steps.keyEncryptKey === '接收方 Bob 的公钥 PB';
    const isStep3 = steps.envelopeDecryptKey === '接收方 Bob 的私钥 SB';
    const isStep4 = steps.dataDecryptKey === '随机生成的对称密钥 K';

    if (isStep1 && isStep2 && isStep3 && isStep4) {
      setFeedback({
        msg: '数字信封协议装配完全正确！既具备对称加密的高速度，又具备公钥体系的密钥分发安全性！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      let err = '数字信封流程错误：';
      if (!isStep1) err += '1. 明文必须用对称密钥 K 加密；';
      if (!isStep2) err += '2. 封入信封需用接收方 Bob 的公钥 PB 加密对称密钥 K；';
      if (!isStep3) err += '3. 拆开信封需用接收方 Bob 的私钥 SB；';
      if (!isStep4) err += '4. 还原明文需用解开出的对称密钥 K；';
      setFeedback({ msg: err, isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/40">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-300">数字信封与密码算法树</h2>
            <p className="text-xs text-slate-400">信息安全 · 数字信封 (Digital Envelope) 密钥分配与混合加解密流程</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6">
        数字信封旨在解决“海量数据公钥加密太慢”与“对称密钥如何安全传输”的矛盾。请为发送方 Alice 与接收方 Bob 匹配正确的密钥选择：
      </div>

      {/* Interactive Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Sender Side */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-4">
          <div className="text-sm font-bold text-indigo-300 font-mono flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" /> 发送方 (Alice) 加密动作
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">步骤 1: 用什么密钥加密大文件明文？</label>
            <select
              value={steps.dataEncryptKey}
              onChange={(e) => setSteps({ ...steps, dataEncryptKey: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-indigo-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择密钥 --</option>
              {keyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">步骤 2: 用什么密钥封装数字信封 (加密对称密钥 K)？</label>
            <select
              value={steps.keyEncryptKey}
              onChange={(e) => setSteps({ ...steps, keyEncryptKey: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-indigo-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择密钥 --</option>
              {keyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiver Side */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-4">
          <div className="text-sm font-bold text-emerald-300 font-mono flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> 接收方 (Bob) 解密动作
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">步骤 3: 用什么密钥拆开数字信封 (解密得到 K)？</label>
            <select
              value={steps.envelopeDecryptKey}
              onChange={(e) => setSteps({ ...steps, envelopeDecryptKey: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-emerald-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择密钥 --</option>
              {keyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-mono block mb-1">步骤 4: 拆出 K 后，用什么密钥解密大文件密文？</label>
            <select
              value={steps.dataDecryptKey}
              onChange={(e) => setSteps({ ...steps, dataDecryptKey: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-emerald-300 font-mono focus:outline-none"
            >
              <option value="">-- 选择密钥 --</option>
              {keyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={checkEnvelope}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <ArrowRight className="w-5 h-5" /> 校验数字信封通信流程
      </button>

      {feedback && (
        <div
          className={`p-4 rounded-xl border ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-sm">
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
