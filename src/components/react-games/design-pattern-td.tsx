import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Factory, Eye, Layers, Bug, Skull, Coins, Heart, Play, RotateCcw, Info, Sparkles, Zap, GitBranch, Link2, FileCode2, AlertOctagon, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { SYSTEM_SCENARIOS } from '../../config/umlTempleScenarios';
import { CodeDiffDrawer } from '../CodeDiffDrawer';
import { UMLBlueprintPanel } from '../UMLBlueprintPanel';
import { soundManager } from '../../utils/audio';

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
  singleton: { name: '单例塔', Icon: Shield, cost: 120, dmg: 32, range: 2.3, cd: 1, unique: true, bg: 'bg-amber-400', stroke: '#facc15', desc: '全局唯一，同一时刻只能存在一座——单体极高伤害，专克强敌。' },
  factory:   { name: '工厂塔', Icon: Factory, cost: 60, dmg: 14, range: 2.0, cd: 1, multi: true, bg: 'bg-orange-500', stroke: '#f97316', desc: '一次生产、批量打击，可同时命中场上 2 个目标。' },
  observer:  { name: '观察者塔', Icon: Eye, cost: 50, dmg: 7, range: 2.3, cd: 1, buff: true, bg: 'bg-cyan-400', stroke: '#22d3ee', desc: '每次攻击都会"通知"全场其他塔，使它们本回合伤害 +50%。' },
  decorator: { name: '装饰器塔', Icon: Layers, cost: 40, dmg: 5, range: 1.5, cd: 1, decorate: true, bg: 'bg-violet-400', stroke: '#a78bfa', desc: '给上下左右相邻的塔叠加 +40% 伤害，可与多个装饰器叠加。' },
  adapter:   { name: '适配器塔', Icon: Zap, cost: 45, dmg: 16, range: 1.8, cd: 1, slow: true, bg: 'bg-emerald-400', stroke: '#34d399', desc: '兼容第三方老旧接口，使范围内的 Bug 减速 50%。' },
  strategy:  { name: '策略塔', Icon: GitBranch, cost: 70, dmg: 22, range: 3.0, cd: 1, pierce: true, bg: 'bg-pink-400', stroke: '#f472b6', desc: '算法无缝切换，横扫超远距离穿透打击。' },
  chain:     { name: '责任链塔', Icon: Link2, cost: 55, dmg: 18, range: 2.0, cd: 1, chain: true, bg: 'bg-indigo-400', stroke: '#818cf8', desc: '多级责任传递，闪电链在多个 Bug 间连续弹射。' },
};

const ENEMIES = {
  nullptr:  { name: '空指针虫', hp: 25, speed: 1, reward: 6, dmg: 5, color: '#fb7185' },
  leak:     { name: '内存泄漏怪', hp: 75, speed: 1, reward: 14, dmg: 10, color: '#65a30d' },
  deadlock: { name: '死锁毒虫', hp: 20, speed: 2, reward: 9, dmg: 8, color: '#facc15' },
  overflow: { name: '边界溢出兽', hp: 260, speed: 1, reward: 70, dmg: 30, color: '#dc2626', boss: true },
};

const WAVES = [
  Array(6).fill('nullptr'),
  [...Array(8).fill('nullptr'), ...Array(3).fill('deadlock')],
  [...Array(5).fill('leak'), ...Array(5).fill('deadlock')],
  [...Array(8).fill('nullptr'), ...Array(5).fill('leak'), ...Array(4).fill('deadlock')],
  [...Array(6).fill('leak'), ...Array(6).fill('deadlock')],
  [...Array(10).fill('nullptr'), ...Array(6).fill('leak'), ...Array(6).fill('deadlock')],
  ['overflow', ...Array(6).fill('deadlock'), ...Array(4).fill('leak')],
];

const QUIZ = [
  { q: '哪个模式的核心意图是"确保一个类只有一个实例，并提供全局访问点"？', opts: ['工厂模式', '单例模式', '观察者模式', '装饰器模式'], a: 1 },
  { q: '对象状态改变时自动通知并更新所有依赖对象，最符合下列哪种模式？', opts: ['单例模式', '策略模式', '观察者模式', '工厂模式'], a: 2 },
  { q: '不修改原有类结构、动态给对象添加职责，应使用？', opts: ['装饰器模式', '单例模式', '适配器模式', '观察者模式'], a: 0 },
  { q: '工厂模式的主要目的是？', opts: ['保证唯一实例', '封装创建过程，使创建与使用分离', '动态添加职责', '定义可互换的算法族'], a: 1 },
  { q: '将一个类的接口转换成客户希望的另一个接口，使原本不兼容的类可以一起工作，属于？', opts: ['适配器模式', '策略模式', '责任链模式', '装饰器模式'], a: 0 },
  { q: '使多个对象都有机会处理请求，将这些对象连成一条链，属于？', opts: ['责任链模式', '代理模式', '单例模式', '建造者模式'], a: 0 },
  { q: '定义一系列算法，把它们一个个封装起来，并且使它们可相互替换，属于？', opts: ['策略模式', '状态模式', '外观模式', '模板方法'], a: 0 },
];

const dist = (a, b) => Math.hypot(a.r - b.r, a.c - b.c);

function getPathPos(idx: number) {
  if (typeof idx !== 'number' || isNaN(idx)) return PATH[0];
  const safeIdx = Math.max(0, Math.min(Math.floor(idx), PATH.length - 1));
  return PATH[safeIdx] || PATH[0];
}

function initState() {
  return {
    towers: [], enemies: [], gold: 200, baseHp: 100, maxBaseHp: 100,
    wave: 0, status: 'ready', spawnQueue: [], spawnTimer: 0, nextId: 1,
    selected: null, flash: null, message: null, attacks: [], damagePopups: [],
  };
}

function tick(prev) {
  if (!prev || prev.status !== 'playing') return prev;
  try {
    let baseHp = prev.baseHp;
    let gold = prev.gold;
    let enemies = [];
    (prev.enemies || []).forEach(e => {
      if (!e) return;
      const speed = (ENEMIES[e.type] || ENEMIES.nullptr).speed;
      const idx = e.pathIndex + (e.slowed ? Math.max(0.5, speed / 2) : speed);
      if (idx >= PATH.length - 1) {
        baseHp -= (ENEMIES[e.type] || ENEMIES.nullptr).dmg;
      } else {
        enemies.push({ ...e, pathIndex: idx, slowed: false });
      }
    });

    const towers = (prev.towers || []).map(t => ({ ...t }));
    const attacks = [];
    towers.forEach(t => {
      if (!t) return;
      if (t.cooldown > 0) { t.cooldown = Math.max(0, t.cooldown - 1); return; }
      const def = TOWERS[t.type] || TOWERS.singleton;
      const inRange = enemies.filter(e => dist({ r: t.r, c: t.c }, getPathPos(e.pathIndex)) <= def.range);
      if (inRange.length === 0) return;
      inRange.sort((a, b) => b.pathIndex - a.pathIndex);
      const targets = def.multi ? inRange.slice(0, 2) : inRange.slice(0, 1);
      
      if (def.slow) {
         enemies.forEach(e => {
           if (dist({ r: t.r, c: t.c }, getPathPos(e.pathIndex)) <= def.range) e.slowed = true;
         });
      }

      const decorators = towers.filter(o => o.type === 'decorator' && (Math.abs(o.r - t.r) + Math.abs(o.c - t.c)) === 1);
      const mult = t.type === 'decorator' ? 1 : (1 + 0.4 * decorators.length);
      targets.forEach(target => {
        const pos = getPathPos(target.pathIndex);
        attacks.push({
          id: target.id,
          dmg: Math.round(def.dmg * mult),
          type: t.type,
          fromR: t.r,
          fromC: t.c,
          toR: pos.r,
          toC: pos.c
        });
      });
      t.cooldown = def.cd;
    });

    if (attacks.length > 0) {
      soundManager.playLaser(attacks[0].type === 'singleton' ? 'heavy' : 'laser');
    }

    const observerFired = attacks.some(a => a.type === 'observer');
    const dmgMap = {};
    const damagePopups = [];
    attacks.forEach(a => {
      const d = Math.round((observerFired && a.type !== 'observer') ? a.dmg * 1.5 : a.dmg);
      dmgMap[a.id] = (dmgMap[a.id] || 0) + d;
      damagePopups.push({
        id: `dmg-${a.id}-${Date.now()}-${Math.random()}`,
        text: `-${d}`,
        r: a.toR,
        c: a.toC,
        color: TOWERS[a.type]?.stroke || '#facc15'
      });
    });

    const survivors = [];
    enemies.forEach(e => {
      const hp = e.hp - (dmgMap[e.id] || 0);
      if (hp <= 0) {
        gold += (ENEMIES[e.type] || ENEMIES.nullptr).reward;
        soundManager.playHit();
      } else {
        survivors.push({ ...e, hp });
      }
    });
    enemies = survivors;

    let spawnQueue = [...(prev.spawnQueue || [])];
    let spawnTimer = prev.spawnTimer - 1;
    let nextId = prev.nextId;
    if (spawnTimer <= 0 && spawnQueue.length > 0) {
      const type = spawnQueue.shift();
      enemies = [...enemies, { id: nextId++, type, pathIndex: 0, hp: (ENEMIES[type] || ENEMIES.nullptr).hp }];
      spawnTimer = 4;
    }

    let status = prev.status;
    if (spawnQueue.length === 0 && enemies.length === 0) {
      status = 'quiz';
      soundManager.playWaveSuccess();
    }
    if (baseHp <= 0) {
      baseHp = 0;
      status = 'lost';
      soundManager.playGameOver();
    }

    return { ...prev, enemies, towers, gold, baseHp, spawnQueue, spawnTimer, nextId, status, attacks, damagePopups };
  } catch (err) {
    console.error("DesignPatternTD tick error caught:", err);
    return prev;
  }
}

function DesignPatternTD() {
  const [g, setG] = useState(initState);
  const [isCodeDiffOpen, setIsCodeDiffOpen] = useState(false);
  const [showUMLBlueprint, setShowUMLBlueprint] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const { setLevel } = useGameStore();

  const currentScenario = SYSTEM_SCENARIOS[Math.min(g.wave > 0 ? g.wave - 1 : 0, SYSTEM_SCENARIOS.length - 1)];

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const startWave = useCallback((idx) => {
    soundManager.playBuild();
    setG(prev => ({ ...prev, wave: idx + 1, spawnQueue: [...WAVES[idx]], spawnTimer: 0, status: 'playing' }));
  }, []);

  useEffect(() => {
    if (g.status !== 'playing') return;
    const id = setInterval(() => setG(tick), 450);
    return () => clearInterval(id);
  }, [g.status]);

  function placeTower(r, c) {
    if (g.status !== 'playing' || !g.selected) return;
    const key = `${r},${c}`;
    if (PATH_INDEX.has(key) || g.towers.some(t => t.r === r && t.c === c)) return;
    const def = TOWERS[g.selected];
    if (g.gold < def.cost || (def.unique && g.towers.some(t => t.type === g.selected))) return;
    soundManager.playBuild();
    setG(prev => ({
      ...prev,
      towers: [...prev.towers, { id: `tw-${prev.towers.length}-${Date.now()}`, r, c, type: g.selected, cooldown: 0 }],
      gold: prev.gold - def.cost,
      selected: null
    }));
  }

  function answerQuiz(i) {
    const q = QUIZ[(g.wave - 1) % QUIZ.length];
    const correct = i === q.a;
    if (correct) soundManager.playWaveSuccess();
    else soundManager.playHit();
    setG(prev => ({ ...prev, flash: { correct, picked: i }, gold: prev.gold + (correct ? 30 : 0) }));
  }

  function continueAfterQuiz() {
    const idx = g.wave;
    if (idx >= WAVES.length) {
      soundManager.playVictory();
      setG(prev => ({ ...prev, flash: null, status: 'won' }));
    } else {
      setG(prev => ({ ...prev, flash: null }));
      startWave(idx);
    }
  }

  function reset() { setG(initState()); }

  const totalWaves = WAVES.length;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-3 sm:p-6 font-mono relative" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .dpt-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .dpt-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes dptFlow { 0%, 100% { opacity: .28; } 50% { opacity: .85; } }
        .dpt-path { animation: dptFlow 3s ease-in-out infinite; }
        .dpt-focus:focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }
        @keyframes dptFloatUp { 0% { opacity: 1; transform: translate(-50%, 0) scale(1); } 100% { opacity: 0; transform: translate(-50%, -24px) scale(1.2); } }
        .dpt-dmg-popup { animation: dptFloatUp 0.6s ease-out forwards; }
        @keyframes bulletTravel { 0% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
        .dpt-bullet-line { animation: bulletTravel 0.3s linear infinite; }
      `}</style>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="dpt-display text-lg sm:text-xl font-bold tracking-tight text-slate-50">GoF 设计模式魔法圣殿</h1>
            <p className="text-xs text-slate-400 mt-0.5">部署 7 种 GoF 设计模式防御塔，防御 Bug 危机</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={toggleSound}
            title={isMuted ? "开启音效" : "静音"}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button onClick={() => setIsCodeDiffOpen(true)} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-500/60 text-purple-200 transition-all shadow">
            <FileCode2 size={14} className="text-purple-400" /> 代码重构对比
          </button>
          
          <button onClick={() => setShowUMLBlueprint(!showUMLBlueprint)} className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 transition-all shadow">
            <GitBranch size={14} className="text-cyan-400" /> UML 蓝图
          </button>

          <div className="flex items-center gap-2.5 dpt-mono text-xs sm:text-sm shrink-0 bg-slate-900/80 p-1.5 px-3 rounded-lg border border-slate-800">
            <span className="flex items-center gap-1 text-amber-300"><Coins size={14} />{g.gold}</span>
            <span className="flex items-center gap-1 text-rose-300"><Heart size={14} />{Math.max(0, Math.round(g.baseHp))}</span>
            <span className="text-slate-400">{g.wave}/{totalWaves}</span>
          </div>
        </div>
      </div>

      {currentScenario && (
        <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-red-500/40 shadow-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertOctagon size={16} className="text-rose-400 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-rose-400 font-mono">CRISIS #{currentScenario.wave}</span>
                <span className="text-xs font-bold text-slate-100 truncate">{currentScenario.title}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">{currentScenario.subTitle}</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
            目标: {currentScenario.patternName}
          </span>
        </div>
      )}

      {showUMLBlueprint && (
        <div className="mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <UMLBlueprintPanel scenario={currentScenario} isUnlocked={g.wave > 0} />
        </div>
      )}

      <div className="h-1.5 bg-slate-800 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(g.baseHp / g.maxBaseHp) * 100}%` }} />
      </div>

      <div className="relative mb-3 rounded-xl overflow-hidden border border-slate-800/80">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)`, aspectRatio: `${COLS}/${ROWS}` }}>
          {Array.from({ length: ROWS }).flatMap((_, r) => Array.from({ length: COLS }).map((_, c) => {
            const key = `${r},${c}`;
            const isPath = PATH_INDEX.has(key);
            const tower = g.towers.find(t => t.r === r && t.c === c);
            const canBuild = g.status === 'playing' && !!g.selected && !isPath && !tower;
            const isDecorated = tower && tower.type !== 'decorator' && g.towers.some(o => o.type === 'decorator' && (Math.abs(o.r - r) + Math.abs(o.c - c)) === 1);
            return (
              <div key={key} onClick={() => placeTower(r, c)} className={`relative flex items-center justify-center border ${isPath ? 'bg-slate-800/60 border-slate-950/60' : canBuild ? 'bg-slate-800/70 border-cyan-400/70 cursor-pointer' : 'bg-slate-900/40 border-slate-950/60'}`}>
                {tower && (() => {
                  const TIcon = TOWERS[tower.type].Icon;
                  return (
                    <div className={`relative w-2/3 h-2/3 rounded-lg flex items-center justify-center ${TOWERS[tower.type].bg} shadow-lg shadow-black/40 ${isDecorated ? 'ring-2 ring-purple-400 animate-pulse' : ''}`}>
                      <TIcon size={14} className="text-slate-950" strokeWidth={2.5} />
                    </div>
                  );
                })()}
              </div>
            );
          }))}
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
          {g.status === 'playing' && g.attacks?.map((att, idx) => {
            const x1 = ((att.fromC + 0.5) / COLS) * 100;
            const y1 = ((att.fromR + 0.5) / ROWS) * 100;
            const x2 = ((att.toC + 0.5) / COLS) * 100;
            const y2 = ((att.toR + 0.5) / ROWS) * 100;
            const strokeColor = TOWERS[att.type]?.stroke || '#facc15';
            return (
              <g key={idx}>
                <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={strokeColor} strokeWidth="3" strokeDasharray="6 3" opacity="0.9" className="dpt-bullet-line" />
                <circle cx={`${x1 + (x2 - x1) * 0.7}%`} cy={`${y1 + (y2 - y1) * 0.7}%`} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2" className="shadow-lg" />
                <circle cx={`${x2}%`} cy={`${y2}%`} r="6" fill={strokeColor} opacity="0.8" className="animate-ping" />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 pointer-events-none z-10">
          {g.enemies.map(e => {
            const pos = PATH[Math.min(Math.floor(e.pathIndex), PATH.length - 1)];
            const def = ENEMIES[e.type];
            const left = ((pos.c + 0.5) / COLS) * 100;
            const top = ((pos.r + 0.5) / ROWS) * 100;
            const size = def.boss ? 22 : 14;
            return (
              <div key={e.id} className="dpt-enemy absolute flex flex-col items-center" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)', transition: 'left 0.42s linear, top 0.42s linear' }}>
                {e.slowed && <div className="absolute -top-4 px-1 py-0.2 bg-cyan-950/90 border border-cyan-400/80 rounded text-[9px] text-cyan-300 font-bold animate-pulse whitespace-nowrap z-20">❄️ 减速 -50%</div>}
                {def.boss ? <Skull size={size} style={{ color: def.color }} /> : <Bug size={size} style={{ color: def.color }} />}
                <div className="w-8 h-1.5 bg-slate-950/80 rounded-full mt-0.5 overflow-hidden border border-slate-800 relative flex items-center justify-center">
                  <div className="h-full absolute left-0 top-0 transition-all duration-300" style={{ width: `${(e.hp / def.hp) * 100}%`, background: def.color }} />
                </div>
                <div className="text-[8px] font-bold font-mono text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-0.5">{Math.round(e.hp)}/{def.hp}</div>
              </div>
            );
          })}
          {g.status === 'playing' && g.damagePopups?.map(pop => (
            <div key={pop.id} className="dpt-dmg-popup absolute font-bold text-xs sm:text-sm font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-30" style={{ left: `${((pop.c + 0.5) / COLS) * 100}%`, top: `${((pop.r + 0.5) / ROWS) * 100}%`, color: pop.color }}>{pop.text}</div>
          ))}
        </div>
      </div>

      <div className="text-xs flex items-start gap-1.5 min-h-8 mb-3">
        <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
        <span className={g.message ? 'text-amber-300' : 'text-slate-400'}>
          {g.message || (g.status === 'ready'
            ? '开始后：选择底部的 GoF 设计模式防御塔 → 点击网格里发光的空地建造'
            : g.status === 'playing'
            ? (g.selected ? TOWERS[g.selected].desc : '选一座塔放置在发光空地；每种塔的能力映射 GoF 设计模式的真实核心语义')
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
      {/* Code Refactoring Comparison Drawer */}
      <CodeDiffDrawer
        scenario={currentScenario}
        isOpen={isCodeDiffOpen}
        onClose={() => setIsCodeDiffOpen(false)}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("DesignPatternTD Render Error Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 border border-rose-500/50 text-center font-mono my-4">
          <AlertOctagon size={40} className="mx-auto text-rose-400 mb-2 animate-pulse" />
          <h2 className="text-lg font-bold text-rose-300 mb-1">系统已从运行异常中自动恢复</h2>
          <p className="text-xs text-slate-400 mb-4">防守已被安全重置，您可以重新启动关卡。</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            重启防守关卡
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function DesignPatternTDWithBoundary() {
  return (
    <ErrorBoundary>
      <DesignPatternTD />
    </ErrorBoundary>
  );
}
