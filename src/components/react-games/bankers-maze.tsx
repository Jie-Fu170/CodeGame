import React, { useState, useEffect } from 'react';
import { ShieldAlert, RotateCcw, Info, Trophy, CheckCircle2 } from 'lucide-react';

const RES = ['R1', 'R2', 'R3'];
const TOTAL = { R1: 10, R2: 6, R3: 7 };
const PROCESSES = [
  { id: 'P0', max: { R1: 7, R2: 5, R3: 3 }, alloc: { R1: 0, R2: 1, R3: 0 } },
  { id: 'P1', max: { R1: 4, R2: 2, R3: 2 }, alloc: { R1: 2, R2: 1, R3: 0 } },
  { id: 'P2', max: { R1: 9, R2: 1, R3: 3 }, alloc: { R1: 3, R2: 0, R3: 2 } },
  { id: 'P3', max: { R1: 3, R2: 2, R3: 2 }, alloc: { R1: 2, R2: 1, R3: 1 } },
  { id: 'P4', max: { R1: 5, R2: 3, R3: 3 }, alloc: { R1: 0, R2: 0, R3: 2 } },
];
const need = pid => { const p = PROCESSES.find(x => x.id === pid); return Object.fromEntries(RES.map(r => [r, p.max[r] - p.alloc[r]])); };
const INITIAL_AVAILABLE = Object.fromEntries(RES.map(r => [r, TOTAL[r] - PROCESSES.reduce((s, p) => s + p.alloc[r], 0)]));

export default function BankersMaze() {
  const [available, setAvailable] = useState(INITIAL_AVAILABLE);
  const [finished, setFinished] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  useEffect(() => {
    if (!shakeId) return;
    const t = setTimeout(() => setShakeId(null), 500);
    return () => clearTimeout(t);
  }, [shakeId]);

  function attemptRun(pid) {
    if (finished.includes(pid)) return;
    const n = need(pid);
    const ok = RES.every(r => n[r] <= available[r]);
    if (!ok) {
      setMessage(`${pid} 的需求超过当前可用资源，先解开别的绳索`);
      setShakeId(pid);
      return;
    }
    const proc = PROCESSES.find(p => p.id === pid);
    const next = { ...available };
    RES.forEach(r => { next[r] += proc.alloc[r]; });
    setAvailable(next);
    setFinished(f => [...f, pid]);
    setSequence(seq => [...seq, pid]);
    setMessage(null);
  }

  function reset() {
    setAvailable(INITIAL_AVAILABLE); setFinished([]); setSequence([]); setMessage(null); setShakeId(null);
  }

  const won = finished.length === PROCESSES.length;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .bm-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .bm-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .bm-focus:focus-visible { outline: 2px solid #f472b6; outline-offset: 2px; }
        @keyframes bmShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .bm-shake { animation: bmShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="bm-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><ShieldAlert size={20} className="text-fuchsia-400" />死锁绞索迷宫</h1>
          <p className="text-xs text-slate-400 mt-0.5">用银行家算法找到一条安全序列，解开所有绞索</p>
        </div>
        <div className="bm-mono text-sm text-slate-300">{finished.length}/{PROCESSES.length}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {RES.map(r => (
          <div key={r} className="rounded-lg bg-slate-900/70 border border-slate-800 py-2 text-center">
            <div className="bm-mono text-xs text-slate-500">{r} 可用</div>
            <div className="bm-mono text-lg text-emerald-300">{available[r]}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        {PROCESSES.map(p => {
          const n = need(p.id);
          const isFinished = finished.includes(p.id);
          const runnable = !isFinished && RES.every(r => n[r] <= available[r]);
          return (
            <button key={p.id} onClick={() => attemptRun(p.id)} disabled={isFinished}
              className={`bm-focus text-left p-3 rounded-lg border transition-colors ${shakeId === p.id ? 'bm-shake' : ''} ${isFinished ? 'border-emerald-800/60 bg-emerald-950/20 opacity-70' : runnable ? 'border-fuchsia-400/70 bg-slate-900/70 ring-1 ring-inset ring-fuchsia-400/40 hover:border-fuchsia-300' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-100">{p.id}</span>
                {isFinished && <CheckCircle2 size={15} className="text-emerald-400" />}
              </div>
              <div className="bm-mono text-xs text-slate-400 space-y-0.5">
                <div>Max&nbsp; {RES.map(r => p.max[r]).join(',')}</div>
                <div>Alloc {RES.map(r => p.alloc[r]).join(',')}</div>
                <div className={runnable && !isFinished ? 'text-fuchsia-300' : ''}>Need&nbsp; {RES.map(r => n[r]).join(',')}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 mb-2">已找到的安全序列：{sequence.length ? sequence.join(' → ') : '（还没开始）'}</div>

      <div className="text-xs flex items-start gap-1.5 min-h-8">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className={message ? 'text-amber-300' : 'text-slate-500'}>{message || '粉色边框 = 当前 Need ≤ 可用资源，此刻可以安全运行；点它会把它的 Allocation 还回可用池。'}</span>
      </div>

      {won && (
        <div className="text-center py-6 mt-2">
          <Trophy size={32} className="mx-auto text-amber-300 mb-2" />
          <div className="bm-display text-2xl font-bold text-emerald-400 mb-1">迷宫解开了！</div>
          <div className="text-sm text-slate-400 mb-4">安全序列：{sequence.join(' → ')} —— 系统全程没有陷入死锁</div>
          <button onClick={reset} className="bm-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再来一轮</button>
        </div>
      )}

      {!won && (
        <button onClick={reset} className="bm-focus w-full mt-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
          <RotateCcw size={14} /> 重新开始
        </button>
      )}
    </div>
  );
}
