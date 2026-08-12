import React, { useState, useEffect } from 'react';
import { Hammer, RotateCcw, Info, Trophy, AlertTriangle } from 'lucide-react';

type ColumnName = typeof COLUMNS[number];
type TableId = typeof TABLES[number]['id'];

const COLUMNS = ['OrderID', 'CustomerID', 'CustomerName', 'CustomerAddr', 'ProductID', 'ProductName', 'Price', 'Qty'] as const;

const RAW_ROWS: Record<ColumnName, string | number>[] = [
  { OrderID: '1001', CustomerID: 'C01', CustomerName: '张伟', CustomerAddr: '北京·海淀区', ProductID: 'P01', ProductName: '机械键盘', Price: 299, Qty: 2 },
  { OrderID: '1001', CustomerID: 'C01', CustomerName: '张伟', CustomerAddr: '北京·海淀区', ProductID: 'P02', ProductName: '无线鼠标', Price: 89, Qty: 1 },
  { OrderID: '1002', CustomerID: 'C02', CustomerName: '李娜', CustomerAddr: '上海·浦东区', ProductID: 'P01', ProductName: '机械键盘', Price: 299, Qty: 3 },
];

const TABLES = [
  { id: '订单表', expected: ['OrderID', 'CustomerID'], hint: '订单表只需要能定位"这是哪个客户下的哪张单"，客户的详细信息不该出现在这里。' },
  { id: '客户表', expected: ['CustomerID', 'CustomerName', 'CustomerAddr'], hint: '客户名和地址只由 CustomerID 决定，跟某一张具体订单无关。' },
  { id: '商品表', expected: ['ProductID', 'ProductName', 'Price'], hint: '商品名和单价只由 ProductID 决定，不该随订单重复存一遍。' },
  { id: '订单明细表', expected: ['OrderID', 'ProductID', 'Qty'], hint: 'Qty（数量）依赖的是"这张订单里的这件商品"，需要 OrderID 和 ProductID 两个字段一起才能确定。' },
] as const;

export default function NormalizationVein() {
  const [picks, setPicks] = useState<Record<TableId, ColumnName[]>>(() => Object.fromEntries(TABLES.map(t => [t.id, []])) as Record<TableId, ColumnName[]>);
  const [checked, setChecked] = useState<Record<TableId, boolean> | null>(null);
  const [shakeTable, setShakeTable] = useState<TableId | null>(null);

  useEffect(() => {
    if (!shakeTable) return;
    const t = setTimeout(() => setShakeTable(null), 500);
    return () => clearTimeout(t);
  }, [shakeTable]);

  function toggle(tableId: TableId, col: ColumnName) {
    setPicks(p => {
      const cur = p[tableId];
      const next = cur.includes(col) ? cur.filter(c => c !== col) : [...cur, col];
      return { ...p, [tableId]: next };
    });
    setChecked(null);
  }

  function verify() {
    const result = {} as Record<TableId, boolean>;
    let allOk = true;
    TABLES.forEach(t => {
      const got = [...picks[t.id]].sort().join(',');
      const want = [...t.expected].sort().join(',');
      const ok = got === want;
      result[t.id] = ok;
      if (!ok) allOk = false;
    });
    setChecked(result);
    if (!allOk) {
      const firstBad = TABLES.find(t => !result[t.id]);
      if (firstBad) { setShakeTable(firstBad.id); }
    }
  }

  function reset() {
    setPicks(Object.fromEntries(TABLES.map(t => [t.id, []])) as Record<TableId, ColumnName[]>);
    setChecked(null);
    setShakeTable(null);
  }

  const allCorrect = checked && Object.values(checked).every(Boolean);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .nv-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .nv-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .nv-focus:focus-visible { outline: 2px solid #4ade80; outline-offset: 2px; }
        @keyframes nvShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .nv-shake { animation: nvShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <h1 className="nv-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Hammer size={20} className="text-lime-400" />数据流矿脉 · 范式炼金</h1>
      </div>

      <div className="rounded-lg border border-amber-900/50 bg-amber-950/10 p-2.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 mb-1.5"><AlertTriangle size={13} />1NF 原始表（红字是重复冗余）</div>
        <div className="overflow-x-auto">
          <table className="nv-mono text-xs w-full">
            <thead><tr>{COLUMNS.map(c => <th key={c} className="text-left text-slate-500 pr-3 pb-1 whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>
              {RAW_ROWS.map((row, ri) => (
                <tr key={ri}>
                  {COLUMNS.map(c => {
                    const isDup = ri > 0 && RAW_ROWS.slice(0, ri).some(r => r[c] === row[c]);
                    return <td key={c} className={`pr-3 py-0.5 whitespace-nowrap ${isDup ? 'text-rose-400' : 'text-slate-300'}`}>{row[c]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-2">把下面的字段分配进 4 张表里——同一个字段可以出现在不止一张表中（外键）。</div>

      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        {TABLES.map(t => {
          const isChecked = checked && checked[t.id] !== undefined;
          const isOk = checked && checked[t.id];
          return (
            <div key={t.id} className={`rounded-lg border p-3 ${shakeTable === t.id ? 'nv-shake' : ''} ${isChecked ? (isOk ? 'border-emerald-700/60 bg-emerald-950/20' : 'border-rose-700/60 bg-rose-950/20') : 'border-slate-800 bg-slate-900/60'}`}>
              <div className="text-sm font-semibold text-slate-100 mb-1.5">{t.id}</div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {COLUMNS.map(col => {
                  const sel = picks[t.id].includes(col);
                  return (
                    <button key={col} onClick={() => toggle(t.id, col)}
                      className={`nv-focus nv-mono text-xs px-2 py-1 rounded border transition-colors ${sel ? 'border-lime-400 bg-lime-400/10 text-lime-200' : 'border-slate-700 bg-slate-900/50 text-slate-500 hover:border-slate-500'}`}>
                      {col}
                    </button>
                  );
                })}
              </div>
              {isChecked && !isOk && <div className="text-xs text-rose-300 mt-1">{t.hint}</div>}
            </div>
          );
        })}
      </div>

      <button onClick={verify} className="nv-focus w-full py-2.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold transition-colors mb-2">检验 3NF</button>

      <div className="text-xs flex items-start gap-1.5 min-h-8">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className="text-slate-500">判断依据：一个非主属性该放进哪张表，看它到底是被"谁"唯一决定的——只被 CustomerID 决定的字段不该跟着 OrderID 走。</span>
      </div>

      {allCorrect && (
        <div className="text-center py-4">
          <Trophy size={28} className="mx-auto text-amber-300 mb-2" />
          <div className="nv-display text-xl font-bold text-emerald-400 mb-1">拆解成功，冗余妖怪已除！</div>
          <div className="text-sm text-slate-400">客户信息不再随每张订单重复、商品单价不再随每次购买重复——这就是 3NF 消除的两种异常</div>
        </div>
      )}

      <button onClick={reset} className="nv-focus w-full mt-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
        <RotateCcw size={14} /> 重新开始
      </button>
    </div>
  );
}
