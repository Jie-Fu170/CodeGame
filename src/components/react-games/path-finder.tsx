import React, { useState } from 'react';
import { Terminal, FolderOpen, FileCode, Check, X, ArrowRight } from 'lucide-react';

const CHALLENGES = [
  { cwd: '/var/log', target: '/var/log/syslog', ans: ['syslog', './syslog'] },
  { cwd: '/etc/nginx/conf.d', target: '/etc/nginx/nginx.conf', ans: ['../nginx.conf'] },
  { cwd: '/usr/bin', target: '/home/user/doc/test.py', ans: ['../../home/user/doc/test.py'] },
  { cwd: '/var/www/html/assets/img', target: '/var/www/html/index.php', ans: ['../../index.php'] }
];

export default function PathFinder() {
  const [level, setLevel] = useState(0);
  const [inputPath, setInputPath] = useState('');
  const [status, setStatus] = useState<'playing' | 'error' | 'success' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');

  const currentChallenge = CHALLENGES[level];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChallenge) return;

    const val = inputPath.trim();
    if (currentChallenge.ans.includes(val)) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      setErrorMsg(`File Not Found: ${val}\n这不是最简相对路径，或者路径不正确。`);
      // Simulate resource deduction or warning
    }
  };

  const nextLevel = () => {
    if (level + 1 >= CHALLENGES.length) {
      setStatus('finished');
    } else {
      setLevel(l => l + 1);
      setInputPath('');
      setStatus('playing');
    }
  };

  if (status === 'finished') {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl p-10 bg-slate-900 flex flex-col items-center justify-center text-center shadow-2xl border border-slate-700 min-h-[500px]">
        <FolderOpen size={80} className="text-amber-400 mb-6" />
        <h2 className="text-4xl font-bold text-white mb-4">路径漫游大师！</h2>
        <p className="text-slate-400 max-w-lg mb-8 text-lg">
          你已经熟练掌握了 Linux 文件系统的绝对与相对路径跳转，这是配置系统环境的必备能力。
        </p>
        <button onClick={() => { setLevel(0); setStatus('playing'); setInputPath(''); }} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-bold transition-all">
          重新挑战
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-[#0c0c0c] text-green-500 border border-slate-800 shadow-2xl flex flex-col min-h-[600px] font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>

      <div className="flex justify-between items-center mb-8 border-b border-green-900 pb-4 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <Terminal size={28} /> 路径漫游指南 (Path Finder)
          </h1>
          <p className="text-green-700 mt-1">输入最简相对路径到达目标文件。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-800">任务进度</div>
          <div className="text-xl font-bold text-green-500">[{level + 1}/{CHALLENGES.length}]</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="bg-[#111] p-6 rounded-xl border border-green-900 mb-8 shadow-inner">
          <div className="flex items-start gap-4 mb-6">
            <FolderOpen className="text-blue-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs text-green-700 uppercase mb-1">当前工作目录 (CWD)</div>
              <div className="text-xl text-blue-300 bg-blue-900/20 px-3 py-1 rounded inline-block">
                {currentChallenge.cwd}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-green-800 mb-6 pl-4">
            <ArrowRight />
            <span className="text-sm border-b border-dashed border-green-800 pb-1">寻找路径...</span>
          </div>

          <div className="flex items-start gap-4">
            <FileCode className="text-amber-400 shrink-0 mt-1" />
            <div>
              <div className="text-xs text-green-700 uppercase mb-1">目标文件绝对路径</div>
              <div className="text-xl text-amber-300 bg-amber-900/20 px-3 py-1 rounded inline-block">
                {currentChallenge.target}
              </div>
            </div>
          </div>
        </div>

        {status === 'success' ? (
          <div className="bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex flex-col items-center animate-in zoom-in duration-300">
            <Check size={48} className="mb-4" />
            <h3 className="text-2xl font-bold mb-2">ACCESS GRANTED</h3>
            <p className="mb-6 text-green-600">成功定位目标文件。</p>
            <button onClick={nextLevel} className="px-8 py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all">
              继续下一个任务
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-auto">
            {status === 'error' && (
              <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-4 animate-bounce">
                <X className="shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{errorMsg}</span>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-green-600 text-sm">请输入相对路径：</label>
              <div className="flex relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700">$ cd</span>
                <input
                  type="text"
                  value={inputPath}
                  onChange={e => setInputPath(e.target.value)}
                  className="w-full bg-black border-2 border-green-900 focus:border-green-500 rounded-lg pl-14 pr-4 py-4 text-xl text-green-400 focus:outline-none focus:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all"
                  placeholder="e.g. ../../target"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-green-900 hover:bg-green-700 text-green-100 px-6 rounded transition-colors font-bold">
                  执行 (Enter)
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
