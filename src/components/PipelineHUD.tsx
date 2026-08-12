import { useGameStore } from '../store/useGameStore'
import { Server, Settings, Zap, Coins } from 'lucide-react'

export const PipelineHUD = () => {
  const { hp, maxHp, money, isPipelined, setIsPipelined, stageTimes, upgradeStage, pipelineCompleted, pipelineTarget } = useGameStore()
  
  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  const maxTime = Math.max(stageTimes.IF, stageTimes.ID, stageTimes.EX) / 1000
  const throughput = (1 / maxTime).toFixed(2)
  const isBottleneck = stageTimes.ID > stageTimes.IF

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-2 sm:p-6 pt-10 sm:pt-14 z-10 overflow-y-auto">
      
      {/* Top Bar: Compact Stats Only */}
      <div className="flex flex-row justify-between w-full pointer-events-auto gap-2">
        <div className="flex-1 bg-slate-800/90 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-slate-300 mb-1 font-bold text-xs sm:text-sm">
            <span>倒计时 (HP)</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{hp} / {maxHp}</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 sm:h-3 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-300 ease-out ${hpColor}`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-800/90 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-slate-700 shadow-xl flex justify-between items-center text-white">
           <div className="font-bold flex items-center gap-1 text-blue-400 text-xs sm:text-sm"><Server size={14}/> 指令</div>
           <div className="font-mono text-xs sm:text-lg font-bold">{pipelineCompleted} / {pipelineTarget}</div>
        </div>
        
        <div className="flex-1 bg-slate-800/90 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] flex justify-between items-center text-yellow-400">
           <div className="font-bold flex items-center gap-1 text-xs sm:text-sm"><Coins size={14}/> 资金</div>
           <div className="font-mono text-xs sm:text-lg font-bold">{money}</div>
        </div>
      </div>

      {/* Bottom Action Bar: Control Center (Unblocks Middle Scene) */}
      <div className="pointer-events-auto flex justify-center mb-2 sm:mb-4 relative z-30">
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-full max-w-xl">
          <div className="flex items-center justify-between text-blue-300 mb-2 font-bold text-xs sm:text-lg border-b border-slate-700/80 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Settings size={16} /> 流水线控制中心
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-green-400 font-normal">
              最大吞吐: {isPipelined ? `${throughput} 指令/秒` : '串行模式'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Mode Switch & Bottleneck Warning */}
            <div className="flex flex-col justify-between gap-1.5">
              <div className="flex p-1 bg-slate-950 rounded-lg">
                <button
                  onClick={() => setIsPipelined(false)}
                  className={`flex-1 py-1.5 sm:py-2 rounded-md font-bold text-xs transition-all ${!isPipelined ? 'bg-red-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  串行模式
                </button>
                <button
                  onClick={() => setIsPipelined(true)}
                  className={`flex-1 py-1.5 sm:py-2 rounded-md font-bold text-xs transition-all ${isPipelined ? 'bg-green-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  流水线模式
                </button>
              </div>
              {isPipelined && isBottleneck && (
                <div className="text-red-400 text-[10px] sm:text-xs animate-pulse text-center font-bold">
                  ⚠️ 警告：分析阶段(ID)严重阻塞！
                </div>
              )}
            </div>

            {/* Upgrade Factory Button */}
            <div className="flex items-center">
              <button
                onClick={() => upgradeStage('ID')}
                disabled={stageTimes.ID <= 2000 || money < 50}
                className={`w-full py-2 px-3 rounded-lg font-bold flex justify-between items-center transition-all text-xs ${
                  stageTimes.ID > 2000 && money >= 50
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1.5"><Zap size={14}/> 升级分析(ID)中心</div>
                <div className="flex flex-col items-end">
                  <div className="text-yellow-300 font-mono text-[11px]">50 资金</div>
                  {stageTimes.ID > 2000 && <div className="text-[9px] opacity-70">4s &rarr; 2s</div>}
                  {stageTimes.ID <= 2000 && <div className="text-[9px] opacity-70 text-green-400">已满级</div>}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
