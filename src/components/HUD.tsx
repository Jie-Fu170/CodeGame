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
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-10">
      {/* Left side: Stats */}
      <div className="flex flex-col gap-3 pointer-events-auto w-64">
        <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2 text-slate-300 mb-1 font-semibold">
            <Activity size={18} className="text-blue-400" />
            系统健康度 (HP)
          </div>
          <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-300 ease-out ${hpColor}`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <CheckCircle2 size={18} className="text-green-400" />
              {isSchedulingLevel ? '已处理进程' : '已解除死锁'}
            </div>
            <div className="text-xl font-bold text-white">
              {isSchedulingLevel ? completedProcesses : deadlocksResolved} <span className="text-slate-500 text-sm">/ {isSchedulingLevel ? targetProcesses : targetDeadlocks}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Clock size={18} className="text-purple-400" />
              性能得分
            </div>
            <div className="text-xl font-bold text-yellow-400">{score}</div>
          </div>
        </div>
      </div>

      {/* Right side: Strategy Console (Only for cpu-scheduling) */}
      {isSchedulingLevel && (
        <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] pointer-events-auto">
          <div className="flex items-center gap-2 text-blue-300 mb-3 font-bold text-lg">
            <Cpu size={22} />
            调度策略控制台
          </div>
          <div className="grid grid-cols-1 gap-2 w-48">
            {(['FCFS', 'SJF', 'RR', 'PRIORITY'] as const).map((alg) => (
              <button
                key={alg}
                onClick={() => setAlgorithm(alg)}
                className={`py-2 px-4 rounded-lg font-bold transition-all duration-200 border text-sm
                  ${algorithm === alg 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-105' 
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                {alg === 'FCFS' && '先来先服务 (FCFS)'}
                {alg === 'SJF' && '短作业优先 (SJF)'}
                {alg === 'RR' && '时间片轮转 (RR)'}
                {alg === 'PRIORITY' && '优先级调度'}
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-400 max-w-[12rem] leading-tight">
            <p className="font-semibold text-slate-300 mb-1">当前策略说明：</p>
            {algorithm === 'FCFS' && '按进程到达的先后顺序进行调度。适合长作业，但容易导致短作业长时间等待。'}
            {algorithm === 'SJF' && '优先调度估计运行时间最短的进程。可获得最短的平均周转时间。'}
            {algorithm === 'RR' && '按一定时间片分配CPU，超时后进程会被重新放入队列，适合分时系统。'}
            {algorithm === 'PRIORITY' && '优先调度优先级(Pr)最高的进程。'}
          </div>
        </div>
      )}

      {/* Right side: Deadlock Info (Only for deadlock) */}
      {isDeadlockLevel && (
        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] pointer-events-auto">
          <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-lg">
            <AlertTriangle size={22} />
            死锁警告系统
          </div>
          <div className="text-sm text-slate-300 w-48 leading-relaxed">
            观察屏幕中心的**资源分配图**。
            <br/><br/>
            一旦出现**红色的死锁环路**（循环等待），请立即在 3 秒内点击红圈的进程节点强制撤销 (Kill)，否则系统将崩溃！
          </div>
        </div>
      )}
    </div>
  )
}
