import React, { useState } from 'react';
import { Layers, ArrowRight, RotateCcw, CheckCircle2, Info, Trophy, Code2 } from 'lucide-react';

const INFIX_TOKENS = ['(', 'A', '+', 'B', ')', '*', 'C', '-', 'D'];
const EXPECTED_POSTFIX = ['A', 'B', '+', 'C', '*', 'D', '-'];

export default function InfixToPostfix() {
  const [tokenIdx, setTokenIdx] = useState<number>(0);
  const [stack, setStack] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentToken = INFIX_TOKENS[tokenIdx];

  const handleNextStep = () => {
    if (tokenIdx >= INFIX_TOKENS.length) {
      // Pop remaining stack to output
      if (stack.length > 0) {
        const top = stack[stack.length - 1];
        setStack(s => s.slice(0, -1));
        setOutput(o => [...o, top]);
      } else {
        if (output.join(' ') === EXPECTED_POSTFIX.join(' ')) {
          setIsCompleted(true);
          setSuccessMsg('🎉 转换完成！后缀表达式 (逆波兰式) 结果完全正确！');
        }
      }
      return;
    }

    const t = currentToken;
    setErrorMsg(null);

    if (/^[A-Z]$/.test(t)) {
      // Operand -> Direct to Output
      setOutput(o => [...o, t]);
      setSuccessMsg(`操作数【${t}】直接输出到结果序列`);
      setTokenIdx(i => i + 1);
    } else if (t === '(') {
      setStack(s => [...s, t]);
      setSuccessMsg(`左括号【(】压入运算符栈`);
      setTokenIdx(i => i + 1);
    } else if (t === ')') {
      // Pop until '('
      const lastLeftParen = stack.lastIndexOf('(');
      if (lastLeftParen !== -1) {
        const popped = stack.slice(lastLeftParen + 1).reverse();
        setStack(s => s.slice(0, lastLeftParen));
        setOutput(o => [...o, ...popped]);
        setSuccessMsg(`遇到右括号【)】，弹出栈中操作符直至【(】`);
        setTokenIdx(i => i + 1);
      }
    } else if (['+', '-', '*', '/'].includes(t)) {
      setStack(s => [...s, t]);
      setSuccessMsg(`运算符【${t}】压入 Stack 栈`);
      setTokenIdx(i => i + 1);
    }
  };

  const handleReset = () => {
    setTokenIdx(0);
    setStack([]);
    setOutput([]);
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
        .ip-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ip-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ip-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Code2 className="text-cyan-400" size={22} />
            逆波兰式与表达式树工厂
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            中缀表达式转换后缀表达式 (Postfix / Reverse Polish Notation) 栈压入弹出算法
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel: Inputs & Steps */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                原始中缀表达式 (Infix)
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-1 mb-4 overflow-x-auto">
                {INFIX_TOKENS.map((token, i) => (
                  <span
                    key={i}
                    className={`ip-mono text-sm px-2.5 py-1 rounded font-bold transition-all ${
                      i === tokenIdx
                        ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/30'
                        : i < tokenIdx
                        ? 'bg-slate-800/60 text-slate-500'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                    {token}
                  </span>
                ))}
              </div>

              <div className="text-xs text-slate-400 mb-3 leading-relaxed">
                规则：操作数 (A, B...) <strong className="text-cyan-300">直接输出</strong>；运算符与括号放入 <strong className="text-indigo-300">运算符 Stack 栈</strong>。
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20">
              <ArrowRight size={14} /> 下一步转换
            </button>
          </div>

          {/* Right Panel: Stack & Output Visual */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Operator Stack */}
              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={14} /> 运算符栈 (Operator Stack)
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 min-h-[50px] flex items-center gap-2">
                  {stack.length === 0 ? (
                    <span className="text-xs text-slate-600 ip-mono">栈空 (Stack Empty)</span>
                  ) : (
                    stack.map((item, i) => (
                      <span key={i} className="ip-mono text-xs px-2.5 py-1 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded font-bold">
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Output Postfix Queue */}
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  后缀表达式输出序列 (Postfix Output)
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 min-h-[50px] flex items-center gap-2 overflow-x-auto">
                  {output.length === 0 ? (
                    <span className="text-xs text-slate-600 ip-mono">等待输出...</span>
                  ) : (
                    output.map((item, i) => (
                      <span key={i} className="ip-mono text-xs px-2.5 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded font-bold">
                        {item}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Feedback message */}
            {successMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Victory Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-cyan-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ip-display text-2xl font-bold text-cyan-400 mb-2">🎉 恭喜通关：逆波兰式大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            中缀表达式 `(A + B) * C - D` 已成功转换为后缀表达式 <span className="ip-mono text-amber-300 font-bold">A B + C * D -</span>！
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
