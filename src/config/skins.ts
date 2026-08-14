// 皮肤注册表：新增皮肤在这里加一条即可。
// 壁纸槽皮肤（wallpaperSlot）会自动探测 public/skins/N.{jpg,png,webp,svg}，
// 无需改配置 —— 丢图进去就生效（找不到图则回退到该皮肤的渐变底色）。

export interface SkinDef {
  /** data-theme 属性值 / 存储键 */
  id: string
  /** 皮肤切换器显示名 */
  name: string
  emoji: string
  /**
   * light: 浅色底，关卡强调小字/图标用 theme.hexStrong（600 档）
   * dark : 深色底，用 theme.hex（500 档）
   */
  scheme: 'light' | 'dark'
  /** 壁纸槽编号 → public/skins/<slot>.<jpg|jpeg|png|webp|svg> */
  wallpaperSlot?: number
  /** 切换器里的辅助说明（如壁纸槽提示放图路径） */
  hint?: string
}

export const SKINS: SkinDef[] = [
  { id: 'daylight', name: '晴空白昼', emoji: '☀️', scheme: 'light' },
  { id: 'peach', name: '蜜桃少女', emoji: '🍑', scheme: 'light' },
  { id: 'neon', name: '电玩霓虹', emoji: '🎮', scheme: 'light' },
  { id: 'aurora', name: '夜空极光', emoji: '🌌', scheme: 'dark' },
  { id: 'wall-1', name: '壁纸·壹', emoji: '🖼️', scheme: 'light', wallpaperSlot: 1, hint: 'skins/1.jpg 未放图' },
  { id: 'wall-2', name: '壁纸·贰', emoji: '🌄', scheme: 'light', wallpaperSlot: 2, hint: 'skins/2.jpg 未放图' },
  { id: 'wall-3', name: '壁纸·叁', emoji: '🎆', scheme: 'light', wallpaperSlot: 3, hint: 'skins/3.jpg 未放图' },
]

export const DEFAULT_SKIN = 'daylight'

/** 壁纸槽探测顺序：用户常见格式优先，示例 svg 垫底 */
export const WALL_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'svg'] as const

export const getSkin = (id?: string | null): SkinDef =>
  SKINS.find(s => s.id === id) ?? SKINS.find(s => s.id === DEFAULT_SKIN)!
