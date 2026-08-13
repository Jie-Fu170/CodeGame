import React, { useState } from 'react';
import { Binary, Check, X } from 'lucide-react';

export default function DataRepresentation() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'error' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');

  const [answers, setAnswers] = useState({
    yuan: '',
    fan: '',
    bu: '',
    yi: ''
  });

  const challenges = [
    {
      num: 45,
      correct: {
        yuan: '00101101',
        fan: '00101101',
        bu: '00101101',
        yi: '10101101'
      }
    },
    {
      num: -45,
      correct: {
        yuan: '10101101',
        fan: '11010010',
        bu: '11010011',
        yi: '01010011'
      }
    }
  ];

  const currentChallenge = challenges[level];

  const handleSubmit = () => {
    const { yuan, fan, bu, yi } = answers;
    if (
      yuan === currentChallenge.correct.yuan &&
      fan === currentChallenge.correct.fan &&
      bu === currentChallenge.correct.bu &&
      yi === currentChallenge.correct.yi
    ) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      setErrorMsg('部分编码填写错误，请重新检查你的转换逻辑。正数的原反补相同；负数的反码是除符号位外按位取反，补码是反码+1，移码是补码符号位取反。');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col min-h-[600px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-400 flex items-center gap-2">
            <Binary size={28} /> 数据表示 (Data Representation)
          </h1>
          <p className="text-slate-400 mt-1">将给定的十进制数转换为 8 位二进制的原码、反码、补码和移码。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">任务进度</div>
          <div className="text-xl font-bold text-teal-400">[{level + 1}/{challenges.length}]</div>
        </div>
      </div>

      {status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Check size={80} className="text-green-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">编码大师！</h2>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            你已经完全掌握了计算机底层的机器数编码规则！
          </p>
          <button onClick={() => { setLevel(0); setStatus('playing'); setAnswers({yuan:'', fan:'', bu:'', yi:''}); }} className="px-8 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl text-white font-bold transition-all">
            重新挑战
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <span className="text-slate-400 mb-2">当前十进制数</span>
            <div className="text-6xl font-bold text-white bg-slate-800 px-10 py-6 rounded-2xl border-2 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              {currentChallenge.num}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { key: 'yuan', label: '原码 (True Form)' },
              { key: 'fan', label: '反码 (Ones\' Complement)' },
              { key: 'bu', label: '补码 (Two\'s Complement)' },
              { key: 'yi', label: '移码 (Offset Binary)' }
            ].map(field => (
              <div key={field.key} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <label className="block text-teal-400 mb-2 font-bold">{field.label}</label>
                <input
                  type="text"
                  maxLength={8}
                  value={answers[field.key as keyof typeof answers]}
                  onChange={e => setAnswers({ ...answers, [field.key]: e.target.value.replace(/[^01]/g, '') })}
                  className="w-full bg-slate-900 border-2 border-slate-600 focus:border-teal-500 rounded-lg px-4 py-3 text-2xl font-mono tracking-[0.5em] text-white focus:outline-none transition-colors text-center"
                  placeholder="00000000"
                />
              </div>
            ))}
          </div>

          {status === 'success' ? (
             <div className="mt-auto bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex flex-col items-center">
               <Check size={48} className="mb-4" />
               <h3 className="text-2xl font-bold mb-2">转换正确</h3>
               <button onClick={() => {
                 if (level + 1 >= challenges.length) {
                   setStatus('finished');
                 } else {
                   setLevel(l => l + 1);
                   setStatus('playing');
                   setAnswers({yuan:'', fan:'', bu:'', yi:''});
                 }
               }} className="mt-4 px-8 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded">
                 继续下一题
               </button>
             </div>
          ) : (
            <div className="mt-auto">
              {status === 'error' && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-lg flex items-center gap-3 mb-4">
                  <X className="shrink-0" />
                  <span className="text-sm">{errorMsg}</span>
                </div>
              )}
              <button 
                onClick={handleSubmit}
                disabled={Object.values(answers).some(v => v.length !== 8)}
                className="w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-xl transition-colors"
              >
                提交验证
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
