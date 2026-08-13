import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, CheckCircle2, Info, Trophy, Code } from 'lucide-react';

const SOLID_CASES = [
  {
    principle: 'LSP (里氏替换原则 Liskov Substitution)',
    code: 'class Square extends Rectangle { setWidth(w) { this.w = w; this.h = w; } }',
    desc: '正方形类继承长方形类，修改 Width 时导致 Height 发生非预期改变，代入父类基类时破坏了逻辑行为。',
    explain: '里氏替换原则要求子类对象能够完全替换父类对象而不破坏程序正确性。正方形继承长方形破坏了长方形的长宽独立行为，违反 LSP！'
  },
  {
    principle: 'OCP (开闭原则 Open/Closed)',
    code: 'if (type == "PDF") exportPDF(); else if (type == "EXCEL") exportExcel();',
    desc: '每次新增导出格式时，都必须修改既有的 if-else 方法源码。',
    explain: '开闭原则要求对扩展开放，对修改关闭。应采用策略模式或工厂模式多态扩展，避免修改既有源码！'
  },
  {
    principle: 'DIP (依赖倒置原则 Dependency Inversion)',
    code: 'class OrderService { private MySQLDao dao = new MySQLDao(); }',
    desc: '高层服务类直接依赖并实例化具体的底层数据库实现类。',
    explain: '依赖倒置原则要求高层模块和底层模块都应该依赖抽象 (Interface)，不应依赖具体实现！'
  }
];

export default function SolidPrinciples() {
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedP, setSelectedP] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQuiz = SOLID_CASES[quizIdx];

  const handleSelectP = (pName: string) => {
    setSelectedP(pName);
    if (pName === currentQuiz.principle) {
      setErrorMsg(null);
      setSuccessMsg(`🎯 正确！${currentQuiz.explain}`);
      if (quizIdx < SOLID_CASES.length - 1) {
        setTimeout(() => {
          setQuizIdx(i => i + 1);
          setSelectedP(null);
          setSuccessMsg(null);
        }, 1500);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`违反的原则判断有误！${currentQuiz.explain}`);
    }
  };

  const handleReset = () => {
    setQuizIdx(0);
    setSelectedP(null);
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
        .sp-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .sp-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="sp-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={22} />
            SOLID 设计原则裁判
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SRP 单一职责、OCP 开闭原则、LSP 里氏替换、ISP 接口隔离、DIP 依赖倒置
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              代码案例重构诊断 ({quizIdx + 1} / {SOLID_CASES.length})
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 mb-3">
            {currentQuiz.code}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 mb-4">
            场景描述：{currentQuiz.desc}
          </div>

          <div className="text-xs font-bold text-slate-300 mb-3">❓ 判定：该代码直接违反了 SOLID 中的哪一项设计原则？</div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              'LSP (里氏替换原则 Liskov Substitution)',
              'OCP (开闭原则 Open/Closed)',
              'DIP (依赖倒置原则 Dependency Inversion)',
            ].map((p) => (
              <button
                key={p}
                onClick={() => handleSelectP(p)}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedP === p
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                {p}
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
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-emerald-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="sp-display text-2xl font-bold text-emerald-400 mb-2">🎉 恭喜通关：SOLID 原则裁判大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌握了 SOLID 5 大面向对象设计原则的诊断与重构要领！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
