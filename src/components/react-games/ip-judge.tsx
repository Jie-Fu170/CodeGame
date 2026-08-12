import React, { useState } from 'react';
import { Scale, Gavel, FileSignature, Lightbulb, Hexagon, LockKeyhole, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'copyright', label: '著作权 (版权)', icon: <FileSignature size={18} /> },
  { id: 'patent', label: '专利权', icon: <Lightbulb size={18} /> },
  { id: 'trademark', label: '商标权', icon: <Hexagon size={18} /> },
  { id: 'secret', label: '商业秘密', icon: <LockKeyhole size={18} /> },
];

const SCENARIOS = [
  { id: 's1', text: '开发者编写的软件源代码与目标代码。', answer: 'copyright' },
  { id: 's2', text: '软件中独创的、能解决特定技术问题的核心算法思想。', answer: 'patent' },
  { id: 's3', text: '软件对外发布的专属 LOGO 与独特的品牌名称。', answer: 'trademark' },
  { id: 's4', text: '公司内部严格保密且未公开的核心技术参数。', answer: 'secret' },
];

export default function IPJudge() {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'playing' | 'won'>('playing');
  const [error, setError] = useState('');

  const handleSelect = (scenarioId: string, catId: string) => {
    setSelections({ ...selections, [scenarioId]: catId });
    setError('');
  };

  const submitVerdict = () => {
    if (Object.keys(selections).length < SCENARIOS.length) {
      setError('请对所有案例做出宣判。');
      return;
    }

    let allCorrect = true;
    for (const s of SCENARIOS) {
      if (selections[s.id] !== s.answer) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setStatus('won');
      setError('');
    } else {
      setError('判决有误！请重新审查知识产权法理（注意代码本身和算法思想的区别）。');
    }
  };

  const reset = () => {
    setSelections({});
    setStatus('playing');
    setError('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-[#1e1b18] text-slate-200 border-2 border-amber-900 shadow-2xl flex flex-col font-serif min-h-[650px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8 border-b border-amber-900/50 pb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-amber-500 flex items-center gap-3">
            <Scale size={32} /> 知识产权大法庭
          </h1>
          <p className="text-amber-200/60 mt-2 font-sans text-sm">任务：作为大法官，为不同的软件侵权纠纷指明正确的知识产权保护类型。</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 relative z-10 font-sans">
        {status === 'won' ? (
          <div className="flex-1 bg-amber-950/30 border border-amber-900 rounded-3xl p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <Gavel size={80} className="text-amber-500 mb-6 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
            <h2 className="text-4xl font-bold text-white mb-6">宣判完毕，维护了软件行业的公平正义！</h2>
            <div className="bg-[#1a1714] border border-amber-900/50 p-6 rounded-2xl max-w-2xl text-left text-amber-200/80 mb-8 space-y-3">
              <p><strong>👨‍⚖️ 法官寄语：</strong></p>
              <p>1. <strong>源代码</strong>受到《著作权法》保护，别人不能直接复制你的代码。</p>
              <p>2. 但著作权不保护思想。如果你有一个牛逼的<strong>算法思想</strong>，必须申请《专利权》。</p>
              <p>3. <strong>品牌和 LOGO</strong> 靠《商标权》保护，防止假冒伪劣。</p>
              <p>4. 只要不公开，靠自己捂严实的技术就是《商业秘密》，一旦被黑客或内鬼泄露，可用《反不正当竞争法》维权。</p>
            </div>
            <button onClick={reset} className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg">
              休庭重审
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="bg-[#1a1714] border border-amber-900/30 rounded-2xl p-6 mb-6">
              <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">法庭卷宗：请为以下案件标定法律属性</h3>
              
              <div className="flex flex-col gap-4">
                {SCENARIOS.map((s, index) => (
                  <div key={s.id} className="bg-[#24201c] border border-amber-900/20 p-5 rounded-xl flex items-center justify-between gap-4 transition-all hover:border-amber-900/50 hover:shadow-lg">
                    <div className="flex-1">
                      <span className="inline-block bg-amber-900/30 text-amber-500 text-xs font-bold px-2 py-1 rounded mr-3">案卷 {index + 1}</span>
                      <span className="text-amber-100">{s.text}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {CATEGORIES.map(cat => {
                        const isSelected = selections[s.id] === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleSelect(s.id, cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
                              isSelected 
                                ? 'bg-amber-600 border-amber-500 text-white shadow-[0_0_10px_rgba(217,119,6,0.5)]' 
                                : 'bg-[#1a1714] border-amber-900/50 text-amber-600 hover:bg-[#332e29] hover:text-amber-400'
                            }`}
                          >
                            {cat.icon} {cat.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center justify-center font-bold mb-4 animate-in slide-in-from-bottom-2">
                {error}
              </div>
            )}

            <button 
              onClick={submitVerdict}
              className="mt-auto py-5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-2xl flex justify-center items-center gap-3 shadow-[0_5px_25px_rgba(180,83,9,0.3)] transition-all text-xl"
            >
              <Gavel size={24} /> 敲击法槌，宣布判决
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
