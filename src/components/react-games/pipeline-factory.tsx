import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, RotateCcw, Star, Link2, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../config/levels';

const INSTRUCTIONS = [
  { id: 'i1', name: 'LOAD R1, [A]', dep: null },
  { id: 'i2', name: 'ADD R2, R1, R1', dep: 'i1' },
  { id: 'i3', name: 'SUB R3, R2, R2', dep: 'i2' },
  { id: 'i4', name: 'MUL R5, R6, R7', dep: null },
  { id: 'i5', name: 'AND R8, R9, R10', dep: null },
  { id: 'i6', name: 'STORE [B], R3', dep: 'i3' },
];
const INIT_ORDER = INSTRUCTIONS.map(i => i.id);
const BY_ID = Object.fromEntries(INSTRUCTIONS.map(i => [i.id, i]));

function simulate(order) {
  let prevIF = 0;
  const completion = {};
  const schedule = [];
  order.forEach(id => {
    const inst = BY_ID[id];
    const expectedIF = prevIF + 1;
    let ifCycle = expectedIF;
    if (inst.dep && completion[inst.dep] !== undefined) {
      const neededID = completion[inst.dep] + 1;
      while (ifCycle + 1 < neededID) ifCycle += 1;
    }
    const ID = ifCycle + 1, EX = ifCycle + 2;
    schedule.push({ id, expectedIF, IF: ifCycle, ID, EX, stalls: ifCycle - expectedIF });
    completion[id] = EX;
    prevIF = ifCycle;
  });
  const total = Math.max(...schedule.map(s => s.EX));
  const stalls = schedule.reduce((a, s) => a + s.stalls, 0);
  return { schedule, total, stalls };
}

function permute(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  arr.forEach((x, i) => {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    permute(rest).forEach(p => out.push([x, ...p]));
  });
  return out;
}
function isValid(order) {
  const pos = Object.fromEntries(order.map((id, i) => [id, i]));
  return INSTRUCTIONS.every(inst => !inst.dep || pos[inst.dep] < pos[inst.id]);
}
const OPTIMAL_STALLS = Math.min(...permute(INIT_ORDER).filter(isValid).map(o => simulate(o).stalls));

const STAGE_STYLE = {
  IF: { label: 'IF', cls: 'bg-cyan-500 text-slate-950' },
  ID: { label: 'ID', cls: 'bg-amber-400 text-slate-950' },
  EX: { label: 'EX', cls: 'bg-violet-400 text-slate-950' },
};

export default function PipelineFactory() {
  const [order, setOrder] = useState(INIT_ORDER);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState(null);
  const { setLevel } = useGameStore();

  const result = useMemo(() => simulate(order), [order]);
  const seqBaseline = order.length * 3;
  const throughput = (order.length / result.total).toFixed(2);
  const speedup = (seqBaseline / result.total).toFixed(2);
  const stars = result.stalls <= OPTIMAL_STALLS ? 3 : result.stalls <= OPTIMAL_STALLS + 1 ? 2 : 1;

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(t);
  }, [message]);

  function tapCard(id) {
    if (selected === id) { setSelected(null); return; }
    if (selected === null) { setSelected(id); return; }
    const a = order.indexOf(selected), b = order.indexOf(id);
    const next = [...order];
    [next[a], next[b]] = [next[b], next[a]];
    if (!isValid(next)) {
      setMessage('这样交换会让指令用到还没算出来的结果，顺序不合法');
      setSelected(null);
      return;
    }
    setOrder(next);
    setSelected(null);
  }

  function reset() { setOrder(INIT_ORDER); setSelected(null); setMessage(null); }

  const cycles = Array.from({ length: result.total }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .pf-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .pf-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .pf-focus:focus-visible { outline: 2px solid #fb923c; outline-offset: 2px; }
      `}</style>

      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="pf-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Cpu size={20} className="text-orange-400" />指令流水线工厂</h1>
          <p className="text-xs text-slate-400 mt-0.5">调整指令顺序，消灭数据冒险产生的流水线气泡</p>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3].map(s => <Star key={s} size={16} className={s <= stars ? 'text-amber-300 fill-amber-300' : 'text-slate-700'} />)}
        </div>
      </div>

      {stars === 3 && (
        <div className="my-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-2 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-300 text-sm sm:text-base">🎉 考点满分通关！</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">3 星 ★★★</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                已达成理论物理极限最小值（1 个气泡），成功消灭所有可优化的数据冒险！
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const curIdx = LEVELS.findIndex(l => l.id === 'pipeline-factory-react');
              if (curIdx >= 0 && curIdx < LEVELS.length - 1) {
                setLevel(LEVELS[curIdx + 1].id);
              }
            }}
            className="w-full sm:w-auto shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
          >
            下一考点 <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 my-3 pf-mono text-center text-xs">
        <div className="rounded-lg bg-slate-900/70 border border-slate-800 py-2"><div className="text-slate-500">总周期</div><div className="text-base text-slate-100">{result.total}</div></div>
        <div className="rounded-lg bg-slate-900/70 border border-slate-800 py-2"><div className="text-slate-500">停顿周期</div><div className="text-base text-rose-300">{result.stalls}</div></div>
        <div className="rounded-lg bg-slate-900/70 border border-slate-800 py-2"><div className="text-slate-500">吞吐率</div><div className="text-base text-cyan-300">{throughput}</div></div>
        <div className="rounded-lg bg-slate-900/70 border border-slate-800 py-2"><div className="text-slate-500">加速比</div><div className="text-base text-emerald-300">{speedup}×</div></div>
      </div>

      <div className="text-xs text-slate-400 mb-2">点一张指令卡，再点另一张，两者互换位置——依赖箭头不能反过来。</div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        {order.map(id => {
          const inst = BY_ID[id];
          const isSel = selected === id;
          return (
            <button key={id} onClick={() => tapCard(id)} className={`pf-focus rounded-lg border p-2 text-left transition-colors ${isSel ? 'border-orange-400 bg-slate-800 ring-1 ring-inset ring-orange-400/50' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}>
              <div className="pf-mono text-xs text-slate-100 leading-tight">{inst.name}</div>
              {inst.dep && (
                <div className="flex items-center gap-1 mt-1 text-xs text-amber-300/90">
                  <Link2 size={10} /> 依赖 {BY_ID[inst.dep].name.split(',')[0]}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800/80 overflow-x-auto mb-3">
        <div style={{ minWidth: '480px' }}>
          <div className="grid pf-mono text-xs text-slate-500" style={{ gridTemplateColumns: `100px repeat(${cycles.length}, 1fr)` }}>
            <div className="p-1"></div>
            {cycles.map(c => <div key={c} className="p-1 text-center">{c}</div>)}
          </div>
          {order.map(id => {
            const s = result.schedule.find(x => x.id === id);
            return (
              <div key={id} className="grid items-center border-t border-slate-900" style={{ gridTemplateColumns: `100px repeat(${cycles.length}, 1fr)` }}>
                <div className="pf-mono text-xs text-slate-400 p-1 truncate">{BY_ID[id].name.split(',')[0]}</div>
                {cycles.map(c => {
                  let cell = null;
                  if (c >= s.expectedIF && c < s.IF) cell = <div className="mx-0.5 my-1 h-5 rounded bg-rose-950/60 border border-dashed border-rose-800/60" title="流水线气泡" />;
                  else if (c === s.IF || c === s.ID || c === s.EX) {
                    const key = c === s.IF ? 'IF' : c === s.ID ? 'ID' : 'EX';
                    cell = <div className={`mx-0.5 my-1 h-5 rounded flex items-center justify-center text-xs font-bold pf-mono ${STAGE_STYLE[key].cls}`}>{STAGE_STYLE[key].label}</div>;
                  }
                  return <div key={c}>{cell}</div>;
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs flex items-start gap-1.5 min-h-8 mb-3">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className={message ? 'text-amber-300' : 'text-slate-400'}>{message || '目标：把两个"独立指令"（无依赖箭头）插到会产生气泡的两条指令之间，尽量把气泡压到最少。'}</span>
      </div>

      <button onClick={reset} className="pf-focus w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
        <RotateCcw size={14} /> 重置为初始顺序
      </button>
    </div>
  );
}
