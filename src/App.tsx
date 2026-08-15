import React, { useEffect, useRef, useState, Suspense } from 'react'
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
import { FloatingDock } from './components/FloatingDock'
import { WorldMap } from './components/WorldMap'

// Lazy-loaded pure React games for optimal initial bundle size
const AlgorithmDuel = React.lazy(() => import('./components/react-games/algorithm-duel'))
const BankersMaze = React.lazy(() => import('./components/react-games/bankers-maze'))
const CipherWorkshop = React.lazy(() => import('./components/react-games/cipher-workshop'))
const CriticalPathExpedition = React.lazy(() => import('./components/react-games/critical-path-expedition'))
const DesignPatternTD = React.lazy(() => import('./components/react-games/design-pattern-td'))
const PipelineFactory = React.lazy(() => import('./components/react-games/pipeline-factory'))
const PseudocodeForge = React.lazy(() => import('./components/react-games/pseudocode-forge'))
const SQLAssemblyBench = React.lazy(() => import('./components/react-games/sql-assembly-bench'))
const SubnetTerritory = React.lazy(() => import('./components/react-games/subnet-territory'))
const HammingAgent = React.lazy(() => import('./components/react-games/hamming-agent'))
const CacheMaster = React.lazy(() => import('./components/react-games/cache-master'))
const DFAMaze = React.lazy(() => import('./components/react-games/dfa-maze'))
const UnixInode = React.lazy(() => import('./components/react-games/unix-inode'))
const PathFinder = React.lazy(() => import('./components/react-games/path-finder'))
const WhiteBoxExplorer = React.lazy(() => import('./components/react-games/white-box-explorer'))
const DFDInspector = React.lazy(() => import('./components/react-games/dfd-inspector'))
const UMLStateMachine = React.lazy(() => import('./components/react-games/uml-state-machine'))
const DPKnapsack = React.lazy(() => import('./components/react-games/dp-knapsack'))
const DBNormalizer = React.lazy(() => import('./components/react-games/db-normalizer'))
const FloatOperator = React.lazy(() => import('./components/react-games/float-operator'))
const ReliabilityArchitect = React.lazy(() => import('./components/react-games/reliability-architect'))
const MatrixCompressor = React.lazy(() => import('./components/react-games/matrix-compressor'))
const McCabeSurveyor = React.lazy(() => import('./components/react-games/mccabe-surveyor'))
const IPJudge = React.lazy(() => import('./components/react-games/ip-judge'))
const NormalizationVein = React.lazy(() => import('./components/react-games/normalization-vein'))
const UmlDesignBench = React.lazy(() => import('./components/react-games/uml-design-bench'))
const OSIEncapsulator = React.lazy(() => import('./components/react-games/osi-encapsulator'))
const PVSemaphore = React.lazy(() => import('./components/react-games/pv-semaphore'))
const RelationalAlgebra = React.lazy(() => import('./components/react-games/relational-algebra'))
const DiskScheduler = React.lazy(() => import('./components/react-games/disk-scheduler'))
const InfixToPostfix = React.lazy(() => import('./components/react-games/infix-to-postfix'))
const HashTableClash = React.lazy(() => import('./components/react-games/hash-table-clash'))
const MinSpanningTree = React.lazy(() => import('./components/react-games/min-spanning-tree'))
const IORegisters = React.lazy(() => import('./components/react-games/io-registers'))
const CohesionCoupling = React.lazy(() => import('./components/react-games/cohesion-coupling'))
const SolidPrinciples = React.lazy(() => import('./components/react-games/solid-principles'))
const ERToRelational = React.lazy(() => import('./components/react-games/er-to-relational'))
const IPCopyrightCourt = React.lazy(() => import('./components/react-games/ip-copyright-court'))
const PageReplacement = React.lazy(() => import('./components/react-games/page-replacement'))
const HeapSort = React.lazy(() => import('./components/react-games/heap-sort'))
const WhiteBoxCoverage = React.lazy(() => import('./components/react-games/white-box-coverage'))
const DBNormalForms = React.lazy(() => import('./components/react-games/db-normal-forms'))
const DigitalSignature = React.lazy(() => import('./components/react-games/digital-signature'))
const CRCChecksum = React.lazy(() => import('./components/react-games/crc-checksum'))
const RiscVsCisc = React.lazy(() => import('./components/react-games/risc-vs-cisc'))
const BitmapDisk = React.lazy(() => import('./components/react-games/bitmap-disk'))
const MMUTranslator = React.lazy(() => import('./components/react-games/mmu-translator'))
const HuffmanCoder = React.lazy(() => import('./components/react-games/huffman-coder'))
const TopologicalSort = React.lazy(() => import('./components/react-games/topological-sort'))
const DBConcurrencyLock = React.lazy(() => import('./components/react-games/db-concurrency-lock'))
const AgileScrumBoard = React.lazy(() => import('./components/react-games/agile-scrum-board'))
const NetworkSecurityWall = React.lazy(() => import('./components/react-games/network-security-wall'))
const StdComplianceCourt = React.lazy(() => import('./components/react-games/std-compliance-court'))
const MemoryAddressing = React.lazy(() => import('./components/react-games/memory-addressing'))
const PrecedencePV = React.lazy(() => import('./components/react-games/precedence-pv'))
const DijkstraShortestPath = React.lazy(() => import('./components/react-games/dijkstra-shortest-path'))
const BlackboxTesting = React.lazy(() => import('./components/react-games/blackbox-testing'))
const SoftwareLifecycleCMMI = React.lazy(() => import('./components/react-games/software-lifecycle-cmmi'))
const DesignPatternCode = React.lazy(() => import('./components/react-games/design-pattern-code'))
const NetProtocolPorts = React.lazy(() => import('./components/react-games/net-protocol-ports'))
const QueryOptimizationTree = React.lazy(() => import('./components/react-games/query-optimization-tree'))
const DigitalEnvelope = React.lazy(() => import('./components/react-games/digital-envelope'))
const ArchStyleATAM = React.lazy(() => import('./components/react-games/arch-style-atam'))
const SyntaxTreeBuilder = React.lazy(() => import('./components/react-games/syntax-tree-builder'))
const DataRepresentation = React.lazy(() => import('./components/react-games/data-representation'))
const MultimediaCalculator = React.lazy(() => import('./components/react-games/multimedia-calculator'))
const OOPPolymorphism = React.lazy(() => import('./components/react-games/oop-polymorphism'))
const AVLTreeRotation = React.lazy(() => import('./components/react-games/avl-tree-rotation'))

const HUDLoadingFallback = () => (
  <div className="w-full py-12 flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono">
    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
    <div className="text-xs tracking-widest uppercase animate-pulse">关卡资源加载中...</div>
  </div>
)

const HUD_MAP: Record<string, React.ComponentType<any>> = {
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
  'MemoryAddressing': MemoryAddressing,
  'PrecedencePV': PrecedencePV,
  'DijkstraShortestPath': DijkstraShortestPath,
  'BlackboxTesting': BlackboxTesting,
  'SoftwareLifecycleCMMI': SoftwareLifecycleCMMI,
  'DesignPatternCode': DesignPatternCode,
  'NetProtocolPorts': NetProtocolPorts,
  'QueryOptimizationTree': QueryOptimizationTree,
  'DigitalEnvelope': DigitalEnvelope,
  'ArchStyleATAM': ArchStyleATAM,
  'SyntaxTreeBuilder': SyntaxTreeBuilder,
  'DataRepresentation': DataRepresentation,
  'MultimediaCalculator': MultimediaCalculator,
  'OOPPolymorphism': OOPPolymorphism,
  'AVLTreeRotation': AVLTreeRotation,
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
  const { currentLevelId, setLevel, returnToMap, skin } = useGameStore()

  // 皮肤属性挂到 <html data-theme>，驱动 index.css 的主题变量
  useEffect(() => {
    document.documentElement.dataset.theme = skin
  }, [skin])

  useEffect(() => {
    if (!currentLevelId) return
    const currentLvl = LEVELS.find(l => l.id === currentLevelId)
    if (currentLvl?.engine === 'phaser') {
      if (gameRef.current) {
        initGame()
        switchScene(currentLevelId)
      }
    } else {
      switchScene(currentLevelId)
    }
  }, [currentLevelId])

  useEffect(() => {
    return () => {
      destroyGame()
    }
  }, [])

  if (!currentLevelId) {
    return <WorldMap />
  }

  const currentLevel = LEVELS.find(l => l.id === currentLevelId)
  const theme = getLevelTheme(currentLevel?.themeColor)
  const levelIndex = currentLevel ? LEVELS.findIndex(l => l.id === currentLevelId) + 1 : 0
  const ActiveHUD = currentLevel && HUD_MAP[currentLevel.hudComponent] ? HUD_MAP[currentLevel.hudComponent] : null
  const isReactLevel = currentLevel?.engine === 'react'

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center t-page relative overflow-hidden">
      {/* 环境背景：皮肤风景层 + 蓝图网格 + 柔和暗角 */}
      <div className="absolute inset-0 t-scenery"></div>
      <div className="absolute inset-0 bg-blueprint-grid"></div>
      <div className="absolute inset-0 t-vignette pointer-events-none"></div>

      {/* 品牌角标（左上，纯文字无底色，小屏隐藏避开胶囊） */}
      <div className="absolute top-1.5 left-4 z-40 font-mono text-[10px] leading-none tracking-[0.3em] t-text-4 select-none pointer-events-none hidden sm:block">
        CODE CONTINENT <span className="t-text-3">//</span> 代码大陆
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

      {/* 返回地图（右上角） */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-4 z-40">
        <button
          onClick={returnToMap}
          className="t-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border shadow-lg flex items-center gap-1.5 sm:gap-2 transition-colors font-mono text-xs sm:text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">🗺️</span>
          <span className="font-bold">返回地图</span>
        </button>
      </div>

      {/* Active HUD Layer / React Game Layer */}
      <div
        className={`relative z-10 w-full h-full ${
          isReactLevel
            ? 'game-skin overflow-y-auto pointer-events-auto nav-scroll pt-12 sm:pt-16 pb-8 px-2 sm:px-4 flex flex-col items-center justify-start sm:justify-center'
            : 'overflow-hidden pointer-events-none flex items-center justify-center'
        }`}
      >
        <div
          className={`w-full max-w-5xl my-auto ${
            isReactLevel ? 'pointer-events-auto' : 'pointer-events-none h-full flex items-center justify-center'
          }`}
        >
          <Suspense fallback={<HUDLoadingFallback />}>
            {ActiveHUD && <ActiveHUD />}
          </Suspense>
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
              <span className="t-text-4 truncate max-w-[120px] sm:max-w-none">://{currentLevel?.id}</span>
            </span>
            <span className="t-text-4 text-[9px] sm:text-[11px]">800 × 600 · PHASER</span>
          </div>

          {/* 舞台框架 + 四角括号 */}
          <div className="stage-glow relative rounded-xl sm:rounded-2xl border t-frame flex items-center justify-center overflow-hidden">
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

      {/* 右下悬浮 Dock：教程 / 语音 / 社群 */}
      <FloatingDock />
    </div>
  )
}

export default App
