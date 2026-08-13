import React, { useState, useEffect } from 'react';
import { TrafficCone, ShieldAlert, CheckCircle2, RotateCcw, Info, Trophy, Play, ArrowRight, Activity, AlertTriangle } from 'lucide-react';

interface ProcessCar {
  id: string;
  name: string;
  status: 'waiting' | 'in_critical' | 'blocked' | 'done';
  color: string;
  borderColor: string;
}

export default function PVSemaphore() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // --- STAGE 1: Mutex Critical Section ---
  const [mutexVal, setMutexVal] = useState<number>(1);
  const [cars, setCars] = useState<ProcessCar[]>([
    { id: 'p1', name: '进程 P1 (小车1)', status: 'waiting', color: 'bg-cyan-500', borderColor: 'border-cyan-400' },
    { id: 'p2', name: '进程 P2 (小车2)', status: 'waiting', color: 'bg-indigo-500', borderColor: 'border-indigo-400' },
    { id: 'p3', name: '进程 P3 (小车3)', status: 'waiting', color: 'bg-amber-500', borderColor: 'border-amber-400' },
  ]);
  const [inCriticalCar, setInCriticalCar] = useState<ProcessCar | null>(null);
  const [blockedQueue, setBlockedQueue] = useState<ProcessCar[]>([]);

  // --- STAGE 2: Producer-Consumer Buffer ---
  const [emptyVal, setEmptyVal] = useState<number>(3);
  const [fullVal, setFullVal] = useState<number>(0);
  const [bufferMutexVal, setBufferMutexVal] = useState<number>(1);
  const [bufferItems, setBufferItems] = useState<string[]>([]);
  const [pcStep, setPcStep] = useState<number>(0);
  const [pcLog, setPcLog] = useState<string[]>([]);

  // --- STAGE 3: Deadlock Quiz ---
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  // Messaging & Shake
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(t);
  }, [shake]);

  // STAGE 1 Actions
  const handleP = () => {
    // Find next process wanting to enter
    const nextWaiting = cars.find(c => c.status === 'waiting');
    if (!nextWaiting) {
      if (inCriticalCar) {
        setErrorMsg('当前临界区内已有进程正在运行，请先执行 V(Mutex) 释放资源！');
      } else {
        setErrorMsg('没有正在等待进入的进程了！');
      }
      setShake(true);
      return;
    }

    setErrorMsg(null);
    const newMutex = mutexVal - 1;
    setMutexVal(newMutex);

    if (mutexVal > 0 && !inCriticalCar) {
      // Enter critical section immediately
      setInCriticalCar(nextWaiting);
      setCars(prev => prev.map(c => c.id === nextWaiting.id ? { ...c, status: 'in_critical' } : c));
      setSuccessMsg(`P(Mutex) 执行成功！Mutex 减为 ${newMutex}，【${nextWaiting.name}】进入临界区单行桥！`);
    } else {
      // Must be blocked because critical section is occupied
      setBlockedQueue(prev => [...prev, nextWaiting]);
      setCars(prev => prev.map(c => c.id === nextWaiting.id ? { ...c, status: 'blocked' } : c));
      setSuccessMsg(`P(Mutex) 执行！Mutex 减为 ${newMutex} < 0，【${nextWaiting.name}】由于资源不足被【阻塞入队】！`);
    }
  };

  const handleV = () => {
    if (!inCriticalCar) {
      setErrorMsg('当前临界区没有运行中的进程，不需要释放信号量！');
      setShake(true);
      return;
    }

    setErrorMsg(null);
    const newMutex = mutexVal + 1;
    setMutexVal(newMutex);

    // Current car leaves
    const leavingCar = inCriticalCar;
    setCars(prev => prev.map(c => c.id === leavingCar.id ? { ...c, status: 'done' } : c));

    if (blockedQueue.length > 0) {
      // Wake up first blocked process
      const awakened = blockedQueue[0];
      setBlockedQueue(prev => prev.slice(1));
      setInCriticalCar(awakened);
      setCars(prev => prev.map(c => c.id === awakened.id ? { ...c, status: 'in_critical' } : c));
      setSuccessMsg(`V(Mutex) 执行！Mutex 加为 ${newMutex} <= 0，【${leavingCar.name}】离开临界区，成功从阻塞队列唤醒【${awakened.name}】进入临界区！`);
    } else {
      setInCriticalCar(null);
      setSuccessMsg(`V(Mutex) 执行！Mutex 加为 ${newMutex}，【${leavingCar.name}】离开临界区，临界区现在空闲。`);
    }
  };

  // Stage 1 Victory check
  useEffect(() => {
    if (stage === 1 && cars.every(c => c.status === 'done')) {
      setTimeout(() => {
        setSuccessMsg('🎉 阶段 1 成功！所有进程已通过 PV 操作安全穿过临界区，没有发生相撞！');
      }, 300);
    }
  }, [cars, stage]);

  // STAGE 2 Actions (Producer / Consumer sequence simulation)
  const PC_SEQUENCE = [
    { type: 'producer', action: 'P(empty)', desc: '生产者申请空缓冲区位: empty = 3 -> 2' },
    { type: 'producer', action: 'P(mutex)', desc: '生产者申请缓冲区互斥锁: mutex = 1 -> 0' },
    { type: 'producer', action: 'put_item', desc: '生产者将数据块 A 放入缓冲区' },
    { type: 'producer', action: 'V(mutex)', desc: '生产者释放缓冲区互斥锁: mutex = 0 -> 1' },
    { type: 'producer', action: 'V(full)', desc: '生产者增加已有数据量: full = 0 -> 1' },
    { type: 'consumer', action: 'P(full)', desc: '消费者申请已有数据: full = 1 -> 0' },
    { type: 'consumer', action: 'P(mutex)', desc: '消费者申请缓冲区互斥锁: mutex = 1 -> 0' },
    { type: 'consumer', action: 'get_item', desc: '消费者从缓冲区取出数据块 A' },
    { type: 'consumer', action: 'V(mutex)', desc: '消费者释放缓冲区互斥锁: mutex = 0 -> 1' },
    { type: 'consumer', action: 'V(empty)', desc: '消费者增加空缓冲区位: empty = 2 -> 3' },
  ];

  const handleStepPC = (clickedAction: string) => {
    const expected = PC_SEQUENCE[pcStep];
    if (clickedAction !== expected.action) {
      setErrorMsg(`顺序错误！正确的生产者-消费者 PV 顺序应为【${expected.action}】(${expected.desc})`);
      setShake(true);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(`执行成功: ${expected.desc}`);
    setPcLog(prev => [...prev, `${expected.action} -> ${expected.desc}`]);

    // Update state based on step
    if (expected.action === 'P(empty)') setEmptyVal(e => e - 1);
    if (expected.action === 'V(empty)') setEmptyVal(e => e + 1);
    if (expected.action === 'P(full)') setFullVal(f => f - 1);
    if (expected.action === 'V(full)') setFullVal(f => f + 1);
    if (expected.action === 'P(mutex)') setBufferMutexVal(m => m - 1);
    if (expected.action === 'V(mutex)') setBufferMutexVal(m => m + 1);
    if (expected.action === 'put_item') setBufferItems(prev => [...prev, '📦 数据块']);
    if (expected.action === 'get_item') setBufferItems(prev => prev.slice(1));

    const nextStep = pcStep + 1;
    setPcStep(nextStep);

    if (nextStep >= PC_SEQUENCE.length) {
      setTimeout(() => {
        setSuccessMsg('🎉 阶段 2 完成！你已成功演示生产者与消费者的完整同步与互斥逻辑！');
      }, 300);
    }
  };

  // STAGE 3 Quiz Questions
  const QUIZ_QUESTIONS = [
    {
      q: '在生产者-消费者问题中，若生产者先执行 P(mutex) 再执行 P(empty)，当缓冲区已满时会发生什么？',
      opts: [
        '没有任何影响，系统照常运行',
        '死锁：生产者占有 mutex 锁并等待 empty，而消费者因获取不到 mutex 锁无法消费释放 empty',
        '缓冲区会自动扩容',
        '生产者会被直接强制终止'
      ],
      correct: 1,
      explain: '绝对不能在申请资源信号量 P(empty) 之前先拿互斥锁 P(mutex)！否则会导致带锁阻塞，产生死锁！'
    },
    {
      q: '若信号量 S 的当前值为 -3，则其物理含义是：',
      opts: [
        '系统中有 3 个可用资源',
        '系统共有 -3 个资源',
        '当前有 3 个进程正在等待/阻塞在信号量 S 的等待队列中',
        '当前有 3 个进程正在临界区中运行'
      ],
      correct: 2,
      explain: '当 S < 0 时，|S|（绝对值）即表示由于缺乏资源而被阻塞在等待队列中的进程数量！'
    },
    {
      q: '若有 N 个进程共享 1 种资源，每个进程需要 3 个资源，为了保证系统永远不会发生死锁，至少需要多少个资源？',
      opts: [
        '3N 个',
        '2N + 1 个',
        'N + 3 个',
        '2N 个'
      ],
      correct: 1,
      explain: '极高频公式：极限极端情况下每个进程分到 (3-1)=2 个资源仍无法运行，此时只要再多给 1 个资源就能打破死锁！公式为 N × (3-1) + 1 = 2N + 1。'
    }
  ];

  const handleQuizAnswer = (optIdx: number) => {
    setSelectedOpt(optIdx);
    const q = QUIZ_QUESTIONS[quizIdx];

    if (optIdx !== q.correct) {
      setErrorMsg(`回答错误！${q.explain}`);
      setShake(true);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(`🎯 答案正确！${q.explain}`);

    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setQuizIdx(i => i + 1);
        setSelectedOpt(null);
        setSuccessMsg(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 800);
    }
  };

  const handleReset = () => {
    setStage(1);
    setMutexVal(1);
    setCars([
      { id: 'p1', name: '进程 P1 (小车1)', status: 'waiting', color: 'bg-cyan-500', borderColor: 'border-cyan-400' },
      { id: 'p2', name: '进程 P2 (小车2)', status: 'waiting', color: 'bg-indigo-500', borderColor: 'border-indigo-400' },
      { id: 'p3', name: '进程 P3 (小车3)', status: 'waiting', color: 'bg-amber-500', borderColor: 'border-amber-400' },
    ]);
    setInCriticalCar(null);
    setBlockedQueue([]);
    setEmptyVal(3);
    setFullVal(0);
    setBufferMutexVal(1);
    setBufferItems([]);
    setPcStep(0);
    setPcLog([]);
    setQuizIdx(0);
    setSelectedOpt(null);
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
        .pv-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .pv-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes pvShake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-5px)} 40%,60%{transform:translateX(5px)} }
        .pv-shake { animation: pvShake 0.4s ease-in-out; }
      `}</style>

      {/* Title & Stage Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="pv-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <TrafficCone className="text-amber-400" size={22} />
            PV 信号量交通局
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            操作系统进程同步与互斥、P(wait)/V(signal) 信号量机制实战
          </p>
        </div>

        {/* Stage selection */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { if (stage !== 1) setStage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${stage === 1 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <Activity size={14} /> 阶段1: 单行桥互斥
          </button>
          <button
            disabled={!cars.every(c => c.status === 'done')}
            onClick={() => { if (stage !== 2 && cars.every(c => c.status === 'done')) setStage(2); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${!cars.every(c => c.status === 'done') ? 'opacity-40 cursor-not-allowed text-slate-500' : stage === 2 ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <Play size={14} /> 阶段2: 生产者-消费者
          </button>
          <button
            disabled={pcStep < PC_SEQUENCE.length}
            onClick={() => { if (stage !== 3 && pcStep >= PC_SEQUENCE.length) setStage(3); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${pcStep < PC_SEQUENCE.length ? 'opacity-40 cursor-not-allowed text-slate-500' : stage === 3 ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <ShieldAlert size={14} /> 阶段3: 死锁规避考点
          </button>
        </div>
      </div>

      {!isCompleted && (
        <>
          {/* STAGE 1: MUTEX SINGLE BRIDGE */}
          {stage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Panel: Semaphore HUD & Controls */}
              <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    信号量控制台 (Semaphore Panel)
                  </div>

                  {/* Mutex Value Display */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mb-4">
                    <div className="text-xs text-slate-400 mb-1">信号量 <span className="pv-mono font-bold text-amber-400">Mutex</span> 当前数值</div>
                    <div className={`pv-mono text-3xl font-bold ${mutexVal > 0 ? 'text-emerald-400' : mutexVal === 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {mutexVal}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {mutexVal > 0 ? '资源可用 (桥空闲)' : mutexVal === 0 ? '临界区被占用 (无人等待)' : `资源不足，|${mutexVal}| 个进程阻塞`}
                    </div>
                  </div>

                  {/* P & V Operation Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={handleP}
                      className="p-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl text-amber-300 transition-all font-bold text-xs flex flex-col items-center gap-1 shadow-lg">
                      <span className="pv-mono text-base">P(Mutex)</span>
                      <span className="text-[10px] text-amber-400/80 font-normal">Mutex = Mutex - 1</span>
                    </button>

                    <button
                      onClick={handleV}
                      className="p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl text-cyan-300 transition-all font-bold text-xs flex flex-col items-center gap-1 shadow-lg">
                      <span className="pv-mono text-base">V(Mutex)</span>
                      <span className="text-[10px] text-cyan-400/80 font-normal">Mutex = Mutex + 1</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  💡 <strong className="text-slate-200">提示：</strong> 按下 <span className="text-amber-300">P(Mutex)</span> 让等待中的小车申请进桥；当桥上有车时按下 <span className="text-cyan-300">V(Mutex)</span> 让其过桥离场并唤醒队列中的车！
                </div>
              </div>

              {/* Right Panel: Bridge / Critical Section Visual */}
              <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    临界区单行桥 (Critical Section Bridge)
                  </div>

                  {/* The Bridge (Critical Section) */}
                  <div className="border-2 border-dashed border-amber-500/40 bg-amber-950/20 rounded-xl p-4 min-h-[90px] flex items-center justify-center relative mb-4">
                    <span className="absolute top-1.5 left-2 text-[10px] pv-mono text-amber-400/80 uppercase font-bold">
                      [临界区 Critical Section] (最多容纳 1 辆车)
                    </span>

                    {inCriticalCar ? (
                      <div className={`p-3 rounded-lg border ${inCriticalCar.borderColor} bg-slate-900 text-slate-100 flex items-center gap-2 shadow-xl animate-pulse`}>
                        <span className={`w-3 h-3 rounded-full ${inCriticalCar.color}`} />
                        <span className="text-xs font-bold">{inCriticalCar.name}</span>
                        <span className="pv-mono text-[10px] text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded">过桥中...</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">桥上当前无车 (空闲)</span>
                    )}
                  </div>

                  {/* Process Lists: Waiting Queue vs Blocked Queue */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Waiting queue */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-slate-400 mb-2">等待发车队列 (Waiting)</div>
                      <div className="space-y-1.5">
                        {cars.filter(c => c.status === 'waiting').length === 0 ? (
                          <span className="text-[11px] text-slate-600">无车</span>
                        ) : (
                          cars.filter(c => c.status === 'waiting').map(c => (
                            <div key={c.id} className="text-xs p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${c.color}`} />
                              <span>{c.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Blocked queue */}
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <div className="text-[11px] font-bold text-rose-400 mb-2 flex items-center gap-1">
                        <AlertTriangle size={12} /> 阻塞等待队列 (Blocked)
                      </div>
                      <div className="space-y-1.5">
                        {blockedQueue.length === 0 ? (
                          <span className="text-[11px] text-slate-600">队列为空</span>
                        ) : (
                          blockedQueue.map(c => (
                            <div key={c.id} className="text-xs p-1.5 rounded bg-rose-950/40 border border-rose-900 text-rose-300 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${c.color}`} />
                              <span>{c.name} (阻塞)</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {cars.every(c => c.status === 'done') && (
                  <button
                    onClick={() => setStage(2)}
                    className="w-full mt-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20">
                    进入阶段 2：生产者-消费者多信号量协同 <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 2: PRODUCER-CONSUMER BUFFER */}
          {stage === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Panel: Real-time Semaphores & Buffer Visual */}
              <div className="md:col-span-6 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    缓冲区 & 3 信号量状态
                  </div>

                  {/* 3 Semaphores HUD */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Empty (空位)</div>
                      <div className="pv-mono text-xl font-bold text-cyan-400">{emptyVal}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Full (已有)</div>
                      <div className="pv-mono text-xl font-bold text-indigo-400">{fullVal}</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Mutex (锁)</div>
                      <div className="pv-mono text-xl font-bold text-amber-400">{bufferMutexVal}</div>
                    </div>
                  </div>

                  {/* Buffer Box */}
                  <div className="border border-slate-700 bg-slate-950 rounded-xl p-3 mb-3">
                    <div className="text-[11px] text-slate-400 mb-2">共享缓冲区槽位 (Capacity: 3)</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((slotIdx) => (
                        <div
                          key={slotIdx}
                          className={`h-12 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                            bufferItems[slotIdx]
                              ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200 shadow-md'
                              : 'border-dashed border-slate-800 bg-slate-900/40 text-slate-600'
                          }`}>
                          {bufferItems[slotIdx] || '空槽位'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Log list */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-h-[100px] overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-500 mb-1">PV 操作日志</div>
                  {pcLog.length === 0 ? (
                    <span className="text-[10px] text-slate-600">等待操作执行...</span>
                  ) : (
                    pcLog.map((log, i) => (
                      <div key={i} className="text-[10px] pv-mono text-slate-300 py-0.5 border-b border-slate-900">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel: Step Sequence Picker */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    请点击下方正确的下一步 PV 操作，演示【生产者放数据】与【消费者拿数据】：
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { action: 'P(empty)', label: 'P(empty) 申请空位' },
                      { action: 'P(full)', label: 'P(full) 申请已有数据' },
                      { action: 'P(mutex)', label: 'P(mutex) 锁定缓冲区' },
                      { action: 'V(mutex)', label: 'V(mutex) 解锁缓冲区' },
                      { action: 'put_item', label: '放入数据块' },
                      { action: 'get_item', label: '取出数据块' },
                      { action: 'V(full)', label: 'V(full) 数据量+1' },
                      { action: 'V(empty)', label: 'V(empty) 空位数+1' },
                    ].map((btn) => (
                      <button
                        key={btn.action}
                        onClick={() => handleStepPC(btn.action)}
                        className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-600 text-left text-xs font-bold text-slate-200 transition-all hover:scale-[1.01]">
                        <span className="pv-mono text-cyan-400 block text-[11px]">{btn.action}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {pcStep >= PC_SEQUENCE.length && (
                  <button
                    onClick={() => setStage(3)}
                    className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20">
                    进入阶段 3：死锁避坑考点诊断 <ShieldAlert size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 3: DEADLOCK QUIZ */}
          {stage === 3 && (
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    软考核心大题真题复演 ({quizIdx + 1} / {QUIZ_QUESTIONS.length})
                  </span>
                  <h3 className="pv-display text-base font-bold text-slate-100 mt-0.5">
                    PV 操作与死锁避坑诊断
                  </h3>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 mb-4 leading-relaxed font-medium">
                ❓ {QUIZ_QUESTIONS[quizIdx].q}
              </div>

              <div className="space-y-2 mb-4">
                {QUIZ_QUESTIONS[quizIdx].opts.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
                      }`}>
                      <span className="pv-mono font-bold mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          <div className="mt-4 min-h-[40px]">
            {errorMsg && (
              <div className={`p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2 ${shake ? 'pv-shake' : ''}`}>
                <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Completion Victory Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-amber-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="pv-display text-2xl font-bold text-amber-400 mb-2">🎉 恭喜通关：PV 信号量交通局！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经彻底掌握了 <span className="text-amber-300">PV 信号量数值变化规律</span>、<span className="text-cyan-300">生产者-消费者同步算法</span> 以及 <span className="text-emerald-300">死锁规避核心计算公式</span>！
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-lg mx-auto text-left text-xs text-slate-400 space-y-2 mb-6">
            <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">💡 PV 操作口诀与考点速记：</div>
            <div>• <strong className="text-amber-300">P(S) 操作：</strong> $S = S - 1$，若 $S < 0$ 进程阻塞入队；相当于【申请资源】。</div>
            <div>• <strong className="text-cyan-300">V(S) 操作：</strong> $S = S + 1$，若 $S \le 0$ 从队列唤醒一个进程；相当于【释放资源】。</div>
            <div>• <strong className="text-emerald-300">防死锁公式：</strong> $N$ 个进程各自需要 $M$ 个资源，保证死锁不发生的最小资源数 $R = N \times (M-1) + 1$。</div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
