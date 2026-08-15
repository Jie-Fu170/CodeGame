import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface MatchItem {
  id: string;
  feature: string;
  correctModel: string;
  selectedModel: string;
}

interface CMMILevel {
  level: number;
  name: string;
  correctKeyword: string;
  selectedKeyword: string;
}

export default function SoftwareLifecycleCMMI() {
  const { addScore } = useGameStore();

  const [activeTab, setActiveTab] = useState<'sdlc' | 'cmmi'>('sdlc');

  // Part 1: SDLC Models
  const [sdlcItems, setSdlcItems] = useState<MatchItem[]>([
    { id: 'm1', feature: '需求极度明确，开发线性流转，上一阶段不完成不进入下一阶段', correctModel: '瀑布模型', selectedModel: '' },
    { id: 'm2', feature: '引入“风险分析”机制，特别适合大型高风险项目的反复迭代开发', correctModel: '螺旋模型', selectedModel: '' },
    { id: 'm3', feature: '将测试与开发各个阶段一一对应 (如单元测试对应详细设计，系统测试对应需求分析)', correctModel: 'V模型', selectedModel: '' },
    { id: 'm4', feature: '面向对象开发，无缝过渡与反复重叠迭代，体现“喷泉”水流无缝集成特性', correctModel: '喷泉模型', selectedModel: '' }
  ]);

  // Part 2: CMMI Levels
  const [cmmiLevels, setCmmiLevels] = useState<CMMILevel[]>([
    { level: 1, name: 'Level 1 初始级 (Initial)', correctKeyword: '混乱无序，个人英雄主义', selectedKeyword: '' },
    { level: 2, name: 'Level 2 已管理级 (Managed)', correctKeyword: '项目级过程已计划、执行、测量和控制', selectedKeyword: '' },
    { level: 3, name: 'Level 3 已定义级 (Defined)', correctKeyword: '企业标准化组织级过程体系', selectedKeyword: '' },
    { level: 4, name: 'Level 4 已量化管理级 (Quantitatively Managed)', correctKeyword: '统计学与数据量化控制', selectedKeyword: '' },
    { level: 5, name: 'Level 5 优化级 (Optimizing)', correctKeyword: '持续自我改进与技术创新', selectedKeyword: '' }
  ]);

  const sdlcOptions = ['瀑布模型', '螺旋模型', 'V模型', '喷泉模型'];
  const cmmiKeywords = [
    '混乱无序，个人英雄主义',
    '项目级过程已计划、执行、测量和控制',
    '企业标准化组织级过程体系',
    '统计学与数据量化控制',
    '持续自我改进与技术创新'
  ];

  const [sdlcFeedback, setSdlcFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [cmmiFeedback, setCmmiFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);

  const checkSDLC = () => {
    const isAllCorrect = sdlcItems.every((item) => item.selectedModel === item.correctModel);
    if (isAllCorrect) {
      setSdlcFeedback({ msg: 'SDLC 模型匹配全对！准确掌握了瀑布、螺旋(风险)、V模型(测试)与喷泉模型！', isCorrect: true });
      addScore(50);
    } else {
      setSdlcFeedback({ msg: '部分模型匹配错误，请对照核心特征重新核对。', isCorrect: false });
    }
  };

  const checkCMMI = () => {
    const isAllCorrect = cmmiLevels.every((item) => item.selectedKeyword === item.correctKeyword);
    if (isAllCorrect) {
      setCmmiFeedback({ msg: 'CMMI 1-5 级成熟度判定完全正确！从初始级到优化级特征掌握扎实！', isCorrect: true });
      addScore(50);
    } else {
      setCmmiFeedback({ msg: '部分 CMMI 等级特征不匹配。注意：L2 是项目级计划、执行、测量和控制；L4 才是统计/量化管理，L5 是持续优化。', isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400 border border-orange-500/40">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-orange-300">软件过程模型与 CMMI 阶梯</h2>
            <p className="text-xs text-slate-400">软件工程 · SDLC 生命周期模型与 CMMI 1-5 级成熟度塔</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('sdlc')}
          className={`px-4 py-2 text-sm rounded-lg font-mono border transition-all ${
            activeTab === 'sdlc' ? 'bg-orange-600 text-white border-orange-400' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          Phase 1: 经典 SDLC 模型判定
        </button>
        <button
          onClick={() => setActiveTab('cmmi')}
          className={`px-4 py-2 text-sm rounded-lg font-mono border transition-all ${
            activeTab === 'cmmi' ? 'bg-orange-600 text-white border-orange-400' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          Phase 2: CMMI 成熟度 5 级塔
        </button>
      </div>

      {activeTab === 'sdlc' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
            请为以下 4 种软件工程开发场景匹配正确的 SDLC 过程模型：
          </div>

          <div className="space-y-3">
            {sdlcItems.map((item, idx) => (
              <div key={item.id} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs font-mono text-slate-200 flex-1">{idx + 1}. {item.feature}</p>
                <select
                  value={item.selectedModel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSdlcItems(sdlcItems.map((s) => (s.id === item.id ? { ...s, selectedModel: val } : s)));
                  }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-orange-300 font-mono focus:outline-none"
                >
                  <option value="">-- 选择模型 --</option>
                  {sdlcOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={checkSDLC}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            校验 Phase 1 解答
          </button>

          {sdlcFeedback && (
            <div className={`p-4 rounded-xl border ${sdlcFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center gap-2 font-mono text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{sdlcFeedback.msg}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cmmi' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300">
            请将正确的描述特征拖选填入 CMMI 软件能力成熟度模型的 1 至 5 级阶梯中：
          </div>

          <div className="space-y-3">
            {cmmiLevels.map((lvl) => (
              <div key={lvl.level} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs font-mono font-bold text-amber-400 w-64">{lvl.name}</div>
                <select
                  value={lvl.selectedKeyword}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCmmiLevels(cmmiLevels.map((c) => (c.level === lvl.level ? { ...c, selectedKeyword: val } : c)));
                  }}
                  className="w-full sm:w-80 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-amber-300 font-mono focus:outline-none"
                >
                  <option value="">-- 选择对应核心特征 --</option>
                  {cmmiKeywords.map((kw) => (
                    <option key={kw} value={kw}>{kw}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={checkCMMI}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            校验 CMMI 成熟度阶梯
          </button>

          {cmmiFeedback && (
            <div className={`p-4 rounded-xl border ${cmmiFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
              <div className="flex items-center gap-2 font-mono text-sm">
                <Award className="w-5 h-5" />
                <span>{cmmiFeedback.msg}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
