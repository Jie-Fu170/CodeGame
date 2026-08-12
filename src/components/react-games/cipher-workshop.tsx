import React, { useState, useEffect } from 'react';
import { KeyRound, RotateCcw, Info, Trophy, Lock, Unlock, Fingerprint, PenTool, Layers } from 'lucide-react';

const ICONS = { sym: Lock, asym: Unlock, hash: Fingerprint, sig: PenTool, hybrid: Layers };

const SCENARIOS = [
  {
    prompt: '给 10GB 的备份文件加密，要求速度快',
    options: [
      { key: 'sym', label: '对称加密（AES）', ok: true },
      { key: 'asym', label: '非对称加密（RSA）', ok: false },
      { key: 'hash', label: '哈希摘要（SHA-256）', ok: false },
      { key: 'sig', label: '数字签名', ok: false },
    ],
    why: '对称加密对大数据量运算快得多；非对称加密处理这么大的数据会慢到不可用，哈希不可逆没法还原原文，数字签名根本不提供保密性。',
  },
  {
    prompt: '两个从未谋面的人第一次通信，需要协商出一把之后都能用的共享密钥',
    options: [
      { key: 'sym', label: '直接用对称加密', ok: false },
      { key: 'asym', label: '非对称加密（用来交换密钥）', ok: true },
      { key: 'hash', label: '哈希摘要', ok: false },
      { key: 'sig', label: '数字签名', ok: false },
    ],
    why: '对称加密最大的痛点就是"怎么把密钥安全交给对方"——这恰恰是非对称加密要解决的问题：公钥可以公开传播，私钥永远不用离开本地。',
  },
  {
    prompt: '需要证明一份电子合同确实是张三签的，张三事后不能抵赖',
    options: [
      { key: 'sym', label: '对称加密', ok: false },
      { key: 'hash', label: '哈希摘要', ok: false },
      { key: 'sig', label: '数字签名（私钥签名，公钥验证）', ok: true },
      { key: 'asym', label: '仅用非对称加密内容', ok: false },
    ],
    why: '不可抵赖性依赖"只有张三拥有的私钥才能生成这个签名"。对称加密的密钥是双方共享的，谁都没法证明是对方签的而不是自己伪造的。',
  },
  {
    prompt: '需要快速检查一个下载文件有没有被篡改，不关心内容是否保密',
    options: [
      { key: 'sym', label: '对称加密', ok: false },
      { key: 'asym', label: '非对称加密', ok: false },
      { key: 'hash', label: '哈希摘要（算指纹再比对）', ok: true },
      { key: 'sig', label: '数字签名', ok: false },
    ],
    why: '这里根本不需要"加密"——加密解决的是保密性，这里要的是完整性校验。哈希函数正是干这个的，而且比加解密快得多。',
  },
  {
    prompt: 'HTTPS 访问一个网站：既要保密，又要处理大量数据还不能太慢',
    options: [
      { key: 'sym', label: '只用对称加密', ok: false },
      { key: 'asym', label: '只用非对称加密', ok: false },
      { key: 'hybrid', label: '混合加密：先非对称交换密钥，再对称传数据', ok: true },
      { key: 'hash', label: '只用哈希摘要', ok: false },
    ],
    why: '这就是 HTTPS 的真实做法：握手阶段用非对称加密安全地协商出一把会话密钥，之后的大量数据全部改用对称加密处理，兼顾安全和速度。',
  },
];

export default function CipherWorkshop() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wrongKey, setWrongKey] = useState(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');

  useEffect(() => {
    if (!wrongKey) return;
    const t = setTimeout(() => setWrongKey(null), 500);
    return () => clearTimeout(t);
  }, [wrongKey]);

  const scenario = SCENARIOS[idx];

  function choose(opt) {
    if (picked) return;
    if (!opt.ok) { setWrongKey(opt.key); return; }
    setPicked(opt.key);
    setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 >= SCENARIOS.length) { setStatus('won'); return; }
    setIdx(i => i + 1);
    setPicked(null);
  }

  function reset() { setIdx(0); setPicked(null); setWrongKey(null); setScore(0); setStatus('playing'); }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .cw-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .cw-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .cw-focus:focus-visible { outline: 2px solid #fbbf24; outline-offset: 2px; }
        @keyframes cwShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .cw-shake { animation: cwShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <h1 className="cw-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><KeyRound size={20} className="text-amber-300" />密钥工坊</h1>
        {status === 'playing' && <span className="cw-mono text-sm text-slate-400">第 {idx + 1}/{SCENARIOS.length} 单</span>}
      </div>

      {status === 'playing' && (
        <>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 mb-3 text-sm text-slate-100">{scenario.prompt}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {scenario.options.map(opt => {
              const Icon = ICONS[opt.key];
              const isPicked = picked === opt.key;
              const isWrong = wrongKey === opt.key;
              return (
                <button key={opt.key} onClick={() => choose(opt)} disabled={!!picked}
                  className={`cw-focus text-left p-3 rounded-lg border flex items-start gap-2 transition-colors ${isWrong ? 'cw-shake border-rose-500 bg-rose-950/30' : isPicked ? 'border-emerald-400 bg-emerald-950/20' : picked ? 'border-slate-800 bg-slate-900/40 opacity-50' : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'}`}>
                  <Icon size={16} className="mt-0.5 shrink-0 text-slate-300" />
                  <span className="text-sm text-slate-100">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {picked ? (
            <div className="rounded-lg border border-emerald-800/60 bg-emerald-950/20 p-3">
              <div className="text-xs text-emerald-300 mb-1">选对了</div>
              <div className="text-sm text-slate-200">{scenario.why}</div>
              <button onClick={next} className="cw-focus w-full mt-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors">
                {idx + 1 >= SCENARIOS.length ? '查看结算' : '下一单'}
              </button>
            </div>
          ) : (
            <div className="text-xs flex items-start gap-1.5 min-h-8">
              <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
              <span className="text-slate-500">先想清楚这单要的是保密、还是身份认证、还是完整性校验——三者对应的工具完全不同。</span>
            </div>
          )}
        </>
      )}

      {status === 'won' && (
        <div className="text-center py-6">
          <Trophy size={32} className="mx-auto text-amber-300 mb-2" />
          <div className="cw-display text-2xl font-bold text-emerald-400 mb-1">工坊打烊！</div>
          <div className="text-sm text-slate-400 mb-4">五单都接对了——保密用对称/非对称，身份认证用签名，完整性用哈希，实际系统里往往是混合着用</div>
          <button onClick={reset} className="cw-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再开一天</button>
        </div>
      )}
    </div>
  );
}
