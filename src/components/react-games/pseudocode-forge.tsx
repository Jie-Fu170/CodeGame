import React, { useState } from 'react';
import { Flame, RotateCcw, Info, Trophy, PlayCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const BLANKS = {
  mid: [
    { v: 'Math.floor((low + high) / 2)', ok: true },
    { v: 'Math.floor((low + high) * 2)', ok: false },
    { v: 'low + high', ok: false },
  ],
  low: [
    { v: 'mid', ok: false },
    { v: 'mid + 1', ok: true },
    { v: 'mid - 1', ok: false },
  ],
  high: [
    { v: 'mid + 1', ok: false },
    { v: 'mid', ok: false },
    { v: 'mid - 1', ok: true },
  ],
};

const TESTS = [
  { arr: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 23, expect: 5 },
  { arr: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 100, expect: -1 },
  { arr: [1, 3, 5, 7, 9], target: 1, expect: 0 },
];

function runBinarySearch(arr, target, choice) {
  let low = 0, high = arr.length - 1, steps = 0;
  while (low <= high) {
    steps += 1;
    if (steps > 60) return { result: 'TIMEOUT', steps };
    let mid;
    if (choice.mid === 'Math.floor((low + high) / 2)') mid = Math.floor((low + high) / 2);
    else if (choice.mid === 'Math.floor((low + high) * 2)') mid = Math.floor((low + high) * 2);
    else mid = low + high;
    if (!Number.isFinite(mid) || mid < -1000 || mid > 100000) return { result: 'ERROR', steps };
    if (mid < 0 || mid >= arr.length) { /* out of range: emulate as immediate not-found path via comparison below */ }
    const val = arr[mid];
    if (val === target) return { result: mid, steps };
    if (val === undefined || !(val < target)) {
      if (choice.high === 'mid + 1') high = mid + 1; else if (choice.high === 'mid') high = mid; else high = mid - 1;
    } else {
      if (choice.low === 'mid') low = mid; else if (choice.low === 'mid + 1') low = mid + 1; else low = mid - 1;
    }
  }
  return { result: -1, steps };
}

export default function PseudocodeForge() {
  const [choice, setChoice] = useState({});
  const [results, setResults] = useState(null);

  const allFilled = BLANKS.mid && choice.mid && choice.low && choice.high;
  const passCount = results ? results.filter(r => r.pass).length : 0;
  const allPass = results && passCount === TESTS.length;

  function pick(slot, v) {
    setChoice(c => ({ ...c, [slot]: v }));
    setResults(null);
  }

  function runTests() {
    const out = TESTS.map(t => {
      const r = runBinarySearch(t.arr, t.target, choice);
      return { ...t, got: r.result, steps: r.steps, pass: r.result === t.expect };
    });
    setResults(out);
  }

  function reset() { setChoice({}); setResults(null); }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .pf2-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .pf2-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .pf2-focus:focus-visible { outline: 2px solid #fb923c; outline-offset: 2px; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="pf2-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Flame size={20} className="text-orange-400" />伪代码熔炉</h1>
          <p className="text-xs text-slate-400 mt-0.5">补全二分查找，浇口选错会真的跑出错误结果</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 mb-3 pf2-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">function binarySearch(arr, target):</div>
        <div className="pl-3 text-slate-300">low = 0, high = length(arr) - 1</div>
        <div className="pl-3 text-slate-300">while low &lt;= high:</div>
        <div className="pl-6 text-slate-300">mid = <SlotTag slot="mid" choice={choice} /></div>
        <div className="pl-6 text-slate-300">if arr[mid] == target: return mid</div>
        <div className="pl-6 text-slate-300">else if arr[mid] &lt; target: low = <SlotTag slot="low" choice={choice} /></div>
        <div className="pl-6 text-slate-300">else: high = <SlotTag slot="high" choice={choice} /></div>
        <div className="pl-3 text-slate-300">return -1</div>
      </div>

      {['mid', 'low', 'high'].map(slot => (
        <div key={slot} className="mb-3">
          <div className="pf2-mono text-xs text-slate-500 mb-1">浇口 {slot}</div>
          <div className="flex flex-wrap gap-2">
            {BLANKS[slot].map((opt, i) => {
              const isSel = choice[slot] === opt.v;
              return (
                <button key={i} onClick={() => pick(slot, opt.v)}
                  className={`pf2-focus pf2-mono text-xs px-2.5 py-1.5 rounded-md border transition-colors ${isSel ? 'border-orange-400 bg-slate-800 text-slate-50 ring-1 ring-inset ring-orange-400/50' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'}`}>
                  {opt.v}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={runTests} disabled={!allFilled} className="pf2-focus w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors mb-3">
        <PlayCircle size={16} /> 浇筑并运行测试
      </button>

      {results && (
        <div className="space-y-2 mb-3">
          {results.map((r, i) => (
            <div key={i} className={`rounded-lg border p-2.5 flex items-center justify-between pf2-mono text-xs ${r.pass ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-rose-800/60 bg-rose-950/20'}`}>
              <div className="text-slate-300">查找 {r.target} in [{r.arr.length} 个元素]</div>
              <div className="flex items-center gap-2">
                <span className={r.pass ? 'text-emerald-300' : 'text-rose-300'}>
                  {r.got === 'TIMEOUT' ? '超时未收敛' : `返回 ${r.got}`}（期望 {r.expect}）
                </span>
                {r.pass ? <CheckCircle2 size={14} className="text-emerald-400" /> : r.got === 'TIMEOUT' ? <AlertTriangle size={14} className="text-amber-400" /> : <XCircle size={14} className="text-rose-400" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {!allPass && (
        <div className="text-xs flex items-start gap-1.5 min-h-8">
          <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="text-slate-500">"超时未收敛"通常意味着 low/high 没有真正逼近彼此——检查是不是漏了 ±1。</span>
        </div>
      )}

      {allPass && (
        <div className="text-center py-4">
          <Trophy size={28} className="mx-auto text-amber-300 mb-2" />
          <div className="pf2-display text-xl font-bold text-emerald-400 mb-1">三个测试全部通过！</div>
          <div className="text-sm text-slate-400 mb-3">这就是二分查找的标准写法——每轮排除一半区间</div>
        </div>
      )}

      <button onClick={reset} className="pf2-focus w-full mt-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
        <RotateCcw size={14} /> 清空重来
      </button>
    </div>
  );
}

function SlotTag({ slot, choice }) {
  const v = choice[slot];
  return <span className={v ? 'text-orange-300' : 'text-slate-600'}>{v || `___${slot}___`}</span>;
}
