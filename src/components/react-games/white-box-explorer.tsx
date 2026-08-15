import { useState } from 'react';
import { Bug, Play, CheckCircle, Code2, GitBranch } from 'lucide-react';

export default function WhiteBoxExplorer() {
  const [testCases, setTestCases] = useState<{ A: boolean, B: boolean, path: number }[]>([]);
  const [aValue, setAValue] = useState<boolean>(true);
  const [bValue, setBValue] = useState<boolean>(true);
  const [status, setStatus] = useState<'playing' | 'won'>('playing');

  const path1Covered = testCases.some(tc => tc.path === 1);
  const path2Covered = testCases.some(tc => tc.path === 2);
  const branchCoverage = (path1Covered ? 50 : 0) + (path2Covered ? 50 : 0);
  const aTrueCovered = testCases.some(tc => tc.A);
  const aFalseCovered = testCases.some(tc => !tc.A);
  const bTrueCovered = testCases.some(tc => tc.B);
  const bFalseCovered = testCases.some(tc => !tc.B);
  const conditionCoverage = [aTrueCovered, aFalseCovered, bTrueCovered, bFalseCovered]
    .filter(Boolean).length * 25;

  const runTest = () => {
    if (status === 'won') return;

    // Logic: if (A && B)
    const pathTaken = (aValue && bValue) ? 1 : 2;
    
    const newCases = [...testCases, { A: aValue, B: bValue, path: pathTaken }];
    setTestCases(newCases);

    const nextBranchCovered = newCases.some(tc => tc.path === 1) && newCases.some(tc => tc.path === 2);
    const nextConditionCovered =
      newCases.some(tc => tc.A) &&
      newCases.some(tc => !tc.A) &&
      newCases.some(tc => tc.B) &&
      newCases.some(tc => !tc.B);

    if (nextBranchCovered && nextConditionCovered) {
      setStatus('won');
    }
  };

  const reset = () => {
    setTestCases([]);
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-[#0f172a] text-slate-200 border-2 border-indigo-900 shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col font-sans min-h-[600px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400 flex items-center gap-3">
            <Bug size={32} className="text-pink-500" /> 白盒测试染色师
          </h1>
          <p className="text-slate-400 mt-2">任务：输入参数，覆盖 True/False 两个判定分支，并让 A、B 两个基本条件均取到真、假。</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">判定覆盖率</span>
            <div className="text-2xl font-bold font-mono flex items-center gap-2">
              <span className={branchCoverage === 100 ? 'text-emerald-400' : 'text-amber-400'}>{branchCoverage}%</span>
            </div>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-1">条件覆盖率</span>
            <div className="text-2xl font-bold font-mono flex items-center gap-2">
              <span className={conditionCoverage === 100 ? 'text-emerald-400' : 'text-amber-400'}>{conditionCoverage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left Side: Code and Graph */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#1e1e1e] rounded-xl border border-slate-700 p-4 font-mono text-sm shadow-inner relative">
            <div className="absolute top-2 right-2 text-slate-600"><Code2 size={20} /></div>
            <div className="text-pink-400">function <span className="text-blue-400">process</span>(A: <span className="text-teal-300">boolean</span>, B: <span className="text-teal-300">boolean</span>) {'{'}</div>
            <div className="pl-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-pink-400">if</span> (A <span className="text-indigo-400">&&</span> B) {'{'}
              </div>
              <div className={`pl-4 py-1 my-1 rounded transition-colors ${path1Covered ? 'bg-emerald-900/40 border-l-2 border-emerald-500' : ''}`}>
                <span className="text-blue-300">executePath1</span>(); <span className="text-slate-500">// Path 1 (True 分支)</span>
              </div>
              <div className="flex items-center gap-2">
                {'}'} <span className="text-pink-400">else</span> {'{'}
              </div>
              <div className={`pl-4 py-1 my-1 rounded transition-colors ${path2Covered ? 'bg-emerald-900/40 border-l-2 border-emerald-500' : ''}`}>
                <span className="text-blue-300">executePath2</span>(); <span className="text-slate-500">// Path 2 (False 分支)</span>
              </div>
              <div>{'}'}</div>
            </div>
            <div>{'}'}</div>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700 p-6 flex flex-col items-center justify-center relative">
            <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><GitBranch size={14}/> 控制流图 (CFG)</h3>
            
            <div className="flex flex-col items-center mt-6 w-full max-w-sm">
              <div className="w-12 h-12 rounded-full border-2 border-slate-500 flex items-center justify-center bg-slate-800 z-10 font-bold">Start</div>
              
              <div className="w-0.5 h-6 bg-slate-600"></div>
              
              <div className="px-6 py-3 border-2 border-amber-500/50 bg-amber-950/30 rounded-lg z-10 flex flex-col items-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <span className="text-xs text-amber-500 font-bold mb-1">Decision Node</span>
                <span className="font-mono text-amber-200">A && B</span>
              </div>
              
              <div className="flex w-full justify-between mt-4 relative h-20">
                {/* Lines */}
                <div className="absolute top-0 left-1/2 w-[40%] h-0.5 bg-slate-600 -translate-x-full"></div>
                <div className="absolute top-0 left-1/2 w-[40%] h-0.5 bg-slate-600"></div>
                <div className="absolute top-0 left-[10%] w-0.5 h-full bg-slate-600"></div>
                <div className="absolute top-0 right-[10%] w-0.5 h-full bg-slate-600"></div>
                
                {/* Path 1 */}
                <div className="absolute -top-3 left-[25%] -translate-x-1/2 bg-slate-900 px-2 text-xs font-bold text-emerald-400">True</div>
                {/* Path 2 */}
                <div className="absolute -top-3 right-[25%] translate-x-1/2 bg-slate-900 px-2 text-xs font-bold text-rose-400">False</div>

                {/* Nodes */}
                <div className={`absolute bottom-0 left-[10%] -translate-x-1/2 px-4 py-2 rounded-lg font-mono text-sm font-bold border-2 transition-all ${path1Covered ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                  Path 1
                </div>
                
                <div className={`absolute bottom-0 right-[10%] translate-x-1/2 px-4 py-2 rounded-lg font-mono text-sm font-bold border-2 transition-all ${path2Covered ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-600 text-slate-500'}`}>
                  Path 2
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inputs & Tests */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-5">
            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">构造测试用例</h3>
            <p className="text-xs text-slate-400 mb-4">通关条件：两个分支均执行，且 A、B 均至少取过一次 True 与 False。</p>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-bold">参数 A</label>
                <button 
                  onClick={() => setAValue(!aValue)}
                  className={`py-2 rounded font-mono font-bold border-2 transition-colors ${aValue ? 'bg-indigo-900 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-600 text-slate-500'}`}
                >
                  {aValue ? 'True' : 'False'}
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-bold">参数 B</label>
                <button 
                  onClick={() => setBValue(!bValue)}
                  className={`py-2 rounded font-mono font-bold border-2 transition-colors ${bValue ? 'bg-indigo-900 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-600 text-slate-500'}`}
                >
                  {bValue ? 'True' : 'False'}
                </button>
              </div>
            </div>
            
            <button 
              onClick={runTest}
              disabled={status === 'won'}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-all"
            >
              <Play size={18} /> 执行测试
            </button>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700 p-4 flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">测试记录</h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
              {testCases.map((tc, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm font-mono animate-in slide-in-from-right-4">
                  <div className="flex gap-3">
                    <span className={tc.A ? 'text-indigo-300' : 'text-slate-500'}>A:{tc.A ? 'T' : 'F'}</span>
                    <span className={tc.B ? 'text-indigo-300' : 'text-slate-500'}>B:{tc.B ? 'T' : 'F'}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${tc.path === 1 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>
                    → Path {tc.path}
                  </div>
                </div>
              ))}
              {testCases.length === 0 && <div className="text-slate-600 text-center mt-10 text-sm">暂无测试记录</div>}
            </div>
          </div>
        </div>
      </div>

      {status === 'won' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 rounded-3xl">
          <div className="bg-slate-900 p-10 rounded-3xl border-2 border-emerald-500 text-center max-w-lg shadow-[0_0_60px_rgba(16,185,129,0.3)] animate-in zoom-in-95 duration-500">
            <CheckCircle size={80} className="mx-auto text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h2 className="text-3xl font-black text-white mb-4">判定与条件覆盖均达 100%！</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              干得好，染色师！你已覆盖 True 和 False 两个分支，并让 A、B 两个基本条件均经历了真、假取值。<br/>
              这体现了判定覆盖与条件覆盖的区别：仅走到两个分支，并不必然覆盖每个基本条件的两种取值。
            </p>
            <button onClick={reset} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg w-full">
              重置并再次挑战
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
