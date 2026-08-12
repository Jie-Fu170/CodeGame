import React, { useState } from 'react';
import { Database, SplitSquareVertical, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function DBNormalizer() {
  const [stage, setStage] = useState(1);
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const attrs = ['SNO', 'CNO', 'GRADE', 'SNAME', 'DEPT', 'MGR'];

  const toggleAttr = (attr: string) => {
    if (selectedAttrs.includes(attr)) {
      setSelectedAttrs(selectedAttrs.filter(a => a !== attr));
    } else {
      setSelectedAttrs([...selectedAttrs, attr]);
    }
  };

  const submitStage1 = () => {
    // Stage 1: Partial Dependency. PK is (SNO, CNO). SNAME, DEPT, MGR depend only on SNO.
    const expected = ['SNAME', 'DEPT', 'MGR'];
    const correct = selectedAttrs.length === expected.length && selectedAttrs.every(a => expected.includes(a));
    if (correct) {
      setError('');
      setStage(2);
      setSelectedAttrs([]);
    } else {
      setError('选择错误。提示：哪些属性仅依赖于 SNO，而不依赖于 CNO？（部分函数依赖）');
    }
  };

  const submitStage2 = () => {
    // Stage 2: Transitive Dependency in Student(SNO, SNAME, DEPT, MGR).
    // DEPT -> MGR. So MGR is transitively dependent on SNO.
    const expected = ['MGR'];
    const correct = selectedAttrs.length === expected.length && selectedAttrs.every(a => expected.includes(a));
    if (correct) {
      setError('');
      setStage(3);
    } else {
      setError('选择错误。提示：哪个属性依赖于非主键属性？（DEPT 决定了什么？）');
    }
  };

  const reset = () => {
    setStage(1);
    setSelectedAttrs([]);
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border-2 border-slate-700 shadow-2xl flex flex-col font-sans min-h-[600px] relative overflow-hidden">
      {/* Bg Deco */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-blue-400 flex items-center gap-3">
            <Database size={32} /> 数据库范式收纳整理狂
          </h1>
          <p className="text-slate-400 mt-2">消除冗余、插入异常、更新异常与删除异常，将数据规范化至 3NF！</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-500 uppercase">当前状态</div>
          <div className="text-2xl font-black font-mono text-white">
            {stage === 1 ? '1NF (第一范式)' : stage === 2 ? '2NF (第二范式)' : '3NF (第三范式)'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {stage === 1 && (
          <div className="animate-in slide-in-from-right flex flex-col h-full">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mb-6">
              <h3 className="text-lg font-bold text-slate-300 mb-2">步骤 1: 消除部分函数依赖 (迈向 2NF)</h3>
              <p className="text-slate-400 text-sm">
                当前表 <code className="text-blue-300">R(SNO, CNO, GRADE, SNAME, DEPT, MGR)</code> 的主键是 <strong>(SNO, CNO)</strong>。<br/>
                请选择那些 <strong>仅依赖于 SNO (部分依赖于主键)</strong> 的属性，将它们拆分出去。
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 mb-6">
              <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase">表 R (主键: SNO, CNO)</h4>
              <div className="flex gap-4">
                {attrs.map(attr => {
                  const isPK = attr === 'SNO' || attr === 'CNO';
                  return (
                    <button
                      key={attr}
                      onClick={() => !isPK && toggleAttr(attr)}
                      disabled={isPK}
                      className={`flex-1 py-4 rounded-xl font-bold font-mono transition-all border-2 
                        ${isPK ? 'bg-slate-800 border-slate-600 text-amber-400 opacity-60 cursor-not-allowed' : 
                          selectedAttrs.includes(attr) ? 'bg-blue-900 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' : 
                          'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
                        }`}
                    >
                      {attr}
                      {isPK && <div className="text-[10px] text-amber-500/80 mt-1">PK (主键)</div>}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle /> {error}
              </div>
            )}

            <button onClick={submitStage1} className="mt-auto py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg text-lg transition-all">
              <SplitSquareVertical /> 拆分至 2NF
            </button>
          </div>
        )}

        {stage === 2 && (
          <div className="animate-in slide-in-from-right flex flex-col h-full">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 mb-6">
              <h3 className="text-lg font-bold text-slate-300 mb-2">步骤 2: 消除传递函数依赖 (迈向 3NF)</h3>
              <p className="text-slate-400 text-sm">
                现在我们有两张表：成绩表 和 学生表。学生表 <code className="text-emerald-300">Student(SNO, SNAME, DEPT, MGR)</code> 的主键是 <strong>SNO</strong>。<br/>
                仔细观察：系主任 (MGR) 其实由系名 (DEPT) 决定。请选择 <strong>传递依赖于主键 SNO</strong> 的属性，将其拆分。
              </p>
            </div>

            <div className="flex gap-6 mb-6">
              {/* Table 1 (Score) */}
              <div className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-6 opacity-70">
                <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase">Score (已规范化)</h4>
                <div className="flex gap-2">
                  {['SNO', 'CNO', 'GRADE'].map(attr => (
                    <div key={attr} className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-lg text-center text-slate-400 font-mono text-sm">
                      {attr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table 2 (Student) */}
              <div className="flex-[2] bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-emerald-500/70 mb-4 uppercase">Student (主键: SNO)</h4>
                <div className="flex gap-4">
                  {['SNO', 'SNAME', 'DEPT', 'MGR'].map(attr => {
                    const isPK = attr === 'SNO';
                    return (
                      <button
                        key={attr}
                        onClick={() => !isPK && toggleAttr(attr)}
                        disabled={isPK}
                        className={`flex-1 py-4 rounded-xl font-bold font-mono transition-all border-2 
                          ${isPK ? 'bg-slate-800 border-slate-600 text-amber-400 opacity-60 cursor-not-allowed' : 
                            selectedAttrs.includes(attr) ? 'bg-emerald-900 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' : 
                            'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300'
                          }`}
                      >
                        {attr}
                        {isPK && <div className="text-[10px] text-amber-500/80 mt-1">PK</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle /> {error}
              </div>
            )}

            <button onClick={submitStage2} className="mt-auto py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg text-lg transition-all">
              <SplitSquareVertical /> 拆分至 3NF
            </button>
          </div>
        )}

        {stage === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <CheckCircle size={80} className="text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
            <h2 className="text-4xl font-bold text-white mb-4">完美达到 3NF！</h2>
            <p className="text-slate-400 max-w-xl mb-10 text-lg">
              你成功地将混沌的数据表拆解为 <strong>Score, Student, Department</strong> 三张高度规范的关系表，彻底消灭了所有的更新异常！
            </p>
            
            <div className="flex gap-4 w-full justify-center opacity-90">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
                <span className="text-amber-400 font-bold mb-2">Score</span>
                <span className="font-mono text-sm text-slate-300">SNO, CNO, GRADE</span>
              </div>
              <div className="flex items-center text-slate-600"><ArrowRight /></div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
                <span className="text-blue-400 font-bold mb-2">Student</span>
                <span className="font-mono text-sm text-slate-300">SNO, SNAME, DEPT</span>
              </div>
              <div className="flex items-center text-slate-600"><ArrowRight /></div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
                <span className="text-emerald-400 font-bold mb-2">Department</span>
                <span className="font-mono text-sm text-slate-300">DEPT, MGR</span>
              </div>
            </div>

            <button onClick={reset} className="mt-12 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all">
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
