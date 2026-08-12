import { useGameStore } from '../store/useGameStore'
import { Bot, RotateCcw, Play } from 'lucide-react'

export const AIMentor = () => {
  const { isGameOver, isVictory, aiFeedback, resetGame } = useGameStore()

  if (!isGameOver) return null

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-slate-800 p-8 rounded-2xl max-w-xl border border-slate-600 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isVictory ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Bot size={40} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
              {isVictory ? '关卡完成！' : '系统崩溃 (Core Dump)'}
            </h2>
            <div className="text-slate-300 text-lg leading-relaxed mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="font-semibold text-blue-400 mb-1 block">老架构师复盘：</span>
              {aiFeedback}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-700">
          <button 
            onClick={() => {
              resetGame()
              // Hard reload to reset Phaser scene for now
              window.location.reload()
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
          >
            <RotateCcw size={18} />
            {isVictory ? '再玩一次' : '重新调度'}
          </button>
          {isVictory && (
            <button 
              onClick={() => alert("第二关【死锁预防】与第三关【虚拟内存】正在努力开发中，敬请期待《代码大陆》正式版！")}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors"
            >
              <Play size={18} />
              下一关卡
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
