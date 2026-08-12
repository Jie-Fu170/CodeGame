import { useGameStore } from '../store/useGameStore'
import { Activity, Cpu, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

// 按当前关卡 id 区分：cpu-scheduling（进程调度）/ deadlock（死锁解除）
export const HUD = () => {
  const { hp, maxHp, score, completedProcesses, targetProcesses, deadlocksResolved, targetDeadlocks, algorithm, setAlgorithm, currentLevelId } = useGameStore()

  const isSchedulingLevel = currentLevelId === 'cpu-scheduling'
  const isDeadlockLevel = currentLevelId === 'deadlock'

  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="absolute top-0 left-0 w-full p-2 sm:p-4 pt-10 sm:pt-14 pointer-events-none flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-2 sm:gap-4 z-10">
      {/* Left side: Stats */}
      <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 pointer-events-auto w-full sm:w-64">
        <div className="flex-1 bg-slate-800/90 backdrop-blur-md p-2.5 sm:p-3 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex items-center gap-1.5 text-slate-300 mb-1 font-semibold text-xs sm:text-base">
            <Activity size={16} className="text-blue-400 shrink-0" />
            <span>系统健康度 (HP)</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-300 ease-out ${hpColor}`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">{hp} / {maxHp}</div>
        </div>

        <div className="flex-1 bg-slate-800/90 backdrop-blur-md p-2.5 sm:p-3 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs sm:text-base">
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span>{isSchedulingLevel ? '已处理进程' : '已解除死锁'}</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-white">
              {isSchedulingLevel ? completedProcesses : deadlocksResolved} <span className="text-slate-500 text-xs sm:text-sm">/ {isSchedulingLevel ? targetProcesses : targetDeadlocks}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs sm:text-base">
              <Clock size={16} className="text-purple-400 shrink-0" />
              <span>性能得分</span>
            </div>
            <div className="text-sm sm:text-xl font-bold text-yellow-400">{score}</div>
          </div>
        </div>
      </div>

      {/* Right side: Strategy Console (Only for cpu-scheduling) */}
      {isSchedulingLevel && (
        <div className="bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] pointer-events-auto w-full sm:w-60">
          <div className="flex items-center gap-2 text-blue-300 mb-2 sm:mb-3 font-bold text-sm sm:text-lg">
            <Cpu size={18} />
            调度策略控制台
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2 w-full">
            {(['FCFS', 'SJF', 'RR', 'PRIORITY'] as const).map((alg) => (
              <button
                key={alg}
                onClick={() => setAlgorithm(alg)}
                className={`py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg font-bold transition-all duration-200 border text-xs sm:text-sm
                  ${algorithm === alg 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-[1.02]' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                {alg === 'FCFS' && 'FCFS (先来先服务)'}
                {alg === 'SJF' && 'SJF (短作业优先)'}
                {alg === 'RR' && 'RR (时间片轮转)'}
                {alg === 'PRIORITY' && 'PRIORITY (优先级)'}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-slate-400 leading-tight hidden sm:block">
            <p className="font-semibold text-slate-300 mb-0.5">当前策略说明：</p>
            {algorithm === 'FCFS' && '按进程到达顺序调度。适合长作业，短作业易等待。'}
            {algorithm === 'SJF' && '优先调度估计运行时间最短的进程。平均周转时间最短。'}
            {algorithm === 'RR' && '按固定时间片轮转分配 CPU，超时重新排队。'}
            {algorithm === 'PRIORITY' && '优先调度优先级最高的进程。'}
          </div>
        </div>
      )}

      {/* Right side: Deadlock Info (Only for deadlock) */}
      {isDeadlockLevel && (
        <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] pointer-events-auto w-full sm:w-56">
          <div className="flex items-center gap-2 text-red-400 mb-1 sm:mb-2 font-bold text-sm sm:text-lg">
            <AlertTriangle size={18} />
            死锁警告系统
          </div>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            点击画面中**红色死锁节点**强制撤销 (Kill)，防止系统崩溃！
          </div>
        </div>
      )}
    </div>
  )
}
