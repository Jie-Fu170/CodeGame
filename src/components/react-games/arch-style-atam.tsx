import React, { useState } from 'react';
import { Network, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface ATAMCase {
  id: string;
  scenario: string;
  correctCategory: 'sensitivity' | 'tradeoff' | 'risk' | 'nonrisk';
  selectedCategory: string;
}

export default function ArchStyleATAM() {
  const { addScore } = useGameStore();

  const [cases, setCases] = useState<ATAMCase[]>([
    {
      id: 'c1',
      scenario: '为提高网络通信安全性将加密位数增加到 4096 位，但这直接导致数据库响应耗时增加了 3 倍。',
      correctCategory: 'tradeoff',
      selectedCategory: ''
    },
    {
      id: 'c2',
      scenario: '将传输通道从 HTTP 提升到 HTTPS，直接使系统“安全性”指标上升 80%。',
      correctCategory: 'sensitivity',
      selectedCategory: ''
    },
    {
      id: 'c3',
      scenario: '系统未配置负载均衡，单节点 CPU 在高并发下崩溃可能导致整个集群瘫痪。',
      correctCategory: 'risk',
      selectedCategory: ''
    },
    {
      id: 'c4',
      scenario: '选用成熟的 PostgreSQL 关系型数据库存储交易订单数据，架构评估确认不会对系统性能产生负面影响。',
      correctCategory: 'nonrisk',
      selectedCategory: ''
    }
  ]);

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const categories = [
    { value: 'sensitivity', label: '敏感点 (Sensitivity Point)' },
    { value: 'tradeoff', label: '权衡点 (Trade-off Point)' },
    { value: 'risk', label: '风险点 (Risk Point)' },
    { value: 'nonrisk', label: '非风险点 (Non-Risk Point)' }
  ];

  const checkATAM = () => {
    const isAllCorrect = cases.every((c) => c.selectedCategory === c.correctCategory);
    if (isAllCorrect) {
      setFeedback({
        msg: 'ATAM / SAAM 架构评估诊断全对！精确区分了敏感点、权衡点(折衷点)、风险点与非风险点！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      setFeedback({
        msg: '校验未通过。提示：影响多个质量属性互相制约为权衡点；直接影响单一质量属性为敏感点；隐患为风险点。',
        isCorrect: false
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400 border border-yellow-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yellow-300">软件架构风格与 ATAM 评估</h2>
            <p className="text-xs text-slate-400">系统架构 · ATAM 评估方法敏感点、权衡点、风险点与非风险点诊断</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6">
        在软件架构评估 (ATAM / SAAM) 中，评审专家需要诊断项目架构决策属于哪种属性节点。请完成下列场景裁决：
      </div>

      <div className="space-y-4 mb-6">
        {cases.map((c, idx) => (
          <div key={c.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <p className="text-xs font-mono text-slate-200 leading-relaxed">
              <span className="text-yellow-400 font-bold">场景 {idx + 1}:</span> {c.scenario}
            </p>

            <select
              value={c.selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setCases(cases.map((item) => (item.id === c.id ? { ...item, selectedCategory: val } : item)));
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-xs text-yellow-300 font-mono focus:outline-none"
            >
              <option value="">-- 请选择 ATAM 判定结果 --</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={checkATAM}
        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <ShieldCheck className="w-5 h-5" /> 提交 ATAM 评估判定
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
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
