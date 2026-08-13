import React, { useState } from 'react';
import { Database, CheckCircle2, ArrowDown, Zap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export default function QueryOptimizationTree() {
  const { addScore } = useGameStore();

  // Initial state: Unoptimized tree: σ (Selection) at top -> Join -> Relations Student & Grade
  // Target: Pushed-down Selection (Selection moved directly on Student before Join)
  const [selectionPosition, setSelectionPosition] = useState<'top' | 'pushed'>('top');
  const [projectionPosition, setProjectionPosition] = useState<'top' | 'pushed'>('top');

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkOptimization = () => {
    if (selectionPosition === 'pushed' && projectionPosition === 'pushed') {
      setFeedback({
        msg: '极大提升数据库查询性能！选择(σ)与投影(π)下推优化成功，笛卡尔积中间结果集降低 95%！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      setFeedback({
        msg: '未达到最优状态！提示：将选择 σ (筛选行) 和投影 π (筛选列) 尽量下推至叶子节点关系表上方。',
        isCorrect: false
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/40">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyan-300">SQL 查询树与关系代数等价优化</h2>
            <p className="text-xs text-slate-400">数据库系统 · 选择 (σ) 下推与投影 (π) 下推优化查询语法树</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6 space-y-2">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">查询语句与优化规则:</h3>
        <p className="font-mono text-amber-300">
          SELECT S.name, G.score FROM Student S JOIN Grade G ON S.id = G.sid WHERE S.age &gt; 20;
        </p>
        <p className="text-slate-400 text-[11px]">
          软考考点：未优化的查询树会在连接 (Join) 之后才进行选择与投影，导致产生海量无用中间元组。按查询等价代数法则，应尽可能将选择与投影下推！
        </p>
      </div>

      {/* Interactive Query Tree */}
      <div className="p-6 bg-slate-950/90 rounded-xl border border-slate-800 mb-6 flex flex-col items-center space-y-4 font-mono text-xs">
        {/* Top Node */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setProjectionPosition(projectionPosition === 'top' ? 'pushed' : 'top')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              projectionPosition === 'pushed'
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            投影 π (name, score) [{projectionPosition === 'pushed' ? '已下推到合适节点' : '留在根节点(未优化)'}]
          </button>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />

        {/* Mid Node (Join) */}
        <div className="p-3 bg-cyan-600/20 border border-cyan-500/40 rounded-xl text-cyan-300 font-bold text-sm">
          自然连接 ⋈ (S.id = G.sid)
        </div>

        <div className="flex justify-around w-full max-w-md pt-2">
          {/* Left Branch: Student */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => setSelectionPosition(selectionPosition === 'top' ? 'pushed' : 'top')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectionPosition === 'pushed'
                  ? 'bg-amber-500/30 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              选择 σ (age &gt; 20) [{selectionPosition === 'pushed' ? '已下推至表首' : '尚未下推'}]
            </button>
            <ArrowDown className="w-3 h-3 text-slate-600" />
            <div className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-200">
              关系表 Student (学生表)
            </div>
          </div>

          {/* Right Branch: Grade */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-200 mt-8">
              关系表 Grade (成绩表)
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={checkOptimization}
        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <Zap className="w-5 h-5" /> 校验查询树优化
      </button>

      {feedback && (
        <div
          className={`p-4 rounded-xl border ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 font-mono text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
