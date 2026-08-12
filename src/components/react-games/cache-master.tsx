import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, Clock, AlertTriangle } from 'lucide-react';

type CacheLine = {
  blockId: number | null;
  lastAccess: number;
};

const INITIAL_REQUESTS = [5, 9, 5, 21, 13, 9, 21, 1, 5, 17, 21];

export default function CacheMaster() {
  // 4 Sets, 2 Ways per set
  const [cache, setCache] = useState<CacheLine[][]>(
    Array.from({ length: 4 }, () => [{ blockId: null, lastAccess: 0 }, { blockId: null, lastAccess: 0 }])
  );
  
  const [requests, setRequests] = useState<number[]>(INITIAL_REQUESTS);
  const [reqIndex, setReqIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [logicalTime, setLogicalTime] = useState(1);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const currentReq = reqIndex < requests.length ? requests[reqIndex] : null;
  const targetSet = currentReq !== null ? currentReq % 4 : null;

  const hitRate = (hits + misses) === 0 ? 0 : (hits / (hits + misses));

  const handleSlotClick = (setIdx: number, wayIdx: number) => {
    if (gameOver || currentReq === null) return;
    
    // Check if user clicked the correct set
    if (setIdx !== targetSet) {
      setMessage(`映射错误！块 ${currentReq} 应该映射到 Set ${targetSet} (${currentReq} % 4 = ${targetSet})`);
      return;
    }

    const set = cache[setIdx];
    const isHit = set.some(line => line.blockId === currentReq);
    
    if (isHit) {
      // Must click the matching block
      if (set[wayIdx].blockId !== currentReq) {
        setMessage('该块已在 Cache 中！请点击它以更新访问时间（Hit）。');
        return;
      }
      // Process Hit
      const newCache = [...cache];
      newCache[setIdx][wayIdx].lastAccess = logicalTime;
      setCache(newCache);
      setHits(h => h + 1);
      advance();
    } else {
      // Miss
      const isFull = set.every(line => line.blockId !== null);
      if (isFull) {
        // Eviction needed. Must click the LRU block.
        const lruIdx = set[0].lastAccess < set[1].lastAccess ? 0 : 1;
        if (wayIdx !== lruIdx) {
          setMessage(`替换错误！必须替换最久未使用的块 (LRU) - 上次访问时间更早的那个。`);
          return;
        }
      } else {
        // Not full. Must click empty slot.
        if (set[wayIdx].blockId !== null) {
          setMessage('Set 未满，请存放在空闲槽位！');
          return;
        }
      }
      
      // Process Miss
      const newCache = [...cache];
      newCache[setIdx][wayIdx] = { blockId: currentReq, lastAccess: logicalTime };
      setCache(newCache);
      setMisses(m => m + 1);
      advance();
    }
  };

  const advance = () => {
    setMessage('操作正确！');
    setTimeout(() => setMessage(''), 1000);
    setLogicalTime(t => t + 1);
    if (reqIndex + 1 >= requests.length) {
      setGameOver(true);
    } else {
      setReqIndex(i => i + 1);
    }
  };

  const reset = () => {
    setCache(Array.from({ length: 4 }, () => [{ blockId: null, lastAccess: 0 }, { blockId: null, lastAccess: 0 }]));
    setReqIndex(0);
    setHits(0);
    setMisses(0);
    setLogicalTime(1);
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-[#0f172a] text-slate-200 min-h-[600px] rounded-3xl border-2 border-indigo-900/50 shadow-[0_0_50px_rgba(79,70,229,0.15)] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
            <Cpu size={32} className="text-indigo-400" />
            存储 Cache 物语
          </h1>
          <p className="text-slate-400 mt-2 text-sm">2路组相联映射 | LRU 替换策略 | 4个 Set</p>
        </div>
        
        <div className="flex gap-6 text-sm bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-1">系统时钟</span>
            <span className="text-xl font-mono text-cyan-400 flex items-center gap-1"><Clock size={16}/> {logicalTime}</span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-1">命中率</span>
            <span className={`text-xl font-mono font-bold ${hitRate >= 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {(hitRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-1">Hits / Misses</span>
            <span className="text-lg font-mono text-slate-300"><span className="text-emerald-400">{hits}</span> / <span className="text-rose-400">{misses}</span></span>
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div className="flex gap-8 flex-1">
          {/* Main Memory Requests Side */}
          <div className="w-1/3 flex flex-col gap-4">
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                <HardDrive size={20} className="text-slate-400" /> 内存请求队列
              </h3>
              
              <div className="relative flex-1 flex flex-col items-center justify-center">
                {currentReq !== null && (
                  <div className="absolute top-0 w-full animate-bounce-slow">
                    <div className="bg-indigo-600 border-2 border-indigo-400 p-6 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)] text-center transform transition-all">
                      <div className="text-indigo-200 text-sm font-bold tracking-widest mb-1">当前请求数据块</div>
                      <div className="text-5xl font-black text-white font-mono">{currentReq}</div>
                      <div className="mt-3 text-xs text-indigo-300 bg-indigo-900/50 py-1 px-3 rounded-full inline-block">
                        映射计算: {currentReq} % 4 = ?
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-48 w-full">
                  <div className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-widest">即将到来...</div>
                  <div className="flex flex-wrap gap-2">
                    {requests.slice(reqIndex + 1, reqIndex + 6).map((r, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-700 w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 font-mono text-sm opacity-50">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {message && (
              <div className={`p-4 rounded-xl border ${message.includes('错误') ? 'bg-rose-950/50 border-rose-800 text-rose-300' : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'} text-sm font-bold animate-in fade-in slide-in-from-bottom-2 flex items-start gap-3`}>
                {message.includes('错误') ? <AlertTriangle size={18} className="shrink-0 mt-0.5" /> : <Zap size={18} className="shrink-0 mt-0.5" />}
                {message}
              </div>
            )}
          </div>

          {/* Cache Side */}
          <div className="w-2/3 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
              <Zap size={20} className="text-amber-400" /> Cache (组相联)
            </h3>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {cache.map((set, setIdx) => (
                <div key={setIdx} className={`p-4 rounded-xl border-2 transition-colors ${currentReq !== null && targetSet === setIdx ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-700 bg-slate-800/30'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-lg text-sm border border-slate-600">Set {setIdx}</span>
                    <span className="text-xs text-slate-500">2-Way</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {set.map((line, wayIdx) => {
                      const isLru = set.every(l => l.blockId !== null) && line.lastAccess === Math.min(set[0].lastAccess, set[1].lastAccess);
                      return (
                        <button
                          key={wayIdx}
                          onClick={() => handleSlotClick(setIdx, wayIdx)}
                          className={`w-full text-left relative p-3 rounded-lg border-2 transition-all hover:scale-[1.02] active:scale-95 group ${
                            line.blockId === null 
                              ? 'border-dashed border-slate-600 text-slate-500 hover:border-slate-400 hover:bg-slate-800' 
                              : 'border-slate-600 bg-slate-800 text-slate-200 hover:border-indigo-400 hover:bg-indigo-900/40'
                          }`}
                        >
                          <div className="flex justify-between items-center relative z-10">
                            <span className="font-mono font-bold text-lg">
                              {line.blockId === null ? 'Empty' : `Block ${line.blockId}`}
                            </span>
                            {line.blockId !== null && (
                              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                                t={line.lastAccess}
                              </span>
                            )}
                          </div>
                          
                          {/* LRU Indicator */}
                          {isLru && currentReq !== null && targetSet === setIdx && !set.some(l => l.blockId === currentReq) && (
                            <div className="absolute inset-0 border-2 border-rose-500/50 rounded-lg animate-pulse pointer-events-none"></div>
                          )}
                          {isLru && (
                            <div className="absolute -right-2 -top-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow shadow-rose-900">
                              LRU
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.5)]">
            <Zap size={64} className="text-indigo-400" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">模拟完成！</h2>
          <p className="text-slate-400 max-w-md mb-8">
            你成功处理了所有的内存请求。你的 Cache 命中率为 <strong className="text-indigo-400 text-xl">{(hitRate * 100).toFixed(1)}%</strong>。
            掌握 LRU 替换策略和组相联映射是优化硬件性能的关键。
          </p>
          <button 
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            重新挑战
          </button>
        </div>
      )}
    </div>
  );
}
