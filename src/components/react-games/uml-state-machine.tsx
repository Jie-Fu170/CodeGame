import { useState } from 'react';
import { GitCommit, Trash2, Plus, Play, CheckCircle } from 'lucide-react';

type Transition = {
  id: string;
  from: string;
  event: string;
  to: string;
};

const STATES = ['Idle (待机)', 'HasCoin (已投币)', 'Dispensing (出货)'];
const EVENTS = ['insert_coin (投币)', 'select (选择商品)', 'take_coffee (取货)', 'refund (退币)'];

const INITIAL_TRANSITIONS: Transition[] = [
  { id: 't1', from: 'Idle (待机)', event: 'select (选择商品)', to: 'Dispensing (出货)' }, // BUG
  { id: 't2', from: 'Idle (待机)', event: 'insert_coin (投币)', to: 'HasCoin (已投币)' },
  { id: 't3', from: 'HasCoin (已投币)', event: 'select (选择商品)', to: 'Dispensing (出货)' },
  // Missing Dispensing -> Idle
];

export default function UMLStateMachine() {
  const [transitions, setTransitions] = useState<Transition[]>(INITIAL_TRANSITIONS);
  const [newFrom, setNewFrom] = useState(STATES[0]);
  const [newEvent, setNewEvent] = useState(EVENTS[0]);
  const [newTo, setNewTo] = useState(STATES[0]);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'failed'>('playing');

  const addTransition = () => {
    if (transitions.find(t => t.from === newFrom && t.event === newEvent)) {
      setLog(['错误：同一个状态不能有相同事件的多个转移分支（确定性有限状态机）。']);
      return;
    }
    const newT = { id: `t_${Date.now()}`, from: newFrom, event: newEvent, to: newTo };
    setTransitions([...transitions, newT]);
  };

  const removeTransition = (id: string) => {
    setTransitions(transitions.filter(t => t.id !== id));
  };

  const runSimulation = () => {
    const logs: string[] = [];
    let passed = true;

    // Test 1: Free coffee bug
    const freeCoffee = transitions.find(t => t.from === 'Idle (待机)' && t.event === 'select (选择商品)');
    if (freeCoffee) {
      logs.push('❌ 致命错误：在待机状态下，用户直接点击"选择商品"，状态机转移到了"出货"！(免费吐咖啡 bug)');
      passed = false;
    } else {
      logs.push('✅ 安全检查：待机状态下无法直接选择商品。');
    }

    // Test 2: Normal flow (Idle -> HasCoin -> Dispensing -> Idle)
    const hasCoin = transitions.find(t => t.from === 'Idle (待机)' && t.event === 'insert_coin (投币)');
    if (!hasCoin || hasCoin.to !== 'HasCoin (已投币)') {
      logs.push('❌ 流程阻断：无法从待机状态投币进入已投币状态。');
      passed = false;
    } else {
      const disp = transitions.find(t => t.from === 'HasCoin (已投币)' && t.event === 'select (选择商品)');
      if (!disp || disp.to !== 'Dispensing (出货)') {
        logs.push('❌ 流程阻断：已投币状态下无法选择商品出货。');
        passed = false;
      } else {
        const backToIdle = transitions.find(t => t.from === 'Dispensing (出货)' && t.event === 'take_coffee (取货)');
        if (!backToIdle || backToIdle.to !== 'Idle (待机)') {
          logs.push('❌ 状态死锁：出货后（用户取货），机器无法回到待机状态。');
          passed = false;
        } else {
          logs.push('✅ 完整购物流程测试通过。');
        }
      }
    }

    setLog(logs);
    if (passed) {
      setStatus('won');
    } else {
      setStatus('failed');
    }
  };

  const reset = () => {
    setTransitions(INITIAL_TRANSITIONS);
    setLog([]);
    setStatus('playing');
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-8 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col font-sans min-h-[600px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
            <GitCommit size={32} className="text-purple-500" /> UML 状态机检修
          </h1>
          <p className="text-slate-400 mt-2">受命修复自动售货机：它在用户未投币时也会免费吐咖啡，且买完后就死机了！</p>
        </div>
        <button onClick={reset} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-300 transition-colors">
          重置状态机
        </button>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Left Side: Transitions List */}
        <div className="flex-[3] flex flex-col gap-6">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-inner">
            <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
              <GitCommit size={20} className="text-purple-400" /> 当前状态转移表
            </h3>
            
            <div className="flex flex-col gap-3">
              {transitions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 animate-in slide-in-from-left">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-bold text-blue-300 w-32">{t.from}</span>
                    <span className="bg-slate-900 text-slate-400 px-3 py-1 rounded-full text-sm font-mono flex-1 text-center border border-slate-700">
                      -- {t.event} --&gt;
                    </span>
                    <span className="font-bold text-emerald-300 w-32 text-right">{t.to}</span>
                  </div>
                  <button 
                    onClick={() => removeTransition(t.id)}
                    className="ml-6 p-2 text-rose-400 hover:bg-rose-950/50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {transitions.length === 0 && <div className="text-center text-slate-500 py-4">无任何状态转移。机器是一块砖。</div>}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">添加新转移</h3>
            <div className="flex gap-3 items-end">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs text-slate-500 font-bold">当前状态</label>
                <select value={newFrom} onChange={e => setNewFrom(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-purple-500 outline-none">
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 flex-[1.2]">
                <label className="text-xs text-slate-500 font-bold">触发事件</label>
                <select value={newEvent} onChange={e => setNewEvent(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-purple-500 outline-none">
                  {EVENTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs text-slate-500 font-bold">目标状态</label>
                <select value={newTo} onChange={e => setNewTo(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-purple-500 outline-none">
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button 
                onClick={addTransition}
                className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-all shadow-lg"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation & Logs */}
        <div className="flex-[2] flex flex-col gap-4">
          <button 
            onClick={runSimulation}
            disabled={status === 'won'}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg text-lg"
          >
            <Play size={24} /> 运行逻辑仿真
          </button>

          <div className="flex-1 bg-[#0a0a0a] rounded-2xl border border-slate-800 p-5 font-mono text-sm overflow-hidden flex flex-col">
            <h3 className="text-slate-500 mb-4 font-bold border-b border-slate-800 pb-2">仿真运行日志</h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {log.map((l, i) => (
                <div key={i} className={`p-3 rounded-lg border ${l.includes('✅') ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400' : l.includes('❌') ? 'bg-rose-950/30 border-rose-900 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300'} animate-in slide-in-from-bottom-2`}>
                  {l}
                </div>
              ))}
              {log.length === 0 && <div className="text-slate-600 italic">点击上方按钮开始仿真...</div>}
            </div>
          </div>
        </div>
      </div>

      {status === 'won' && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 rounded-3xl">
          <div className="bg-slate-900 p-10 rounded-3xl border-2 border-purple-500 text-center max-w-lg shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-in zoom-in-95 duration-500">
            <CheckCircle size={80} className="mx-auto text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-3xl font-black text-white mb-4">逻辑闭环修复成功！</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              非法送咖啡的 bug 已被铲除，且售货机能在交易完成后顺利回到稳态。<br/>
              UML 状态机图的严谨性保证了软件的确定性。
            </p>
            <button onClick={reset} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg w-full">
              重置以供复习
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
