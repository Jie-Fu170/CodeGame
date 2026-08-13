import React, { useState } from 'react';
import { Disc, Play, RotateCcw, CheckCircle2, Info, Trophy, Gauge } from 'lucide-react';

const INITIAL_HEAD = 53;
const REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67];

// Calculate sequences and total distances
function getFCFS() {
  let curr = INITIAL_HEAD;
  let dist = 0;
  const seq = [curr];
  for (const r of REQUESTS) {
    dist += Math.abs(r - curr);
    curr = r;
    seq.push(curr);
  }
  return { seq, dist };
}

function getSSTF() {
  let curr = INITIAL_HEAD;
  let dist = 0;
  const seq = [curr];
  const pending = [...REQUESTS];
  while (pending.length > 0) {
    pending.sort((a, b) => Math.abs(a - curr) - Math.abs(b - curr));
    const next = pending.shift()!;
    dist += Math.abs(next - curr);
    curr = next;
    seq.push(curr);
  }
  return { seq, dist };
}

function getSCAN() {
  // Moving upwards first (increasing tracks)
  let curr = INITIAL_HEAD;
  let dist = 0;
  const seq = [curr];
  const up = REQUESTS.filter(r => r >= curr).sort((a, b) => a - b);
  const down = REQUESTS.filter(r => r < curr).sort((a, b) => b - a);

  for (const r of up) {
    dist += Math.abs(r - curr);
    curr = r;
    seq.push(curr);
  }
  for (const r of down) {
    dist += Math.abs(r - curr);
    curr = r;
    seq.push(curr);
  }
  return { seq, dist };
}

export default function DiskScheduler() {
  const [algo, setAlgo] = useState<'FCFS' | 'SSTF' | 'SCAN'>('FCFS');
  const [completedAlgos, setCompletedAlgos] = useState<Record<string, boolean>>({});

  const fcfsRes = getFCFS();
  const sstfRes = getSSTF();
  const scanRes = getSCAN();

  const currentRes = algo === 'FCFS' ? fcfsRes : algo === 'SSTF' ? sstfRes : scanRes;

  const handleTestAlgo = () => {
    setCompletedAlgos(prev => ({ ...prev, [algo]: true }));
  };

  const isCompleted = completedAlgos.FCFS && completedAlgos.SSTF && completedAlgos.SCAN;

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
        .ds-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ds-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ds-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Disc className="text-amber-400" size={22} />
            磁盘调度算法磁头车间
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            FCFS 先来先服务、SSTF 最短寻道时间优先、SCAN 电梯算法磁头寻道计算
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          磁头初始位置: <span className="ds-mono font-bold text-amber-300">磁道 {INITIAL_HEAD}</span>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Controls & Algorithm Picker */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                选择磁盘调度算法
              </div>

              <div className="space-y-2 mb-4">
                {[
                  { key: 'FCFS', name: 'FCFS (先来先服务)', desc: '按请求到达的先后顺序依次服务，容易产生大量磁头往返摇摆。' },
                  { key: 'SSTF', name: 'SSTF (最短寻道时间优先)', desc: '优先选择距离当前磁头最近的磁道，显著减少寻道总距离。' },
                  { key: 'SCAN', name: 'SCAN (电梯扫描算法)', desc: '磁头单向移动扫描到顶，反向返回，彻底避免“饥饿”现象。' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setAlgo(item.key as any)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      algo === item.key
                        ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="ds-mono font-bold text-xs">{item.name}</span>
                      {completedAlgos[item.key] && <CheckCircle2 size={14} className="text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTestAlgo}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20">
              <Play size={14} /> 模拟执行 {algo} 寻道路线
            </button>
          </div>

          {/* Right Visual & Calculation */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge size={14} className="text-amber-400" />
                  磁头移动轨迹与寻道距离
                </span>
                <span className="ds-mono text-xs text-amber-300 font-bold">
                  总寻道磁道数: {currentRes.dist}
                </span>
              </div>

              {/* Request Sequence Visual */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                <div className="text-[11px] text-slate-400 mb-2">访问顺序:</div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {currentRes.seq.map((track, i) => (
                    <React.Fragment key={i}>
                      <span className={`ds-mono text-xs px-2 py-1 rounded font-bold ${i === 0 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>
                        {track}
                      </span>
                      {i < currentRes.seq.length - 1 && <span className="text-slate-600 text-xs">&rarr;</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Track scale bar (0 to 200) */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[10px] ds-mono text-slate-500 mb-1">
                  <span>磁道 0</span>
                  <span>磁道 100</span>
                  <span>磁道 200</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full relative overflow-hidden">
                  {currentRes.seq.map((t, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-1 bg-amber-400"
                      style={{ left: `${(t / 200) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              💡 <strong className="text-slate-200">对比结论：</strong> FCFS (寻道距离: {fcfsRes.dist}) &gt; SSTF (寻道距离: {sstfRes.dist}) &ge; SCAN (寻道距离: {scanRes.dist})。SSTF 与 SCAN 的寻道效率远高于 FCFS！
            </div>
          </div>
        </div>
      )}

      {/* Completion Victory Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-amber-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ds-display text-2xl font-bold text-amber-400 mb-2">🎉 恭喜通关：磁盘调度大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经掌握了 FCFS (公平无极)、SSTF (就近寻道) 和 SCAN (电梯扫描) 的全部磁头寻道算法原理与平均寻道时间计算！
          </p>

          <button
            onClick={() => setCompletedAlgos({})}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
