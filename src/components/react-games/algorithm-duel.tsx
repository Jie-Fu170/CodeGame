import React, { useState, useEffect } from 'react';
import { Swords, RotateCcw, Zap, Trophy } from 'lucide-react';

const CARDS = {
  bubble: { name: '冒泡排序', big: 'O(n²)', kind: 'sq', color: 'bg-rose-500', desc: '相邻元素两两比较交换，简单但数据量一大代价就会陡增。' },
  insertion: { name: '插入排序', big: 'O(n²)', kind: 'sq', color: 'bg-orange-500', desc: '像整理扑克牌一样逐个插入合适位置，复杂度与冒泡同级。' },
  quick: { name: '快速排序', big: 'O(n log n)', kind: 'log', color: 'bg-cyan-500', desc: '分治 + 基准划分，平均情况下大幅领先 O(n²) 算法。' },
  merge: { name: '归并排序', big: 'O(n log n)', kind: 'log', color: 'bg-violet-500', desc: '分治 + 合并，稳定的 O(n log n)，大数据量下的可靠选择。' },
};

const WAVES = [
  { name: '小顽固数组', n: 6 },
  { name: '中型混乱兽', n: 16 },
  { name: '大型无序巨兽', n: 36 },
  { name: '终极混沌深渊', n: 60 },
];

const MAX_MANA = 160;

function cost(kind, n) {
  return kind === 'sq' ? Math.round((n * n) / 8) : Math.round((n * Math.log2(Math.max(n, 2))) / 3);
}
function genBars(n) {
  return Array.from({ length: n }, (_, i) => ({ id: `b${i}-${Math.random().toString(36).slice(2, 7)}`, value: 10 + Math.random() * 85 }));
}

export default function AlgorithmDuel() {
  const [wave, setWave] = useState(0);
  const [mana, setMana] = useState(60);
  const [bars, setBars] = useState(() => genBars(WAVES[0].n));
  const [sorted, setSorted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [status, setStatus] = useState('playing');

  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => setMana(m => Math.min(MAX_MANA, m + 18)), 1400);
    return () => clearInterval(id);
  }, [status]);

  const n = WAVES[wave].n;

  function playCard(key) {
    if (animating || sorted) return;
    const c = cost(CARDS[key].kind, n);
    if (c > mana) return;
    setMana(m => m - c);
    setActiveCard(key);
    setAnimating(true);
    const duration = Math.max(500, Math.min(3600, c * 16));
    setTimeout(() => {
      setBars(b => [...b].sort((x, y) => x.value - y.value));
      setSorted(true);
      setAnimating(false);
    }, duration);
  }

  function nextWave() {
    const next = wave + 1;
    if (next >= WAVES.length) { setStatus('won'); return; }
    setWave(next);
    setBars(genBars(WAVES[next].n));
    setSorted(false);
    setActiveCard(null);
  }

  function reset() {
    setWave(0); setMana(60); setBars(genBars(WAVES[0].n)); setSorted(false);
    setStatus('playing'); setAnimating(false); setActiveCard(null);
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .ad-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ad-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .ad-focus:focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }
        @keyframes adPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.35); } 50% { box-shadow: 0 0 0 6px rgba(34,211,238,0); } }
        .ad-animating { animation: adPulse 1.1s ease-in-out infinite; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="ad-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Swords size={20} className="text-cyan-400" />算法排序决斗场</h1>
          <p className="text-xs text-slate-400 mt-0.5">用复杂度最匹配的算法打倒每一波数据怪</p>
        </div>
        <div className="ad-mono text-sm text-slate-300 text-right shrink-0">
          <div>第 {wave + 1}/{WAVES.length} 波</div>
          <div className="text-amber-300 flex items-center gap-1 justify-end"><Zap size={13} />{mana}/{MAX_MANA}</div>
        </div>
      </div>

      <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${(mana / MAX_MANA) * 100}%` }} />
      </div>

      {status === 'playing' && (
        <>
          <div className="text-center mb-2">
            <span className="ad-display text-sm font-bold text-slate-100">{WAVES[wave].name}</span>
            <span className="ad-mono text-xs text-slate-400 ml-2">n = {n}</span>
          </div>

          <div className={`relative h-28 sm:h-36 rounded-lg border mb-4 bg-slate-900/60 overflow-hidden ${animating ? 'ad-animating border-cyan-500/60' : 'border-slate-800'}`}>
            {bars.map((b, idx) => (
              <div key={b.id} className="absolute bottom-0 rounded-t" style={{
                left: `${(idx / bars.length) * 100}%`,
                width: `${Math.max(100 / bars.length, 1)}%`,
                height: `${b.value}%`,
                background: sorted ? '#34d399' : '#38bdf8',
                transition: 'left 0.5s ease, height 0.4s ease, background 0.3s ease',
              }} />
            ))}
            {animating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="ad-mono text-xs bg-slate-950/80 text-cyan-300 px-2 py-1 rounded">正在用 {CARDS[activeCard].name} 排序…</span>
              </div>
            )}
          </div>

          {!sorted ? (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CARDS).map(([key, def]) => {
                const c = cost(def.kind, n);
                const impossible = c > MAX_MANA;
                const affordable = c <= mana;
                return (
                  <button key={key} disabled={!affordable || animating} onClick={() => playCard(key)}
                    className={`ad-focus text-left p-3 rounded-lg border transition-colors ${affordable && !animating ? 'border-slate-700 bg-slate-900/70 hover:border-slate-500' : 'border-slate-800 bg-slate-900/40 opacity-60 cursor-not-allowed'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-100">{def.name}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${def.color}`} />
                    </div>
                    <div className="ad-mono text-xs text-slate-400 mb-1">{def.big}</div>
                    <div className={`ad-mono text-xs ${impossible ? 'text-rose-400' : affordable ? 'text-emerald-300' : 'text-amber-400'}`}>
                      需要 {c} 点法力{impossible ? '（满蓝也不够！）' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <button onClick={nextWave} className="ad-focus w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors">
              {wave + 1 >= WAVES.length ? '查看结算' : '排序完成，前往下一波'}
            </button>
          )}

          <div className="text-xs text-slate-500 mt-3">
            提示：n 越大，O(n²) 卡牌的花费涨得比 O(n log n) 快得多——满蓝都打不过时，说明不是法力问题，是算法选错了。
          </div>
        </>
      )}

      {status === 'won' && (
        <div className="text-center py-6">
          <Trophy size={32} className="mx-auto text-amber-300 mb-2" />
          <div className="ad-display text-2xl font-bold text-emerald-400 mb-1">决斗场通关！</div>
          <div className="text-sm text-slate-400 mb-4">从 n=6 打到 n=60，你已经用身体记住了复杂度曲线的差距</div>
          <button onClick={reset} className="ad-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再来一轮</button>
        </div>
      )}
    </div>
  );
}
