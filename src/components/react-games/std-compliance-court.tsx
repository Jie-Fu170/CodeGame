import React, { useState } from 'react';
import { Scale, RefreshCw, CheckCircle2, AlertTriangle, BookOpen, Award } from 'lucide-react';

interface StandardCase {
  id: string;
  title: string;
  desc: string;
  correctRule: 'MANDATORY_GB' | 'RECOMMENDED_GBT' | 'HIERARCHY_RULE' | 'ENTERPRISE_RULE';
}

const CASES: StandardCase[] = [
  {
    id: 'case_gb',
    title: '某软件公司拒绝执行 GB 8567 标准',
    desc: '该公司声称该标准只是行业建议，不强制执行。审查其代号为 GB（未带 /T）。',
    correctRule: 'MANDATORY_GB'
  },
  {
    id: 'case_gbt',
    title: '辨析代号 GB/T 11457 的法律效力',
    desc: '判断代号为 GB/T 11457《软件工程术语》标准的强制执行效力。',
    correctRule: 'RECOMMENDED_GBT'
  },
  {
    id: 'case_hierarchy',
    title: '企业标准与国家标准冲突效力裁决',
    desc: '企业内部标准 Q/ABC 与国家推荐性标准 GB/T 冲突，或制定了低于国标指标的企标。',
    correctRule: 'HIERARCHY_RULE'
  },
  {
    id: 'case_iso',
    title: 'ISO / IEC 国际标准转化 national 标准',
    desc: '识别国际标准化组织 (ISO) 与国际电工委员会 (IEC) 的代号归属。',
    correctRule: 'ENTERPRISE_RULE'
  }
];

export default function StdComplianceCourt() {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectRule = (caseId: string, rule: string) => {
    if (submitted) return;
    setChoices(prev => ({ ...prev, [caseId]: rule }));
  };

  const handleCheck = () => {
    let count = 0;
    CASES.forEach(c => {
      if (choices[c.id] === c.correctRule) {
        count++;
      }
    });
    setScore(count);
    setSubmitted(true);
  };

  const resetGame = () => {
    setChoices({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <Scale size={28} /> 标准化与合规裁判所 (Standards Court)
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：国家标准 (GB 强制性 / GB/T 推荐性)、行业与国际标准 (ISO/IEEE) 效力层级与代号识别
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Standards Spec Banner */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 text-xs space-y-2">
        <div className="font-bold text-amber-300 flex items-center gap-2">
          <BookOpen size={16} /> 标准化代号分类知识库：
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-1">
          <div className="bg-slate-900 p-2.5 rounded border border-slate-700 text-center">
            <span className="font-bold text-red-400">GB</span>
            <div className="text-slate-400 text-[10px]">国家强制性标准</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded border border-slate-700 text-center">
            <span className="font-bold text-emerald-400">GB/T</span>
            <div className="text-slate-400 text-[10px]">国家推荐性标准</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded border border-slate-700 text-center">
            <span className="font-bold text-cyan-400">GB/Z</span>
            <div className="text-slate-400 text-[10px]">国家指导性技术文件</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded border border-slate-700 text-center">
            <span className="font-bold text-purple-400">ISO / IEEE</span>
            <div className="text-slate-400 text-[10px]">国际标准组织代号</div>
          </div>
        </div>
      </div>

      {/* Cases Challenge */}
      <div className="space-y-4 mb-6">
        <h2 className="text-sm font-bold text-slate-200">法庭裁决：请为以下 4 起标准化纠纷做出最权威的法律定性：</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASES.map(c => {
            const current = choices[c.id];
            const isCorrect = submitted && current === c.correctRule;
            const isWrong = submitted && current !== c.correctRule;

            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-100'
                    : isWrong
                    ? 'bg-red-950/70 border-red-600 text-red-100'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-amber-300 mb-1">{c.title}</div>
                  <div className="text-slate-300">{c.desc}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSelectRule(c.id, 'MANDATORY_GB')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'MANDATORY_GB' ? 'bg-red-900 border-red-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    属于强制性标准，必须严格执行
                  </button>

                  <button
                    onClick={() => handleSelectRule(c.id, 'RECOMMENDED_GBT')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'RECOMMENDED_GBT' ? 'bg-emerald-900 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    属于推荐性标准，鼓励自愿采用
                  </button>

                  <button
                    onClick={() => handleSelectRule(c.id, 'HIERARCHY_RULE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'HIERARCHY_RULE' ? 'bg-amber-900 border-amber-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    企标严于国标有效，低于国标无效
                  </button>

                  <button
                    onClick={() => handleSelectRule(c.id, 'ENTERPRISE_RULE')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'ENTERPRISE_RULE' ? 'bg-purple-900 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    属于 ISO/IEC 国际标准体系
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action & Results */}
      {!submitted ? (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            disabled={Object.keys(choices).length < CASES.length}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              Object.keys(choices).length === CASES.length
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle2 size={18} /> 宣判合规裁决 (已裁决 {Object.keys(choices).length}/{CASES.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            score === CASES.length ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' : 'bg-amber-950/80 border-amber-600 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <Award size={32} />
              <div>
                <h3 className="font-bold text-base">标准化合规裁决得分: {score} / {CASES.length}</h3>
                <p className="text-xs opacity-90">
                  {score === CASES.length ? '🎉 宣判正确！彻底吃透了标准化代号与法律效力规则！' : '裁决存在瑕疵，参考下方必背考点。'}
                </p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600"
            >
              重新裁决
            </button>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-amber-400 text-sm">📘 软考标准化与法规高频秒杀口诀：</h4>
            <p>1. <strong>代号区分</strong>：<span className="text-red-400 font-bold">GB</span> 为国家<strong>强制性标准</strong>，保障人身/财产/安全；<span className="text-emerald-400 font-bold">GB/T</span> 为国家<strong>推荐性标准</strong>（T代表推荐）。</p>
            <p>2. <strong>效力层级关系</strong>：国际标准 &gt; 国家标准 &gt; 行业标准 &gt; 地方标准 &gt; 企业标准。但在企业内部，企业标准要求<strong>严于（高于）</strong>国家标准的，以企业标准为准；低于国标的无效。</p>
            <p>3. <strong>国际标准组织简称</strong>：<strong>ISO</strong> (国际标准化组织)、<strong>IEC</strong> (国际电工委员会)、<strong>IEEE</strong> (电气电子工程师学会)。</p>
          </div>
        </div>
      )}
    </div>
  );
}
