import React, { useState, useEffect } from 'react';
import { Globe2, RotateCcw, Info, Trophy } from 'lucide-react';

const BASE = '192.168.1';
const BLOCK_SIZE = 256;

const TRIBES = [
  { id: '研发部', hosts: 60, options: [
    { prefix: 25, verdict: 'waste' },
    { prefix: 26, verdict: 'ok' },
    { prefix: 27, verdict: 'small' },
  ] },
  { id: '市场部', hosts: 25, options: [
    { prefix: 26, verdict: 'waste' },
    { prefix: 27, verdict: 'ok' },
    { prefix: 28, verdict: 'small' },
  ] },
  { id: '人事部', hosts: 10, options: [
    { prefix: 27, verdict: 'waste' },
    { prefix: 28, verdict: 'ok' },
    { prefix: 29, verdict: 'small' },
  ] },
  { id: '前台', hosts: 4, options: [
    { prefix: 28, verdict: 'waste' },
    { prefix: 29, verdict: 'ok' },
    { prefix: 30, verdict: 'small' },
  ] },
];

const COLORS = ['bg-cyan-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

function usableHosts(prefix) { return Math.pow(2, 32 - prefix) - 2; }
function maskDotted(prefix) { return `255.255.255.${256 - Math.pow(2, 32 - prefix)}`; }
function ipAt(offset) { return `${BASE}.${offset}`; }

export default function SubnetTerritory() {
  const [idx, setIdx] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [allocations, setAllocations] = useState([]);
  const [message, setMessage] = useState(null);
  const [shakeOpt, setShakeOpt] = useState(null);

  useEffect(() => {
    if (!shakeOpt) return;
    const t = setTimeout(() => setShakeOpt(null), 500);
    return () => clearTimeout(t);
  }, [shakeOpt]);

  const tribe = TRIBES[idx];
  const won = idx >= TRIBES.length;

  function pick(prefix, verdict) {
    if (verdict !== 'ok') {
      setMessage(verdict === 'small' ? `/${prefix} 只能容纳 ${usableHosts(prefix)} 台主机，不够 ${tribe.hosts} 台的需求` : `/${prefix} 能装下但浪费——用更紧凑的掩码，把空间留给后面的部落`);
      setShakeOpt(prefix);
      return;
    }
    const size = Math.pow(2, 32 - prefix);
    const start = Math.ceil(cursor / size) * size;
    const end = start + size - 1;
    setAllocations(a => [...a, { id: tribe.id, prefix, start, end, color: COLORS[idx % COLORS.length] }]);
    setCursor(end + 1);
    setMessage(null);
    setIdx(i => i + 1);
  }

  function reset() { setIdx(0); setCursor(0); setAllocations([]); setMessage(null); setShakeOpt(null); }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .st-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .st-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .st-focus:focus-visible { outline: 2px solid #34d399; outline-offset: 2px; }
        @keyframes stShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .st-shake { animation: stShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="st-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Globe2 size={20} className="text-cyan-400" />领地划分</h1>
          <p className="text-xs text-slate-400 mt-0.5">在 {BASE}.0/24 里给每个部落划出刚好够用的子网</p>
        </div>
        <div className="st-mono text-sm text-slate-300">{Math.min(idx, TRIBES.length)}/{TRIBES.length}</div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 h-10 flex overflow-hidden mb-1 relative">
        {allocations.map(a => (
          <div key={a.id} className={`${a.color} h-full flex items-center justify-center relative`} style={{ width: `${((a.end - a.start + 1) / BLOCK_SIZE) * 100}%` }}>
            <span className="st-mono text-xs text-slate-950 font-bold truncate px-1">{a.id}</span>
          </div>
        ))}
        <div className="h-full bg-slate-800/60 flex-1 flex items-center justify-center">
          <span className="text-xs text-slate-500">空闲</span>
        </div>
      </div>
      <div className="st-mono text-xs text-slate-500 mb-4">{ipAt(0)} — {ipAt(255)}（共 {BLOCK_SIZE} 个地址）</div>

      {!won && (
        <>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 mb-3">
            <div className="text-sm text-slate-100">{tribe.id} 需要 <span className="st-mono text-cyan-300">{tribe.hosts}</span> 台主机</div>
            <div className="text-xs text-slate-500 mt-1">当前起点：{ipAt(cursor)}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            {tribe.options.map(opt => (
              <button key={opt.prefix} onClick={() => pick(opt.prefix, opt.verdict)}
                className={`st-focus text-left p-3 rounded-lg border transition-colors ${shakeOpt === opt.prefix ? 'st-shake border-rose-500 bg-rose-950/30' : 'border-slate-700 bg-slate-900/70 hover:border-slate-500'}`}>
                <div className="st-mono text-sm text-slate-100 font-bold">/{opt.prefix}</div>
                <div className="st-mono text-xs text-slate-400">{maskDotted(opt.prefix)}</div>
                <div className="text-xs text-slate-500 mt-1">可用主机 {usableHosts(opt.prefix)} 台</div>
              </button>
            ))}
          </div>

          <div className="text-xs flex items-start gap-1.5 min-h-8">
            <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
            <span className={message ? 'text-amber-300' : 'text-slate-500'}>{message || '选能装下需求、又不浪费的那一档——可用主机数 = 2^主机位 − 2。'}</span>
          </div>
        </>
      )}

      {won && (
        <div className="text-center py-6">
          <Trophy size={32} className="mx-auto text-amber-300 mb-2" />
          <div className="st-display text-2xl font-bold text-emerald-400 mb-1">领地划分完成！</div>
          <div className="text-sm text-slate-400 mb-1">4 个部落共占用 {cursor} 个地址，剩下 {BLOCK_SIZE - cursor} 个留给未来扩张</div>
          <div className="text-xs text-slate-500 mb-4">先分大的、后分小的，是让子网边界天然对齐、不留缝隙的诀窍</div>
          <button onClick={reset} className="st-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再来一轮</button>
        </div>
      )}

      {!won && (
        <button onClick={reset} className="st-focus w-full mt-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
          <RotateCcw size={14} /> 重新开始
        </button>
      )}
    </div>
  );
}
