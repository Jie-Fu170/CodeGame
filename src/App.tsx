import React, { useEffect, useRef, useState } from 'react'
import { HUD } from './components/HUD'
import { SQLConsole } from './components/SQLConsole'
import { TowerHUD } from './components/TowerHUD'
import { PipelineHUD } from './components/PipelineHUD'
import { NetworkHUD } from './components/NetworkHUD'
import { CryptoHUD } from './components/CryptoHUD'
import { TreeHUD } from './components/TreeHUD'
import { LoadBalancerHUD } from './components/LoadBalancerHUD'
import { AIMentor } from './components/AIMentor'
import { initGame, destroyGame, switchScene } from './game/main'
import { useGameStore } from './store/useGameStore'
import { LEVELS, GameLevel } from './config/levels'
import { getLevelTheme } from './config/theme'
import { VoiceGuide } from './components/VoiceGuide'
import { TutorialModal } from './components/TutorialModal'

// Import pure React games
import AlgorithmDuel from './components/react-games/algorithm-duel'
import BankersMaze from './components/react-games/bankers-maze'
import CipherWorkshop from './components/react-games/cipher-workshop'
import CriticalPathExpedition from './components/react-games/critical-path-expedition'
import DesignPatternTD from './components/react-games/design-pattern-td'
import PipelineFactory from './components/react-games/pipeline-factory'
import PseudocodeForge from './components/react-games/pseudocode-forge'
import SQLAssemblyBench from './components/react-games/sql-assembly-bench'
import SubnetTerritory from './components/react-games/subnet-territory'
import HammingAgent from './components/react-games/hamming-agent'
import CacheMaster from './components/react-games/cache-master'
import DFAMaze from './components/react-games/dfa-maze'
import UnixInode from './components/react-games/unix-inode'
import PathFinder from './components/react-games/path-finder'
import WhiteBoxExplorer from './components/react-games/white-box-explorer'
import DFDInspector from './components/react-games/dfd-inspector'
import UMLStateMachine from './components/react-games/uml-state-machine'
import DPKnapsack from './components/react-games/dp-knapsack'
import DBNormalizer from './components/react-games/db-normalizer'
import FloatOperator from './components/react-games/float-operator'
import ReliabilityArchitect from './components/react-games/reliability-architect'
import MatrixCompressor from './components/react-games/matrix-compressor'
import McCabeSurveyor from './components/react-games/mccabe-surveyor'
import IPJudge from './components/react-games/ip-judge'
import NormalizationVein from './components/react-games/normalization-vein'
import UmlDesignBench from './components/react-games/uml-design-bench'
import OSIEncapsulator from './components/react-games/osi-encapsulator'
import PVSemaphore from './components/react-games/pv-semaphore'
import RelationalAlgebra from './components/react-games/relational-algebra'
import DiskScheduler from './components/react-games/disk-scheduler'
import InfixToPostfix from './components/react-games/infix-to-postfix'
import HashTableClash from './components/react-games/hash-table-clash'
import MinSpanningTree from './components/react-games/min-spanning-tree'
import IORegisters from './components/react-games/io-registers'
import CohesionCoupling from './components/react-games/cohesion-coupling'
import SolidPrinciples from './components/react-games/solid-principles'
import ERToRelational from './components/react-games/er-to-relational'
import IPCopyrightCourt from './components/react-games/ip-copyright-court'
import PageReplacement from './components/react-games/page-replacement'
import HeapSort from './components/react-games/heap-sort'
import WhiteBoxCoverage from './components/react-games/white-box-coverage'
import DBNormalForms from './components/react-games/db-normal-forms'
import DigitalSignature from './components/react-games/digital-signature'
import CRCChecksum from './components/react-games/crc-checksum'
import RiscVsCisc from './components/react-games/risc-vs-cisc'
import BitmapDisk from './components/react-games/bitmap-disk'
import MMUTranslator from './components/react-games/mmu-translator'
import HuffmanCoder from './components/react-games/huffman-coder'
import TopologicalSort from './components/react-games/topological-sort'
import DBConcurrencyLock from './components/react-games/db-concurrency-lock'
import AgileScrumBoard from './components/react-games/agile-scrum-board'
import NetworkSecurityWall from './components/react-games/network-security-wall'
import StdComplianceCourt from './components/react-games/std-compliance-court'

const HUD_MAP: Record<string, React.FC> = {
  // Phaser HUDs
  'HUD': HUD,
  'SQLConsole': SQLConsole,
  'TowerHUD': TowerHUD,
  'PipelineHUD': PipelineHUD,
  'NetworkHUD': NetworkHUD,
  'CryptoHUD': CryptoHUD,
  'TreeHUD': TreeHUD,
  'LoadBalancerHUD': LoadBalancerHUD,

  // Pure React Games
  'AlgorithmDuel': AlgorithmDuel,
  'BankersMaze': BankersMaze,
  'CipherWorkshop': CipherWorkshop,
  'CriticalPathExpedition': CriticalPathExpedition,
  'DesignPatternTD': DesignPatternTD,
  'PipelineFactory': PipelineFactory,
  'PseudocodeForge': PseudocodeForge,
  'SQLAssemblyBench': SQLAssemblyBench,
  'SubnetTerritory': SubnetTerritory,
  'HammingAgent': HammingAgent,
  'CacheMaster': CacheMaster,
  'DFAMaze': DFAMaze,
  'UnixInode': UnixInode,
  'PathFinder': PathFinder,
  'WhiteBoxExplorer': WhiteBoxExplorer,
  'DFDInspector': DFDInspector,
  'UMLStateMachine': UMLStateMachine,
  'DPKnapsack': DPKnapsack,
  'DBNormalizer': DBNormalizer,
  'FloatOperator': FloatOperator,
  'ReliabilityArchitect': ReliabilityArchitect,
  'MatrixCompressor': MatrixCompressor,
  'McCabeSurveyor': McCabeSurveyor,
  'IPJudge': IPJudge,
  'NormalizationVein': NormalizationVein,
  'UmlDesignBench': UmlDesignBench,
  'OSIEncapsulator': OSIEncapsulator,
  'PVSemaphore': PVSemaphore,
  'RelationalAlgebra': RelationalAlgebra,
  'DiskScheduler': DiskScheduler,
  'InfixToPostfix': InfixToPostfix,
  'HashTableClash': HashTableClash,
  'MinSpanningTree': MinSpanningTree,
  'IORegisters': IORegisters,
  'CohesionCoupling': CohesionCoupling,
  'SolidPrinciples': SolidPrinciples,
  'ERToRelational': ERToRelational,
  'IPCopyrightCourt': IPCopyrightCourt,
  'PageReplacement': PageReplacement,
  'HeapSort': HeapSort,
  'WhiteBoxCoverage': WhiteBoxCoverage,
  'DBNormalForms': DBNormalForms,
  'DigitalSignature': DigitalSignature,
  'CRCChecksum': CRCChecksum,
  'RiscVsCisc': RiscVsCisc,
  'BitmapDisk': BitmapDisk,
  'MMUTranslator': MMUTranslator,
  'HuffmanCoder': HuffmanCoder,
  'TopologicalSort': TopologicalSort,
  'DBConcurrencyLock': DBConcurrencyLock,
  'AgileScrumBoard': AgileScrumBoard,
  'NetworkSecurityWall': NetworkSecurityWall,
  'StdComplianceCourt': StdComplianceCourt,
}

/** 按声明顺序对关卡做领域分组（保持 LEVELS 的原始顺序） */
const CATEGORY_GROUPS: Array<{ category: string; levels: GameLevel[] }> = (() => {
  const groups: Array<{ category: string; levels: GameLevel[] }> = []
  LEVELS.forEach(level => {
    const group = groups.find(g => g.category === level.category)
    if (group) group.levels.push(level)
    else groups.push({ category: level.category, levels: [level] })
  })
  return groups
})()

function App() {
  const gameRef = useRef<HTMLDivElement>(null)
  const { currentLevelId, setLevel } = useGameStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (gameRef.current) {
      initGame()
      switchScene(currentLevelId)
    }
    return () => {
      destroyGame()
    }
  }, [])

  // Switch scene when level changes
  useEffect(() => {
    switchScene(currentLevelId)
  }, [currentLevelId])

  // 导航面板打开时支持 Esc 关闭
  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const currentLevel = LEVELS.find(l => l.id === currentLevelId)
  const theme = getLevelTheme(currentLevel?.themeColor)
  const levelIndex = currentLevel ? LEVELS.findIndex(l => l.id === currentLevelId) + 1 : 0
  const ActiveHUD = currentLevel && HUD_MAP[currentLevel.hudComponent] ? HUD_MAP[currentLevel.hudComponent] : null
  const isReactLevel = currentLevel?.engine === 'react'

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* 环境背景：径向晕染 + 蓝图网格 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 bg-blueprint-grid"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(2,6,23,0.85)_100%)] pointer-events-none"></div>

      {/* 品牌角标（左上，纯文字无底色，小屏隐藏避开胶囊） */}
      <div className="absolute top-1.5 left-4 z-40 font-mono text-[10px] leading-none tracking-[0.3em] text-slate-600 select-none pointer-events-none hidden sm:block">
        CODE CONTINENT <span className="text-slate-700">//</span> 代码大陆
      </div>

      {/* 当前关卡胶囊 —— 顶部居中 */}
      {currentLevel && (
        <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none max-w-[calc(100vw-130px)]">
          <div
            key={currentLevel.id}
            className={`panel-in flex items-center gap-1.5 sm:gap-2.5 rounded-full border ${theme.borderSoft} ${theme.bgDeep} backdrop-blur px-2.5 sm:px-4 py-1 sm:py-1.5 shadow-lg whitespace-nowrap overflow-hidden`}
          >
            <span className={`h-2 w-2 rounded-full shrink-0 ${theme.dot}`}></span>
            <span className={`text-xs sm:text-sm font-bold leading-none truncate ${theme.textBright}`}>{currentLevel.title}</span>
            <span className="font-mono text-[11px] leading-none text-slate-400 hidden md:inline">{currentLevel.category}</span>
            <span className="font-mono text-[10px] sm:text-[11px] leading-none text-slate-500">
              {String(levelIndex).padStart(2, '0')}/{LEVELS.length}
            </span>
            <span className={`font-mono text-[9px] sm:text-[10px] leading-none px-1 sm:px-1.5 py-0.5 rounded border ${theme.borderSoft} ${theme.bgSoft} ${theme.text} hidden xs:inline`}>
              {isReactLevel ? 'REACT' : 'PHASER'}
            </span>
            {currentLevel.isNew && (
              <span className="font-mono text-[9px] sm:text-[10px] leading-none px-1 sm:px-1.5 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
                NEW
              </span>
            )}
          </div>
        </div>
      )}

      {/* 考点导航（右上角） */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-4 z-40">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900/80 backdrop-blur text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-slate-500 shadow-lg flex items-center gap-1.5 sm:gap-2.5 transition-colors font-mono text-xs sm:text-sm"
        >
          <span className={`h-2 w-2 rounded-full ${theme.dot}`}></span>
          <span className="font-bold text-xs sm:text-sm">考点导航</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500">{LEVELS.length}</span>
          <span className="text-[10px] sm:text-xs text-slate-500">{isMenuOpen ? '▲' : '▼'}</span>
        </button>

        {isMenuOpen && (
          <>
            {/* 点击空白处关闭 */}
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>

            <div className="panel-in absolute right-0 top-full z-50 mt-2 w-[440px] max-w-[92vw] max-h-[72vh] overflow-y-auto nav-scroll bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-2xl p-3">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                <span className="text-sm font-bold text-slate-200">选择要挑战的考点</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {LEVELS.length} 个考点 · {CATEGORY_GROUPS.length} 大领域
                </span>
              </div>

              {/* 当前关卡说明 */}
              <div className="mx-1 mt-2 mb-1 rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
                <div className={`text-xs font-bold mb-0.5 ${theme.text}`}>当前 · {currentLevel?.title}</div>
                <p className="text-[11px] leading-relaxed text-slate-500">{currentLevel?.description}</p>
              </div>

              {CATEGORY_GROUPS.map(group => (
                <div key={group.category} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 px-2 pt-2 pb-1.5">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{group.category}</span>
                    <span className="h-px flex-1 bg-slate-800"></span>
                    <span className="font-mono text-[10px] text-slate-600">{group.levels.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {group.levels.map((level: GameLevel) => {
                      const t = getLevelTheme(level.themeColor)
                      const isActive = currentLevelId === level.id
                      return (
                        <button
                          key={level.id}
                          onClick={() => {
                            setLevel(level.id)
                            setIsMenuOpen(false)
                          }}
                          title={level.description}
                          className={`px-2.5 py-1.5 rounded-md font-bold text-xs transition-colors border flex items-center gap-1.5 ${
                            isActive
                              ? `${t.bgSolid} text-white ${t.border} shadow-lg`
                              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:border-slate-500 hover:text-slate-100'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-white/80' : t.dot}`}></span>
                          {level.title}
                          {level.isNew && <span className="text-[9px] text-yellow-400 font-mono">NEW</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Active HUD Layer / React Game Layer */}
      <div
        className={`relative z-10 w-full h-full ${
          isReactLevel
            ? 'overflow-y-auto pointer-events-auto nav-scroll pt-12 sm:pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center justify-start sm:justify-center'
            : 'overflow-hidden pointer-events-none flex items-center justify-center'
        }`}
      >
        <div
          className={`w-full max-w-5xl my-auto ${
            isReactLevel ? 'pointer-events-auto' : 'pointer-events-none h-full flex items-center justify-center'
          }`}
        >
          {ActiveHUD && <ActiveHUD />}
        </div>
      </div>

      {/* 游戏视口：Phaser 舞台 + HUD 式框架 */}
      <div
        className={`absolute inset-0 z-0 flex items-center justify-center p-2 sm:p-4 ${isReactLevel ? 'hidden' : ''}`}
        style={{ '--accent': theme.hex } as React.CSSProperties}
      >
        <div className="flex flex-col items-stretch w-full max-w-[800px]">
          {/* 视口状态条 */}
          <div className="flex items-center justify-between pb-1 sm:pb-2 px-0.5 font-mono text-[10px] sm:text-[11px] select-none">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="stage-live-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
              <span className={theme.text}>viewport</span>
              <span className="text-slate-600 truncate max-w-[120px] sm:max-w-none">://{currentLevel?.id}</span>
            </span>
            <span className="text-slate-600 text-[9px] sm:text-[11px]">800 × 600 · PHASER</span>
          </div>

          {/* 舞台框架 + 四角括号 */}
          <div className="stage-glow relative rounded-xl sm:rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <span className="stage-corner stage-corner-tl"></span>
            <span className="stage-corner stage-corner-tr"></span>
            <span className="stage-corner stage-corner-bl"></span>
            <span className="stage-corner stage-corner-br"></span>
            <div
              id="phaser-game-container"
              ref={gameRef}
              className="w-full aspect-[4/3] max-h-[70vh] sm:max-h-[80vh] overflow-hidden rounded-xl sm:rounded-2xl bg-slate-950/40 touch-none flex items-center justify-center"
            >
              {/* Phaser injects canvas here */}
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlay Layer */}
      {currentLevel?.engine !== 'react' && <AIMentor />}

      {/* Voice Guide Toggle */}
      <VoiceGuide />

      {/* Tutorial / Help Modal */}
      <TutorialModal />
    </div>
  )
}

export default App
