import React, { useState } from 'react';
import { Database, ArrowRight, RotateCcw, CheckCircle2, Info, Trophy, Table as TableIcon } from 'lucide-react';

const SCENARIOS = [
  {
    type: '1:n (一对多)',
    entities: '部门 (Dept) 与 员工 (Emp)',
    desc: '1 个部门有多个员工，每个员工仅属于 1 个部门。',
    opts: [
      '在部门表 (Dept) 中加入员工 ID (emp_id)',
      '在员工表 (Emp) 中加入部门 ID (dept_id) 作为外键',
      '建立独立的联系表 (Dept_Emp)，包含 (dept_id, emp_id)',
    ],
    correct: 1,
    explain: '对于 1:n 联系，转换时必须将【1 方】的主键 (dept_id) 作为外键放入【n 方】(Emp) 的表结构中！'
  },
  {
    type: 'm:n (多对多)',
    entities: '学生 (Student) 与 课程 (Course)',
    desc: '1 个学生可以选修多门课程，1 门课程有多个学生选修。',
    opts: [
      '在学生表 (Student) 中加入课程 ID (course_id)',
      '在课程表 (Course) 中加入学生 ID (student_id)',
      '建立全新的独立联系表 (SC)，将 student_id 与 course_id 作为复合主键',
    ],
    correct: 2,
    explain: '对于 m:n 联系，必须建立一个【独立的联系表】，将两端的主键作为复合主键放入联系表中！'
  }
];

export default function ERToRelational() {
  const [idx, setIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const current = SCENARIOS[idx];

  const handleSelect = (optIdx: number) => {
    setSelectedOpt(optIdx);
    if (optIdx === current.correct) {
      setErrorMsg(null);
      setSuccessMsg(`🎯 正确！${current.explain}`);
      if (idx < SCENARIOS.length - 1) {
        setTimeout(() => {
          setIdx(i => i + 1);
          setSelectedOpt(null);
          setSuccessMsg(null);
        }, 1500);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`选择错误！${current.explain}`);
    }
  };

  const handleReset = () => {
    setIdx(0);
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
        .er-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .er-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="er-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Database className="text-cyan-400" size={22} />
            E-R 图转关系表工坊
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            1:1、1:n 与 m:n 实体联系转换表结构与外键映射规则
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              E-R 转换案例 ({idx + 1} / {SCENARIOS.length}) &mdash; {current.type}
            </span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 mb-4 leading-relaxed">
            实体与联系：<strong className="text-cyan-300">{current.entities}</strong> ({current.desc})
          </div>

          <div className="text-xs font-bold text-slate-300 mb-3">❓ 转换方案：应如何正确构造关系模式与外键？</div>

          <div className="space-y-2.5 mb-4">
            {current.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedOpt === i
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                <span className="er-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>

          {/* Toast */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && !errorMsg && (
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-cyan-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-cyan-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="er-display text-2xl font-bold text-cyan-400 mb-2">🎉 恭喜通关：E-R 转换工坊大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 <span className="text-cyan-300">1:n (1方主键入n方)</span> 与 <span className="text-indigo-300">m:n (建立独立联系表)</span> 的转换准则！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
