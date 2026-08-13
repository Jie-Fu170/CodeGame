import React, { useState } from 'react';
import { Database, Lock, Unlock, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DBConcurrencyLock() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Concurrency Inconsistency, 2: Locking Protocol Upgrade, 3: Success

  // Phase 1 Choice: Identify dirty read
  const [phase1Choice, setPhase1Choice] = useState<string | null>(null);
  const [phase1Error, setPhase1Error] = useState('');

  // Phase 2 Protocol Selection
  const [selectedProtocol, setSelectedProtocol] = useState<'LEVEL1' | 'LEVEL2' | 'LEVEL3' | null>(null);
  const [phase2Error, setPhase2Error] = useState('');

  const handleVerifyPhase1 = () => {
    if (phase1Choice === 'DIRTY_READ') {
      setPhase1Error('');
      setPhase(2);
    } else {
      setPhase1Error('判定错误！T1 修改数据未提交即被 T2 读取，随后 T1 回滚，导致 T2 读到的数据无效，此现象称为“脏读”！');
    }
  };

  const handleVerifyPhase2 = () => {
    if (selectedProtocol === 'LEVEL2' || selectedProtocol === 'LEVEL3') {
      setPhase2Error('');
      setPhase(3);
    } else {
      setPhase2Error('一级封锁协议仅要求修改前加 X 锁直至事务结束，无法防止读未提交的数据（脏读）。防止脏读至少需要二级封锁协议！');
    }
  };

  const resetGame = () => {
    setPhase(1);
    setPhase1Choice(null);
    setPhase1Error('');
    setSelectedProtocol(null);
    setPhase2Error('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
            <Database size={28} /> 数据库事务 ACID 与并发锁协议
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：并发异常 (脏读/不可重复读/幻读)、S锁 (共享锁) 与 X锁 (排他锁)、一/二/三级封锁协议
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className={`p-2.5 rounded-lg border ${phase === 1 ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          1. 诊断并发不一致异常
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 提升封锁协议级别
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          3. 通关与考点总结
        </div>
      </div>

      {/* Phase 1 */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Unlock size={18} className="text-purple-400" /> 步骤 1：分析无锁并发冲突案例
            </h2>

            {/* Sequence Simulation Table */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-purple-300 pb-1 border-b border-slate-800">事务执行流视角：</div>
              <div className="grid grid-cols-3 gap-2 py-1 text-slate-300 border-b border-slate-900">
                <span className="text-slate-500">t1:</span>
                <span className="text-cyan-300 font-semibold">T1 事务将账户余额从 $1000 修改为 $500</span>
                <span className="text-slate-600">(未提交 COMMIT)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 text-slate-300 border-b border-slate-900">
                <span className="text-slate-500">t2:</span>
                <span className="text-amber-300 font-semibold">T2 事务读取该账户余额为 $500</span>
                <span className="text-slate-600">(读取了未提交数据)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 text-slate-300">
                <span className="text-slate-500">t3:</span>
                <span className="text-red-400 font-semibold">T1 发生异常，执行 ROLLBACK 撤销修改</span>
                <span className="text-slate-600">(实际余额恢复至 $1000)</span>
              </div>
            </div>

            <p className="text-xs text-slate-200 font-bold">请诊断 T2 事务读取到的 $500 余额属于哪种并发异常？</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setPhase1Choice('DIRTY_READ')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                  phase1Choice === 'DIRTY_READ' ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-sm text-purple-300 mb-1">A. 脏读 (Dirty Read)</div>
                <div>读取到了其他事务未提交且随后回滚的脏数据。</div>
              </button>

              <button
                onClick={() => setPhase1Choice('NON_REPEATABLE')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                  phase1Choice === 'NON_REPEATABLE' ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-sm text-amber-300 mb-1">B. 不可重复读</div>
                <div>同一事务内两次读取同一数据，中途被其他事务 UPDATE/DELETE 改变。</div>
              </button>

              <button
                onClick={() => setPhase1Choice('PHANTOM')}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                  phase1Choice === 'PHANTOM' ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-sm text-cyan-300 mb-1">C. 幻读 (Phantom Read)</div>
                <div>同一事务内两次查询，由于其他事务 INSERT 导致记录行数增多。</div>
              </button>
            </div>

            {phase1Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase1Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase1}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              提交异常诊断
            </button>
          </div>
        </div>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Lock size={18} className="text-amber-400" /> 步骤 2：选择正确的封锁协议消除脏读
            </h2>
            <p className="text-xs text-slate-300">
              请为数据库系统选择最低能<strong>彻底消除脏读 (Dirty Read)</strong> 的封锁协议级别：
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedProtocol('LEVEL1')}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                  selectedProtocol === 'LEVEL1' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-amber-300 text-sm mb-1">一级封锁协议 (Level 1 Protocol)</div>
                <div>修改数据前加 X 锁直至事务结束。读数据不加锁。（只能防丢失修改，无法防脏读）。</div>
              </button>

              <button
                onClick={() => setSelectedProtocol('LEVEL2')}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                  selectedProtocol === 'LEVEL2' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-emerald-300 text-sm mb-1">二级封锁协议 (Level 2 Protocol)</div>
                <div>在一级基础上，读取数据前必须加 S 锁，<strong>读完后立刻释放 S 锁</strong>。（防止读未提交数据，成功消除脏读！）。</div>
              </button>

              <button
                onClick={() => setSelectedProtocol('LEVEL3')}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all ${
                  selectedProtocol === 'LEVEL3' ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-cyan-300 text-sm mb-1">三级封锁协议 (Level 3 Protocol)</div>
                <div>在一级基础上，读取数据前必须加 S 锁，且<strong>保持至事务结束才释放</strong>。（防止脏读与不可重复读）。</div>
              </button>
            </div>

            {phase2Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase2Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase2}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              部署封锁协议
            </button>
          </div>
        </div>
      )}

      {/* Phase 3 */}
      {phase === 3 && (
        <div className="bg-emerald-950/40 p-6 rounded-xl border border-emerald-700 space-y-4 text-center">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-300">通关！彻底理清事务 ACID 与三级封锁协议！</h2>
          
          <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-purple-300 text-sm">📘 软考数据库封锁协议对照口诀：</h4>
            <p>1. <strong>一级封锁协议</strong>：修改加 X 锁至事务结束 $\Rightarrow$ 防止<strong>丢失修改</strong>。</p>
            <p>2. <strong>二级封锁协议</strong>：在一级基础上，读取加 S 锁用完即释放 $\Rightarrow$ 防止<strong>脏读</strong>。</p>
            <p>3. <strong>三级封锁协议</strong>：在一级基础上，读取加 S 锁至事务结束 $\Rightarrow$ 防止<strong>不可重复读</strong>。</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
          >
            再次演练
          </button>
        </div>
      )}
    </div>
  );
}
