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
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* Top Bar */}
      <div className="flex justify-between w-full pointer-events-auto">
        <div className="flex flex-col gap-3 w-64">
          <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-2 font-bold text-lg">
              倒计时 (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl flex justify-between items-center text-white">
             <div className="font-bold flex items-center gap-2 text-blue-400"><Server size={18}/> 完成指令</div>
             <div className="font-mono text-xl">{pipelineCompleted} / {pipelineTarget}</div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-md p-3 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] flex justify-between items-center text-yellow-400">
             <div className="font-bold flex items-center gap-2"><Coins size={18}/> 资金</div>
             <div className="font-mono text-xl">{money}</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-80">
          <div className="flex items-center gap-2 text-blue-300 mb-4 font-bold text-xl border-b border-slate-700 pb-2">
            <Settings /> 流水线控制中心
          </div>
          
          <div className="flex flex-col gap-4">
            {/* Mode Switch */}
            <div className="flex p-1 bg-slate-950 rounded-lg">
              <button
                onClick={() => setIsPipelined(false)}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${!isPipelined ? 'bg-red-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                串行模式
              </button>
              <button
                onClick={() => setIsPipelined(true)}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${isPipelined ? 'bg-green-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                流水线模式
              </button>
            </div>

            {/* Throughput Stats */}
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-xs mb-1">当前理论最大吞吐率：</div>
              <div className="text-2xl font-mono font-bold text-green-400">
                {isPipelined ? `${throughput} 指令/秒` : '极低'}
              </div>
              {isPipelined && isBottleneck && (
                <div className="text-red-400 text-xs mt-1 animate-pulse">
                  ⚠️ 警告：分析阶段(ID)严重阻塞！
                </div>
              )}
            </div>

            {/* Upgrades */}
            <div>
              <div className="text-slate-400 text-xs mb-2">升级工厂（花费资金降低耗时）：</div>
              <button
                onClick={() => upgradeStage('ID')}
                disabled={stageTimes.ID <= 2000 || money < 50}
                className={`w-full py-2 px-4 rounded-lg font-bold flex justify-between items-center transition-all ${
                  stageTimes.ID > 2000 && money >= 50
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2"><Zap size={16}/> 升级分析(ID)中心</div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-yellow-300">50 资金</div>
                  {stageTimes.ID > 2000 && <div className="text-[10px] opacity-70">4s &rarr; 2s</div>}
                  {stageTimes.ID <= 2000 && <div className="text-[10px] opacity-70 text-green-400">已满级</div>}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
