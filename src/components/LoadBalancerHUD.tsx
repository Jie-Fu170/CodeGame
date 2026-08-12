import { useGameStore } from '../store/useGameStore'
import { Server, Activity, Clock, ShieldAlert, ArrowDownUp, CheckCircle, Flame } from 'lucide-react'

export const LoadBalancerHUD = () => {
  const { 
    hp, 
    maxHp, 
    lbAlgorithm,
    lbTimeLeft,
    lbWarnings,
    lbStatus,
    setLbAlgorithm
  } = useGameStore()
  
  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-2 sm:p-6 pt-10 sm:pt-14 z-10 overflow-y-auto">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between w-full pointer-events-auto gap-2 sm:gap-4">
        {/* HP Bar */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-72">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-1 sm:mb-2 font-bold text-xs sm:text-lg">
              集群健康度 (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-[10px] sm:text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
          </div>

          {/* Warnings */}
          {lbWarnings.length > 0 && (
            <div className="bg-red-900/80 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
              <div className="flex items-center gap-1.5 text-red-200 font-bold mb-0.5 text-xs sm:text-sm">
                <ShieldAlert size={14} /> 警告 (Warning)
              </div>
              <div className="text-white text-[10px] sm:text-xs">
                {lbWarnings[lbWarnings.length - 1]}
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)] flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto min-w-[160px]">
          <div className="flex items-center gap-1.5 text-orange-300 font-bold text-xs sm:text-base">
            <Clock size={16} /> 剩余防守时间
          </div>
          <div className="text-white text-xl sm:text-5xl font-mono font-bold bg-slate-950 px-4 sm:px-6 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-slate-800">
            {lbTimeLeft}s
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pointer-events-auto flex justify-center mb-2 sm:mb-4 relative z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-2 sm:gap-3 w-full max-w-2xl">
          
          {lbStatus === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-4">
              <div className="text-yellow-400 font-bold text-2xl sm:text-4xl flex items-center gap-2 sm:gap-3 animate-bounce">
                <Flame className="w-6 h-6 sm:w-10 sm:h-10" /> 架构师觉醒！
              </div>
              <div className="text-slate-300 text-xs sm:text-base text-center">
                您成功抵御了史诗级的流量洪峰，守护了代码大陆的和平！
              </div>
            </div>
          ) : lbStatus === 'FAILED' ? (
            <div className="flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-4">
              <div className="text-red-400 font-bold text-lg sm:text-2xl flex items-center gap-2">
                <ShieldAlert /> 服务器集群崩溃！
              </div>
              <button 
                onClick={() => useGameStore.getState().setChapter(12)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-base transition-colors"
              >
                重启集群 (重试)
              </button>
            </div>
          ) : (
            <>
              <div className="text-slate-400 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5">
                <ArrowDownUp size={14} /> 选择负载均衡策略 (Algorithm)
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4">
                <button
                  onClick={() => setLbAlgorithm('RR')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border-2 transition-all group active:scale-95 ${lbAlgorithm === 'RR' ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                >
                  <Activity className="mb-1 w-6 h-6 sm:w-8 sm:h-8" />
                  <div className="font-bold text-xs sm:text-sm">轮询 (Round Robin)</div>
                  <div className={`text-[10px] sm:text-xs mt-0.5 ${lbAlgorithm === 'RR' ? 'text-orange-200' : 'text-slate-500'}`}>公平依次分配</div>
                </button>
                <button
                  onClick={() => setLbAlgorithm('LEAST_CONN')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border-2 transition-all group active:scale-95 ${lbAlgorithm === 'LEAST_CONN' ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                >
                  <Server className="mb-1 w-6 h-6 sm:w-8 sm:h-8" />
                  <div className="font-bold text-xs sm:text-sm">最少连接 (Least Conn)</div>
                  <div className={`text-[10px] sm:text-xs mt-0.5 ${lbAlgorithm === 'LEAST_CONN' ? 'text-orange-200' : 'text-slate-500'}`}>发给空闲高的机器</div>
                </button>
                <button
                  onClick={() => setLbAlgorithm('IP_HASH')}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border-2 transition-all group active:scale-95 ${lbAlgorithm === 'IP_HASH' ? 'bg-orange-600 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                >
                  <CheckCircle className="mb-1 w-6 h-6 sm:w-8 sm:h-8" />
                  <div className="font-bold text-xs sm:text-sm">IP 哈希 (IP Hash)</div>
                  <div className={`text-[10px] sm:text-xs mt-0.5 ${lbAlgorithm === 'IP_HASH' ? 'text-orange-200' : 'text-slate-500'}`}>源IP绑定节点</div>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
