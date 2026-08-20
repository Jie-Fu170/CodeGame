import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

interface PremiumUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumUnlockModal({ isOpen, onClose }: PremiumUnlockModalProps) {
  const [unlockKey, setUnlockKey] = useState('');
  const [error, setError] = useState(false);
  const { unlockPremium } = useGameStore();

  if (!isOpen) return null;

  const handleUnlock = () => {
    if (unlockKey.trim() === '123') {
      unlockPremium();
      setError(false);
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-900/20 overflow-hidden panel-in">
        
        {/* Header */}
        <div className="bg-slate-800/80 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <h2 className="text-lg font-bold text-slate-200 font-mono">高级考区加密</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-slate-300 text-sm text-center mb-6 leading-relaxed">
            您试图访问的是软考<span className="text-cyan-400 font-bold mx-1">下午大题核心训练区</span>。<br/>
            此区域包含高频易错的架构与算法模拟，<br/>需验证权限后放行。
          </p>

          {/* QR Code Area */}
          <div className="w-48 h-48 bg-white border-2 border-cyan-500/40 rounded-xl flex flex-col items-center justify-center mb-6 relative group overflow-hidden p-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent translate-y-[-100%] group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none z-10"></div>
            <img src="/wechat-qr.png" alt="WeChat QR" className="w-full h-full object-contain rounded-lg relative z-0" />
          </div>

          {/* Input Area */}
          <div className="w-full">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="输入密钥 (测试: 123)"
                value={unlockKey}
                onChange={(e) => setUnlockKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                className={`flex-1 bg-slate-950 border ${error ? 'border-red-500 text-red-400' : 'border-slate-700 text-cyan-400'} rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors`}
              />
              <button
                onClick={handleUnlock}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold font-mono text-sm transition-colors border border-cyan-400/30 shadow-[0_0_15px_rgba(8,145,178,0.3)]"
              >
                解密
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 font-mono animate-pulse">
                &gt; ERROR: 密钥校验失败，访问被拒绝。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
