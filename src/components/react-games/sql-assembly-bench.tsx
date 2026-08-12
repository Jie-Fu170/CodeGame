import React, { useState, useEffect } from 'react';
import { Database, RotateCcw, Info, Trophy, PlayCircle } from 'lucide-react';

const TABLES = {
  students: [
    { id: 1, name: '张伟', dept: '计算机' },
    { id: 2, name: '李娜', dept: '计算机' },
    { id: 3, name: '王芳', dept: '数学' },
    { id: 4, name: '刘洋', dept: '数学' },
    { id: 5, name: '陈静', dept: '计算机' },
  ],
  courses: [
    { id: 101, name: '数据结构', credit: 4 },
    { id: 102, name: '操作系统', credit: 3 },
    { id: 103, name: '高等数学', credit: 5 },
  ],
  enrollments: [
    { student_id: 1, course_id: 101, score: 92 },
    { student_id: 1, course_id: 102, score: 78 },
    { student_id: 2, course_id: 101, score: 85 },
    { student_id: 2, course_id: 103, score: 90 },
    { student_id: 3, course_id: 103, score: 95 },
    { student_id: 3, course_id: 101, score: 60 },
    { student_id: 4, course_id: 103, score: 88 },
    { student_id: 5, course_id: 101, score: 76 },
    { student_id: 5, course_id: 102, score: 82 },
  ],
};

const CHALLENGES = [
  {
    id: 'c1',
    prompt: '找出"计算机"系学生的姓名',
    slots: [
      { key: 'SELECT', options: [{ v: 'name', ok: true }, { v: '*', ok: false }, { v: 'dept', ok: false }] },
      { key: 'FROM', options: [{ v: 'students', ok: true }, { v: 'courses', ok: false }, { v: 'enrollments', ok: false }] },
      { key: 'WHERE', options: [{ v: "dept = '计算机'", ok: true }, { v: "dept = '数学'", ok: false }, { v: "score > 80", ok: false }] },
    ],
    run: () => TABLES.students.filter(s => s.dept === '计算机').map(s => ({ 姓名: s.name })),
  },
  {
    id: 'c2',
    prompt: '找出选修了"数据结构"、且成绩高于 80 分的学生姓名',
    slots: [
      { key: 'SELECT', options: [{ v: 's.name', ok: true }, { v: 's.dept', ok: false }, { v: 'c.name', ok: false }] },
      { key: 'FROM/JOIN', options: [
        { v: 'students s JOIN enrollments e ON s.id=e.student_id JOIN courses c ON e.course_id=c.id', ok: true },
        { v: 'students s JOIN courses c ON s.id=c.id', ok: false },
        { v: 'students s', ok: false },
      ] },
      { key: 'WHERE', options: [
        { v: "c.name='数据结构' AND e.score>80", ok: true },
        { v: "c.name='数据结构' OR e.score>80", ok: false },
        { v: "c.name='操作系统' AND e.score>80", ok: false },
      ] },
    ],
    run: () => {
      const cid = TABLES.courses.find(c => c.name === '数据结构').id;
      return TABLES.enrollments.filter(e => e.course_id === cid && e.score > 80)
        .map(e => ({ 姓名: TABLES.students.find(s => s.id === e.student_id).name, 成绩: e.score }));
    },
  },
  {
    id: 'c3',
    prompt: '统计每个学生的平均成绩，只显示平均分 80 分以上的（学号 + 平均分）',
    slots: [
      { key: 'SELECT', options: [{ v: 'student_id, AVG(score)', ok: true }, { v: 'student_id, SUM(score)', ok: false }, { v: 'student_id, COUNT(score)', ok: false }] },
      { key: 'FROM', options: [{ v: 'enrollments', ok: true }, { v: 'students', ok: false }, { v: 'courses', ok: false }] },
      { key: 'GROUP BY', options: [{ v: 'student_id', ok: true }, { v: 'course_id', ok: false }, { v: 'score', ok: false }] },
      { key: 'HAVING', options: [{ v: 'AVG(score) > 80', ok: true }, { v: 'score > 80', ok: false }, { v: 'COUNT(score) > 80', ok: false }] },
    ],
    run: () => {
      const by = {};
      TABLES.enrollments.forEach(e => { (by[e.student_id] = by[e.student_id] || []).push(e.score); });
      return Object.entries(by).map(([sid, s]) => ({ 学号: Number(sid), 平均分: s.reduce((a, b) => a + b, 0) / s.length }))
        .filter(r => r.平均分 > 80).map(r => ({ ...r, 平均分: r.平均分.toFixed(1) }));
    },
  },
  {
    id: 'c4',
    prompt: '统计每门课程的选课人数，只显示人数 ≥ 3 的课程名称',
    slots: [
      { key: 'SELECT', options: [{ v: 'c.name, COUNT(*)', ok: true }, { v: 'c.name, SUM(e.score)', ok: false }, { v: 'e.course_id, COUNT(*)', ok: false }] },
      { key: 'FROM/JOIN', options: [
        { v: 'enrollments e JOIN courses c ON e.course_id=c.id', ok: true },
        { v: 'enrollments e JOIN students s ON e.student_id=s.id', ok: false },
        { v: 'courses c', ok: false },
      ] },
      { key: 'GROUP BY', options: [{ v: 'e.course_id', ok: true }, { v: 'e.student_id', ok: false }, { v: 'c.credit', ok: false }] },
      { key: 'HAVING', options: [{ v: 'COUNT(*) >= 3', ok: true }, { v: 'COUNT(*) >= 2', ok: false }, { v: 'COUNT(*) > 3', ok: false }] },
    ],
    run: () => {
      const by = {};
      TABLES.enrollments.forEach(e => { by[e.course_id] = (by[e.course_id] || 0) + 1; });
      return Object.entries(by).filter(([, c]) => c >= 3)
        .map(([cid, c]) => ({ 课程: TABLES.courses.find(x => x.id === Number(cid)).name, 人数: c }));
    },
  },
];

export default function SqlAssemblyBench() {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState({});
  const [result, setResult] = useState(null);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [status, setStatus] = useState('playing');

  const challenge = CHALLENGES[idx];

  useEffect(() => {
    if (wrongSlots.length === 0) return;
    const t = setTimeout(() => setWrongSlots([]), 1800);
    return () => clearTimeout(t);
  }, [wrongSlots]);

  function pick(slotKey, optIdx) {
    setPicks(p => ({ ...p, [slotKey]: optIdx }));
    setResult(null);
  }

  function runQuery() {
    const allPicked = challenge.slots.every(s => picks[s.key] !== undefined);
    if (!allPicked) return;
    const bad = challenge.slots.filter(s => !s.options[picks[s.key]].ok).map(s => s.key);
    if (bad.length > 0) { setWrongSlots(bad); return; }
    setResult(challenge.run());
  }

  function nextChallenge() {
    if (idx + 1 >= CHALLENGES.length) { setStatus('won'); return; }
    setIdx(i => i + 1);
    setPicks({});
    setResult(null);
  }

  function reset() {
    setIdx(0); setPicks({}); setResult(null); setWrongSlots([]); setStatus('playing');
  }

  const allPicked = challenge && challenge.slots.every(s => picks[s.key] !== undefined);
  const columns = result && result.length ? Object.keys(result[0]) : [];

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl p-4 sm:p-6" style={{ background: '#0a0e1a', backgroundImage: 'radial-gradient(circle, #1c2942 1px, transparent 1px)', backgroundSize: '18px 18px', color: '#e2e8f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .sq-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .sq-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .sq-focus:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }
        @keyframes sqShake { 10%,90%{transform:translateX(-1px)} 20%,80%{transform:translateX(2px)} 30%,50%,70%{transform:translateX(-4px)} 40%,60%{transform:translateX(4px)} }
        .sq-shake { animation: sqShake 0.5s; }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <h1 className="sq-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2"><Database size={20} className="text-sky-400" />SQL 拼装台</h1>
        {status === 'playing' && <span className="sq-mono text-sm text-slate-400">第 {idx + 1}/{CHALLENGES.length} 题</span>}
      </div>

      {status === 'playing' && (
        <>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 mb-3 text-sm text-slate-100">{challenge.prompt}</div>

          <div className="space-y-2 mb-3">
            {challenge.slots.map(slot => (
              <div key={slot.key} className={wrongSlots.includes(slot.key) ? 'sq-shake' : ''}>
                <div className="sq-mono text-xs text-slate-500 mb-1">{slot.key}</div>
                <div className="flex flex-wrap gap-2">
                  {slot.options.map((opt, oi) => {
                    const isSel = picks[slot.key] === oi;
                    const isWrong = wrongSlots.includes(slot.key) && isSel;
                    return (
                      <button key={oi} onClick={() => pick(slot.key, oi)}
                        className={`sq-focus sq-mono text-xs px-2.5 py-1.5 rounded-md border transition-colors ${isWrong ? 'border-rose-500 bg-rose-950/40 text-rose-300' : isSel ? 'border-sky-400 bg-slate-800 text-slate-50 ring-1 ring-inset ring-sky-400/50' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'}`}>
                        {opt.v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!result ? (
            <button onClick={runQuery} disabled={!allPicked} className="sq-focus w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors">
              <PlayCircle size={16} /> 运行查询
            </button>
          ) : (
            <div className="rounded-lg border border-emerald-800/60 bg-emerald-950/20 p-3 mb-2">
              <div className="text-xs text-emerald-300 mb-2">查询成功，结果如下：</div>
              <table className="w-full sq-mono text-xs">
                <thead><tr>{columns.map(c => <th key={c} className="text-left text-slate-400 border-b border-slate-800 pb-1 pr-3">{c}</th>)}</tr></thead>
                <tbody>{result.map((row, ri) => <tr key={ri}>{columns.map(c => <td key={c} className="text-slate-100 pt-1 pr-3">{String(row[c])}</td>)}</tr>)}</tbody>
              </table>
              <button onClick={nextChallenge} className="sq-focus w-full mt-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors">
                {idx + 1 >= CHALLENGES.length ? '查看结算' : '下一题'}
              </button>
            </div>
          )}

          <div className="text-xs flex items-start gap-1.5 mt-3">
            <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
            <span className="text-slate-500">每个空位选一个片段，拼完点"运行查询"。选错的部分会红光抖动，改一下再试。</span>
          </div>
        </>
      )}

      {status === 'won' && (
        <div className="text-center py-6">
          <Trophy size={32} className="mx-auto text-amber-300 mb-2" />
          <div className="sq-display text-2xl font-bold text-emerald-400 mb-1">关系之海通关！</div>
          <div className="text-sm text-slate-400 mb-4">从单表 WHERE 到多表 JOIN 再到 GROUP BY / HAVING，四题打通一条完整的 SQL 能力链</div>
          <button onClick={reset} className="sq-focus px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 inline-flex items-center gap-2 transition-colors"><RotateCcw size={15} />再来一轮</button>
        </div>
      )}
    </div>
  );
}
