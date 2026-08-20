import { useState } from 'react';

export function CommunityFloatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Dock 内的入口图标 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dock-item"
        title="添加作者微信 / 交流与支持"
      >
        <span className="text-lg leading-none">💬</span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 t-panel border rounded-2xl shadow-2xl p-4 panel-in origin-bottom-right backdrop-blur-xl">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold t-text-1 font-mono">
              添加作者微信
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="t-text-4 hover:opacity-60 transition-opacity leading-none"
            >
              ✕
            </button>
          </div>

          <p className="text-xs t-text-3 mb-4 leading-relaxed">
            交流软考备考经验，讨论设计模式与系统架构，反馈 Bug 或获取最新通关攻略。
          </p>

          <div className="w-full aspect-square bg-white border rounded-xl flex items-center justify-center relative overflow-hidden p-2 shadow-inner">
             <img src="/wechat-qr.png" alt="Author WeChat QR" className="w-full h-full object-contain rounded-lg" />
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
