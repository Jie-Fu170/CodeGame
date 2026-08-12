import React, { useState } from 'react';
import { Boxes, RotateCcw, Info, Trophy, CheckCircle2 } from 'lucide-react';

type NodeKey = keyof typeof NODE_POS;
type EdgeId = typeof EDGES[number]['id'];

interface RelTypeDef { label: string; marker: string; dash: boolean; pos: 'end' | 'start' }

const NODE_POS = {
  Publication: { x: 300, y: 40, w: 90 }, Book: { x: 170, y: 150, w: 90 }, Periodical: { x: 430, y: 150, w: 90 },
  Library: { x: 60, y: 250, w: 90 }, Bookshelf: { x: 170, y: 320, w: 90 },
  Reader: { x: 470, y: 250, w: 90 }, BorrowRecord: { x: 470, y: 320, w: 100 }, Printable: { x: 300, y: 340, w: 90 },
};

const LABELS: Record<NodeKey, string> = { Publication: '出版物', Book: '图书', Periodical: '期刊', Library: '图书馆', Bookshelf: '书架', Reader: '读者', BorrowRecord: '借阅记录', Printable: '«接口» 可打印' };

const REL_TYPES: Record<string, RelTypeDef> = {
  generalization: { label: '泛化(继承)', marker: 'mTri', dash: false, pos: 'end' },
  realization: { label: '实现', marker: 'mTri', dash: true, pos: 'end' },
  association: { label: '关联', marker: 'mArrow', dash: false, pos: 'end' },
  aggregation: { label: '聚合', marker: 'mDiaHollow', dash: false, pos: 'start' },
  composition: { label: '组合', marker: 'mDiaFilled', dash: false, pos: 'start' },
  dependency: { label: '依赖', marker: 'mArrow', dash: true, pos: 'end' },
};

const EDGES = [
  { id: 'e1', from: 'Book', to: 'Publication', accept: ['generalization'], explain: '图书"是一种"出版物，子类继承父类的全部特征——标准的泛化关系。' },
  { id: 'e2', from: 'Periodical', to: 'Publication', accept: ['generalization'], explain: '期刊同样"是一种"出版物。' },
  { id: 'e3', from: 'Library', to: 'Bookshelf', accept: ['composition'], explain: '书架是图书馆密不可分的组成部分，图书馆撤了书架也就不存在了——整体和部分生命周期绑定，是组合。' },
  { id: 'e4', from: 'Bookshelf', to: 'Book', accept: ['aggregation'], explain: '书架"装着"图书，但图书能被搬到别的书架甚至借出馆外，脱离某个书架依然存在——较弱的整体-部分关系：聚合。' },
  { id: 'e5', from: 'Reader', to: 'BorrowRecord', accept: ['association', 'dependency'], explain: '读者和借阅记录有持续存在的业务联系，更标准的建模是关联；勉强也能说成依赖，但关联更贴切，因为这不是临时用一下就完事的关系。' },
  { id: 'e6', from: 'Book', to: 'Printable', accept: ['realization'], explain: '图书类实现了"可打印"接口约定的方法——接口没有实现细节，实现类必须补上，这是实现关系，不是继承。' },
  { id: 'e7', from: 'BorrowRecord', to: 'Printable', accept: ['dependency'], explain: '借阅记录只是在生成凭证的某个方法里临时调用一下打印功能，不长期持有引用——用完即走，是最弱的依赖关系。' },
] as const;

interface EdgeAnswer { type: string; correct: boolean }

export default function UmlDesignBench() {
  const [active, setActive] = useState<EdgeId | null>(null);
  const [answers, setAnswers] = useState<Partial<Record<EdgeId, EdgeAnswer>>>({});
  const [shake, setShake] = useState(false);

  const solvedCount = Object.values(answers).filter(a => a?.correct).length;
  const won = solvedCount === EDGES.length;
  const activeEdge = EDGES.find(e => e.id === active);

  function choose(type: string) {
    if (!activeEdge) return;
    const correct = (activeEdge.accept as readonly string[]).includes(type);
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setAnswers(a => ({ ...a, [activeEdge.id]: { type, correct: true } }));
  }

  function reset() { setAnswers({}); setActive(null); setShake(false); }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .ub-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .ub-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .ub-focus:focus-visible { outline: 2px solid #a78bfa; outline-offset: 2px; }
        @keyframes ubShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .ub-shake { animation: ubShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="ub-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Boxes size={20} className="text-violet-400" />UML 设计台 · 图书馆管理系统</h1>
          <p className="text-xs text-slate-400 mt-0.5">点一条连线，判断它该是哪种 UML 关系</p>
        </div>
        <div className="ub-mono text-sm text-slate-300">{solvedCount}/{EDGES.length}</div>
      </div>

      <svg viewBox="0 0 600 400" className="w-full h-auto mb-3">
        <defs>
          <marker id="mTri" viewBox="0 0 20 14" refX="18" refY="7" markerWidth="15" markerHeight="11" orient="auto-start-reverse">
            <path d="M1,1 L18,7 L1,13 Z" fill="#0a0e1a" stroke="#e2e8f0" strokeWidth="1.5" />
          </marker>
          <marker id="mDiaHollow" viewBox="0 0 22 14" refX="20" refY="7" markerWidth="17" markerHeight="11" orient="auto-start-reverse">
            <path d="M1,7 L11,1 L21,7 L11,13 Z" fill="#0a0e1a" stroke="#e2e8f0" strokeWidth="1.5" />
          </marker>
          <marker id="mDiaFilled" viewBox="0 0 22 14" refX="20" refY="7" markerWidth="17" markerHeight="11" orient="auto-start-reverse">
            <path d="M1,7 L11,1 L21,7 L11,13 Z" fill="#e2e8f0" />
          </marker>
          <marker id="mArrow" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="10" markerHeight="8" orient="auto-start-reverse">
            <path d="M1,1 L10,5 L1,9" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          </marker>
        </defs>

        {EDGES.map(e => {
          const from = NODE_POS[e.from], to = NODE_POS[e.to];
          const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
          const ans = answers[e.id];
          const rel = ans ? REL_TYPES[ans.type] : null;
          const isActive = active === e.id;
          return (
            <g key={e.id}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth={18} onClick={() => setActive(e.id)} style={{ cursor: 'pointer' }} />
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={ans ? '#34d399' : isActive ? '#a78bfa' : '#475569'}
                strokeWidth={isActive || ans ? 2.5 : 1.5}
                strokeDasharray={rel && rel.dash ? '6,4' : undefined}
                markerEnd={rel && rel.pos === 'end' ? `url(#${rel.marker})` : undefined}
                markerStart={rel && rel.pos === 'start' ? `url(#${rel.marker})` : undefined}
                pointerEvents="none" style={{ transition: 'stroke 0.2s' }} />
              <rect x={mid.x - 10} y={mid.y - 9} width={20} height={16} rx={3} fill="#0a0e1a" opacity={0.85} pointerEvents="none" />
              <text x={mid.x} y={mid.y + 3} textAnchor="middle" fontSize="10" fill={ans ? '#34d399' : '#64748b'} pointerEvents="none">{ans ? '✓' : '?'}</text>
            </g>
          );
        })}

        {(Object.entries(NODE_POS) as [NodeKey, { x: number, y: number, w: number }][]).map(([key, p]) => (
          <g key={key}>
            <rect x={p.x - p.w / 2} y={p.y - 16} width={p.w} height={32} rx={5} fill={key === 'Printable' ? '#1e1b4b' : '#1e293b'} stroke={key === 'Printable' ? '#818cf8' : '#475569'} strokeWidth={1.5} />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="#e2e8f0">{LABELS[key]}</text>
          </g>
        ))}
      </svg>

      {activeEdge && (
        <div className={`rounded-lg border border-slate-800 bg-slate-900/70 p-3 mb-3 ${shake ? 'ub-shake' : ''}`}>
          <div className="text-sm text-slate-100 mb-2">{LABELS[activeEdge.from]} → {LABELS[activeEdge.to]} 该是什么关系？</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {Object.entries(REL_TYPES).map(([key, def]) => (
              <button key={key} onClick={() => choose(key)}
                className="ub-focus text-xs px-2 py-1.5 rounded-md border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-violet-400 hover:text-slate-100 transition-colors">
                {def.label}
              </button>
            ))}
          </div>
          {answers[activeEdge.id] && (
            <div className="text-xs text-emerald-300 flex items-start gap-1.5 mt-2 pt-2 border-t border-slate-800">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
              <span className="text-slate-300">{activeEdge.explain}</span>
            </div>
          )}
        </div>
      )}

      {!activeEdge && (
        <div className="text-xs flex items-start gap-1.5 mb-3">
          <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="text-slate-500">"?"标记的连线还没判定，点它选关系类型。判断依据：会不会随对象一起消失（组合）、能不能脱离整体独立存在（聚合）、是不是临时借用一下（依赖）。</span>
        </div>
      )}

      {won && (
        <div className="text-center py-4">
          <Trophy size={28} className="mx-auto text-amber-300 mb-2" />
          <div className="ub-display text-xl font-bold text-emerald-400 mb-1">七条关系全部判定正确！</div>
          <div className="text-sm text-slate-400">这张图里的每种 UML 关系都对应一个真实世界的"归属强度"判断，不是死记符号形状</div>
        </div>
      )}

      <button onClick={reset} className="ub-focus w-full mt-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm flex items-center justify-center gap-2 transition-colors">
        <RotateCcw size={14} /> 重新开始
      </button>
    </div>
  );
}
