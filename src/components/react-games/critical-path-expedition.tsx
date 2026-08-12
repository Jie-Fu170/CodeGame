import React, { useState, useMemo } from 'react';
import { Route, RotateCcw, Zap, Info, CheckCircle2 } from 'lucide-react';

const NODE_POS = { 1: { x: 40, y: 150 }, 2: { x: 210, y: 55 }, 3: { x: 210, y: 245 }, 4: { x: 390, y: 100 }, 5: { x: 390, y: 245 }, 6: { x: 560, y: 150 } };
const NODES = [1, 2, 3, 4, 5, 6];
const START = 1, END = 6;
const ACTIVITIES = [
  { id: 'A', from: 1, to: 2, dur: 4 },
  { id: 'B', from: 1, to: 3, dur: 2 },
  { id: 'C', from: 2, to: 4, dur: 3 },
  { id: 'D', from: 3, to: 4, dur: 2 },
  { id: 'E', from: 3, to: 5, dur: 5 },
  { id: 'F', from: 4, to: 6, dur: 4 },
  { id: 'G', from: 5, to: 6, dur: 3 },
];
const MAX_CRASH_PER = 2;
const TOKENS = 3;

function computeCPM(durations) {
  const byTo = {};
  ACTIVITIES.forEach(a => { (byTo[a.to] = byTo[a.to] || []).push(a); });
  const ET = { [START]: 0 };
  NODES.forEach(n => { if (n !== START) ET[n] = Math.max(...(byTo[n] || []).map(a => ET[a.from] + durations[a.id])); });
  const projectDuration = ET[END];
  const byFrom = {};
  ACTIVITIES.forEach(a => { (byFrom[a.from] = byFrom[a.from] || []).push(a); });
  const LT = { [END]: projectDuration };
  [...NODES].reverse().forEach(n => {
    if (n === END) return;
    const out = byFrom[n] || [];
    LT[n] = out.length ? Math.min(...out.map(a => LT[a.to] - durations[a.id])) : ET[n];
  });
  const details = Object.fromEntries(ACTIVITIES.map(a => {
    const ES = ET[a.from], EF = ES + durations[a.id], LF = LT[a.to], LS = LF - durations[a.id];
    return [a.id, { ES, EF, LS, LF, TF: LS - ES, critical: LS === ES }];
  }));
  return { projectDuration, details };
}

function bruteOptimal(tokens) {
  let best = Infinity;
  function rec(i, remaining, crash) {
    if (i === ACTIVITIES.length) {
      const durations = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.dur - (crash[a.id] || 0)]));
      best = Math.min(best, computeCPM(durations).projectDuration);
      return;
    }
    for (let c = 0; c <= Math.min(MAX_CRASH_PER, remaining); c++) rec(i + 1, remaining - c, { ...crash, [ACTIVITIES[i].id]: c });
  }
  rec(0, tokens, {});
  return best;
}
const ORIGINAL_DURATIONS = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.dur]));
const ORIGINAL_CPM = computeCPM(ORIGINAL_DURATIONS);
const OPTIMAL_AFTER_CRASH = bruteOptimal(TOKENS);

export default function CriticalPathExpedition() {
  const [phase, setPhase] = useState('identify');
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState(null);
  const [durations, setDurations] = useState(ORIGINAL_DURATIONS);
  const [crashCount, setCrashCount] = useState({});
  const [tokensLeft, setTokensLeft] = useState(TOKENS);

  const cpm = useMemo(() => computeCPM(durations), [durations]);

  function toggleEdge(id) {
    if (phase !== 'identify') return;
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
    setMessage(null);
  }

  function checkPath() {
    const criticalIds = ACTIVITIES.filter(a => ORIGINAL_CPM.details[a.id].critical).map(a => a.id);
    const match = selected.length === criticalIds.length && criticalIds.every(id => selected.includes(id));
    if (match) {
      setMessage(null);
      setPhase('crash');
    } else {
      setMessage('不对——关键路径是"总时差为 0"的那条最长路径，再对一下每条边的总时差。');
    }
  }

  function crashEdge(id) {
    if (phase !== 'crash' || tokensLeft <= 0) return;
    const used = crashCount[id] || 0;
    if (used >= MAX_CRASH_PER) { setMessage(`${id} 已经赶工到极限了，赶工再多也压不动`); return; }
    if (!cpm.details[id].critical) { setMessage(`${id} 现在不在关键路径上，压缩它不会缩短总工期`); return; }
    setCrashCount(c => ({ ...c, [id]: used + 1 }));
    setDurations(d => ({ ...d, [id]: d[id] - 1 }));
    setTokensLeft(t => t - 1);
    setMessage(null);
  }

  function reset() {
    setPhase('identify'); setSelected([]); setMessage(null);
    setDurations(ORIGINAL_DURATIONS); setCrashCount({}); setTokensLeft(TOKENS);
  }

  const stars = cpm.projectDuration <= OPTIMAL_AFTER_CRASH ? 3 : cpm.projectDuration <= OPTIMAL_AFTER_CRASH + 1 ? 2 : 1;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .cp-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .cp-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .cp-focus:focus-visible { outline: 2px solid #34d399; outline-offset: 2px; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="cp-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Route size={20} className="text-emerald-400" />关键路径远征图</h1>
          <p className="text-xs text-slate-400 mt-0.5">{phase === 'identify' ? '点亮组成关键路径的活动边' : '用有限的赶工资源压缩总工期'}</p>
        </div>
        <div className="cp-mono text-sm text-right shrink-0">
          <div className="text-slate-300">工期 <span className="text-emerald-300">{cpm.projectDuration}</span> 天</div>
          {phase === 'crash' && <div className="text-amber-300 flex items-center gap-1 justify-end"><Zap size={13} />{tokensLeft} 队员待命</div>}
        </div>
      </div>

      <svg viewBox="0 0 600 300" className="w-full h-auto mb-3">
        <defs>
          <marker id="cpArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
          </marker>
        </defs>
        {ACTIVITIES.map(a => {
          const from = NODE_POS[a.from], to = NODE_POS[a.to];
          const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
          const isSelected = selected.includes(a.id);
          const isCritical = phase !== 'identify' && cpm.details[a.id].critical;
          const stroke = isSelected ? '#22d3ee' : isCritical ? '#fb7185' : '#475569';
          return (
            <g key={a.id}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth={22} onClick={() => phase === 'identify' ? toggleEdge(a.id) : crashEdge(a.id)} style={{ cursor: 'pointer' }} />
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={stroke} strokeWidth={isSelected || isCritical ? 3.5 : 2} markerEnd="url(#cpArrow)" pointerEvents="none" style={{ transition: 'stroke 0.25s' }} />
              <rect x={mid.x - 22} y={mid.y - 11} width={44} height={20} rx={4} fill="#0a0e1a" opacity={0.9} pointerEvents="none" />
              <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize="11" fill="#e2e8f0" pointerEvents="none" className="cp-mono">{a.id}:{durations[a.id]}</text>
              {(crashCount[a.id] || 0) > 0 && <text x={mid.x} y={mid.y - 16} textAnchor="middle" fontSize="9" fill="#fbbf24" pointerEvents="none">已赶工{crashCount[a.id]}</text>}
            </g>
          );
        })}
        {NODES.map(n => (
          <g key={n}>
            <circle cx={NODE_POS[n].x} cy={NODE_POS[n].y} r={16} fill="#1e293b" stroke="#475569" strokeWidth={2} />
            <text x={NODE_POS[n].x} y={NODE_POS[n].y + 4} textAnchor="middle" fontSize="12" fill="#e2e8f0">{n}</text>
          </g>
        ))}
      </svg>

      {phase === 'identify' && (
        <>
          <div className="text-xs text-slate-400 mb-2">已选活动：{selected.length ? selected.sort().join(', ') : '（点图上的边来选择）'} · 合计 {selected.reduce((s, id) => s + durations[id], 0)} 天</div>
          <button onClick={checkPath} className="cp-focus w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors mb-2">确认路径</button>
        </>
      )}

      {phase === 'crash' && (
        <div className="text-xs text-slate-400 mb-2">点红色的关键活动边消耗 1 名队员，把它压缩 1 天——工期只由当前的关键路径决定，压缩非关键活动是浪费。</div>
      )}

      {phase === 'crash' && tokensLeft === 0 && (
        <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3 flex items-center gap-2 mb-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="text-sm text-slate-100">
            队员全部用完，最终工期 <span className="cp-mono text-emerald-300">{cpm.projectDuration}</span> 天（最优解 {OPTIMAL_AFTER_CRASH} 天）
            <div className="flex gap-0.5 mt-1">{[1, 2, 3].map(s => <span key={s} className={s <= stars ? 'text-amber-300' : 'text-slate-700'}>★</span>)}</div>
          </div>
        </div>
      )}

      <div className="text-xs flex items-start gap-1.5 min-h-8">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className={message ? 'text-amber-300' : 'text-slate-500'}>{message || (phase === 'identify' ? '关键路径 = 总时差为 0 的活动组成的最长路径，工期完全由它决定。' : '提示：两条路径打平之后，得同时压两边才能继续缩短总工期。')}</span>
      </div>

      <button onClick={reset} className="cp-focus w-full mt-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
        <RotateCcw size={14} /> 重新开始
      </button>
    </div>
  );
}
