import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LEVELS, GameLevel } from '../config/levels';
import { useGameStore } from '../store/useGameStore';
import { getLevelTheme, LevelTheme } from '../config/theme';
import { SKINS, getSkin, WALL_EXTS } from '../config/skins';
import { PremiumUnlockModal } from './PremiumUnlockModal';
import { MapPin, CheckCircle2, Play, Compass, Database, Cpu, HardDrive, Network, Layers, Shield, FileCode, Check, Lock, X, ChevronDown, BookOpenCheck } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  '计算机组成原理': <Cpu size={24} />,
  '操作系统': <HardDrive size={24} />,
  '计算机网络': <Network size={24} />,
  '数据库': <Database size={24} />,
  '数据结构与算法': <Layers size={24} />,
  '设计模式': <FileCode size={24} />,
  '信息安全': <Shield size={24} />,
  '系统架构': <MapPin size={24} />,
  '软件工程': <Compass size={24} />,
  '自考公共课': <BookOpenCheck size={24} />
};

/**
 * 科目分区主色（静态颜色名 → getLevelTheme 静态映射）。
 * 注意：不要做 `bg-${color}-500/10` 之类的动态拼接，
 * Tailwind JIT 只编译源码里出现过的完整字面量类名。
 */
const CATEGORY_ACCENTS: Record<string, string> = {
  '计算机组成原理': 'indigo',
  '操作系统': 'emerald',
  '计算机网络': 'cyan',
  '数据库': 'purple',
  '数据结构与算法': 'fuchsia',
  '设计模式': 'green',
  '信息安全': 'red',
  '系统架构': 'amber',
  '软件工程': 'pink',
  '自考公共课': 'amber'
};

/** 冒险者段位：按总完成度晋升（min 为百分比阈值） */
const RANKS = [
  { min: 0, name: '见习码农', emoji: '🌱' },
  { min: 10, name: '代码学徒', emoji: '📘' },
  { min: 25, name: '算法骑士', emoji: '⚔️' },
  { min: 50, name: '架构法师', emoji: '🔮' },
  { min: 75, name: '大陆征服者', emoji: '👑' },
  { min: 100, name: '源码之神', emoji: '✨' },
] as const;

/** 技能链节点单元格尺寸（定死 → 位置可纯算出来，不用测量每个节点） */
const CELL_W = 112;
const CELL_H = 108;
/** 节点圆心相对所在行的纵向偏移（= 圆形节点 44px 的一半，保证连线正好穿过圆心） */
const NODE_CY = 22;

/** 蜜桃少女皮肤的樱瓣 */
const PETALS = [
  { ch: '🌸', left: '4%',  dur: '11s', delay: '0s',    size: '17px' },
  { ch: '💮', left: '16%', dur: '14s', delay: '-4s',   size: '14px' },
  { ch: '🌸', left: '28%', dur: '12s', delay: '-8s',   size: '19px' },
  { ch: '✿', left: '45%', dur: '15s', delay: '-2s',   size: '15px' },
  { ch: '🌸', left: '58%', dur: '10s', delay: '-6s',   size: '14px' },
  { ch: '💮', left: '70%', dur: '13s', delay: '-9s',   size: '18px' },
  { ch: '🌸', left: '82%', dur: '12s', delay: '-3s',   size: '16px' },
  { ch: '✿', left: '93%', dur: '14s', delay: '-11s',  size: '13px' },
];

/** 电玩霓虹皮肤的闪烁星 */
const STARS = [
  { ch: '✦', left: '7%',  top: '18%', delay: '0s',    color: '#a855f7', size: '18px' },
  { ch: '✧', left: '18%', top: '64%', delay: '-1.2s', color: '#ec4899', size: '14px' },
  { ch: '✦', left: '33%', top: '36%', delay: '-0.6s', color: '#22d3ee', size: '16px' },
  { ch: '✦', left: '52%', top: '78%', delay: '-2s',   color: '#a855f7', size: '13px' },
  { ch: '✧', left: '66%', top: '14%', delay: '-1.6s', color: '#22d3ee', size: '17px' },
  { ch: '✦', left: '79%', top: '52%', delay: '-0.9s', color: '#ec4899', size: '15px' },
  { ch: '✧', left: '90%', top: '30%', delay: '-2.4s', color: '#a855f7', size: '14px' },
];

/** 测量某个 div 的内容宽度（初次同步测量避免首帧闪烁，ResizeObserver 接管后续变化） */
function useElementWidth() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/** 壁纸槽探测：按设备区分候选顺序。
 *  手机/窄屏：N-m.{jpg,...}（竖构图优先）→ N.{...}
 *  桌面宽屏：N.{...} → N-m.{...}（没放横图就退竖图） */
function useWallpaperUrls() {
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    const preferMobile = window.matchMedia('(max-width: 640px)').matches;
    SKINS.forEach(skin => {
      if (!skin.wallpaperSlot) return;
      const slot = skin.wallpaperSlot;
      const candidates = WALL_EXTS.flatMap(ext => {
        const mobile = `/skins/${slot}-m.${ext}`;
        const base = `/skins/${slot}.${ext}`;
        return preferMobile ? [mobile, base] : [base, mobile];
      });
      (async () => {
        for (const url of candidates) {
          const ok = await new Promise<boolean>(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
          });
          if (cancelled || !ok) continue;
          setUrls(prev => (prev[skin.id] ? prev : { ...prev, [skin.id]: url }));
          break;
        }
      })();
    });
    return () => { cancelled = true; };
  }, []);
  return urls;
}

interface NodePos { x: number; y: number }

/** 蛇形排布：偶数行从左到右，奇数行从右到左，保证路径首尾相连 */
function computePositions(count: number, cols: number): NodePos[] {
  const res: NodePos[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const colInRow = i % cols;
    const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
    res.push({ x: col * CELL_W + CELL_W / 2, y: row * CELL_H + NODE_CY });
  }
  return res;
}

export function WorldMap() {
  const { setLevel, completedLevels, completeLevel, isPremiumUnlocked, skin, setSkin } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [skinMenuOpen, setSkinMenuOpen] = useState(false);

  const skinDef = getSkin(skin);
  const isLight = skinDef.scheme === 'light';
  /** 浅色皮肤用 600 档深一档的强调色保证对比度 */
  const accHex = (t: LevelTheme) => (isLight ? t.hexStrong : t.hex);
  const accText = (t: LevelTheme) => (isLight ? t.textStrong : t.text);

  const wallpaperUrls = useWallpaperUrls();
  const activeWallpaper = wallpaperUrls[skinDef.id];

  const groups = useMemo(() => {
    const res: Array<{ category: string; levels: GameLevel[] }> = [];
    LEVELS.forEach(level => {
      const group = res.find(g => g.category === level.category);
      if (group) group.levels.push(level);
      else res.push({ category: level.category, levels: [level] });
    });
    return res;
  }, []);

  // 各分区内部宽度一致（面板等宽），用第一块面板内的量尺测一次即可
  const { ref: sizerRef, width: zoneWidth } = useElementWidth();
  const cols = Math.max(2, Math.floor(zoneWidth / CELL_W) || 2);

  /** 当前待挑战节点：按关卡顺序第一个「未完成且可玩」的关卡 */
  const nextLevelId = useMemo(() => {
    const next = LEVELS.find(l => !completedLevels.includes(l.id) && (!l.isPremium || isPremiumUnlocked));
    return next?.id;
  }, [completedLevels, isPremiumUnlocked]);

  const totalCompleted = completedLevels.length;
  const progressPercent = Math.round((totalCompleted / LEVELS.length) * 100);

  /** 详情抽屉里的关卡及其坐标（科目内序号） */
  const selectedInfo = useMemo(() => {
    if (!selectedId) return null;
    for (const group of groups) {
      const idx = group.levels.findIndex(l => l.id === selectedId);
      if (idx >= 0) return { level: group.levels[idx], category: group.category, idx };
    }
    return null;
  }, [selectedId, groups]);

  const handleNodeClick = (level: GameLevel) => {
    if (level.isPremium && !isPremiumUnlocked) {
      setIsModalOpen(true);
    } else {
      setSelectedId(level.id);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col t-page overflow-hidden">
      {/* 风景层：皮肤背景图组；壁纸皮肤有图时用图片覆盖（定位偏上 1/3，竖构图人像壁纸能保住面部） */}
      <div
        className="absolute inset-0 t-scenery pointer-events-none"
        style={activeWallpaper ? { backgroundImage: `url(${activeWallpaper})`, backgroundPosition: 'center 32%' } : undefined}
      ></div>
      {activeWallpaper && <div className="absolute inset-0 t-wall-overlay pointer-events-none"></div>}
      <div className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none"></div>

      {/* 装饰粒子层 */}
      {skinDef.id === 'peach' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PETALS.map((p, i) => (
            <span key={i} className="deco-petal" style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay, fontSize: p.size }}>{p.ch}</span>
          ))}
        </div>
      )}
      {skinDef.id === 'neon' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {STARS.map((s, i) => (
            <span key={i} className="deco-star" style={{ left: s.left, top: s.top, animationDelay: s.delay, color: s.color, fontSize: s.size }}>{s.ch}</span>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b t-header backdrop-blur-xl shadow-2xl gap-4">
        <div className="flex items-center gap-3.5">
          {/* 自制群岛星轨徽标（渐变随皮肤三色） */}
          <svg
            viewBox="0 0 48 48"
            className="w-11 h-11 rounded-[13px] flex-shrink-0"
            style={{ filter: 'drop-shadow(0 6px 16px color-mix(in srgb, var(--t-b2) 45%, transparent))' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wm-logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0" style={{ stopColor: 'var(--t-b1)' }} />
                <stop offset="0.55" style={{ stopColor: 'var(--t-b2)' }} />
                <stop offset="1" style={{ stopColor: 'var(--t-b3)' }} />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#wm-logo-grad)" />
            <circle cx="24" cy="24" r="16.5" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" strokeDasharray="3 4" />
            <ellipse cx="17" cy="29.5" rx="6.5" ry="4" fill="rgba(255,255,255,0.92)" />
            <ellipse cx="30.5" cy="25.5" rx="8" ry="5" fill="rgba(255,255,255,0.75)" />
            <ellipse cx="25" cy="34.5" rx="4.5" ry="2.8" fill="rgba(255,255,255,0.6)" />
            <path d="M29.5 13.5 L35.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            <path d="M35.5 9 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1 Z" fill="white" />
          </svg>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] t-text-3 select-none">
              Code Continent
            </div>
            <h1 className="text-[26px] leading-8 font-black t-brand flex items-baseline select-none">
              代码大陆
              <span className="caret-blink ml-1 text-lg leading-none" style={{ color: 'var(--t-b2)' }}>▌</span>
            </h1>
            <p className="t-text-3 text-xs tracking-widest mt-0.5">软考核心考点知识图谱</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* 皮肤切换器 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSkinMenuOpen(v => !v)}
              className="t-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-colors"
            >
              <span>{skinDef.emoji}</span>
              <span className="font-bold">{skinDef.name}</span>
              <ChevronDown size={12} className={`transition-transform ${skinMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {skinMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSkinMenuOpen(false)}></div>
                <div className="panel-in absolute left-0 right-auto sm:left-auto sm:right-0 top-full mt-2 z-50 w-56 t-panel border rounded-xl shadow-xl p-1.5 backdrop-blur-xl">
                  {SKINS.map(s => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => { setSkin(s.id); setSkinMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        s.id === skinDef.id
                          ? 'bg-[var(--t-chip-bg)] t-text-1 font-bold'
                          : 't-text-2 hover:bg-[var(--t-chip-bg)]'
                      }`}
                    >
                      <span className="text-base leading-none">{s.emoji}</span>
                      <span className="flex-1">
                        {s.name}
                        {s.hint && !wallpaperUrls[s.id] && (
                          <span className="block text-[10px] font-normal t-text-4">{s.hint}</span>
                        )}
                      </span>
                      {s.id === skinDef.id && <Check size={14} className="t-text-3" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* 冒险者段位 */}
            {(() => {
              const rankIdx = RANKS.reduce((acc, r, i) => (progressPercent >= r.min ? i : acc), 0);
              const rank = RANKS[rankIdx];
              return (
                <div className="t-chip border rounded-full px-3 py-1 flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-sm leading-none">{rank.emoji}</span>
                  <span className="t-text-1 font-bold tracking-wide">{rank.name}</span>
                  <span className="t-text-3 tracking-widest">LV.{rankIdx}</span>
                </div>
              );
            })()}

            {/* 九科目分段进度：世界地图的缩微模型 */}
            <div className="flex items-center gap-3">
              <div className="flex w-48 sm:w-56 h-2 rounded-full overflow-hidden gap-[2px]">
                {groups.map(g => {
                  const accentSeg = getLevelTheme(CATEGORY_ACCENTS[g.category] ?? 'slate');
                  const done = g.levels.filter(l => completedLevels.includes(l.id)).length;
                  const segPct = Math.round((done / g.levels.length) * 100);
                  return (
                    <div
                      key={g.category}
                      title={`${g.category} ${done}/${g.levels.length}`}
                      className="t-track h-full rounded-sm"
                      style={{ width: `${(g.levels.length / LEVELS.length) * 100}%` }}
                    >
                      <div
                        className="h-full rounded-sm transition-all duration-700"
                        style={{ width: `${segPct}%`, background: accHex(accentSeg) }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <span className="font-mono font-bold text-lg t-text-1">{progressPercent}%</span>
            </div>
            <div className="text-[10px] t-text-3 -mt-1">{totalCompleted} / {LEVELS.length} 关卡已征服</div>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y nav-scroll p-4 sm:p-8 md:p-10" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-[1500px] mx-auto flex flex-col gap-8 pb-24">
          {groups.map((group, groupIdx) => {
            const groupCompleted = group.levels.filter(l => completedLevels.includes(l.id)).length;
            const isAllCompleted = groupCompleted === group.levels.length;
            const accent = getLevelTheme(CATEGORY_ACCENTS[group.category] ?? 'slate');
            const zonePercent = Math.round((groupCompleted / group.levels.length) * 100);
            const positions = computePositions(group.levels.length, cols);
            const rows = Math.ceil(group.levels.length / cols);

            return (
              <section
                key={group.category}
                className={`relative map-rise rounded-3xl border panel-shadow ${accent.bgSoft} ${isLight ? accent.border : accent.borderSoft} p-4 sm:p-6 md:p-7`}
                style={{ animationDelay: `${groupIdx * 100}ms` }}
              >
                {/* 量尺：测出本面板内容宽度，供所有分区统一计算列数 */}
                {groupIdx === 0 && <div ref={sizerRef} className="w-full h-0" aria-hidden="true"></div>}

                {/* Zone Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl shadow-lg border flex-shrink-0 transition-colors ${
                      isAllCompleted
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                        : `${accent.bgSoft} ${isLight ? accent.border : accent.borderSoft} ${accText(accent)}`
                    }`}
                    style={{ boxShadow: `0 0 22px -6px ${isAllCompleted ? '#f59e0b' : accHex(accent)}59` }}
                  >
                    {CATEGORY_ICONS[group.category] || <MapPin size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-2xl font-bold t-text-1 tracking-wide">{group.category}</h2>
                      {isAllCompleted && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-amber-400/40 bg-amber-400/10 text-amber-500 tracking-widest">
                          ALL CLEAR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-1 w-28 rounded-full t-track overflow-hidden">
                        <div className={`h-full rounded-full ${accent.bgBar} transition-all duration-700`} style={{ width: `${zonePercent}%` }}></div>
                      </div>
                      <span className="font-mono text-xs t-text-3">
                        <span className={groupCompleted > 0 ? `${accText(accent)} font-bold` : ""}>{groupCompleted}</span> / {group.levels.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skill Chain：蛇形路径 + 节点 */}
                <div className="relative" style={{ height: rows * CELL_H }}>
                  {/* 路径连线（已通段绿色实线发光，未通段随皮肤的暗虚线） */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    width={zoneWidth}
                    height={rows * CELL_H}
                    aria-hidden="true"
                  >
                    {group.levels.slice(0, -1).map((level, i) => {
                      const from = positions[i];
                      const to = positions[i + 1];
                      const lit = completedLevels.includes(level.id);
                      return (
                        <line
                          key={level.id}
                          x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                          className={lit ? undefined : 't-line'}
                          stroke={lit ? (isLight ? '#059669' : '#10b981') : undefined}
                          strokeWidth={lit ? 3 : 2.5}
                          strokeLinecap="round"
                          strokeDasharray={lit ? undefined : '1 7'}
                          style={lit ? { filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.55))' } : undefined}
                        />
                      );
                    })}
                  </svg>

                  {/* 节点 */}
                  {group.levels.map((level, idx) => {
                    const isCompleted = completedLevels.includes(level.id);
                    const isNext = level.id === nextLevelId;
                    const isLocked = level.isPremium && !isPremiumUnlocked;
                    const theme = getLevelTheme(level.themeColor);
                    const pos = positions[idx];
                    const hex = accHex(theme);
                    // hover 卡片横向避让：靠链条左边缘右对齐、右边缘左对齐，其余居中
                    const tipPos = pos.x < 160 ? 'left-0' : pos.x > zoneWidth - 160 ? 'right-0' : 'left-1/2 -translate-x-1/2';

                    return (
                      <button
                        type="button"
                        key={level.id}
                        onClick={() => handleNodeClick(level)}
                        className="group absolute flex flex-col items-center focus:outline-none"
                        style={{ left: pos.x - CELL_W / 2, top: pos.y - NODE_CY, width: CELL_W }}
                      >
                        {/* Hover 速览卡 */}
                        <span className={`pointer-events-none absolute bottom-full mb-2 w-56 z-30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 ${tipPos}`}>
                          <span className="block t-panel border panel-shadow rounded-xl p-3 text-left backdrop-blur-xl">
                            <span className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                              <span className="font-mono text-[10px] tracking-widest t-text-4">
                                LVL {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="t-chip font-mono text-[10px] px-1.5 py-0.5 rounded border">
                                {level.engine === 'react' ? 'React' : 'Phaser'}
                              </span>
                              {isCompleted && (
                                <span className={`font-mono text-[10px] tracking-widest ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>✓ 已通关</span>
                              )}
                              {isLocked && <span className="font-mono text-[10px] tracking-widest t-text-4">🔒 高级</span>}
                              {isNext && <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: hex }}>◄ 当前</span>}
                            </span>
                            <span className="block text-sm font-bold t-text-1 leading-snug mb-1">{level.title}</span>
                            <span className="block text-xs t-text-3 leading-relaxed line-clamp-3">{level.description}</span>
                            <span className="block mt-2 font-mono text-[10px] tracking-wider" style={{ color: hex }}>
                              {isLocked ? '点击查看解锁方式 ▸' : '点击开始挑战 ▸'}
                            </span>
                          </span>
                        </span>

                        <span
                          style={{ '--node-accent': hex, ...(isLocked || isCompleted ? {} : { borderColor: `${hex}99` }) } as React.CSSProperties}
                          className={`h-11 w-11 rounded-full border-2 flex items-center justify-center backdrop-blur transition-transform duration-200 group-hover:scale-110 ${
                            isNext ? 'next-node' : ''
                          } ${
                            isCompleted
                              ? isLight
                                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 shadow-[0_0_14px_-4px_rgba(16,185,129,0.6)]'
                                : 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_14px_-4px_rgba(16,185,129,0.7)]'
                              : isLocked
                                ? 't-node-locked'
                                : 't-node'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={20} />
                          ) : isLocked ? (
                            <Lock size={15} />
                          ) : isNext ? (
                            <Play size={15} style={{ color: hex }} className="ml-0.5" />
                          ) : (
                            <span className="font-mono text-xs font-bold" style={{ color: hex }}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          )}
                        </span>
                        <span className={`mt-1.5 w-full px-1 text-center text-[11px] leading-tight line-clamp-2 transition-colors ${
                          isCompleted
                            ? 't-text-4'
                            : isLocked
                              ? 't-text-4'
                              : isNext
                                ? 't-text-1 font-bold'
                                : 't-label'
                        }`}>
                          {level.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* 关卡详情抽屉：描述/引擎等信息全部收进来 */}
      {selectedInfo && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 t-dim backdrop-blur-sm" onClick={() => setSelectedId(null)}></div>
          <aside className="drawer-in absolute right-0 top-0 h-full w-full sm:max-w-sm t-drawer border-l backdrop-blur-xl shadow-2xl flex flex-col">
            {(() => {
              const { level, category, idx } = selectedInfo;
              const theme = getLevelTheme(level.themeColor);
              const isCompleted = completedLevels.includes(level.id);
              return (
                <>
                  <div className="flex items-start justify-between p-6 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${theme.borderSoft} ${theme.bgSoft} ${accText(theme)}`}>
                        {category} · Lvl {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="t-chip font-mono text-[10px] px-2 py-1 rounded border">
                        {level.engine === 'react' ? 'React' : 'Phaser'}
                      </span>
                      {isCompleted && (
                        <span className={`font-mono text-[10px] px-2 py-1 rounded border border-emerald-400/40 bg-emerald-400/10 ${isLight ? 'text-emerald-600' : 'text-emerald-300'}`}>
                          已通关
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="t-btn w-8 h-8 rounded-lg border flex items-center justify-center transition-colors"
                      title="关闭"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto nav-scroll p-6 flex flex-col gap-5">
                    <h3 className="text-xl font-bold t-text-1 leading-snug">{level.title}</h3>
                    <p className="text-sm t-text-2 leading-relaxed">{level.description}</p>

                    {level.instructions && level.instructions.length > 0 && (
                      <div>
                        <div className="text-xs t-text-4 uppercase tracking-widest mb-2">玩法说明</div>
                        <ul className="space-y-1.5">
                          {level.instructions.map((ins, i) => (
                            <li key={i} className="text-xs t-text-3 leading-relaxed flex gap-2">
                              <span className={accText(theme)}>▸</span>
                              <span>{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-4 border-t border-[var(--t-panel-bd)] flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => { setSelectedId(null); setLevel(level.id); }}
                      className={`w-full py-3 rounded-xl ${theme.bgSolid} ${theme.bgSolidHover} text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg`}
                    >
                      <Play size={16} />
                      {isCompleted ? '再玩一次' : '开始挑战'}
                    </button>
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => completeLevel(level.id)}
                        className={`w-full py-1.5 text-xs t-text-4 flex items-center justify-center gap-1.5 transition-colors ${isLight ? 'hover:text-emerald-600' : 'hover:text-emerald-300'}`}
                        title="Mark as completed (Debug)"
                      >
                        <Check size={12} />
                        标记为已完成（Debug）
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </aside>
        </div>
      )}

      <PremiumUnlockModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
