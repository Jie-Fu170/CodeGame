import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, CheckCircle2, Info, Trophy, Terminal } from 'lucide-react';

export default function WhiteBoxCoverage() {
  const [valA, setValA] = useState<number>(2);
  const [valB, setValB] = useState<number>(0);
  const [valX, setValX] = useState<number>(4);

  const [testedCases, setTestedCases] = useState<Array<{ a: number; b: number; x: number; cond1: boolean; cond2: boolean }>>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleRunTestCase = () => {
    // Condition 1: (A > 1 && B == 0)
    const c1 = valA > 1 && valB === 0;

    let localX = valX;
    if (c1) localX = localX / valA;

    // Condition 2: (A == 2 || X > 1)
    const c2 = valA === 2 || localX > 1;

    const newCase = { a: valA, b: valB, x: valX, cond1: c1, cond2: c2 };
    const updated = [...testedCases, newCase];
    setTestedCases(updated);

    // Check coverage
    const hasC1True = updated.some(c => c.cond1);
    const hasC1False = updated.some(c => !c.cond1);
    const hasC2True = updated.some(c => c.cond2);
    const hasC2False = updated.some(c => !c.cond2);

    if (hasC1True && hasC1False && hasC2True && hasC2False) {
      setSuccessMsg('🎉 恭喜！测试用例组合已达成 100% 判定覆盖率 (Branch Coverage)！所有分支真假路径均已触发！');
      setTimeout(() => setIsCompleted(true), 800);
    } else {
      setSuccessMsg(`运行用例 (A=${valA}, B=${valB}, X=${valX}): 分支1=${c1 ? '真(T)' : '假(F)'}, 分支2=${c2 ? '真(T)' : '假(F)'}`);
    }
  };

  const handleReset = () => {
    setValA(2);
    setValB(0);
    setValX(4);
    setTestedCases([]);
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
        .wbc-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .wbc-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="wbc-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <ShieldCheck className="text-pink-400" size={22} />
            白盒测试逻辑覆盖率
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            语句覆盖、判定/分支覆盖 (Branch Coverage)、条件覆盖与用例设计
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Panel: Inputs */}
          <div className="md:col-span-5 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                设计测试用例输入参数
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">参数 A: {valA}</label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={valA}
                    onChange={(e) => setValA(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">参数 B: {valB}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={valB}
                    onChange={(e) => setValB(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">参数 X: {valX}</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={valX}
                    onChange={(e) => setValX(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleRunTestCase}
              className="w-full py-2.5 bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-lg shadow-pink-500/20">
              <Terminal size={14} /> 运行测试用例 (A={valA}, B={valB}, X={valX})
            </button>
          </div>

          {/* Right Panel: Code & Coverage Status */}
          <div className="md:col-span-7 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                被测伪代码与判定覆盖状态
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs wbc-mono text-pink-300 space-y-1 mb-4">
                <div>if (A &gt; 1 &amp;&amp; B == 0) &#123; X = X / A; &#125;  // 判定 1</div>
                <div>if (A == 2 || X &gt; 1) &#123; X = X + 1; &#125;     // 判定 2</div>
              </div>

              {/* Coverage Checklist */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${testedCases.some(c => c.cond1) ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <span>判定 1 为 [真]</span>
                  {testedCases.some(c => c.cond1) && <CheckCircle2 size={14} />}
                </div>
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${testedCases.some(c => !c.cond1) ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <span>判定 1 为 [假]</span>
                  {testedCases.some(c => !c.cond1) && <CheckCircle2 size={14} />}
                </div>
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${testedCases.some(c => c.cond2) ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <span>判定 2 为 [真]</span>
                  {testedCases.some(c => c.cond2) && <CheckCircle2 size={14} />}
                </div>
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${testedCases.some(c => !c.cond2) ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
                  <span>判定 2 为 [假]</span>
                  {testedCases.some(c => !c.cond2) && <CheckCircle2 size={14} />}
                </div>
              </div>
            </div>

            {/* Toast */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-pink-950/60 border border-pink-800 text-pink-300 text-xs">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-pink-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="wbc-display text-2xl font-bold text-pink-400 mb-2">🎉 恭喜通关：白盒测试工程师大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你的测试用例集成功达到了 <span className="text-pink-300 font-bold">100% 判定/分支覆盖率</span>！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-pink-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
