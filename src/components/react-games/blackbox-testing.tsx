import React, { useState } from 'react';
import { Target, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface TestCase {
  id: string;
  value: number;
  label: string;
  category: 'invalid_low' | 'min_bound' | 'valid_mid' | 'max_bound' | 'invalid_high';
  isCorrectBoundary: boolean;
}

export default function BlackboxTesting() {
  const { addScore } = useGameStore();

  // Range [18, 60]
  // Standard BVA points: 17 (min-1), 18 (min), 19 (min+1), 39 (nom), 59 (max-1), 60 (max), 61 (max+1)
  const allTestCases: TestCase[] = [
    { id: 't1', value: 17, label: '17 (min - 1)', category: 'invalid_low', isCorrectBoundary: true },
    { id: 't2', value: 18, label: '18 (下界 min)', category: 'min_bound', isCorrectBoundary: true },
    { id: 't3', value: 19, label: '19 (min + 1)', category: 'valid_mid', isCorrectBoundary: true },
    { id: 't4', value: 35, label: '35 (普通有效值)', category: 'valid_mid', isCorrectBoundary: false },
    { id: 't5', value: 59, label: '59 (max - 1)', category: 'valid_mid', isCorrectBoundary: true },
    { id: 't6', value: 60, label: '60 (上界 max)', category: 'max_bound', isCorrectBoundary: true },
    { id: 't7', value: 61, label: '61 (max + 1)', category: 'invalid_high', isCorrectBoundary: true },
    { id: 't8', value: 100, label: '100 (远超上界冗余值)', category: 'invalid_high', isCorrectBoundary: false }
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleVerify = () => {
    const requiredBoundaryIds = allTestCases.filter((tc) => tc.isCorrectBoundary).map((tc) => tc.id);

    const hasAllBoundaries = requiredBoundaryIds.every((id) => selectedIds.includes(id));
    const hasNoRedundant = selectedIds.every((id) => requiredBoundaryIds.includes(id));

    if (hasAllBoundaries && hasNoRedundant) {
      setFeedback({
        msg: '完美诊断！精确勾选了 5 点法/7 点法标准的边界值用例集 (17, 18, 19, 59, 60, 61)，无任何无效冗余用例！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      let err = '';
      if (!hasAllBoundaries) err += '未覆盖全所有边界节点 (如 min-1, min, min+1, max-1, max, max+1)；';
      if (!hasNoRedundant) err += '选择了非极值点的普通冗余用例；';
      setFeedback({ msg: err, isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500/20 rounded-xl text-pink-400 border border-pink-500/40">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-pink-300">黑盒测试与边界值分析 (BVA)</h2>
            <p className="text-xs text-slate-400">软件工程与质量保证 · 等价类划分与 [min-1, min, min+1, max-1, max, max+1] 测试用例设计</p>
          </div>
        </div>
      </div>

      {/* Requirement Box */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 mb-6 space-y-2">
        <h3 className="text-xs font-mono text-pink-400 uppercase tracking-wider">测试需求说明:</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          某系统注册模块要求用户年龄输入范围为 <span className="font-mono text-amber-400 font-bold">[18, 60]</span> (闭区间，18岁与60岁均有效)。
          请根据<span className="text-cyan-300 font-bold">黑盒测试边界值分析法 (Boundary Value Analysis)</span>，从下方备选用例集中挑选出最严谨、无冗余的测试用例组合。
        </p>
      </div>

      {/* Grid of Test Cases */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {allTestCases.map((tc) => {
          const isSelected = selectedIds.includes(tc.id);
          return (
            <button
              key={tc.id}
              onClick={() => toggleSelect(tc.id)}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center text-center font-mono ${
                isSelected
                  ? 'bg-pink-600/30 border-pink-400 text-pink-200 shadow-lg shadow-pink-500/20 scale-105'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <div className="text-lg font-bold text-white mb-1">{tc.value}</div>
              <div className="text-xs">{tc.label}</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleVerify}
        className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <CheckCircle2 className="w-5 h-5" /> 提交用例组合
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
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
