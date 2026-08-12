import React, { useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Database, Play, AlertCircle } from 'lucide-react'

export const SQLConsole = () => {
  const { 
    sqlQuestions, 
    currentQuestionIndex, 
    submitAnswers, 
    bossHp, 
    maxBossHp, 
    playerHp, 
    maxPlayerHp,
    aiFeedback
  } = useGameStore()
  
  const [answers, setAnswers] = useState<string[]>([])

  if (currentQuestionIndex >= sqlQuestions.length) return null

  const currentQuestion = sqlQuestions[currentQuestionIndex]

  // When question changes, reset answers
  React.useEffect(() => {
    setAnswers(Array(currentQuestion.blanks.length).fill('???'))
  }, [currentQuestionIndex, currentQuestion])
  const bossHpPercentage = (bossHp / maxBossHp) * 100
  const playerHpPercentage = (playerHp / maxPlayerHp) * 100

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-center z-10 pb-2 sm:pb-6 px-2 sm:px-6">
      {/* Top HUD: HP Bars */}
      <div className="absolute top-10 sm:top-14 left-0 w-full px-3 sm:px-12 flex justify-between items-start gap-2 pointer-events-auto">
        {/* Player HP */}
        <div className="w-1/2 sm:w-64">
          <div className="text-blue-400 font-bold mb-0.5 sm:mb-1 flex justify-between text-xs sm:text-sm">
            <span>架构师 Code</span>
            <span>{playerHp} / {maxPlayerHp}</span>
          </div>
          <div className="h-3 sm:h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${playerHpPercentage}%` }}></div>
          </div>
        </div>

        {/* Boss HP */}
        <div className="w-1/2 sm:w-80 text-right">
          <div className="text-red-400 font-bold mb-0.5 sm:mb-1 flex justify-between flex-row-reverse text-xs sm:text-sm">
            <span className="text-xs sm:text-lg font-black truncate">冗余数据魔王</span>
            <span>{bossHp} / {maxBossHp}</span>
          </div>
          <div className="h-3 sm:h-5 bg-slate-900 rounded-full overflow-hidden border border-red-900 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${bossHpPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* SQL Terminal */}
      <div className="w-full max-w-4xl max-h-[70vh] sm:max-h-[60vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl pointer-events-auto flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-700 flex items-center gap-2 shrink-0">
          <Database size={16} className="text-purple-400" />
          <span className="font-bold text-xs sm:text-sm text-slate-200">数据库海洋控制台 (SQL Terminal)</span>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
          {/* Left: Quest Info */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 p-3 sm:p-4 bg-slate-900/50">
            <h3 className="text-yellow-400 font-bold mb-1 text-xs sm:text-sm">当前任务 ({currentQuestionIndex + 1}/{sqlQuestions.length})</h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-2 sm:mb-4 leading-relaxed">{currentQuestion.task}</p>
            
            <h3 className="text-green-400 font-bold mb-1 text-xs">表结构 (Schema)</h3>
            <code className="block bg-black/50 p-1.5 sm:p-2 rounded text-green-300 text-[10px] sm:text-xs font-mono overflow-x-auto">
              {currentQuestion.schema}
            </code>

            {aiFeedback && !aiFeedback.includes('太强了') && (
              <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-[10px] sm:text-xs flex items-start gap-1.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{aiFeedback}</span>
              </div>
            )}
          </div>

          {/* Right: Input via Fill-in-the-blank */}
          <div className="w-full md:w-2/3 flex flex-col bg-slate-900 p-3 sm:p-6">
            
            {/* Template Area */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-slate-400 text-xs sm:text-sm mb-2 font-semibold">补全 SQL 代码漏洞：</div>
              <div className="bg-slate-950/80 p-3 sm:p-6 rounded-xl border border-slate-700 font-mono text-xs sm:text-lg leading-relaxed text-blue-300 shadow-inner flex flex-wrap items-center gap-1 sm:gap-2">
                {currentQuestion.template.split(/\{(\d+)\}/).map((part: string, index: number) => {
                  if (index % 2 === 0) {
                    // Normal text
                    return <span key={index} className="whitespace-pre-wrap">{part}</span>
                  } else {
                    // Blank dropdown
                    const blankIndex = parseInt(part, 10)
                    const blankDef = currentQuestion.blanks[blankIndex]
                    return (
                      <select
                        key={index}
                        value={answers[blankIndex] || '???'}
                        onChange={(e) => {
                          const newAnswers = [...answers]
                          newAnswers[blankIndex] = e.target.value
                          setAnswers(newAnswers)
                        }}
                        className={`mx-2 px-3 py-1 rounded bg-slate-800 border-b-4 font-bold outline-none cursor-pointer hover:bg-slate-700 transition-colors ${
                          answers[blankIndex] === '???' 
                            ? 'text-yellow-400 border-yellow-600' 
                            : 'text-green-400 border-green-600'
                        }`}
                      >
                        {blankDef.options.map((opt: string, i: number) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )
                  }
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => {
                  if (answers.includes('???')) {
                    alert("请填满所有代码空缺！")
                    return
                  }
                  submitAnswers(answers)
                }}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg active:scale-95 hover:shadow-purple-500/30"
              >
                <Play size={20} fill="currentColor" />
                执行漏洞攻击
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
