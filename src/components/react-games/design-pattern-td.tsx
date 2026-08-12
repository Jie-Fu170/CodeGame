import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Factory, Eye, Layers, Bug, Skull, Coins, Heart, Play, RotateCcw, Info, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

const ROWS = 6, COLS = 10;

function buildPath() {
  const p = [];
  for (let c = 0; c < COLS; c++) p.push({ r: 0, c });
  p.push({ r: 1, c: COLS - 1 });
  for (let c = COLS - 1; c >= 0; c--) p.push({ r: 2, c });
  p.push({ r: 3, c: 0 });
  for (let c = 0; c < COLS; c++) p.push({ r: 4, c });
  p.push({ r: 5, c: COLS - 1 });
  return p;
}
const PATH = buildPath();
const PATH_INDEX = new Map(PATH.map((p, i) => [`${p.r},${p.c}`, i]));
const BASE_CELL = PATH[PATH.length - 1];
const SPAWN_CELL = PATH[0];

const TOWERS = {
  singleton: { name: '单例塔', Icon: Shield, cost: 120, dmg: 26, range: 2.3, cd: 1, unique: true, bg: 'bg-amber-400', desc: '全局唯一，同一时刻只能存在一座——单体高伤害，专克强敌。' },
  factory:   { name: '工厂塔', Icon: Factory, cost: 60, dmg: 11, range: 2.0, cd: 1, multi: true, bg: 'bg-orange-500', desc: '一次生产、批量打击，可同时命中场上 2 个目标。' },
  observer:  { name: '观察者塔', Icon: Eye, cost: 50, dmg: 5, range: 2.3, cd: 1, buff: true, bg: 'bg-cyan-400', desc: '每次攻击都会"通知"全场其他塔，使它们本回合伤害 +50%。' },
  decorator: { name: '装饰器塔', Icon: Layers, cost: 40, dmg: 3, range: 1.5, cd: 1, decorate: true, bg: 'bg-violet-400', desc: '给上下左右相邻的塔叠加 +40% 伤害，可与多个装饰器叠加。' },
};

const ENEMIES = {
  nullptr:  { name: '空指针虫', hp: 20, speed: 1, reward: 5, dmg: 5, color: '#fb7185' },
  leak:     { name: '内存泄漏怪', hp: 65, speed: 1, reward: 12, dmg: 10, color: '#65a30d' },
  deadlock: { name: '死锁毒虫', hp: 16, speed: 2, reward: 8, dmg: 8, color: '#facc15' },
  overflow: { name: '边界溢出兽', hp: 220, speed: 1, reward: 60, dmg: 30, color: '#dc2626', boss: true },
};

const WAVES = [
  Array(6).fill('nullptr'),
  [...Array(8).fill('nullptr'), ...Array(3).fill('deadlock')],
  [...Array(5).fill('leak'), ...Array(5).fill('deadlock')],
  [...Array(10).fill('nullptr'), ...Array(5).fill('leak'), ...Array(4).fill('deadlock')],
  ['overflow', ...Array(5).fill('deadlock')],
];

const QUIZ = [
  { q: '哪个模式的核心意图是"确保一个类只有一个实例，并提供全局访问点"？', opts: ['工厂模式', '单例模式', '观察者模式', '装饰器模式'], a: 1 },
  { q: '对象状态改变时自动通知并更新所有依赖对象，最符合下列哪种模式？', opts: ['单例模式', '策略模式', '观察者模式', '工厂模式'], a: 2 },
  { q: '不修改原有类结构、动态给对象添加职责，应使用？', opts: ['装饰器模式', '单例模式', '适配器模式', '观察者模式'], a: 0 },
  { q: '工厂模式的主要目的是？', opts: ['保证唯一实例', '封装创建过程，使创建与使用分离', '动态添加职责', '定义可互换的算法族'], a: 1 },
  { q: '关于设计模式分类，以下哪项说法是错误的？', opts: ['单例模式属于创建型模式', '装饰器模式属于结构型模式', '观察者模式属于结构型模式', '设计模式是可复用的通用解决方案'], a: 2 },
];

const dist = (a, b) => Math.hypot(a.r - b.r, a.c - b.c);

function initState() {
  return {
    towers: [], enemies: [], gold: 180, baseHp: 100, maxBaseHp: 100,
    wave: 0, status: 'ready', spawnQueue: [], spawnTimer: 0, nextId: 1,
    selected: null, flash: null, message: null,
  };
}

function tick(prev) {
  if (prev.status !== 'playing') return prev;

  let baseHp = prev.baseHp;
  let gold = prev.gold;
  let enemies = [];
  prev.enemies.forEach(e => {
    const idx = e.pathIndex + ENEMIES[e.type].speed;
    if (idx >= PATH.length - 1) baseHp -= ENEMIES[e.type].dmg;
    else enemies.push({ ...e, pathIndex: idx });
  });

  const towers = prev.towers.map(t => ({ ...t }));
  const attacks = [];
  towers.forEach(t => {
    if (t.cooldown > 0) { t.cooldown -= 1; return; }
    const def = TOWERS[t.type];
    const inRange = enemies.filter(e => dist({ r: t.r, c: t.c }, PATH[Math.min(e.pathIndex, PATH.length - 1)]) <= def.range);
    if (inRange.length === 0) return;
    inRange.sort((a, b) => b.pathIndex - a.pathIndex);
    const targets = def.multi ? inRange.slice(0, 2) : inRange.slice(0, 1);
    const decorators = towers.filter(o => o.type === 'decorator' && (Math.abs(o.r - t.r) + Math.abs(o.c - t.c)) === 1);
    const mult = t.type === 'decorator' ? 1 : (1 + 0.4 * decorators.length);
    targets.forEach(target => {
      const pos = PATH[Math.min(target.pathIndex, PATH.length - 1)];
      attacks.push({
        id: target.id,
        dmg: def.dmg * mult,
        type: t.type,
        fromR: t.r,
        fromC: t.c,
        toR: pos.r,
        toC: pos.c
      });
    });
    t.cooldown = def.cd;
  });

  const observerFired = attacks.some(a => a.type === 'observer');
  const dmgMap = {};
  attacks.forEach(a => {
    const d = (observerFired && a.type !== 'observer') ? a.dmg * 1.5 : a.dmg;
    dmgMap[a.id] = (dmgMap[a.id] || 0) + d;
  });

  const survivors = [];
  enemies.forEach(e => {
    const hp = e.hp - (dmgMap[e.id] || 0);
    if (hp <= 0) gold += ENEMIES[e.type].reward;
    else survivors.push({ ...e, hp });
  });
  enemies = survivors;

  let spawnQueue = [...prev.spawnQueue];
  let spawnTimer = prev.spawnTimer - 1;
  let nextId = prev.nextId;
  if (spawnTimer <= 0 && spawnQueue.length > 0) {
    const type = spawnQueue.shift();
    enemies = [...enemies, { id: nextId++, type, pathIndex: 0, hp: ENEMIES[type].hp }];
    spawnTimer = 4;
  }

  let status = prev.status;
  if (spawnQueue.length === 0 && enemies.length === 0) {
    status = 'quiz';
  }
  if (baseHp <= 0) { baseHp = 0; status = 'lost'; }

  return { ...prev, enemies, towers, gold, baseHp, spawnQueue, spawnTimer, nextId, status, attacks };
}

export default function DesignPatternTD() {
  const [g, setG] = useState(initState);
  const { setLevel } = useGameStore();

  const startWave = useCallback((idx) => {
    setG(prev => ({ ...prev, wave: idx + 1, spawnQueue: [...WAVES[idx]], spawnTimer: 0, status: 'playing' }));
  }, []);

  useEffect(() => {
    if (g.status !== 'playing') return;
    const id = setInterval(() => setG(tick), 450);
    return () => clearInterval(id);
  }, [g.status]);

  useEffect(() => {
    if (!g.message) return;
    const t = setTimeout(() => setG(prev => ({ ...prev, message: null })), 2200);
    return () => clearTimeout(t);
  }, [g.message]);

  function placeTower(r, c) {
    if (g.status === 'ready') {
      setG(prev => ({ ...prev, message: '先点下面的"开始防守"启动游戏' }));
      return;
    }
    if (g.status !== 'playing') return;
    if (!g.selected) {
      setG(prev => ({ ...prev, message: '先在下面选一座塔，再点格子放置' }));
      return;
    }
    const key = `${r},${c}`;
    if (PATH_INDEX.has(key)) {
      setG(prev => ({ ...prev, message: '这一格是 Bug 的行进路径，塔要建在路径旁边发光的空地上' }));
      return;
    }
    if (g.towers.some(t => t.r === r && t.c === c)) {
      setG(prev => ({ ...prev, message: '这一格已经有塔了' }));
      return;
    }
    const def = TOWERS[g.selected];
    if (g.gold < def.cost) {
      setG(prev => ({ ...prev, message: '金币不够了，先攒点再建' }));
      return;
    }
    if (def.unique && g.towers.some(t => t.type === g.selected)) {
      setG(prev => ({ ...prev, message: '单例塔全场只能建一座' }));
      return;
    }
    setG(prev => ({
      ...prev,
      towers: [...prev.towers, { id: `tw-${prev.towers.length}-${Date.now()}`, r, c, type: g.selected, cooldown: 0 }],
      gold: prev.gold - def.cost,
      selected: null,
      message: null,
    }));
  }

  function answerQuiz(i) {
    const q = QUIZ[(g.wave - 1) % QUIZ.length];
    const correct = i === q.a;
    setG(prev => ({ ...prev, flash: { correct, picked: i }, gold: prev.gold + (correct ? 30 : 0) }));
  }

  function continueAfterQuiz() {
    const idx = g.wave;
    if (idx >= WAVES.length) {
      setG(prev => ({ ...prev, flash: null, status: 'won' }));
    } else {
      setG(prev => ({ ...prev, flash: null }));
      startWave(idx);
    }
  }

  function reset() { setG(initState()); }

  const totalWaves = WAVES.length;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .dpt-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .dpt-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes dptFlow { 0%, 100% { opacity: .28; } 50% { opacity: .85; } }
        .dpt-path { animation: dptFlow 3s ease-in-out infinite; }
        .dpt-focus:focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .dpt-path { animation: none; opacity: .55; }
          .dpt-enemy { transition: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="dpt-display text-lg sm:text-xl font-bold tracking-tight text-slate-50">设计模式魔法圣殿</h1>
            <p className="text-xs text-slate-400 mt-0.5">用设计模式筑塔，挡住 Bug 入侵代码大陆</p>
          </div>
          <button
            onClick={() => setLevel('uml-temple')}
            className="hidden sm:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 transition-all shadow shrink-0"
            title="切换至包含全功能2D物理弹道与UML重构对比的Phaser版本"
          >
            <Sparkles size={12} className="text-purple-400" /> 2D UML重构版
          </button>
        </div>
        <div className="flex items-center gap-3 dpt-mono text-sm shrink-0">
          <span className="flex items-center gap-1 text-amber-300"><Coins size={15} />{g.gold}</span>
          <span className="flex items-center gap-1 text-rose-300"><Heart size={15} />{Math.max(0, Math.round(g.baseHp))}</span>
          <span className="text-slate-400">{g.wave}/{totalWaves}</span>
        </div>
      </div>

      <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(g.baseHp / g.maxBaseHp) * 100}%` }} />
      </div>

      <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800/80">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)`, aspectRatio: `${COLS}/${ROWS}` }}>
          {Array.from({ length: ROWS }).flatMap((_, r) => Array.from({ length: COLS }).map((_, c) => {
            const key = `${r},${c}`;
            const isPath = PATH_INDEX.has(key);
            const isBase = r === BASE_CELL.r && c === BASE_CELL.c;
            const isSpawn = r === SPAWN_CELL.r && c === SPAWN_CELL.c;
            const tower = g.towers.find(t => t.r === r && t.c === c);
            const canBuild = g.status === 'playing' && !!g.selected && !isPath && !tower;
            let cellClass = 'relative flex items-center justify-center border ';
            if (isPath) {
              cellClass += isBase ? 'bg-rose-950/70 border-slate-950/60' : isSpawn ? 'bg-emerald-950/60 border-slate-950/60' : 'bg-slate-800/60 border-slate-950/60';
            } else if (canBuild) {
              cellClass += 'bg-slate-800/70 border-cyan-400/70 ring-1 ring-inset ring-cyan-400/50 hover:bg-slate-700/80 cursor-pointer';
            } else {
              cellClass += 'bg-slate-900/40 border-slate-950/60';
            }
            return (
              <div
                key={key}
                onClick={() => placeTower(r, c)}
                className={`dpt-focus ${cellClass}`}
                style={isPath ? { animationDelay: `${-(PATH_INDEX.get(key) / PATH.length) * 3}s` } : undefined}
              >
                {isPath && <div className={`dpt-path absolute inset-1 rounded-sm ${isBase ? 'bg-rose-500/40' : isSpawn ? 'bg-emerald-500/40' : 'bg-cyan-400/25'}`} />}
                {isBase && !tower && <Shield size={13} className="relative text-rose-300" />}
                {tower && (() => {
                  const def = TOWERS[tower.type];
                  const TIcon = def.Icon;
                  return (
                    <div className={`relative w-2/3 h-2/3 rounded-lg flex items-center justify-center ${def.bg} shadow-lg shadow-black/40`}>
                      <TIcon size={15} className="text-slate-950" strokeWidth={2.5} />
                    </div>
                  );
                })()}
              </div>
            );
          }))}
        </div>

        {/* SVG Attack Lasers / Bullet Tracers Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
          {g.status === 'playing' && g.attacks?.map((att, idx) => {
            const x1 = ((att.fromC + 0.5) / COLS) * 100;
            const y1 = ((att.fromR + 0.5) / ROWS) * 100;
            const x2 = ((att.toC + 0.5) / COLS) * 100;
            const y2 = ((att.toR + 0.5) / ROWS) * 100;
            const strokeColor = att.type === 'singleton' ? '#facc15' : att.type === 'factory' ? '#f97316' : att.type === 'observer' ? '#22d3ee' : '#a78bfa';
            return (
              <g key={idx}>
                <line
                  x1={`${x1}%`} y1={`${y1}%`}
                  x2={`${x2}%`} y2={`${y2}%`}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  opacity="0.9"
                  className="animate-pulse"
                />
                <circle cx={`${x2}%`} cy={`${y2}%`} r="4" fill={strokeColor} className="animate-ping" />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 pointer-events-none z-10">
          {g.enemies.map(e => {
            const pos = PATH[Math.min(e.pathIndex, PATH.length - 1)];
            const def = ENEMIES[e.type];
            const left = ((pos.c + 0.5) / COLS) * 100;
            const top = ((pos.r + 0.5) / ROWS) * 100;
            const size = def.boss ? 22 : 14;
            return (
              <div key={e.id} className="dpt-enemy absolute flex flex-col items-center" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)', transition: 'left 0.42s linear, top 0.42s linear' }}>
                {def.boss ? <Skull size={size} style={{ color: def.color }} /> : <Bug size={size} style={{ color: def.color }} />}
                <div className="w-6 h-1 bg-slate-950/70 rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full" style={{ width: `${(e.hp / def.hp) * 100}%`, background: def.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs flex items-start gap-1.5 min-h-10 mb-3">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className={g.message ? 'text-amber-300' : 'text-slate-400'}>
          {g.message || (g.status === 'ready'
            ? '开始后：选一座塔 → 点击网格里发光的空地建造 → 挡住每一波 Bug'
            : g.status === 'playing'
            ? (g.selected ? TOWERS[g.selected].desc : '选一座塔，再点击网格里发光的空地放置；塔的技能就是对应设计模式的真实机制')
            : '')}
        </span>
      </div>

      {g.status === 'ready' && (
        <button onClick={() => startWave(0)} className="dpt-focus w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors">
          <Play size={18} /> 开始防守
        </button>
      )}

      {g.status === 'playing' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(TOWERS).map(([key, def]) => {
            const TIcon = def.Icon;
            const disabled = g.gold < def.cost || (def.unique && g.towers.some(t => t.type === key));
            const isSel = g.selected === key;
            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => setG(prev => ({ ...prev, selected: prev.selected === key ? null : key, message: null }))}
                className={`dpt-focus flex items-center gap-2 p-2 rounded-lg border text-left transition-colors ${isSel ? 'border-cyan-400 bg-slate-800' : 'border-slate-800 bg-slate-900/60'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-slate-600'}`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${def.bg}`}>
                  <TIcon size={16} className="text-slate-950" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-100 truncate">{def.name}{def.unique ? '·唯一' : ''}</div>
                  <div className="dpt-mono text-xs text-amber-300/90 flex items-center gap-0.5"><Coins size={10} />{def.cost}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {g.status === 'quiz' && (() => {
        const q = QUIZ[(g.wave - 1) % QUIZ.length];
        return (
          <div className="rounded-xl border border-cyan-900/60 bg-slate-900/80 p-4">
            <div className="text-xs text-cyan-300 mb-1 dpt-mono">第 {g.wave} 关清空 · 答对真题额外 +30 金币</div>
            <div className="text-sm mb-3 text-slate-100">{q.q}</div>
            {g.flash ? (
              <div>
                <div className={`text-sm mb-3 ${g.flash.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {g.flash.correct ? '✓ 回答正确！' : `✗ 回答错误，正确答案：${q.opts[q.a]}`}
                </div>
                <button onClick={continueAfterQuiz} className="dpt-focus w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors">{g.wave >= totalWaves ? '查看通关结果' : '继续下一关'}</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {q.opts.map((opt, i) => (
                  <button key={i} onClick={() => answerQuiz(i)} className="dpt-focus text-left text-sm px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 transition-colors">
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {g.status === 'won' && (
        <div className="text-center py-6">
          <div className="dpt-display text-2xl font-bold text-emerald-400 mb-1">通关！</div>
          <div className="text-sm text-slate-400 mb-4">你用 4 种设计模式扛住了全部 {totalWaves} 波 Bug 入侵</div>
          <button onClick={reset} className="dpt-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再玩一次</button>
        </div>
      )}

      {g.status === 'lost' && (
        <div className="text-center py-6">
          <div className="dpt-display text-2xl font-bold text-rose-400 mb-1">系统崩溃…</div>
          <div className="text-sm text-slate-400 mb-4">Bug 突破了防线，调整一下塔的搭配再试试</div>
          <button onClick={reset} className="dpt-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />重新开始</button>
        </div>
      )}
    </div>
  );
}
