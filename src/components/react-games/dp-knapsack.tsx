import React, { useState } from 'react';
import { PackageSearch, Briefcase, ChevronRight, Zap, Target, Lock } from 'lucide-react';

const CAPACITY = 8;
const ITEMS = [
  { id: 'A', weight: 5, value: 10, color: 'bg-rose-500' }, // Unit: 2
  { id: 'B', weight: 4, value: 7, color: 'bg-blue-500' },  // Unit: 1.75
  { id: 'C', weight: 4, value: 7, color: 'bg-emerald-500' },// Unit: 1.75
];

export default function DPKnapsack() {
  const [stage, setStage] = useState(1);
  
  // Stage 1 State
  const [selected, setSelected] = useState<string[]>([]);
  const [greedyDemonstrated, setGreedyDemonstrated] = useState(false);
  const [s1Msg, setS1Msg] = useState('');

  // Stage 2 State
  const [dpInputs, setDpInputs] = useState({ c1: '', c2: '' });
  const [s2Msg, setS2Msg] = useState('');

  const currentWeight = selected.reduce((acc, id) => acc + ITEMS.find(i => i.id === id)!.weight, 0);
  const currentValue = selected.reduce((acc, id) => acc + ITEMS.find(i => i.id === id)!.value, 0);

  const toggleItem = (id: string) => {
    if (greedyDemonstrated) {
      setS1Msg('贪心结果已记录，请进入动态规划表比较全局最优解。');
      return;
    }

    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      const item = ITEMS.find(i => i.id === id)!;
      if (currentWeight + item.weight <= CAPACITY) {
        setSelected([...selected, id]);
      } else {
        setS1Msg('背包容量不足！');
        setTimeout(() => setS1Msg(''), 1500);
      }
    }
  };

  const submitStage1 = () => {
    if (greedyDemonstrated) {
      setS1Msg('');
      setStage(2);
      return;
    }

    if (selected.length === 1 && selected[0] === 'A') {
      setGreedyDemonstrated(true);
      setS1Msg('按单位价值贪心会先选 A：价值 10、剩余容量 3，B 和 C 均无法再装入。因此贪心结果为 10，下一步用 DP 寻找全局最优。');
    } else {
      setS1Msg('请先按“价值/重量”从高到低执行贪心：本例应先选择 A。');
    }
  };

  const submitStage2 = () => {
    // dp[2][4] = 7 (B alone fits in 4)
    // dp[3][8] = 14 (B + C fits in 8)
    if (dpInputs.c1 === '7' && dpInputs.c2 === '14') {
      setStage(3);
    } else {
      setS2Msg('计算错误，请仔细阅读状态转移方程！');
    }
  };

  if (stage === 3) {
    return (
      <div className="w-full max-w-4xl mx-auto rounded-3xl p-10 bg-slate-900 flex flex-col items-center justify-center text-center shadow-2xl border border-amber-500/50 min-h-[500px]">
        <Briefcase size={80} className="text-amber-400 mb-6 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
        <h2 className="text-4xl font-bold text-white mb-4">绝世神偷！</h2>
        <p className="text-slate-400 max-w-lg mb-8 text-lg">
          你成功破解了 0-1 背包问题！贪心策略往往只能得到局部最优（10），而动态规划通过状态转移表穷尽了所有的可能性，找到了全局最优解（14）。
        </p>
        <button onClick={() => { setStage(1); setSelected([]); setGreedyDemonstrated(false); setS1Msg(''); setS2Msg(''); setDpInputs({c1:'', c2:''}); }} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-bold transition-all">
          深藏功与名
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-[#18181b] text-slate-200 border-2 border-slate-700 shadow-2xl flex flex-col font-sans min-h-[650px] relative">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-3">
            <PackageSearch size={32} className="text-amber-500" /> 0-1 背包大盗
          </h1>
          <p className="text-slate-400 mt-2 font-mono text-sm">Target: 全局最优解 (Global Optimal) vs 局部最优解 (Greedy)</p>
        </div>
        <div className="flex gap-2 font-mono">
          <div className={`px-4 py-2 rounded-lg font-bold border-2 ${stage === 1 ? 'border-amber-500 text-amber-400 bg-amber-950/30' : 'border-slate-700 text-slate-500'}`}>Stage 1: 贪心陷阱</div>
          <div className={`px-4 py-2 rounded-lg font-bold border-2 ${stage === 2 ? 'border-amber-500 text-amber-400 bg-amber-950/30' : 'border-slate-700 text-slate-500'}`}>Stage 2: 动态规划表</div>
        </div>
      </div>

      {stage === 1 && (
        <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-left">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Target className="text-rose-400"/> 任务：先执行单位价值贪心</h3>
              <p className="text-slate-400">按“价值/重量”从高到低选择物品，观察它为何只能得到局部最优。每种物品只有一个 (0-1 背包)。</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">背包容量</div>
              <div className="text-3xl font-black text-amber-400 font-mono">{currentWeight} / {CAPACITY}</div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Items */}
            <div className="flex-1 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase">可用物品库</h4>
              {ITEMS.map(item => {
                const isSelected = selected.includes(item.id);
                const unitPrice = (item.value / item.weight).toFixed(2);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`relative overflow-hidden flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-slate-600 bg-slate-800 opacity-50 scale-95' 
                        : `border-${item.color.split('-')[1]}-500 bg-slate-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`
                    }`}
                  >
                    {!isSelected && <div className={`absolute top-0 left-0 w-2 h-full ${item.color}`}></div>}
                    <div className="ml-4 flex flex-col items-start">
                      <span className="font-bold text-lg">宝物 {item.id}</span>
                      <span className="text-xs text-slate-400">性价比: {unitPrice} 价值/重量</span>
                    </div>
                    <div className="flex gap-4 text-right font-mono">
                      <div>
                        <div className="text-xs text-slate-500">重量 (W)</div>
                        <div className="font-bold text-white">{item.weight}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">价值 (V)</div>
                        <div className="font-bold text-amber-400">+{item.value}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Knapsack */}
            <div className="flex-1 bg-slate-900 rounded-3xl border-4 border-slate-700 p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-800 px-4 py-2 rounded-bl-xl font-bold text-amber-400 flex items-center gap-2">
                <Briefcase size={18}/> 当前价值: {currentValue}
              </div>
              
              <h4 className="text-sm font-bold text-slate-500 uppercase mb-6">我的背包</h4>
              
              <div className="flex-1 flex flex-col gap-2">
                {selected.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-700 rounded-xl">
                    背包空空如也
                  </div>
                )}
                {selected.map(id => {
                  const item = ITEMS.find(i => i.id === id)!;
                  return (
                    <div key={id} className={`flex items-center justify-between p-3 rounded-lg ${item.color} text-white font-bold animate-in slide-in-from-left-4`}>
                      <span>宝物 {id}</span>
                      <span className="font-mono bg-black/20 px-2 py-1 rounded">W: {item.weight} | V: {item.value}</span>
                    </div>
                  )
                })}
              </div>

              {/* Capacity Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>已用容量</span>
                  <span>剩余: {CAPACITY - currentWeight}</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  {selected.map(id => {
                    const item = ITEMS.find(i => i.id === id)!;
                    return (
                      <div key={`bar-${id}`} className={`h-full ${item.color} border-r border-black/20 transition-all`} style={{ width: `${(item.weight / CAPACITY) * 100}%` }}></div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-rose-400 font-bold">{s1Msg}</div>
            <button 
              onClick={submitStage1}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(217,119,6,0.4)]"
            >
              {greedyDemonstrated ? '进入 DP 对比' : '执行贪心方案'} <ChevronRight />
            </button>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right">
          <div className="bg-indigo-950/30 p-6 rounded-2xl border border-indigo-900 flex flex-col items-center">
            <h3 className="text-xl font-bold text-indigo-300 mb-2 flex items-center gap-2"><Zap /> 动态规划状态转移方程</h3>
            <div className="font-mono text-lg bg-black/40 px-6 py-3 rounded-xl border border-indigo-500/50 text-indigo-200 shadow-inner">
              dp[i][j] = max(<span className="text-rose-300">dp[i-1][j]</span>, <span className="text-emerald-300">dp[i-1][j - w[i]] + v[i]</span>)
            </div>
            <p className="text-slate-400 text-sm mt-4 max-w-2xl text-center">
              意思是在面对第 i 件物品时，你的选择是：<br/>
              1. <strong>不拿</strong>：价值等同于之前 (i-1) 在相同容量 j 下的最优解。<br/>
              2. <strong>拿</strong>：腾出这件物品的重量 (j - w[i])，加上这件物品的价值 v[i]。<br/>
              两者取最大值！
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 overflow-x-auto relative">
            <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">DP 填表挑战 (行:考虑前i个物品, 列:背包容量)</h4>
            
            <table className="w-full text-center font-mono border-collapse">
              <thead>
                <tr className="text-slate-400 border-b-2 border-slate-700">
                  <th className="p-3 border-r-2 border-slate-700">i \ j</th>
                  {[0,1,2,3,4,5,6,7,8].map(cap => <th key={cap} className="p-3">{cap}</th>)}
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {/* Row 0: Empty */}
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <td className="p-3 border-r-2 border-slate-700 font-bold">0 (无)</td>
                  {[0,1,2,3,4,5,6,7,8].map(cap => <td key={cap} className="p-3 text-slate-600">0</td>)}
                </tr>
                {/* Row 1: Item A (W=5, V=10) */}
                <tr className="border-b border-slate-800 bg-rose-950/10">
                  <td className="p-3 border-r-2 border-slate-700 font-bold text-rose-400">1 (A: 5kg,$10)</td>
                  {[0,1,2,3,4].map(cap => <td key={cap} className="p-3">0</td>)}
                  {[5,6,7,8].map(cap => <td key={cap} className="p-3 text-rose-300">10</td>)}
                </tr>
                {/* Row 2: Item B (W=4, V=7) */}
                <tr className="border-b border-slate-800 bg-blue-950/10">
                  <td className="p-3 border-r-2 border-slate-700 font-bold text-blue-400">2 (+B: 4kg,$7)</td>
                  {[0,1,2,3].map(cap => <td key={cap} className="p-3">0</td>)}
                  <td className="p-3">
                    <input type="text" value={dpInputs.c1} onChange={e => setDpInputs({...dpInputs, c1: e.target.value})} className="w-16 bg-slate-950 border border-blue-500 text-center rounded py-1 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="?" />
                  </td>
                  <td className="p-3 text-rose-300">10</td>
                  <td className="p-3 text-rose-300">10</td>
                  <td className="p-3 text-rose-300">10</td>
                  <td className="p-3 text-rose-300">10</td>
                </tr>
                {/* Row 3: Item C (W=4, V=7) */}
                <tr className="bg-emerald-950/10">
                  <td className="p-3 border-r-2 border-slate-700 font-bold text-emerald-400">3 (+C: 4kg,$7)</td>
                  {[0,1,2,3].map(cap => <td key={cap} className="p-3">0</td>)}
                  <td className="p-3 text-blue-300">7</td>
                  {[5,6,7].map(cap => <td key={cap} className="p-3 text-rose-300">10</td>)}
                  <td className="p-3">
                    <input type="text" value={dpInputs.c2} onChange={e => setDpInputs({...dpInputs, c2: e.target.value})} className="w-16 bg-slate-950 border border-emerald-500 text-center rounded py-1 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]" placeholder="?" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-rose-400 font-bold">{s2Msg}</div>
            <button 
              onClick={submitStage2}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(79,70,229,0.4)]"
            >
              验证 DP 表 <Lock size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
