import React, { useState } from 'react';
import { Network, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface ProtocolRule {
  name: string;
  desc: string;
  correctPort: number;
  correctTransport: 'TCP' | 'UDP';
  userPort: string;
  userTransport: 'TCP' | 'UDP' | '';
}

export default function NetProtocolPorts() {
  const { addScore } = useGameStore();

  const [rules, setRules] = useState<ProtocolRule[]>([
    { name: 'HTTP', desc: '超文本传输协议', correctPort: 80, correctTransport: 'TCP', userPort: '', userTransport: '' },
    { name: 'HTTPS', desc: '安全超文本传输协议', correctPort: 443, correctTransport: 'TCP', userPort: '', userTransport: '' },
    { name: 'FTP (控制)', desc: '文件传输控制命令端口', correctPort: 21, correctTransport: 'TCP', userPort: '', userTransport: '' },
    { name: 'DNS（典型查询）', desc: '小型域名解析查询', correctPort: 53, correctTransport: 'UDP', userPort: '', userTransport: '' },
    { name: 'DHCP (服务器)', desc: '动态主机配置协议', correctPort: 67, correctTransport: 'UDP', userPort: '', userTransport: '' },
    { name: 'SNMP', desc: '简单网络管理协议', correctPort: 161, correctTransport: 'UDP', userPort: '', userTransport: '' }
  ]);

  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkPorts = () => {
    const isAllCorrect = rules.every(
      (r) => parseInt(r.userPort.trim()) === r.correctPort && r.userTransport === r.correctTransport
    );

    if (isAllCorrect) {
      setFeedback({
        msg: '网络协议端口与 TCP/UDP 传输层归类完全正确！本关 DNS 按典型小型查询使用 UDP/53；区域传送、大响应或截断回退等场景也可使用 TCP/53。',
        isCorrect: true
      });
      if (!isCompleted) {
        setIsCompleted(true);
        addScore(100);
      }
    } else {
      setFeedback({
        msg: '校验未通过。本关按典型查询口径：HTTP(80/TCP)、HTTPS(443/TCP)、FTP(21/TCP)、DNS(53/UDP)、DHCP(67/UDP)、SNMP(161/UDP)。注意 DNS 在区域传送或大响应等例外中也可使用 TCP/53。',
        isCorrect: false
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/40">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-300">网络协议与默认端口巡警</h2>
            <p className="text-xs text-slate-400">计算机网络 · 应用层协议端口号识别与 TCP/UDP 传输层归类</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 mb-6">
        请为以下常见网络协议配置默认端口号 (Port) 与典型传输层协议 (TCP / UDP)。其中 DNS 项仅指典型小型查询；区域传送或大响应等例外可使用 TCP/53。
      </div>

      {/* Grid of Protocol Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {rules.map((rule, idx) => (
          <div key={rule.name} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm font-bold text-emerald-300">{rule.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{rule.desc}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 font-mono block mb-1">默认端口:</label>
                <input
                  type="number"
                  value={rule.userPort}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRules(rules.map((r, i) => (i === idx ? { ...r, userPort: val } : r)));
                  }}
                  placeholder="如 80"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="w-28">
                <label className="text-[10px] text-slate-400 font-mono block mb-1">传输层协议:</label>
                <select
                  value={rule.userTransport}
                  onChange={(e) => {
                    const val = e.target.value as 'TCP' | 'UDP';
                    setRules(rules.map((r, i) => (i === idx ? { ...r, userTransport: val } : r)));
                  }}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-xs text-emerald-300 font-mono focus:outline-none"
                >
                  <option value="">-- 选择 --</option>
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={checkPorts}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mb-4"
      >
        <Network className="w-5 h-5" /> 验证端口号与协议映射
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
            {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span>{feedback.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
