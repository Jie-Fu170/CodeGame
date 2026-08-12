import { useGameStore } from '../store/useGameStore'
import { Shield, Key, Lock, Unlock, AlertTriangle, ArrowRight, Play, FileKey } from 'lucide-react'

export const CryptoHUD = () => {
  const { 
    hp, 
    maxHp, 
    cryptoTasks, 
    currentCryptoTaskIndex, 
    currentCryptoStepIndex,
    cryptoStatus,
    submitCryptoKey,
    nextCryptoTask,
    isGameOver
  } = useGameStore()
  
  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  const task = cryptoTasks[currentCryptoTaskIndex]
  const step = task.steps[currentCryptoStepIndex]

  const keys = [
    { id: 'alice_pub', label: "Alice's Public Key", desc: "任何人可用" },
    { id: 'alice_priv', label: "Alice's Private Key", desc: "仅Alice有" },
    { id: 'bob_pub', label: "Bob's Public Key", desc: "任何人可用" },
    { id: 'bob_priv', label: "Bob's Private Key", desc: "仅Bob有" },
    { id: 'symmetric_key', label: "Symmetric Key", desc: "对称密钥(快)" },
  ]

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-2 sm:p-6 pt-10 sm:pt-14 z-10 overflow-y-auto">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between w-full pointer-events-auto gap-2 sm:gap-4">
        <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-72">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-1 sm:mb-2 font-bold text-xs sm:text-lg">
              安全防御 (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-[10px] sm:text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
            
            <div className="mt-2 text-xs sm:text-sm text-blue-400 font-bold flex justify-between">
              <span>进度: {currentCryptoTaskIndex + 1} / {cryptoTasks.length}</span>
              <span>步骤: {currentCryptoStepIndex + 1} / {task.steps.length}</span>
            </div>
          </div>
        </div>

        {/* Task Display */}
        <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-5 rounded-2xl border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] w-full sm:w-auto max-w-2xl">
          <div className="flex items-center gap-2 text-purple-300 mb-1 sm:mb-2 font-bold text-xs sm:text-xl border-b border-slate-700 pb-1 sm:pb-2">
            <Shield size={16} /> {task.title}
          </div>
          <div className="text-slate-300 text-xs sm:text-sm mt-1 sm:mt-3 mb-2 sm:mb-4">
            {task.description}
          </div>
          
          <div className="bg-slate-800 p-2 sm:p-3 rounded-lg border border-slate-600">
            <div className="text-amber-400 font-bold mb-0.5 sm:mb-1 flex items-center gap-1.5 text-xs sm:text-base">
              <AlertTriangle size={14} /> 当前需求：
            </div>
            <div className="text-white text-xs sm:text-lg">
              {step.instruction}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pointer-events-auto flex justify-center mb-2 sm:mb-4 relative z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-2 w-full max-w-3xl">
          
          {cryptoStatus === 'SUCCESS' ? (
            <div className="flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-4">
              <div className="text-green-400 font-bold text-lg sm:text-2xl flex items-center gap-2">
                <Unlock /> 拦截成功！数据安全！
              </div>
              {!isGameOver && (
                <button 
                  onClick={nextCryptoTask}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold flex items-center gap-2 text-xs sm:text-base transition-transform hover:scale-105 active:scale-95"
                >
                  <Play size={16} /> 进入下一关
                </button>
              )}
            </div>
          ) : cryptoStatus === 'FAILED' ? (
            <div className="flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-4">
              <div className="text-red-400 font-bold text-lg sm:text-2xl flex items-center gap-2">
                <AlertTriangle /> 加密失败，数据泄露！
              </div>
              <button 
                onClick={() => useGameStore.setState({ cryptoStatus: 'PLAYING' })}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-base transition-colors"
              >
                重试本步骤
              </button>
            </div>
          ) : (
            <>
              <div className="text-slate-400 text-xs sm:text-sm font-bold text-center">选择并使用密钥 (Select Key to Apply)</div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-3">
                {keys.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => submitCryptoKey(k.id)}
                    className="flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-purple-500 transition-all text-slate-300 hover:text-white group active:scale-95"
                  >
                    {k.id === 'symmetric_key' ? <FileKey className="group-hover:text-amber-400 mb-1 sm:mb-2 w-5 h-5 sm:w-8 sm:h-8" /> : <Key className="group-hover:text-purple-400 mb-1 sm:mb-2 w-5 h-5 sm:w-8 sm:h-8" />}
                    <div className="text-xs sm:text-sm font-bold text-center leading-tight">{k.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{k.desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
