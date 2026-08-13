import React, { useState } from 'react';
import { Layout, RefreshCw, CheckCircle2, AlertTriangle, UserCheck, Wrench } from 'lucide-react';

interface MaintenanceScenario {
  id: string;
  title: string;
  desc: string;
  correctType: 'CORRECTIVE' | 'ADAPTIVE' | 'PERFECTIVE' | 'PREVENTIVE';
}

const SCENARIOS: MaintenanceScenario[] = [
  {
    id: 'bug_fix',
    title: '用户报修内存泄漏崩溃',
    desc: '修复排查出的隐藏内存泄漏 Bug，恢复系统正常功能',
    correctType: 'CORRECTIVE'
  },
  {
    id: 'os_upgrade',
    title: '操作系统升级适配',
    desc: '因客户操作系统由 Windows 10 升级至 Windows 11，调整系统 API 调用规则',
    correctType: 'ADAPTIVE'
  },
  {
    id: 'new_feature',
    title: '增加微信/支付宝扫码支付',
    desc: '响应业务需求变化，为原单机收银系统增加在线扫码支付新功能',
    correctType: 'PERFECTIVE'
  },
  {
    id: 'refactor',
    title: '重构老旧算法预防未来故障',
    desc: '主动重构未发生故障但结构较差的代码，提升可读性并为未来维护打基础',
    correctType: 'PREVENTIVE'
  },
  {
    id: 'tax_law',
    title: '国家税率法规变更',
    desc: '因国家财税政策调整，更新计税公式配置文件',
    correctType: 'ADAPTIVE'
  },
  {
    id: 'speed_up',
    title: '数据库查询索引性能调优',
    desc: '优化现有订单查询响应速度，将接口延迟由 2s 提升至 100ms',
    correctType: 'PERFECTIVE'
  }
];

export default function AgileScrumBoard() {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectType = (scenarioId: string, type: string) => {
    if (submitted) return;
    setAssignments(prev => ({ ...prev, [scenarioId]: type }));
  };

  const handleCheck = () => {
    let count = 0;
    SCENARIOS.forEach(s => {
      if (assignments[s.id] === s.correctType) {
        count++;
      }
    });
    setScore(count);
    setSubmitted(true);
  };

  const resetGame = () => {
    setAssignments({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-orange-400 flex items-center gap-2">
            <Layout size={28} /> 敏捷 Scrum 看板与 4 种软件维护诊断
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：Scrum/XP 敏捷实践，与改正性、适应性、完善性、预防性维护类型判定
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Agile Info Bar */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1">
          <span className="text-orange-300 font-bold flex items-center gap-1">
            <UserCheck size={14} /> 敏捷开发 Scrum 核心要义:
          </span>
          <p className="text-slate-300">
            Sprint 短周期增量迭代 (1~4周)、Product Backlog、Daily Standup (每日站会 15min)、可交付的软件胜过繁琐的文档。
          </p>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1">
          <span className="text-cyan-300 font-bold flex items-center gap-1">
            <Wrench size={14} /> 极限编程 XP 核心实践:
          </span>
          <p className="text-slate-300">
            Pair Programming (结对编程)、TDD (测试驱动开发)、Continuous Integration (持续集成)、Refactoring (代码重构)。
          </p>
        </div>
      </div>

      {/* Maintenance Scenario Grid */}
      <div className="space-y-4 mb-6">
        <h2 className="text-sm font-bold text-slate-200">案例挑战：请为以下 6 个工程维护案例诊断正确的维护类型：</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map(s => {
            const current = assignments[s.id];
            const isCorrect = submitted && current === s.correctType;
            const isWrong = submitted && current !== s.correctType;

            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-100'
                    : isWrong
                    ? 'bg-red-950/70 border-red-600 text-red-100'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-orange-300 mb-1">{s.title}</div>
                  <div className="text-slate-300">{s.desc}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSelectType(s.id, 'CORRECTIVE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'CORRECTIVE' ? 'bg-red-900 border-red-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    改正性维护 (修Bug)
                  </button>

                  <button
                    onClick={() => handleSelectType(s.id, 'ADAPTIVE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'ADAPTIVE' ? 'bg-amber-900 border-amber-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    适应性维护 (适配OS/法规)
                  </button>

                  <button
                    onClick={() => handleSelectType(s.id, 'PERFECTIVE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'PERFECTIVE' ? 'bg-cyan-900 border-cyan-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    完善性维护 (新功能/性能)
                  </button>

                  <button
                    onClick={() => handleSelectType(s.id, 'PREVENTIVE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'PREVENTIVE' ? 'bg-purple-900 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    预防性维护 (重构/防故障)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action & Results */}
      {!submitted ? (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            disabled={Object.keys(assignments).length < SCENARIOS.length}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              Object.keys(assignments).length === SCENARIOS.length
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle2 size={18} /> 提交诊断结论 (已选择 {Object.keys(assignments).length}/{SCENARIOS.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            score === SCENARIOS.length ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' : 'bg-amber-950/80 border-amber-600 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={32} />
              <div>
                <h3 className="font-bold text-base">维护类型诊断得分: {score} / {SCENARIOS.length}</h3>
                <p className="text-xs opacity-90">
                  {score === SCENARIOS.length ? '🎉 完美解答！彻底吃透了 4 种软件维护类型的判定法则！' : '仍有混淆选项，请参考下方软考公式要点。'}
                </p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600"
            >
              重新诊断
            </button>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-orange-400 text-sm">📘 软考单选题秒杀秘籍：</h4>
            <p>1. <strong>完善性维护 (占比最高 ~50%)</strong>：为了满足用户<strong>新增需求或提升系统性能</strong>（如增加扫码支付、优化速度）。</p>
            <p>2. <strong>适应性维护 (占比 ~25%)</strong>：为了适应外部<strong>环境变化</strong>（如 OS 升级、硬件变更、税率法规变动）。</p>
            <p>3. <strong>改正性维护 (占比 ~20%)</strong>：诊断并改正测试阶段未发现的隐藏 <strong>Software Bug/崩溃</strong>。</p>
            <p>4. <strong>预防性维护 (占比 ~5%)</strong>：为了提高软件未来可维护性而主动进行的代码<strong>重构或预警改造</strong>。</p>
          </div>
        </div>
      )}
    </div>
  );
}
