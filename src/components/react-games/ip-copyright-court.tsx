import React, { useState } from 'react';
import { Scale, RotateCcw, CheckCircle2, Info, Trophy, Gavel } from 'lucide-react';

const COURT_CASES = [
  {
    title: '案件 1：甲公司委托乙方开发软件案',
    desc: '甲公司（甲方）出资委托程序员小王（乙方）开发一套管理软件。双方签订了开发合同，但合同中未对软件著作权的归属做出任何明确约定。软件交付后，甲公司擅自将软件出售给第三方，小王起诉甲公司侵权。',
    q: '法官大人！根据我国《计算机软件保护条例》，当委托开发合同未明确约定著作权归属时，该软件的著作权归属于谁？',
    opts: [
      '归甲方（甲公司）所有，因为甲公司支付了开发费用',
      '归乙方（受托人小王）所有，合同未约定则法律默认归受托人',
      '归甲公司和小王共同共有',
      '直接进入公有领域，任何人都可以免费使用'
    ],
    correct: 1,
    explain: '极高频必考点：委托开发软件，若合同无明确约定或约定不明确的，软件著作权依法归【受托人 (乙方)】所有！因此甲公司无权擅自转售。'
  },
  {
    title: '案件 2：员工利用单位设备开发职务软件案',
    desc: '程序员老李是 A 公司的正式员工，他在工作期间主要利用 A 公司的服务器、测试设备与内部代码库，开发了一款高性能中间件。老李离职后声称该软件是自己个人独立创作的，要求带走软件著作权。',
    q: '法官大人！本案中该软件的著作权归属于谁？',
    opts: [
      '归老李个人所有，因为源码都是他敲出来的',
      '归 A 公司所有，因为主要利用了单位的物质技术条件且属于职务开发成果',
      '老李和 A 公司各占 50% 收益',
      '著作权归国家所有'
    ],
    correct: 1,
    explain: '职务开发成果：主要是利用法人或者其他组织的物质技术条件创作，并由法人或者其他组织承担责任的软件，著作权归【单位 (A公司)】所有！'
  }
];

export default function IPCopyrightCourt() {
  const [caseIdx, setCaseIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentCase = COURT_CASES[caseIdx];

  const handleSelectOpt = (optIdx: number) => {
    setSelectedOpt(optIdx);
    if (optIdx === currentCase.correct) {
      setErrorMsg(null);
      setSuccessMsg(`⚖️ 异议 (Objection)! 法官判决：判决正确！${currentCase.explain}`);
      if (caseIdx < COURT_CASES.length - 1) {
        setTimeout(() => {
          setCaseIdx(i => i + 1);
          setSelectedOpt(null);
          setSuccessMsg(null);
        }, 1800);
      } else {
        setTimeout(() => setIsCompleted(true), 800);
      }
    } else {
      setSuccessMsg(null);
      setErrorMsg(`驳回抗辩！判决依据：${currentCase.explain}`);
    }
  };

  const handleReset = () => {
    setCaseIdx(0);
    setSelectedOpt(null);
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
        .ipc-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ipc-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="ipc-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Gavel className="text-amber-400" size={22} />
            知识产权大法庭 (逆转裁判版)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            职务作品、委托作品软件著作权与专利权法律归属辩论
          </p>
        </div>
      </div>

      {!isCompleted && (
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Scale size={14} /> 法庭审判 ({caseIdx + 1} / {COURT_CASES.length})
            </span>
          </div>

          <h3 className="ipc-display text-base font-bold text-slate-100 mb-2">
            {currentCase.title}
          </h3>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed">
            {currentCase.desc}
          </div>

          <div className="text-xs font-bold text-amber-300 mb-3">❓ {currentCase.q}</div>

          <div className="space-y-2.5 mb-4">
            {currentCase.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOpt(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  selectedOpt === i
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                }`}>
                <span className="ipc-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                {opt}
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
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-amber-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="ipc-display text-2xl font-bold text-amber-400 mb-2">🎉 胜诉通关：知识产权法官大法官！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经完全掌控了软考知识产权章节中 <span className="text-amber-300">委托作品归乙方</span> 与 <span className="text-cyan-300">职务作品归单位</span> 的关键判例！
          </p>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
