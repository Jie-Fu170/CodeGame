import React, { useState } from 'react';
import { GitMerge, RefreshCw, CheckCircle2, AlertTriangle, Calculator, FileCode } from 'lucide-react';

interface LeafNode {
  id: string;
  char: string;
  weight: number;
}

export default function HuffmanCoder() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Build Tree / WPL, 2: Code Verification, 3: Success

  // Character frequencies for: A: 40, B: 20, C: 15, D: 15, E: 10
  // Total weight = 100
  // Huffman Tree Construction:
  // Step 1: Combine E(10) + C(15) or D(15) -> N1(25)
  // Step 2: Combine C(15) or D(15) + B(20) -> N2(35)
  // Step 3: Combine N1(25) + N2(35) -> N3(60)
  // Step 4: Combine A(40) + N3(60) -> Root(100)
  // WPL = 40*1 + 20*3 + 15*3 + 15*3 + 10*3 = 40 + 60 + 45 + 45 + 30 = 220
  const [leaves] = useState<LeafNode[]>([
    { id: 'A', char: 'A', weight: 40 },
    { id: 'B', char: 'B', weight: 20 },
    { id: 'C', char: 'C', weight: 15 },
    { id: 'D', char: 'D', weight: 15 },
    { id: 'E', char: 'E', weight: 10 },
  ]);

  const [inputWPL, setInputWPL] = useState('');
  const [phase1Error, setPhase1Error] = useState('');

  // Phase 2: Prefix codes
  const [codes, setCodes] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
    E: '',
  });
  const [phase2Error, setPhase2Error] = useState('');

  const correctWPL = 220; // 40*1 + 20*3 + 15*3 + 15*3 + 10*3 = 220

  const handleVerifyPhase1 = () => {
    const wpl = parseInt(inputWPL, 10);
    if (wpl === correctWPL) {
      setPhase1Error('');
      setPhase(2);
    } else {
      setPhase1Error(
        `计算错误！请建树：先合并最小的 10(E)与15(D)$\\rightarrow 25$，再合并 15(C)与20(B)$\\rightarrow 35$，合并 25与35$\\rightarrow 60$，最后合并 40(A)与60$\\rightarrow 100$。WPL = 40×1 + 20×3 + 15×3 + 15×3 + 10×3 = 220！`
      );
    }
  };

  const handleVerifyPhase2 = () => {
    // Check if lengths of codes match valid Huffman code depths
    // A: len 1, B, C, D, E: len 3
    const lenA = codes.A.length;
    const lenB = codes.B.length;
    const lenC = codes.C.length;
    const lenD = codes.D.length;
    const lenE = codes.E.length;

    // Check prefix code property (no code is a prefix of another)
    const codeList = [codes.A, codes.B, codes.C, codes.D, codes.E];
    const hasEmpty = codeList.some(c => c.trim() === '');

    if (hasEmpty) {
      setPhase2Error('请填满所有 5 个字符的二进制变长编码！');
      return;
    }

    let isPrefixFree = true;
    for (let i = 0; i < codeList.length; i++) {
      for (let j = 0; j < codeList.length; j++) {
        if (i !== j && codeList[j].startsWith(codeList[i])) {
          isPrefixFree = false;
          break;
        }
      }
    }

    if (lenA === 1 && lenB === 3 && lenC === 3 && lenD === 3 && lenE === 3 && isPrefixFree) {
      setPhase2Error('');
      setPhase(3);
    } else if (!isPrefixFree) {
      setPhase2Error('违反前缀码性质！任何一个字符的编码都不能是另一个字符编码的前缀。');
    } else {
      setPhase2Error('编码长度不匹配！频次最高(40)的 A 应为 1 位编码，其余 4 个字符应为 3 位编码。');
    }
  };

  const resetGame = () => {
    setPhase(1);
    setInputWPL('');
    setPhase1Error('');
    setCodes({ A: '', B: '', C: '', D: '', E: '' });
    setPhase2Error('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            <GitMerge size={28} /> 哈夫曼树 (Huffman Tree) 与前缀编码
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：哈夫曼树构造法则、带权路径长度 (WPL) 计算与无前缀编码规则
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
        <div className={`p-2.5 rounded-lg border ${phase === 1 ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          1. 构造哈夫曼树求 WPL
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 2 ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          2. 分配 0/1 前缀编码
        </div>
        <div className={`p-2.5 rounded-lg border ${phase === 3 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
          3. 通关与考点总结
        </div>
      </div>

      {/* Character Frequencies display */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 space-y-2 text-xs">
        <div className="text-slate-400 font-bold">已知 5 个字符及其出现的权重频次：</div>
        <div className="flex gap-3 justify-around pt-1">
          {leaves.map(l => (
            <div key={l.id} className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-center">
              <span className="text-amber-400 font-bold text-base">{l.char}</span>
              <div className="text-slate-400 text-[10px]">权重: {l.weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 1 */}
      {phase === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calculator size={18} className="text-amber-400" /> 步骤 1：构造最优二叉树并求带权路径长度 WPL
            </h2>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700 text-xs space-y-2 text-slate-300">
              <p className="text-amber-300 font-semibold">💡 建树口诀：每次挑出权值最小的 2 个节点合并为一个新父节点！</p>
              <p>公式：$\text{WPL} = \sum (\text{字符权重} \times \text{节点到根的路径长度 } l_i)$</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-200 font-bold">请计算该哈夫曼树的最终带权路径长度 (WPL):</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={inputWPL}
                  onChange={e => setInputWPL(e.target.value)}
                  placeholder="例如: 220"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleVerifyPhase1}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-sm transition-all shadow-lg"
                >
                  验证 WPL 计算
                </button>
              </div>
            </div>

            {phase1Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase1Error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCode size={18} className="text-cyan-400" /> 步骤 2：分配左 0 右 1 变长无前缀编码
            </h2>
            <p className="text-xs text-slate-300">
              请为 5 个字符输入一组符合哈夫曼树分支规则（左分支标记 0，右分支标记 1）的二进制编码：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {leaves.map(l => (
                <div key={l.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">字符 {l.char} (权值 {l.weight}):</span>
                  <input
                    type="text"
                    value={codes[l.id as keyof typeof codes]}
                    onChange={e => setCodes({ ...codes, [l.id]: e.target.value.replace(/[^01]/g, '') })}
                    placeholder={l.id === 'A' ? '例如: 0' : '例如: 100'}
                    className="w-28 bg-slate-950 border border-slate-600 rounded px-2 py-1 text-cyan-300 font-bold text-sm text-center"
                  />
                </div>
              ))}
            </div>

            {phase2Error && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} /> {phase2Error}
              </div>
            )}

            <button
              onClick={handleVerifyPhase2}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
            >
              提交前缀编码验证
            </button>
          </div>
        </div>
      )}

      {/* Phase 3 */}
      {phase === 3 && (
        <div className="bg-emerald-950/40 p-6 rounded-xl border border-emerald-700 space-y-4 text-center">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-300">通关！完美攻克哈夫曼编码大题！</h2>
          
          <div className="bg-slate-900/90 p-4 rounded-xl text-left text-xs text-slate-300 space-y-2 border border-slate-700">
            <h4 className="font-bold text-amber-400 text-sm">📘 软考大题及单选题高频避坑要点：</h4>
            <p>1. <strong>哈夫曼树节点数公式</strong>：有 $n$ 个叶子节点，则生成的哈夫曼树总结点数为 $2n - 1$（包含 $n-1$ 个度为 2 的分支节点，度为 1 的节点数恒为 0）。</p>
            <p>2. <strong>前缀码定义</strong>：任一字符的编码绝不能是另一个字符编码的前缀，保证解码时无歧义。</p>
            <p>3. <strong>压缩率计算</strong>：定长编码（如 5 字符需 3 位定长 $100 \times 3 = 300$ 位）对比变长 WPL ($220$ 位)，压缩率 $= (300-220)/300 = 26.67\%$。</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
          >
            再次演练
          </button>
        </div>
      )}
    </div>
  );
}
