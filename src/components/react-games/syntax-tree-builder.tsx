import React, { useState } from 'react';
import { Network, Check, X, ArrowRight, GitMerge, RotateCcw } from 'lucide-react';

export default function SyntaxTreeBuilder() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'error' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [currentString, setCurrentString] = useState('S');
  const [derivationPath, setDerivationPath] = useState<string[]>(['S']);

  const challenges = [
    {
      grammar: ['S -> aSb', 'S -> ab'],
      target: 'aabb',
      targetDerivations: [
        ['S', 'aSb', 'aabb']
      ]
    },
    {
      grammar: ['E -> E+T', 'E -> T', 'T -> T*F', 'T -> F', 'F -> (E)', 'F -> i'],
      target: 'i+i',
      targetDerivations: [
        ['E', 'E+T', 'T+T', 'F+T', 'i+T', 'i+F', 'i+i']
      ]
    }
  ];

  const currentChallenge = challenges[level];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col min-h-[600px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <Network size={28} /> 语法树构建与文法推导 (Syntax Tree)
          </h1>
          <p className="text-slate-400 mt-1">根据上下文无关文法 (CFG)，选择正确的推导步骤生成目标字符串。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">任务进度</div>
          <div className="text-xl font-bold text-blue-400">[{level + 1}/{challenges.length}]</div>
        </div>
      </div>

      {status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Check size={80} className="text-green-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">推导大师！</h2>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            你已经掌握了上下文无关文法 (CFG) 的推导过程，能够正确构建语法树！
          </p>
          <button onClick={() => { setLevel(0); setStatus('playing'); setCurrentString('S'); setDerivationPath(['S']); }} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all">
            重新挑战
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative z-10">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-600">
              <h3 className="text-lg font-bold text-emerald-400 mb-3 border-b border-slate-600 pb-2">已知文法 G</h3>
              <ul className="space-y-2 font-mono text-lg text-slate-300">
                {currentChallenge.grammar.map((rule, idx) => (
                  <li key={idx} className="bg-slate-700/50 px-3 py-1 rounded">{rule}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-600 flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-bold text-amber-400 mb-2">目标终结符串</h3>
              <div className="text-4xl font-mono font-bold text-white bg-slate-900 px-6 py-3 rounded-xl border border-slate-700">
                {currentChallenge.target}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-600 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <GitMerge size={20} /> 当前推导路径
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xl">
              {derivationPath.map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className={idx === derivationPath.length - 1 ? "text-white font-bold bg-blue-600/30 px-3 py-1 rounded border border-blue-500" : "text-slate-400"}>
                    {step}
                  </span>
                  {idx < derivationPath.length - 1 && <ArrowRight className="text-slate-600" size={20} />}
                </React.Fragment>
              ))}
            </div>

            {status === 'success' ? (
               <div className="mt-auto bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex flex-col items-center animate-in zoom-in duration-300">
                 <Check size={48} className="mb-4" />
                 <h3 className="text-2xl font-bold mb-2">推导成功</h3>
                 <p className="mb-6">成功推导出目标字符串！</p>
                 <button onClick={() => {
                   if (level + 1 >= challenges.length) {
                     setStatus('finished');
                   } else {
                     setLevel(l => l + 1);
                     setCurrentString(challenges[level+1].targetDerivations[0][0]);
                     setDerivationPath([challenges[level+1].targetDerivations[0][0]]);
                     setStatus('playing');
                     setErrorMsg('');
                   }
                 }} className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded">
                   继续下一题
                 </button>
               </div>
            ) : (
              <div className="mt-auto">
                 {status === 'error' && (
                  <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg flex items-center gap-3 mb-4">
                    <X className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <h4 className="text-slate-400 mb-3">选择下一步推导结果：</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(() => {
                    const targetPath = currentChallenge.targetDerivations[0];
                    const currentIndex = targetPath.indexOf(currentString);
                    if (currentIndex === -1 || currentIndex >= targetPath.length - 1) return null;
                    
                    const nextCorrect = targetPath[currentIndex + 1];
                    const options = [nextCorrect];
                    if (level === 0) {
                      options.push('aab');
                      options.push('aSbSb');
                    } else {
                      if (currentString === 'E+T') options.push('T+F');
                      if (currentString === 'T+T') options.push('T+F');
                      if (currentString === 'F+T') options.push('i+F');
                      if (currentString === 'i+T') options.push('i+i');
                      if (currentString === 'i+F') options.push('F+i');
                      if (currentString === 'E') options.push('T');
                    }
                    
                    const uniqueOptions = Array.from(new Set(options)).sort(() => Math.random() - 0.5);

                    return uniqueOptions.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          if (opt === nextCorrect) {
                            const newPath = [...derivationPath, opt];
                            setDerivationPath(newPath);
                            setCurrentString(opt);
                            if (opt === currentChallenge.target) {
                              setStatus('success');
                              setErrorMsg('');
                            } else {
                              setStatus('playing');
                              setErrorMsg('');
                            }
                          } else {
                            setStatus('error');
                            setErrorMsg(`推导错误！字符串 "${opt}" 不是当前推导的正确下一步。`);
                          }
                        }}
                        className="bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white font-mono py-3 rounded-lg transition-colors"
                      >
                        {opt}
                      </button>
                    ));
                  })()}
                </div>
                
                <button 
                  onClick={() => {
                    setCurrentString(currentChallenge.targetDerivations[0][0]);
                    setDerivationPath([currentChallenge.targetDerivations[0][0]]);
                    setStatus('playing');
                    setErrorMsg('');
                  }} 
                  className="mt-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} /> 重新开始本题推导
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
