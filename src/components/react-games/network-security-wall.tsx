import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Server, RefreshCw, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface AttackScenario {
  id: string;
  name: string;
  desc: string;
  correctDevice: 'FIREWALL' | 'IDS' | 'IPS' | 'XSS_FILTER';
}

const ATTACKS: AttackScenario[] = [
  {
    id: 'packet_scan',
    title: '外网非法 IP 端口扫描',
    desc: '阻断来自特定外网 IP (如 192.0.2.1) 对内网数据库 3306 端口的直连访问',
    correctDevice: 'FIREWALL'
  },
  {
    id: 'xss_inject',
    title: 'Web 论坛恶意 script 脚本注入',
    desc: '防御用户在输入框中提交 <script>cookieSteal()</script> 窃取凭证',
    correctDevice: 'XSS_FILTER'
  },
  {
    id: 'ids_monitor',
    title: '旁路实时流量威胁告警',
    desc: '要求在不影响主干通信速率的前提下，旁路监听并记录异常流量日志',
    correctDevice: 'IDS'
  },
  {
    id: 'ips_block',
    title: '已知漏洞 exploit 实时阻断',
    desc: '在网络入口深层检测 (DPI) 发现缓冲区溢出攻击包并实时物理切断',
    correctDevice: 'IPS'
  }
];

export default function NetworkSecurityWall() {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAssign = (attackId: string, device: string) => {
    if (submitted) return;
    setAssignments(prev => ({ ...prev, [attackId]: device }));
  };

  const handleCheck = () => {
    let count = 0;
    ATTACKS.forEach(a => {
      if (assignments[a.id] === a.correctDevice) {
        count++;
      }
    });
    setScore(count);
    setSubmitted(true);
  };

  const resetGame = () => {
    setAssignments({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-6 bg-slate-900 text-slate-200 border border-slate-700 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <ShieldAlert size={28} /> 网络安全设备部署与网络攻击防御
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            考点：防火墙/IDS/IPS 拓扑部署、DMZ 隔离区与 XSS/CSRF 常见网络攻击防护
          </p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors border border-slate-600"
        >
          <RefreshCw size={14} /> 重置关卡
        </button>
      </div>

      {/* Network Topology Banner */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-6 text-xs space-y-3">
        <div className="font-bold text-cyan-300 flex items-center gap-2">
          <Server size={16} /> 典型企业网络三级拓扑结构与设备职能：
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div className="font-bold text-amber-300 mb-1">外网与 DMZ (非军事区)</div>
            <p className="text-slate-400">DMZ 放置外网可访问的 Web/Mail 服务器，内部不能主动发起访问内网连接。</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div className="font-bold text-emerald-300 mb-1">IDS vs IPS 部署差异</div>
            <p className="text-slate-400"><strong>IDS (入侵检测)</strong>: 旁路部署、镜像监听、只告警不阻断。<strong>IPS (入侵防御)</strong>: 串联部署、实时阻断。</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div className="font-bold text-purple-300 mb-1">XSS vs CSRF 攻击防护</div>
            <p className="text-slate-400"><strong>XSS (跨站脚本)</strong>: 输入转义/过滤。<strong>CSRF (跨站请求伪造)</strong>: Token 验证 / Referer 检查。</p>
          </div>
        </div>
      </div>

      {/* Attack Defense Challenges */}
      <div className="space-y-4 mb-6">
        <h2 className="text-sm font-bold text-slate-200">防御阵线布置：为 4 种网络攻击/审计场景配备最精准的防御武器：</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ATTACKS.map(a => {
            const current = assignments[a.id];
            const isCorrect = submitted && current === a.correctDevice;
            const isWrong = submitted && current !== a.correctDevice;

            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border text-xs space-y-3 transition-all ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-100'
                    : isWrong
                    ? 'bg-red-950/70 border-red-600 text-red-100'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-cyan-300 mb-1">{a.title}</div>
                  <div className="text-slate-300">{a.desc}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleAssign(a.id, 'FIREWALL')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'FIREWALL' ? 'bg-amber-900 border-amber-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    包过滤防火墙 (L3/L4)
                  </button>

                  <button
                    onClick={() => handleAssign(a.id, 'IDS')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'IDS' ? 'bg-cyan-900 border-cyan-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    IDS 入侵检测 (旁路告警)
                  </button>

                  <button
                    onClick={() => handleAssign(a.id, 'IPS')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'IPS' ? 'bg-emerald-900 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    IPS 入侵防御 (串联阻断)
                  </button>

                  <button
                    onClick={() => handleAssign(a.id, 'XSS_FILTER')}
                    className={`py-1.5 px-2 rounded border text-[11px] font-bold transition-all ${
                      current === 'XSS_FILTER' ? 'bg-purple-900 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    HTML/SQL 输入实体转义
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action & Results */}
      {!submitted ? (
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            disabled={Object.keys(assignments).length < ATTACKS.length}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              Object.keys(assignments).length === ATTACKS.length
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <CheckCircle2 size={18} /> 部署安全防御网络 (已配置 {Object.keys(assignments).length}/{ATTACKS.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            score === ATTACKS.length ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' : 'bg-amber-950/80 border-amber-600 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={32} />
              <div>
                <h3 className="font-bold text-base">网络安全部署得分: {score} / {ATTACKS.length}</h3>
                <p className="text-xs opacity-90">
                  {score === ATTACKS.length ? '🎉 完美部署！安全网络成功御敌于国门之外！' : '防御配置存在漏洞，参考下方考点总结强化！'}
                </p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600"
            >
              重新配置
            </button>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-emerald-400 text-sm">📘 软考网络安全高频混淆考点解题卡：</h4>
            <p>1. <strong>IDS (检测) vs IPS (防御)</strong>：IDS 是<strong>旁路（镜像）部署</strong>，只发报警不影响原网络速率；IPS 是<strong>直连（串联）部署</strong>，能直接切断有害数据包。</p>
            <p>2. <strong>包过滤 vs 应用代理防火墙</strong>：包过滤防火墙工作在 <strong>网络层/传输层 (IP+Port)</strong>；应用代理防火墙工作在 <strong>应用层 (L7)</strong>。</p>
            <p>3. <strong>DMZ 区域安全规则</strong>：允许外网访问 DMZ，允许内网访问 DMZ，<strong>严禁 DMZ 主动发起对内网的连接</strong>。</p>
          </div>
        </div>
      )}
    </div>
  );
}
