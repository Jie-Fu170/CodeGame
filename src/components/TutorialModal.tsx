import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { LEVELS } from '../config/levels';
import { getLevelTheme } from '../config/theme';

export const TutorialModal: React.FC = () => {
  const { currentLevelId } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);
  const instructions = currentLevel?.instructions || [
    '这个关卡暂未提供详细引导，请自行探索规律！',
    '注意观察界面上的信息提示，如果遇到困难，可以尝试切换不同的策略。'
  ];

  // Reset step when level changes or modal opens
  useEffect(() => {
    setCurrentStep(0);
  }, [currentLevelId, isOpen]);



  if (!currentLevel) return null;

  const theme = getLevelTheme(currentLevel.themeColor);

  return (
    <>
      {/* Help Button - positioned above the voice toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 sm:bottom-20 right-3 sm:right-4 z-40 p-2.5 sm:p-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full shadow-lg border border-slate-700 transition-all"
        title="查看关卡指南"
      >
        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className={`p-3 sm:p-4 border-b border-slate-800 flex justify-between items-center ${theme.bgDeep}`}>
              <div>
                <div className={`${theme.text} text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5`}>
                  操作指南
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white">{currentLevel.title}</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 min-h-[140px] sm:min-h-[200px] flex items-center overflow-y-auto">
              <div className="w-full">
                <div className="text-slate-300 text-xs sm:text-lg leading-relaxed bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700/50 shadow-inner">
                  {instructions[currentStep]}
                </div>
              </div>
            </div>

            {/* Footer & Navigation */}
            <div className="p-3 sm:p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
              <div className="flex gap-1">
                {instructions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === currentStep ? 'w-4 sm:w-6 ' + theme.bgBar : 'w-1.5 sm:w-2 bg-slate-700'}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="p-1.5 sm:p-2 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {currentStep < instructions.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-1 rounded-lg font-bold text-xs sm:text-sm text-white ${theme.bgSolid} ${theme.bgSolidHover} transition-colors`}
                  >
                    下一步
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    开始挑战！
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
