import React, { useState } from 'react';
import { MonitorPlay, Check, X, Calculator } from 'lucide-react';

export default function MultimediaCalculator() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'error' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');

  const [formulaIdx, setFormulaIdx] = useState(-1);
  const [result, setResult] = useState('');

  const challenges = [
    {
      title: '位图图像容量计算',
      desc: '一幅分辨率为 1024 × 768 的 24 位真彩色位图图像。',
      question: '请计算该图像未压缩时的理论存储容量大约是多少 (单位: MB，保留 2 位小数)。',
      options: [
        '分辨率 × 色深 / 8',
        '分辨率 × 色深',
        '长 × 宽 × 分辨率',
        '分辨率 × 帧率 × 色深'
      ],
      correctIdx: 0,
      // 1024 * 768 * 24 / 8 = 2,359,296 Bytes = 2.25 MB
      correctResult: '2.25'
    },
    {
      title: '无损音频容量计算',
      desc: '一段录音，采样频率为 44.1 kHz，量化位数为 16 位，双声道立体声，时长 1 分钟。',
      question: '请计算该音频文件未压缩时的存储容量大约是多少 (单位: MB，保留 2 位小数，按 1MB=1024KB 计算 或 1MB=1000000B 近似计算均可，这里按精确的 1024*1024 计算)。',
      options: [
        '采样率 × 量化位数 / 8',
        '采样率 × 量化位数 × 声道数 × 时长',
        '采样率 × 量化位数 × 声道数 × 时长 / 8',
        '采样率 × 声道数 × 时长 / 8'
      ],
      correctIdx: 2,
      // 44100 * 16 * 2 * 60 / 8 = 10,584,000 Bytes = 10.09 MB
      correctResult: '10.09'
    }
  ];

  const currentChallenge = challenges[level];

  const handleSubmit = () => {
    if (formulaIdx !== currentChallenge.correctIdx) {
      setStatus('error');
      setErrorMsg('计算公式选择错误。请重新回忆图像和音频容量的计算法则。记得除以 8 将 bit 转换为 Byte！');
      return;
    }
    
    // Accept small rounding errors
    const parsedRes = parseFloat(result);
    const correctRes = parseFloat(currentChallenge.correctResult);
    if (isNaN(parsedRes) || Math.abs(parsedRes - correctRes) > 0.05) {
      setStatus('error');
      setErrorMsg(`结果计算错误！正确答案应在 ${currentChallenge.correctResult} 附近 (可能因为 1000 和 1024 的换算产生微小差异，标准计算应除以 1024*1024)。`);
      return;
    }

    setStatus('success');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-[#0f172a] text-slate-200 border border-slate-700 shadow-2xl flex flex-col min-h-[600px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-fuchsia-400 flex items-center gap-2">
            <MonitorPlay size={28} /> 多媒体容量计算 (Multimedia)
          </h1>
          <p className="text-slate-400 mt-1">掌握图像、音频、视频等多媒体文件的基本属性与未压缩存储容量计算。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">任务进度</div>
          <div className="text-xl font-bold text-fuchsia-400">[{level + 1}/{challenges.length}]</div>
        </div>
      </div>

      {status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Check size={80} className="text-green-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">多媒体计算达人！</h2>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            你已经掌握了图像色深、音频采样率、声道数等核心参数对文件大小的决定性影响！
          </p>
          <button onClick={() => { setLevel(0); setStatus('playing'); setFormulaIdx(-1); setResult(''); }} className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl text-white font-bold transition-all">
            重新挑战
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
            <p className="text-slate-300 text-lg bg-slate-900/50 p-4 rounded-lg border-l-4 border-fuchsia-500 font-mono">
              {currentChallenge.desc}
            </p>
            <p className="text-fuchsia-400 mt-4 font-bold">{currentChallenge.question}</p>
          </div>

          <div className="space-y-6 mb-6 flex-1">
            <div>
              <label className="block text-slate-400 mb-3">1. 选择正确的计算公式 (转为 Byte 级)：</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentChallenge.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFormulaIdx(idx)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formulaIdx === idx 
                        ? 'bg-fuchsia-600/20 border-fuchsia-500 text-fuchsia-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-3">2. 填入最终计算结果 (MB)：</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    value={result}
                    onChange={e => setResult(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 focus:border-fuchsia-500 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none"
                    placeholder="例如: 1.50"
                  />
                </div>
                <span className="text-slate-400 font-bold text-xl">MB</span>
              </div>
            </div>
          </div>

          {status === 'success' ? (
             <div className="mt-auto bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Check size={32} />
                 <div>
                   <h3 className="text-xl font-bold">计算完全正确</h3>
                   <p className="text-sm opacity-80">公式与结果均无误。</p>
                 </div>
               </div>
               <button onClick={() => {
                 if (level + 1 >= challenges.length) {
                   setStatus('finished');
                 } else {
                   setLevel(l => l + 1);
                   setStatus('playing');
                   setFormulaIdx(-1);
                   setResult('');
                 }
               }} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded">
                 继续下一题
               </button>
             </div>
          ) : (
            <div className="mt-auto">
              {status === 'error' && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg flex items-start gap-3 mb-4">
                  <X className="shrink-0 mt-0.5" />
                  <span className="text-sm">{errorMsg}</span>
                </div>
              )}
              <button 
                onClick={handleSubmit}
                disabled={formulaIdx === -1 || result === ''}
                className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl rounded-xl transition-colors"
              >
                提交计算
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
