// 关卡主题色的静态映射表。
// 注意：Tailwind JIT 只会为源码中出现过的「完整类名字符串」生成样式，
// 像 `bg-${themeColor}-600` 这种动态拼接永远不会被编译（这也是旧版
// App / TutorialModal 主题色整体失效的原因）。因此这里全部是完整字面量。

export interface LevelTheme {
  /** 代表色 hex（500 档），用于内联样式（舞台外发光、四角括号、深色底上的节点） */
  hex: string
  /** 深一档 hex（600 档），浅色皮肤上的小字/图标/圆环用它保证对比度 */
  hexStrong: string
  /** 主强调文字色，如 text-cyan-400 */
  text: string
  /** 更亮的强调文字色，如 text-cyan-300 */
  textBright: string
  /** 深一档强调文字色（浅色皮肤用），如 text-cyan-600 */
  textStrong: string
  /** 深色染色面板背景，如 bg-cyan-950/40 */
  bgDeep: string
  /** 柔和染色背景，如 bg-cyan-500/10 */
  bgSoft: string
  /** 实心按钮/芯片背景，如 bg-cyan-600 */
  bgSolid: string
  /** 实心按钮 hover 背景，如 hover:bg-cyan-500 */
  bgSolidHover: string
  /** 高亮条/指示块背景，如 bg-cyan-500 */
  bgBar: string
  /** 彩色描边，如 border-cyan-500/50 */
  border: string
  /** 弱化彩色描边，如 border-cyan-500/25 */
  borderSoft: string
  /** 小圆点指示色，如 bg-cyan-400 */
  dot: string
}

const THEMES: Record<string, LevelTheme> = {
  slate: {
    hex: '#64748b',
    hexStrong: '#475569',
    text: 'text-slate-400',
    textBright: 'text-slate-300',
    textStrong: 'text-slate-600',
    bgDeep: 'bg-slate-950/40',
    bgSoft: 'bg-slate-500/10',
    bgSolid: 'bg-slate-600',
    bgSolidHover: 'hover:bg-slate-500',
    bgBar: 'bg-slate-500',
    border: 'border-slate-500/50',
    borderSoft: 'border-slate-500/25',
    dot: 'bg-slate-400',
  },
  indigo: {
    hex: '#6366f1',
    hexStrong: '#4f46e5',
    text: 'text-indigo-400',
    textBright: 'text-indigo-300',
    textStrong: 'text-indigo-600',
    bgDeep: 'bg-indigo-950/40',
    bgSoft: 'bg-indigo-500/10',
    bgSolid: 'bg-indigo-600',
    bgSolidHover: 'hover:bg-indigo-500',
    bgBar: 'bg-indigo-500',
    border: 'border-indigo-500/50',
    borderSoft: 'border-indigo-500/25',
    dot: 'bg-indigo-400',
  },
  blue: {
    hex: '#3b82f6',
    hexStrong: '#2563eb',
    text: 'text-blue-400',
    textBright: 'text-blue-300',
    textStrong: 'text-blue-600',
    bgDeep: 'bg-blue-950/40',
    bgSoft: 'bg-blue-500/10',
    bgSolid: 'bg-blue-600',
    bgSolidHover: 'hover:bg-blue-500',
    bgBar: 'bg-blue-500',
    border: 'border-blue-500/50',
    borderSoft: 'border-blue-500/25',
    dot: 'bg-blue-400',
  },
  red: {
    hex: '#ef4444',
    hexStrong: '#dc2626',
    text: 'text-red-400',
    textBright: 'text-red-300',
    textStrong: 'text-red-600',
    bgDeep: 'bg-red-950/40',
    bgSoft: 'bg-red-500/10',
    bgSolid: 'bg-red-600',
    bgSolidHover: 'hover:bg-red-500',
    bgBar: 'bg-red-500',
    border: 'border-red-500/50',
    borderSoft: 'border-red-500/25',
    dot: 'bg-red-400',
  },
  purple: {
    hex: '#a855f7',
    hexStrong: '#9333ea',
    text: 'text-purple-400',
    textBright: 'text-purple-300',
    textStrong: 'text-purple-600',
    bgDeep: 'bg-purple-950/40',
    bgSoft: 'bg-purple-500/10',
    bgSolid: 'bg-purple-600',
    bgSolidHover: 'hover:bg-purple-500',
    bgBar: 'bg-purple-500',
    border: 'border-purple-500/50',
    borderSoft: 'border-purple-500/25',
    dot: 'bg-purple-400',
  },
  emerald: {
    hex: '#10b981',
    hexStrong: '#059669',
    text: 'text-emerald-400',
    textBright: 'text-emerald-300',
    textStrong: 'text-emerald-600',
    bgDeep: 'bg-emerald-950/40',
    bgSoft: 'bg-emerald-500/10',
    bgSolid: 'bg-emerald-600',
    bgSolidHover: 'hover:bg-emerald-500',
    bgBar: 'bg-emerald-500',
    border: 'border-emerald-500/50',
    borderSoft: 'border-emerald-500/25',
    dot: 'bg-emerald-400',
  },
  cyan: {
    hex: '#06b6d4',
    hexStrong: '#0891b2',
    text: 'text-cyan-400',
    textBright: 'text-cyan-300',
    textStrong: 'text-cyan-600',
    bgDeep: 'bg-cyan-950/40',
    bgSoft: 'bg-cyan-500/10',
    bgSolid: 'bg-cyan-600',
    bgSolidHover: 'hover:bg-cyan-500',
    bgBar: 'bg-cyan-500',
    border: 'border-cyan-500/50',
    borderSoft: 'border-cyan-500/25',
    dot: 'bg-cyan-400',
  },
  yellow: {
    hex: '#eab308',
    hexStrong: '#ca8a04',
    text: 'text-yellow-400',
    textBright: 'text-yellow-300',
    textStrong: 'text-yellow-600',
    bgDeep: 'bg-yellow-950/40',
    bgSoft: 'bg-yellow-500/10',
    bgSolid: 'bg-yellow-600',
    bgSolidHover: 'hover:bg-yellow-500',
    bgBar: 'bg-yellow-500',
    border: 'border-yellow-500/50',
    borderSoft: 'border-yellow-500/25',
    dot: 'bg-yellow-400',
  },
  orange: {
    hex: '#f97316',
    hexStrong: '#ea580c',
    text: 'text-orange-400',
    textBright: 'text-orange-300',
    textStrong: 'text-orange-600',
    bgDeep: 'bg-orange-950/40',
    bgSoft: 'bg-orange-500/10',
    bgSolid: 'bg-orange-600',
    bgSolidHover: 'hover:bg-orange-500',
    bgBar: 'bg-orange-500',
    border: 'border-orange-500/50',
    borderSoft: 'border-orange-500/25',
    dot: 'bg-orange-400',
  },
  amber: {
    hex: '#f59e0b',
    hexStrong: '#d97706',
    text: 'text-amber-400',
    textBright: 'text-amber-300',
    textStrong: 'text-amber-600',
    bgDeep: 'bg-amber-950/40',
    bgSoft: 'bg-amber-500/10',
    bgSolid: 'bg-amber-600',
    bgSolidHover: 'hover:bg-amber-500',
    bgBar: 'bg-amber-500',
    border: 'border-amber-500/50',
    borderSoft: 'border-amber-500/25',
    dot: 'bg-amber-400',
  },
  green: {
    hex: '#22c55e',
    hexStrong: '#16a34a',
    text: 'text-green-400',
    textBright: 'text-green-300',
    textStrong: 'text-green-600',
    bgDeep: 'bg-green-950/40',
    bgSoft: 'bg-green-500/10',
    bgSolid: 'bg-green-600',
    bgSolidHover: 'hover:bg-green-500',
    bgBar: 'bg-green-500',
    border: 'border-green-500/50',
    borderSoft: 'border-green-500/25',
    dot: 'bg-green-400',
  },
  pink: {
    hex: '#ec4899',
    hexStrong: '#db2777',
    text: 'text-pink-400',
    textBright: 'text-pink-300',
    textStrong: 'text-pink-600',
    bgDeep: 'bg-pink-950/40',
    bgSoft: 'bg-pink-500/10',
    bgSolid: 'bg-pink-600',
    bgSolidHover: 'hover:bg-pink-500',
    bgBar: 'bg-pink-500',
    border: 'border-pink-500/50',
    borderSoft: 'border-pink-500/25',
    dot: 'bg-pink-400',
  },
  fuchsia: {
    hex: '#d946ef',
    hexStrong: '#c026d3',
    text: 'text-fuchsia-400',
    textBright: 'text-fuchsia-300',
    textStrong: 'text-fuchsia-600',
    bgDeep: 'bg-fuchsia-950/40',
    bgSoft: 'bg-fuchsia-500/10',
    bgSolid: 'bg-fuchsia-600',
    bgSolidHover: 'hover:bg-fuchsia-500',
    bgBar: 'bg-fuchsia-500',
    border: 'border-fuchsia-500/50',
    borderSoft: 'border-fuchsia-500/25',
    dot: 'bg-fuchsia-400',
  },
  teal: {
    hex: '#14b8a6',
    hexStrong: '#0d9488',
    text: 'text-teal-400',
    textBright: 'text-teal-300',
    textStrong: 'text-teal-600',
    bgDeep: 'bg-teal-950/40',
    bgSoft: 'bg-teal-500/10',
    bgSolid: 'bg-teal-600',
    bgSolidHover: 'hover:bg-teal-500',
    bgBar: 'bg-teal-500',
    border: 'border-teal-500/50',
    borderSoft: 'border-teal-500/25',
    dot: 'bg-teal-400',
  },
  lime: {
    hex: '#84cc16',
    hexStrong: '#65a30d',
    text: 'text-lime-400',
    textBright: 'text-lime-300',
    textStrong: 'text-lime-600',
    bgDeep: 'bg-lime-950/40',
    bgSoft: 'bg-lime-500/10',
    bgSolid: 'bg-lime-600',
    bgSolidHover: 'hover:bg-lime-500',
    bgBar: 'bg-lime-500',
    border: 'border-lime-500/50',
    borderSoft: 'border-lime-500/25',
    dot: 'bg-lime-400',
  },
}

/** 按关卡 themeColor 取主题映射，未知颜色回退到 slate */
export const getLevelTheme = (themeColor?: string): LevelTheme => {
  return THEMES[themeColor ?? ''] ?? THEMES.slate
}
