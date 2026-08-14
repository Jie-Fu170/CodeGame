import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
      {/* Help Button - Dock 内的一格（定位由 FloatingDock 负责） */}
      <button
        onClick={() => setIsOpen(true)}
        className="dock-item"
        title="查看关卡指南"
      >
        <HelpCircle size={20} />
      </button>

      {/* Modal —— portal 到 body：Dock 的 backdrop-filter 会成为 fixed 后代的包含块，
          不 portal 的话全屏弹窗会被压扁在 Dock 小胶囊内 */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 t-dim backdrop-blur-sm panel-in">
          <div className="t-drawer border rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className={`p-3 sm:p-4 border-b border-[var(--t-panel-bd)] flex justify-between items-center ${theme.bgDeep}`}>
              <div>
                <div className={`${theme.text} text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5`}>
                  操作指南
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white">{currentLevel.title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 min-h-[140px] sm:min-h-[200px] flex items-center overflow-y-auto nav-scroll">
              <div className="w-full">
                <div className="t-text-2 text-xs sm:text-lg leading-relaxed t-panel border p-4 sm:p-6 rounded-xl shadow-inner">
                  {instructions[currentStep]}
                </div>
              </div>
            </div>

            {/* Footer & Navigation */}
            <div className="p-3 sm:p-4 border-t border-[var(--t-panel-bd)] flex items-center justify-between">
              <div className="flex gap-1">
                {instructions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === currentStep ? 'w-4 sm:w-6 ' + theme.bgBar : 'w-1.5 sm:w-2 bg-[var(--t-line)]'}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-1.5 sm:gap-2">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="t-btn p-1.5 sm:p-2 flex items-center justify-center rounded-lg border disabled:opacity-30 transition-colors"
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
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm text-white ${theme.bgSolid} ${theme.bgSolidHover} transition-colors shadow-lg`}
                  >
                    开始挑战！
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};
