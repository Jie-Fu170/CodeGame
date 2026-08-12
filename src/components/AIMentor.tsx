import { useGameStore } from '../store/useGameStore'
import { Bot, RotateCcw, Play } from 'lucide-react'

export const AIMentor = () => {
  const { isGameOver, isVictory, aiFeedback, resetGame } = useGameStore()

  if (!isGameOver) return null

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 pointer-events-auto">
      <div className="bg-slate-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-slate-600 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${isVictory ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Bot size={32} className="sm:w-10 sm:h-10" />
          </div>
          <div className="flex-1">
            <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
              {isVictory ? '关卡完成！' : '系统崩溃 (Core Dump)'}
            </h2>
            <div className="text-slate-300 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-left">
              <span className="font-semibold text-blue-400 mb-1 block">老架构师复盘：</span>
              {aiFeedback}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700">
          <button 
            onClick={() => {
              resetGame()
              window.location.reload()
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs sm:text-base transition-colors"
          >
            <RotateCcw size={16} />
            {isVictory ? '再玩一次' : '重新调度'}
          </button>
          {isVictory && (
            <button 
              onClick={() => alert("后续关卡正在努力开发中，敬请期待《代码大陆》正式版！")}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-xs sm:text-base transition-colors"
            >
              <Play size={16} />
              下一关卡
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
