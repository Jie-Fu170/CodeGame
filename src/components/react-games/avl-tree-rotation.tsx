import React, { useState } from 'react';
import { GitBranch, Check, X } from 'lucide-react';

export default function AVLTreeRotation() {
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<'playing' | 'success' | 'error' | 'finished'>('playing');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedRotation, setSelectedRotation] = useState<string | null>(null);

  const challenges = [
    {
      desc: '向 AVL 树中依次插入节点 [10, 20, 30]。在插入 30 后，哪一个节点失去了平衡？应该使用哪种旋转来修复？',
      treeLayout: `
      10 (BF=-2)
        \\
         20 (BF=-1)
           \\
            30 (BF=0)
      `,
      nodes: ['10', '20', '30'],
      rotations: ['LL 单旋 (右旋)', 'RR 单旋 (左旋)', 'LR 双旋 (先左后右)', 'RL 双旋 (先右后左)'],
      correctNode: '10',
      correctRotation: 'RR 单旋 (左旋)',
      explanation: '插入 30 后，节点 10 的右子树高度为 2，左子树高度为 0，平衡因子为 -2，失去平衡。不平衡是因为在 10 的右孩子 (20) 的右子树 (30) 上插入，属于 RR 型，需要进行 RR 单旋 (左旋) 修复。'
    },
    {
      desc: '原树已有 [50, 30, 80]，向其中插入 40。插入后哪一个节点失去平衡？应该使用哪种旋转？',
      treeLayout: `
         50 (BF=2)
        /  \\
       30   80
         \\
          40
      `,
      nodes: ['50', '30', '40', '80'],
      rotations: ['LL 单旋 (右旋)', 'RR 单旋 (左旋)', 'LR 双旋 (先左后右)', 'RL 双旋 (先右后左)'],
      correctNode: '50',
      correctRotation: 'LR 双旋 (先左后右)',
      explanation: '节点 50 失衡 (左高右低，BF=2)。不平衡是因为在 50 的左孩子 (30) 的右子树 (40) 上插入，属于 LR 型，需进行 LR 双旋 (先对 30 左旋，再对 50 右旋)。'
    }
  ];

  const currentChallenge = challenges[level];

  const handleSubmit = () => {
    if (selectedNode === currentChallenge.correctNode && selectedRotation === currentChallenge.correctRotation) {
      setStatus('success');
      setErrorMsg('');
    } else {
      setStatus('error');
      setErrorMsg(`判断错误！\n提示: ${currentChallenge.explanation}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl flex flex-col min-h-[600px]">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-lime-400 flex items-center gap-2">
            <GitBranch size={28} /> AVL 树平衡旋转 (AVL Tree)
          </h1>
          <p className="text-slate-400 mt-1">识别失衡节点并执行正确的单双旋转操作。</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">任务进度</div>
          <div className="text-xl font-bold text-lime-400">[{level + 1}/{challenges.length}]</div>
        </div>
      </div>

      {status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Check size={80} className="text-green-500 mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">平衡大师！</h2>
          <p className="text-slate-400 mb-8 text-center max-w-md">
            你已经熟练掌握了 AVL 平衡二叉树的 LL、RR、LR、RL 四大旋转秘诀！
          </p>
          <button onClick={() => { setLevel(0); setStatus('playing'); setSelectedNode(null); setSelectedRotation(null); }} className="px-8 py-3 bg-lime-600 hover:bg-lime-500 rounded-xl text-black font-bold transition-all">
            重新挑战
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
            <p className="text-white text-lg">{currentChallenge.desc}</p>
          </div>
          
          <div className="bg-[#1e293b] rounded-xl border border-slate-600 mb-6 p-6 flex justify-center items-center font-mono text-lime-400 whitespace-pre leading-relaxed overflow-x-auto">
            {currentChallenge.treeLayout}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <label className="block text-slate-400 mb-3">1. 请找出第一个失去平衡的节点：</label>
              <div className="flex flex-wrap gap-3">
                {currentChallenge.nodes.map(node => (
                  <button
                    key={node}
                    onClick={() => setSelectedNode(node)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all border-2 ${
                      selectedNode === node 
                        ? 'bg-red-500/20 border-red-500 text-red-400 scale-110' 
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {node}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-3">2. 应采用的旋转修复方式：</label>
              <div className="flex flex-col gap-2">
                {currentChallenge.rotations.map(rot => (
                  <button
                    key={rot}
                    onClick={() => setSelectedRotation(rot)}
                    className={`p-3 rounded-lg text-left transition-colors border ${
                      selectedRotation === rot 
                        ? 'bg-lime-600/20 border-lime-500 text-lime-300' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {rot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === 'success' ? (
             <div className="mt-auto bg-green-900/30 border border-green-500 text-green-400 p-6 rounded-xl flex items-center justify-between">
               <div>
                 <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><Check /> 修复成功</h3>
                 <p className="text-sm opacity-80">{currentChallenge.explanation}</p>
               </div>
               <button onClick={() => {
                 if (level + 1 >= challenges.length) {
                   setStatus('finished');
                 } else {
                   setLevel(l => l + 1);
                   setStatus('playing');
                   setSelectedNode(null);
                   setSelectedRotation(null);
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
                disabled={!selectedNode || !selectedRotation}
                className="w-full py-4 bg-lime-600 hover:bg-lime-500 text-black disabled:bg-slate-700 disabled:text-slate-500 font-bold text-xl rounded-xl transition-colors"
              >
                实施旋转修复
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
