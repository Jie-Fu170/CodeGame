import { useGameStore } from '../store/useGameStore'
import { Shield, ArrowLeft, ArrowRight, AlertTriangle, Play, CheckCircle } from 'lucide-react'

export const TreeHUD = () => {
  const { 
    hp, 
    maxHp, 
    bstTasks, 
    currentBstTaskIndex, 
    bstCurrentNodeId,
    bstStatus,
    submitBstDirection,
    nextBstTask,
    isGameOver
  } = useGameStore()
  
  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  const task = bstTasks[currentBstTaskIndex]

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* Top Bar */}
      <div className="flex justify-between w-full pointer-events-auto">
        <div className="flex flex-col gap-3 w-72">
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-2 font-bold text-lg">
              探针能量 (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
            
            <div className="mt-4 text-sm text-cyan-400 font-bold flex justify-between">
              <span>进度: {currentBstTaskIndex + 1} / {bstTasks.length}</span>
            </div>
          </div>
        </div>

        {/* Task Display */}
        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] w-auto max-w-2xl">
          <div className="flex items-center gap-2 text-cyan-300 mb-2 font-bold text-xl border-b border-slate-700 pb-2">
            <Shield /> {task.title}
          </div>
          <div className="text-slate-300 text-sm mt-3 mb-4">
            {task.description}
          </div>
          
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 flex gap-4 items-center">
            <div className="text-amber-400 font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> 目标值：
            </div>
            <div className="text-white text-2xl font-mono font-bold bg-slate-900 px-4 py-1 rounded">
              {task.targetValue}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pointer-events-auto flex justify-center mb-4 relative z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-3 min-w-[400px]">
          
          {bstStatus === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center p-6 gap-4">
              <div className="text-green-400 font-bold text-2xl flex items-center gap-2">
                <CheckCircle /> 追踪成功！
              </div>
              {!isGameOver && (
                <button 
                  onClick={nextBstTask}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Play /> 追踪下一个目标
                </button>
              )}
            </div>
          ) : bstStatus === 'FAILED' ? (
            <div className="flex flex-col items-center justify-center p-6 gap-4">
              <div className="text-red-400 font-bold text-2xl flex items-center gap-2">
                <AlertTriangle /> 坠入深渊！
              </div>
              <button 
                onClick={() => useGameStore.setState({ bstStatus: 'PLAYING', bstCurrentNodeId: 50 })}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                回到根节点重试
              </button>
            </div>
          ) : (
            <>
              <div className="text-slate-400 text-sm font-bold text-center mb-2">当前处于节点：<span className="text-white text-lg font-mono">{bstCurrentNodeId}</span></div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => submitBstDirection('LEFT')}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500 transition-all text-slate-300 hover:text-white group active:scale-95"
                >
                  <ArrowLeft className="group-hover:text-cyan-400 mb-2" size={40} />
                  <div className="font-bold text-lg">向左子树</div>
                  <div className="text-xs text-slate-500 mt-1">{"(< 当前节点)"}</div>
                </button>
                <button
                  onClick={() => submitBstDirection('RIGHT')}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500 transition-all text-slate-300 hover:text-white group active:scale-95"
                >
                  <ArrowRight className="group-hover:text-cyan-400 mb-2" size={40} />
                  <div className="font-bold text-lg">向右子树</div>
                  <div className="text-xs text-slate-500 mt-1">{"(> 当前节点)"}</div>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
