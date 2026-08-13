import React, { useState } from 'react';
import { Code, CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export default function DesignPatternCode() {
  const { addScore } = useGameStore();

  // Observer Pattern Fill-in-the-blanks
  const [b1, setB1] = useState(''); // interface Observer / class Observer
  const [b2, setB2] = useState(''); // observers.add(obs)
  const [b3, setB3] = useState(''); // obs.update(this) / obs.update()
  const [b4, setB4] = useState(''); // strategy / observer

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkCode = () => {
    const isB1Correct = b1.trim() === 'Observer';
    const isB2Correct = b2.trim() === 'observers.add(obs)' || b2.trim() === 'this.observers.add(obs)';
    const isB3Correct = b3.trim() === 'obs.update(this)' || b3.trim() === 'obs.update()';
    const isB4Correct = b4.trim() === 'Subject';

    if (isB1Correct && isB2Correct && isB3Correct && isB4Correct) {
      setFeedback({
        msg: '代码编译与运行完美通过！软考下午试题六观察者模式 (Observer Pattern) 15 分大题满分！',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      let err = '填空校验失败：';
      if (!isB1Correct) err += '空(1)接口名称应为 Observer；';
      if (!isB2Correct) err += '空(2)注册监听器逻辑应为 observers.add(obs)；';
      if (!isB3Correct) err += '空(3)广播通知方法调用应为 obs.update(this)；';
      if (!isB4Correct) err += '空(4)主题基类名应为 Subject；';
      setFeedback({ msg: err, isCorrect: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/40">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-300">软考下午试题六：设计模式代码填空</h2>
            <p className="text-xs text-slate-400">面向对象程序设计 · Observer 观察者模式 15 分 Java/C++ 代码重构真题实战</p>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3 mb-6 shadow-inner">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-slate-400">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>ObserverPatternTest.java (软考真题试卷代码)</span>
        </div>

        <pre className="text-purple-300 font-bold">// 1. 观察者接口定义</pre>
        <div>
          public interface <input
            type="text"
            value={b1}
            onChange={(e) => setB1(e.target.value)}
            placeholder=" (1) 接口名 "
            className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold text-xs outline-none w-32 focus:border-purple-400"
          /> &#123;
        </div>
        <div className="pl-4">void update(Subject subject);</div>
        <div>&#125;</div>

        <pre className="text-purple-300 font-bold mt-4">// 2. 主题 (Subject) 被观察者基类</pre>
        <div>
          public abstract class <input
            type="text"
            value={b4}
            onChange={(e) => setB4(e.target.value)}
            placeholder=" (4) 主题类名 "
            className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold text-xs outline-none w-32 focus:border-purple-400"
          /> &#123;
        </div>
        <div className="pl-4 text-slate-400">private List&lt;Observer&gt; observers = new ArrayList&lt;&gt;();</div>

        <div className="pl-4 mt-2">public void attach(Observer obs) &#123;</div>
        <div className="pl-8">
          <input
            type="text"
            value={b2}
            onChange={(e) => setB2(e.target.value)}
            placeholder=" (2) 将 obs 存入列表 "
            className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold text-xs outline-none w-48 focus:border-purple-400"
          />;
        </div>
        <div className="pl-4">&#125;</div>

        <div className="pl-4 mt-2">public void notifyAllObservers() &#123;</div>
        <div className="pl-8 text-slate-400">for (Observer obs : observers) &#123;</div>
        <div className="pl-12">
          <input
            type="text"
            value={b3}
            onChange={(e) => setB3(e.target.value)}
            placeholder=" (3) 遍历调用观察者更新 "
            className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold text-xs outline-none w-48 focus:border-purple-400"
          />;
        </div>
        <div className="pl-8 text-slate-400">&#125;</div>
        <div className="pl-4">&#125;</div>
        <div>&#125;</div>
      </div>

      <button
        onClick={checkCode}
        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <Terminal className="w-5 h-5" /> 提交编译并运行测试
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
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
