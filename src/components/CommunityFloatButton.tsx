import { useState } from 'react';

export function CommunityFloatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Dock 内的入口图标 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dock-item"
        title="加入社群 / 支持项目"
      >
        <span className="text-lg leading-none">💬</span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 t-panel border rounded-2xl shadow-2xl p-4 panel-in origin-bottom-right backdrop-blur-xl">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold t-text-1 font-mono">
              加入软考硬核通关群
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="t-text-4 hover:opacity-60 transition-opacity leading-none"
            >
              ✕
            </button>
          </div>

          <p className="text-xs t-text-3 mb-4 leading-relaxed">
            分享软考经验，讨论设计模式与架构难题，反馈 Bug，或者只是想给主理人点个赞。
          </p>

          <div className="w-full aspect-square t-chip border rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
             <span className="text-3xl mb-2">👾</span>
             <span className="text-[10px] t-text-4 font-mono">微信群二维码占位</span>
             {/* 替换为您真实的二维码图片 */}
             {/* <img src="/your-group-qr.png" alt="Group QR" className="absolute inset-0 w-full h-full object-cover" /> */}
          </div>

          <div className="mt-4 flex flex-col gap-2">
             <a
               href="https://github.com/Jie-Fu170/CodeGame"
               target="_blank"
               rel="noreferrer"
               className="t-btn w-full text-center py-2 text-xs font-mono rounded-lg border transition-colors"
             >
               &gt; 给项目点个 Star ★
             </a>
          </div>
        </div>
      )}
    </div>
  );
}
