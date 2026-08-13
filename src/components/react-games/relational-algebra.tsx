import React, { useState } from 'react';
import { Database, Filter, Columns, GitMerge, CheckCircle2, RotateCcw, Info, Trophy, Table as TableIcon } from 'lucide-react';

interface StudentRow {
  sno: string;
  sname: string;
  dept: string;
}

interface ScoreRow {
  sno: string;
  cno: string;
  grade: number;
}

const STUDENTS: StudentRow[] = [
  { sno: 'S1', sname: '张三', dept: 'CS' },
  { sno: 'S2', sname: '李四', dept: 'EE' },
  { sno: 'S3', sname: '王五', dept: 'CS' },
  { sno: 'S4', sname: '赵六', dept: 'MA' },
];

const SCORES: ScoreRow[] = [
  { sno: 'S1', cno: 'C1', grade: 95 },
  { sno: 'S1', cno: 'C2', grade: 88 },
  { sno: 'S2', cno: 'C1', grade: 76 },
  { sno: 'S3', cno: 'C2', grade: 90 },
];

export default function RelationalAlgebra() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Stage 1: Selection (sigma)
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Stage 2: Projection (pi)
  const [projCols, setProjCols] = useState<{ sno: boolean; sname: boolean; dept: boolean }>({
    sno: true,
    sname: true,
    dept: true,
  });

  // Stage 3: Natural Join (bowtie) vs Cartesian Product (X)
  const [chosenOp, setChosenOp] = useState<'JOIN' | 'CARTESIAN' | null>(null);

  // Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Stage 1 Selection Handler
  const handleSelectDept = (dept: string) => {
    setSelectedDept(dept);
    if (dept === 'CS') {
      setErrorMsg(null);
      setSuccessMsg('🎯 正确！选择操作 σ (Sigma) 是对关系表进行【行筛选】。σ_DEPT=\'CS\'(S) 筛选出了 2 位计算机系学生！');
    } else {
      setSuccessMsg(null);
      setErrorMsg('目标是筛选出计算机系 (CS) 的学生，请选择 σ_DEPT=\'CS\'！');
    }
  };

  // Stage 2 Projection Handler
  const handleToggleCol = (col: 'sno' | 'sname' | 'dept') => {
    const updated = { ...projCols, [col]: !projCols[col] };
    setProjCols(updated);

    // Goal: Project sname and dept only (exclude sno)
    if (!updated.sno && updated.sname && updated.dept) {
      setErrorMsg(null);
      setSuccessMsg('🎯 正确！投影操作 π (Pi) 是对关系表进行【列挑选】。π_{SNAME, DEPT}(S) 消除了 SNO 列！');
    } else {
      setSuccessMsg(null);
    }
  };

  // Stage 3 Join Handler
  const handlePickJoinOp = (op: 'JOIN' | 'CARTESIAN') => {
    setChosenOp(op);
    if (op === 'JOIN') {
      setErrorMsg(null);
      setSuccessMsg('🎯 正确！自然连接 ⋈ (Natural Join) 根据公共属性 (SNO) 进行匹配合并，消除了重复的 SNO 列！');
      setTimeout(() => setIsCompleted(true), 1200);
    } else {
      setSuccessMsg(null);
      setErrorMsg('错误！笛卡尔积 × 会产生 4×4=16 条无差别组合行，包含大量无效交叉数据。而目标是对齐公共属性 SNO，应选自然连接 ⋈！');
    }
  };

  const handleReset = () => {
    setStage(1);
    setSelectedDept('ALL');
    setProjCols({ sno: true, sname: true, dept: true });
    setChosenOp(null);
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
        .ra-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ra-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Title & Stage Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ra-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Database className="text-purple-400" size={22} />
            关系代数拼图
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            选择 $\sigma$、投影 $\pi$、自然连接 $\bowtie$ 与笛卡尔积 $\times$ 运算实战
          </p>
        </div>

        {/* Stage selection */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStage(1)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${stage === 1 ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <Filter size={14} /> 阶段1: 选择 $\sigma$
          </button>
          <button
            onClick={() => setStage(2)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${stage === 2 ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <Columns size={14} /> 阶段2: 投影 $\pi$
          </button>
          <button
            onClick={() => setStage(3)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${stage === 3 ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <GitMerge size={14} /> 阶段3: 连接 $\bowtie$
          </button>
        </div>
      </div>

      {!isCompleted && (
        <>
          {/* STAGE 1: SELECTION (SIGMA) */}
          {stage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    关系代数运算：选择 $\sigma$ (Selection)
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    选择运算 $\sigma_{F}(R)$ 是根据条件 $F$ 对关系表 $R$ 进行<strong className="text-purple-300">【行筛选】</strong>，只保留满足条件的行。
                  </p>

                  <div className="text-xs font-bold text-slate-300 mb-2">任务：筛选出计算机系 (CS) 的学生</div>
                  <div className="space-y-2 mb-4">
                    {['CS', 'EE', 'MA', 'ALL'].map((dept) => (
                      <button
                        key={dept}
                        onClick={() => handleSelectDept(dept)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          selectedDept === dept
                            ? 'border-purple-400 bg-purple-950/40 text-purple-200 shadow-md'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                        }`}>
                        <span className="ra-mono">
                          {dept === 'ALL' ? '全表 (无筛选)' : `\u03C3_{DEPT='${dept}'}(S)`}
                        </span>
                        {selectedDept === dept && <CheckCircle2 size={16} className="text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDept === 'CS' && (
                  <button
                    onClick={() => setStage(2)}
                    className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-lg shadow-purple-500/20">
                    进入阶段 2：投影 $\pi$ 列挑选 &rarr;
                  </button>
                )}
              </div>

              {/* Table Preview */}
              <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TableIcon size={14} className="text-purple-400" />
                    学生关系表 S 结果预览
                  </span>
                  <span className="ra-mono text-xs text-purple-300">
                    行数: {STUDENTS.filter(s => selectedDept === 'ALL' || s.dept === selectedDept).length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 ra-mono">
                        <th className="p-2">SNO (学号)</th>
                        <th className="p-2">SNAME (姓名)</th>
                        <th className="p-2">DEPT (院系)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {STUDENTS.filter(s => selectedDept === 'ALL' || s.dept === selectedDept).map(row => (
                        <tr key={row.sno} className="hover:bg-slate-800/40 text-slate-200 ra-mono">
                          <td className="p-2 text-purple-300">{row.sno}</td>
                          <td className="p-2">{row.sname}</td>
                          <td className="p-2 font-bold">{row.dept}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: PROJECTION (PI) */}
          {stage === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    关系代数运算：投影 $\pi$ (Projection)
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    投影运算 $\pi_{A}(R)$ 是挑选出指定的属性列 $A$，对关系表进行<strong className="text-indigo-300">【列挑选】</strong>（并消除重复行）。
                  </p>

                  <div className="text-xs font-bold text-slate-300 mb-2">任务：保留【SNAME】与【DEPT】列，隐藏【SNO】</div>
                  <div className="space-y-2 mb-4">
                    {[
                      { key: 'sno', name: 'SNO (学号)' },
                      { key: 'sname', name: 'SNAME (姓名)' },
                      { key: 'dept', name: 'DEPT (院系)' },
                    ].map(col => (
                      <button
                        key={col.key}
                        onClick={() => handleToggleCol(col.key as any)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          projCols[col.key as keyof typeof projCols]
                            ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200'
                            : 'border-slate-800 bg-slate-900/40 opacity-40 text-slate-500'
                        }`}>
                        <span className="ra-mono">{col.name}</span>
                        <span>{projCols[col.key as keyof typeof projCols] ? '保留列 ✓' : '已隐藏'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {!projCols.sno && projCols.sname && projCols.dept && (
                  <button
                    onClick={() => setStage(3)}
                    className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-lg shadow-indigo-500/20">
                    进入阶段 3：自然连接 $\bowtie$ 实战 &rarr;
                  </button>
                )}
              </div>

              {/* Table Preview */}
              <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TableIcon size={14} className="text-indigo-400" />
                    投影后关系表 $\pi$ 预览
                  </span>
                  <span className="ra-mono text-xs text-indigo-300">
                    投影表达式: $\pi_{\{[
                      projCols.sno && 'SNO',
                      projCols.sname && 'SNAME',
                      projCols.dept && 'DEPT'
                    ].filter(Boolean).join(', ')\}}(S)$
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 ra-mono">
                        {projCols.sno && <th className="p-2">SNO</th>}
                        {projCols.sname && <th className="p-2">SNAME</th>}
                        {projCols.dept && <th className="p-2">DEPT</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 ra-mono">
                      {STUDENTS.map(row => (
                        <tr key={row.sno} className="hover:bg-slate-800/40 text-slate-200">
                          {projCols.sno && <td className="p-2 text-indigo-300">{row.sno}</td>}
                          {projCols.sname && <td className="p-2">{row.sname}</td>}
                          {projCols.dept && <td className="p-2 font-bold">{row.dept}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: NATURAL JOIN VS CARTESIAN */}
          {stage === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    关系运算：自然连接 $\bowtie$ vs 笛卡尔积 $\times$
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    我们要把学生表 $S(\text{SNO, SNAME})$ 与 成绩表 $SC(\text{SNO, CNO, GRADE})$ 进行合并。
                  </p>

                  <div className="text-xs font-bold text-slate-300 mb-2">请选择正确的代数运算符：</div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handlePickJoinOp('JOIN')}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        chosenOp === 'JOIN'
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-300'
                      }`}>
                      <div className="ra-mono text-xl font-bold mb-1 text-cyan-400">$S \bowtie SC$</div>
                      <div className="text-[11px] text-slate-400 font-medium">自然连接 (Natural Join)</div>
                      <div className="text-[10px] text-slate-500 mt-1">根据公共属性 SNO 等值对齐并去重</div>
                    </button>

                    <button
                      onClick={() => handlePickJoinOp('CARTESIAN')}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        chosenOp === 'CARTESIAN'
                          ? 'border-rose-400 bg-rose-950/40 text-rose-200 shadow-lg'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-600 text-slate-300'
                      }`}>
                      <div className="ra-mono text-xl font-bold mb-1 text-rose-400">$S \times SC$</div>
                      <div className="text-[11px] text-slate-400 font-medium">笛卡尔积 (Cartesian)</div>
                      <div className="text-[10px] text-slate-500 mt-1">两表每行无条件两两交叉组合</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Result Preview */}
              <div className="md:col-span-6 bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TableIcon size={14} className="text-cyan-400" />
                    运算结果预览
                  </span>
                </div>

                {chosenOp === 'JOIN' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs ra-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="p-2">SNO</th>
                          <th className="p-2">SNAME</th>
                          <th className="p-2">CNO</th>
                          <th className="p-2">GRADE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {SCORES.map((sc, i) => {
                          const st = STUDENTS.find(s => s.sno === sc.sno);
                          return (
                            <tr key={i} className="hover:bg-slate-800/40">
                              <td className="p-2 text-cyan-300">{sc.sno}</td>
                              <td className="p-2">{st?.sname}</td>
                              <td className="p-2">{sc.cno}</td>
                              <td className="p-2 font-bold text-amber-300">{sc.grade}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 text-center py-8">
                    选择上方运算符预览运算生成的元组结果
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          <div className="mt-4 min-h-[40px]">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 text-xs flex items-start gap-2">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-purple-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-purple-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ra-display text-2xl font-bold text-purple-400 mb-2">🎉 恭喜通关：关系代数拼图大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经彻底掌握了 <span className="text-purple-300">选择 $\sigma$ (行筛选)</span>、<span className="text-indigo-300">投影 $\pi$ (列挑选)</span> 与 <span className="text-cyan-300">自然连接 $\bowtie$ (等值去重连接)</span>！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
