import React, { useState } from 'react';
import { Code2, Check, X, Braces } from 'lucide-react';

export default function OOPPolymorphism() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'error' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedOutput, setSelectedOutput] = useState('');
  const [selectedBinding, setSelectedBinding] = useState('');

  const challenges = [
    {
      code: `class Parent {
    public void print() {
        System.out.println("Parent Print");
    }
}
class Child extends Parent {
    public void print() {
        System.out.println("Child Print");
    }
}
public class Test {
    public static void main(String[] args) {
        Parent obj = new Child();
        obj.print();
    }
}`,
      question: '上述 Java 代码中，obj.print() 的输出结果是什么？这种机制属于哪种绑定？',
      options: ['Parent Print', 'Child Print', '编译报错'],
      bindingOptions: ['静态绑定 (Static Binding)', '动态绑定 (Dynamic Binding)'],
      correctOutput: 'Child Print',
      correctBinding: '动态绑定 (Dynamic Binding)',
      explanation: '父类引用指向子类对象，调用的是被子类重写 (Override) 的方法，这在运行期决定的，称为动态绑定（或晚期绑定）。'
    },
    {
      code: `class Calculator {
    public int add(int a, int b) { return a + b; }
    public double add(double a, double b) { return a + b; }
}
public class Test {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        calc.add(1, 2);
    }
}`,
      question: '上述代码展示了同名方法，参数类型不同。这种特性叫什么？它在何时决定调用哪个方法？',
      options: ['重写 (Override)', '重载 (Overload)', '隐藏 (Hide)'],
      bindingOptions: ['编译期 (静态绑定)', '运行期 (动态绑定)'],
      correctOutput: '重载 (Overload)',
      correctBinding: '编译期 (静态绑定)',
      explanation: '重载 (Overload) 是指在同一个类中方法名相同但参数列表不同。编译器在编译阶段就能根据传入的参数类型（这里是 int, int）决定调用哪个方法，属于静态绑定。'
    }
  ];

  const currentChallenge = challenges[level];

  const handleSubmit = () => {
    if (selectedOutput === currentChallenge.correctOutput && selectedBinding === currentChallenge.correctBinding) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      setErrorMsg(`选择有误！\n解析: ${currentChallenge.explanation}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-[#1e1e1e] text-slate-200 border border-slate-700 shadow-2xl flex flex-col min-h-[600px] relative">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-orange-400 flex items-center gap-2">
            <Code2 size={28} /> 面向对象多态与绑定 (OOP Polymorphism)
          </h1>
          <p className="text-slate-400 mt-1">剖析重载、重写与静态/动态绑定的本质区别。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">任务进度</div>
          <div className="text-xl font-bold text-orange-400">[{level + 1}/{challenges.length}]</div>
        </div>
      </div>

      {status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Check size={80} className="text-green-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">面向对象理论大师！</h2>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            你已经准确理解了面向对象语言中多态的底层原理，能够清晰分辨编译期绑定与运行期绑定！
          </p>
          <button onClick={() => { setLevel(0); setStatus('playing'); setSelectedOutput(''); setSelectedBinding(''); }} className="px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-bold transition-all">
            重新挑战
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#2d2d2d] rounded-xl border border-[#3d3d3d] mb-6 overflow-hidden">
            <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-[#3d3d3d]">
              <Braces size={16} className="text-orange-400" />
              <span className="text-sm text-slate-400 font-mono">Test.java</span>
            </div>
            <pre className="p-4 overflow-x-auto text-green-400 font-mono text-sm leading-relaxed">
              {currentChallenge.code}
            </pre>
          </div>

          <div className="mb-6">
            <p className="text-white font-bold mb-4">{currentChallenge.question}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-slate-400 mb-2">1. 结果 / 特性判断：</label>
                <div className="flex flex-col gap-2">
                  {currentChallenge.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedOutput(opt)}
                      className={`p-3 rounded text-left transition-colors border ${
                        selectedOutput === opt 
                          ? 'bg-orange-600/20 border-orange-500 text-orange-300' 
                          : 'bg-[#2d2d2d] border-[#3d3d3d] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2">2. 绑定时机判断：</label>
                <div className="flex flex-col gap-2">
                  {currentChallenge.bindingOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSelectedBinding(opt)}
                      className={`p-3 rounded text-left transition-colors border ${
                        selectedBinding === opt 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                          : 'bg-[#2d2d2d] border-[#3d3d3d] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {status === 'success' ? (
             <div className="mt-auto bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex items-center justify-between">
               <div>
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><Check /> 判断完全正确</h3>
                 <p className="text-sm opacity-80">{currentChallenge.explanation}</p>
               </div>
               <button onClick={() => {
                 if (level + 1 >= challenges.length) {
                   setStatus('finished');
                 } else {
                   setLevel(l => l + 1);
                   setStatus('playing');
                   setSelectedOutput('');
                   setSelectedBinding('');
                 }
               }} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shrink-0 ml-4">
                 继续下一题
               </button>
             </div>
          ) : (
            <div className="mt-auto">
              {status === 'error' && (
                <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-lg flex items-start gap-3 mb-4">
                  <X className="shrink-0 mt-0.5" />
                  <span className="text-sm whitespace-pre-line">{errorMsg}</span>
                </div>
              )}
              <button 
                onClick={handleSubmit}
                disabled={!selectedOutput || !selectedBinding}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-[#2d2d2d] disabled:text-slate-500 text-white font-bold text-xl rounded-xl transition-colors"
              >
                提交判决
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
