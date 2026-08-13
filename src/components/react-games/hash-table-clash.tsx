import React, { useState } from 'react';
import { Hash, RotateCcw, CheckCircle2, Info, Trophy, Sparkles } from 'lucide-react';

const KEYS = [15, 22, 8, 29];
const TABLE_SIZE = 7;

export default function HashTableClash() {
  const [method, setMethod] = useState<'LINEAR' | 'CHAINING'>('LINEAR');

  // Linear probing table
  const [linearTable, setLinearTable] = useState<(number | null)[]>(Array(TABLE_SIZE).fill(null));

  // Chaining table
  const [chainingTable, setChainingTable] = useState<number[][]>(Array(TABLE_SIZE).fill([]).map(() => []));

  const [insertIdx, setInsertIdx] = useState<number>(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentKey = KEYS[insertIdx];

  const handleInsert = () => {
    if (insertIdx >= KEYS.length) {
      setIsCompleted(true);
      return;
    }

    const k = currentKey;
    const initialSlot = k % TABLE_SIZE;

    if (method === 'LINEAR') {
      let slot = initialSlot;
      let probes = 0;

      while (linearTable[slot] !== null && probes < TABLE_SIZE) {
        probes++;
        slot = (initialSlot + probes) % TABLE_SIZE;
      }

      if (probes > 0) {
        setSuccessMsg(`⚠️ 发生哈希冲突！在槽位 ${initialSlot} 冲突，线性探测往后寻找空槽位，最终存入槽位 ${slot}！`);
      } else {
        setSuccessMsg(`哈希值 ${k} % 7 = ${slot}，直接放入空槽位 ${slot}！`);
      }

      setLinearTable(prev => {
        const next = [...prev];
        next[slot] = k;
        return next;
      });
    } else {
      // Chaining
      setChainingTable(prev => {
        const next = prev.map(arr => [...arr]);
        next[initialSlot].push(k);
        return next;
      });
      setSuccessMsg(`拉链法 (Chaining)：哈希值 ${k} % 7 = ${initialSlot}，在槽位 ${initialSlot} 链表尾部挂载 ${k}！`);
    }

    const nextIdx = insertIdx + 1;
    setInsertIdx(nextIdx);

    if (nextIdx >= KEYS.length) {
      setTimeout(() => setIsCompleted(true), 600);
    }
  };

  const handleReset = () => {
    setLinearTable(Array(TABLE_SIZE).fill(null));
    setChainingTable(Array(TABLE_SIZE).fill([]).map(() => []));
    setInsertIdx(0);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800"
      style={{
        background: '#090d16',
        backgroundImage: 'radial-gradient(circle, #1a2438 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#e2e8f0'
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .ht-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ht-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ht-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Hash className="text-emerald-400" size={22} />
            哈希冲突与散列表收纳
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            散列函数 $H(key) = key \bmod 7$、开放定址线性探测法与拉链法 (Chaining) 解决冲突
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { setMethod('LINEAR'); handleReset(); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${method === 'LINEAR' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            线性探测法 (Linear)
          </button>
          <button
            onClick={() => { setMethod('CHAINING'); handleReset(); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${method === 'CHAINING' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            拉链法 (Chaining)
          </button>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                待插入关键字序列
              </div>
              <div className="flex gap-2 mb-4">
                {KEYS.map((k, i) => (
                  <span
                    key={i}
                    className={`ht-mono text-xs px-2.5 py-1.5 rounded-lg font-bold ${
                      i === insertIdx
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                        : i < insertIdx
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}>
                    {k}
                  </span>
                ))}
              </div>

              {insertIdx < KEYS.length && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div>当前待插入: <span className="ht-mono text-emerald-400 font-bold">{currentKey}</span></div>
                  <div>初始哈希值: <span className="ht-mono text-cyan-300 font-bold">{currentKey} % 7 = {currentKey % 7}</span></div>
                </div>
              )}
            </div>

            <button
              onClick={handleInsert}
              className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
              <Sparkles size={14} /> 插入关键字 {currentKey}
            </button>
          </div>

          {/* Right Panel: Hash Table Visual */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              散列表 Hash Table ($m=7$) 可视化
            </div>

            <div className="space-y-1.5">
              {Array.from({ length: TABLE_SIZE }).map((_, slotIdx) => (
                <div key={slotIdx} className="flex items-center gap-2 text-xs">
                  <span className="ht-mono w-14 text-slate-500 text-right shrink-0">槽位 [{slotIdx}]</span>
                  <div className="flex-1 bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center min-h-[36px]">
                    {method === 'LINEAR' ? (
                      linearTable[slotIdx] !== null ? (
                        <span className="ht-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          {linearTable[slotIdx]}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600 ht-mono">空位</span>
                      )
                    ) : (
                      chainingTable[slotIdx].length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          {chainingTable[slotIdx].map((val, i) => (
                            <React.Fragment key={i}>
                              <span className="ht-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                                {val}
                              </span>
                              {i < chainingTable[slotIdx].length - 1 && <span className="text-slate-600">&rarr;</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600 ht-mono">NULL</span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback message */}
            {successMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-emerald-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ht-display text-2xl font-bold text-emerald-400 mb-2">🎉 恭喜通关：散列表收纳大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了开放定址线性探测法与拉链法 (Chaining) 解决哈希冲突的全部过程！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
