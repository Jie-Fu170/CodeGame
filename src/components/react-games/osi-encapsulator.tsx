import React, { useState, useEffect } from 'react';
import { Network, ArrowDown, ArrowUp, CheckCircle2, RotateCcw, Info, Trophy, Layers, ShieldCheck, Cpu, Server } from 'lucide-react';

interface HeaderItem {
  id: string;
  layerName: string;
  layerNum: number;
  shortTag: string;
  color: string;
  borderColor: string;
  bgLight: string;
  details: {
    title: string;
    protocol: string;
    keyFields: string[];
    hint: string;
  };
}

const LAYERS_DATA: HeaderItem[] = [
  {
    id: 'app',
    layerName: '应用层 (Application)',
    layerNum: 7,
    shortTag: 'HTTP Header',
    color: 'bg-fuchsia-500',
    borderColor: 'border-fuchsia-400',
    bgLight: 'bg-fuchsia-950/40 text-fuchsia-300',
    details: {
      title: 'HTTP 应用报头',
      protocol: 'HTTP/1.1',
      keyFields: ['Method: GET', 'URI: /index.html', 'Host: example.com'],
      hint: '应用层负责为终端用户应用提供网络服务，HTTP 报头包含请求方法与目标资源。'
    }
  },
  {
    id: 'transport',
    layerName: '传输层 (Transport)',
    layerNum: 4,
    shortTag: 'TCP Header',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-400',
    bgLight: 'bg-indigo-950/40 text-indigo-300',
    details: {
      title: 'TCP 传输控制头',
      protocol: 'TCP',
      keyFields: ['源端口: 54321', '目的端口: 80', 'Seq: 1001', 'ACK: 0'],
      hint: '传输层提供端到端的可靠数据传输服务。最核心字段是【端口号】，用于标识计算机上的应用进程。'
    }
  },
  {
    id: 'network',
    layerName: '网络层 (Network)',
    layerNum: 3,
    shortTag: 'IP Header',
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-400',
    bgLight: 'bg-cyan-950/40 text-cyan-300',
    details: {
      title: 'IP 网络层头',
      protocol: 'IPv4',
      keyFields: ['源 IP: 192.168.1.100', '目的 IP: 140.205.1.1', 'TTL: 64', 'Protocol: 6 (TCP)'],
      hint: '网络层负责点对点的路由寻址与分组转发。最核心字段是【源 IP 与 目的 IP 地址】。'
    }
  },
  {
    id: 'datalink',
    layerName: '数据链路层 (Data Link)',
    layerNum: 2,
    shortTag: 'MAC Header + FCS',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-400',
    bgLight: 'bg-emerald-950/40 text-emerald-300',
    details: {
      title: '以太网帧头与帧尾',
      protocol: 'Ethernet II',
      keyFields: ['源 MAC: 00:1A:2B:3C:4D:5E', '目的 MAC: AA:BB:CC:DD:EE:FF', 'FCS 校验尾部: 0x8F3A2B'],
      hint: '数据链路层在局域网相邻节点间传输数据帧。头部包含【物理 MAC 地址】，尾部包含【FCS 循环冗余校验码】。'
    }
  },
  {
    id: 'physical',
    layerName: '物理层 (Physical)',
    layerNum: 1,
    shortTag: 'Bitstream',
    color: 'bg-amber-500',
    borderColor: 'border-amber-400',
    bgLight: 'bg-amber-950/40 text-amber-300',
    details: {
      title: '物理层比特流',
      protocol: 'PHY / Manchester',
      keyFields: ['前导码 Preamble', '01010101 01100101 01110010 01101110...'],
      hint: '物理层将数据帧转换成网线/光纤/无线电波中的 0 和 1 二进制比特流传输。'
    }
  }
];

// Device boundary challenge choices for stage 3
const DEVICE_CHALLENGES = [
  {
    device: '二层交换机 (Layer 2 Switch)',
    desc: '工作在局域网数据链路层，根据 MAC 地址表转发数据帧。',
    targetLayerNum: 2,
    hint: '二层交换机不需要解包 IP 或 TCP，只需要解包到数据链路层查看 MAC 地址！'
  },
  {
    device: '三层路由器 (Layer 3 Router)',
    desc: '工作在网络层，根据路由表进行子网间的路径选择和 IP 分组转发。',
    targetLayerNum: 3,
    hint: '路由器需要剥离数据链路层 MAC 头，查看 IP 头的目的 IP 并减少 TTL，最高解包到网络层！'
  },
  {
    device: '应用层网关 / 防火墙 (Application Gateway)',
    desc: '深度包检测 (DPI)，能审查 HTTP 请求中的 Payload 是否包含恶意 SQL 注入。',
    targetLayerNum: 7,
    hint: '应用网关需要一路解封到最高层——应用层，才能审查具体的 HTTP 报文内容！'
  }
];

export default function OSIEncapsulator() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Stage 1 State: Encapsulation (Top -> Bottom)
  const [encapIndex, setEncapIndex] = useState<number>(0);
  const [encapStack, setEncapStack] = useState<HeaderItem[]>([]);

  // Stage 2 State: Decapsulation (Bottom -> Top)
  const [decapIndex, setDecapIndex] = useState<number>(4);
  const [decapStack, setDecapStack] = useState<HeaderItem[]>([...LAYERS_DATA]);

  // Stage 3 State: Device Inspection
  const [deviceIdx, setDeviceIdx] = useState<number>(0);
  const [selectedLayerNum, setSelectedLayerNum] = useState<number | null>(null);

  // Feedback messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Win condition
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!shakeId) return;
    const t = setTimeout(() => setShakeId(null), 500);
    return () => clearTimeout(t);
  }, [shakeId]);

  // Handle Stage 1 layer selection
  const handleEncapPick = (layer: HeaderItem) => {
    const expected = LAYERS_DATA[encapIndex];
    if (layer.id !== expected.id) {
      setErrorMsg(`顺序错误！数据发送封装必须从顶层向下进行。应该先封装【${expected.layerName}】！`);
      setShakeId(layer.id);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(`成功给数据包贴上 ${layer.shortTag}！(${layer.details.hint})`);
    setEncapStack(prev => [layer, ...prev]);
    const nextIdx = encapIndex + 1;
    setEncapIndex(nextIdx);

    if (nextIdx >= LAYERS_DATA.length) {
      setTimeout(() => {
        setSuccessMsg('🎉 阶段 1 完成！数据已成功封装为比特流并发出！即刻进入接收端拆解阶段。');
      }, 300);
    }
  };

  // Handle Stage 2 layer stripping
  const handleDecapStrip = (layer: HeaderItem) => {
    const expected = LAYERS_DATA[decapIndex];
    if (layer.id !== expected.id) {
      setErrorMsg(`拆解顺序错误！接收端拆包必须自底向上逐层解开头部。应该先剥离【${expected.layerName}】！`);
      setShakeId(layer.id);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(`成功剥离 ${layer.shortTag}！校验通过。`);
    setDecapStack(prev => prev.filter(l => l.id !== layer.id));
    const nextIdx = decapIndex - 1;
    setDecapIndex(nextIdx);

    if (nextIdx < 0) {
      setTimeout(() => {
        setSuccessMsg('🎉 阶段 2 完成！原始 HTTP 报文已成功被服务器应用进程接收！进入网络设备辨析阶段。');
      }, 300);
    }
  };

  // Handle Stage 3 device boundary check
  const handleDeviceCheck = (chosenLayerNum: number) => {
    const currentChallenge = DEVICE_CHALLENGES[deviceIdx];
    setSelectedLayerNum(chosenLayerNum);

    if (chosenLayerNum !== currentChallenge.targetLayerNum) {
      setErrorMsg(`判定错误！${currentChallenge.device} ${currentChallenge.hint}`);
      setShakeId(`layer-${chosenLayerNum}`);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(`🎯 正确！${currentChallenge.device} 最高只需要解包处理到 ${chosenLayerNum} 层！`);

    if (deviceIdx < DEVICE_CHALLENGES.length - 1) {
      setTimeout(() => {
        setDeviceIdx(i => i + 1);
        setSelectedLayerNum(null);
        setSuccessMsg(null);
      }, 1200);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 800);
    }
  };

  const handleReset = () => {
    setStage(1);
    setEncapIndex(0);
    setEncapStack([]);
    setDecapIndex(4);
    setDecapStack([...LAYERS_DATA]);
    setDeviceIdx(0);
    setSelectedLayerNum(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800"
      style={{
        background: '#090d16',
        backgroundImage: 'radial-gradient(circle, #1a2438 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#e2e8f0'
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        .osi-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .osi-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes osiShake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-5px)} 40%,60%{transform:translateX(5px)} }
        .osi-shake { animation: osiShake 0.4s ease-in-out; }
      `}</style>

      {/* Title & Stage Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="osi-display text-lg sm:text-xl font-bold text-slate-50 flex items-center gap-2">
            <Network className="text-cyan-400" size={22} />
            OSI 七层封装车间
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            TCP/IP 协议栈数据封装、拆解与中间设备解包边界实战
          </p>
        </div>

        {/* Stage selection */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { if (stage !== 1) setStage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${stage === 1 ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <ArrowDown size={14} /> 阶段1: 封装打包
          </button>
          <button
            disabled={encapIndex < LAYERS_DATA.length}
            onClick={() => { if (stage !== 2 && encapIndex >= LAYERS_DATA.length) setStage(2); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${encapIndex < LAYERS_DATA.length ? 'opacity-40 cursor-not-allowed text-slate-500' : stage === 2 ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <ArrowUp size={14} /> 阶段2: 拆解接收
          </button>
          <button
            disabled={decapIndex >= 0}
            onClick={() => { if (stage !== 3 && decapIndex < 0) setStage(3); }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${decapIndex >= 0 ? 'opacity-40 cursor-not-allowed text-slate-500' : stage === 3 ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}>
            <Cpu size={14} /> 阶段3: 设备辨析
          </button>
        </div>
      </div>

      {/* Main Content Area based on Stage */}
      {!isCompleted && (
        <>
          {/* STAGE 1: ENCAPSULATION */}
          {stage === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Data Packet Visual (Nested Header Stack) */}
              <div className="md:col-span-6 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={14} className="text-cyan-400" />
                      数据包封装状态 (Top-Down)
                    </span>
                    <span className="osi-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      已封层数: {encapIndex} / 5
                    </span>
                  </div>

                  {/* Packet Stack representation */}
                  <div className="space-y-2 min-h-[220px] flex flex-col justify-center">
                    {encapStack.length === 0 ? (
                      <div className="border border-dashed border-slate-700/80 rounded-lg p-4 text-center">
                        <span className="text-xs text-slate-500 block mb-1">原始应用数据 (Payload)</span>
                        <div className="osi-mono text-xs text-fuchsia-300 bg-fuchsia-950/30 p-2 rounded border border-fuchsia-800/50">
                          "GET /index.html HTTP/1.1\r\nHost: example.com"
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {encapStack.map((layer) => (
                          <div
                            key={layer.id}
                            className={`p-2.5 rounded-lg border ${layer.borderColor} ${layer.bgLight} transition-all duration-300 flex items-center justify-between text-xs`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${layer.color}`} />
                              <span className="font-bold">{layer.shortTag}</span>
                            </div>
                            <span className="osi-mono text-[11px] opacity-80">{layer.details.protocol}</span>
                          </div>
                        ))}

                        {/* Core payload inside */}
                        <div className="border border-fuchsia-900/80 bg-fuchsia-950/20 rounded p-2 text-center">
                          <span className="osi-mono text-[11px] text-fuchsia-300">Payload Data (HTTP Content)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${(encapIndex / LAYERS_DATA.length) * 100}%` }}
                    />
                  </div>
                  {encapIndex >= LAYERS_DATA.length && (
                    <button
                      onClick={() => setStage(2)}
                      className="w-full mt-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20">
                      进入阶段 2：接收端拆解剥离 <ArrowUp size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Layer Selection Workshop */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    请按 <span className="text-cyan-300 font-bold">自顶向下 (Application → Physical)</span> 的顺序，点击贴上对应的协议头：
                  </div>

                  <div className="space-y-2">
                    {LAYERS_DATA.map((layer, index) => {
                      const isPicked = encapStack.some(item => item.id === layer.id);
                      const isNext = index === encapIndex;
                      const isShaking = shakeId === layer.id;

                      return (
                        <button
                          key={layer.id}
                          disabled={isPicked}
                          onClick={() => handleEncapPick(layer)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isShaking
                              ? 'osi-shake border-rose-500 bg-rose-950/40 text-rose-200'
                              : isPicked
                              ? 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                              : isNext
                              ? `${layer.borderColor} bg-slate-900/90 shadow-md hover:scale-[1.01]`
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="osi-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                L{layer.layerNum}
                              </span>
                              <span className="text-xs font-bold text-slate-100">{layer.layerName}</span>
                            </div>
                            <div className="osi-mono text-[11px] text-slate-400 mt-1">
                              包含: {layer.details.keyFields.join(' | ')}
                            </div>
                          </div>

                          <div>
                            {isPicked ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : (
                              <span className="text-xs text-cyan-400 font-medium">贴上头部 &rarr;</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: DECAPSULATION */}
          {stage === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Stripping visualization */}
              <div className="md:col-span-6 bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Server size={14} className="text-indigo-400" />
                      接收端解包状态 (Bottom-Up)
                    </span>
                    <span className="osi-mono text-xs text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                      待剥离头部: {decapStack.length} 个
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[220px] flex flex-col justify-center">
                    {decapStack.length === 0 ? (
                      <div className="border border-emerald-500/50 bg-emerald-950/30 rounded-lg p-4 text-center">
                        <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                        <span className="text-xs font-bold text-emerald-300 block">数据报文成功到达 Web 服务应用！</span>
                        <div className="osi-mono text-xs text-slate-300 mt-2 bg-slate-950 p-2 rounded">
                          HTTP/1.1 200 OK (Data Delivered Successfully)
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {decapStack.map((layer) => (
                          <div
                            key={layer.id}
                            className={`p-2.5 rounded-lg border ${layer.borderColor} ${layer.bgLight} flex items-center justify-between text-xs`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${layer.color}`} />
                              <span className="font-bold">{layer.shortTag}</span>
                            </div>
                            <span className="osi-mono text-[11px] opacity-80">{layer.layerName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full transition-all duration-300"
                      style={{ width: `${((5 - (decapIndex + 1)) / LAYERS_DATA.length) * 100}%` }}
                    />
                  </div>
                  {decapIndex < 0 && (
                    <button
                      onClick={() => setStage(3)}
                      className="w-full mt-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20">
                      进入阶段 3：网络设备解包界限辨析 <Cpu size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Stripping options */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    请按 <span className="text-indigo-300 font-bold">自底向上 (Physical → Application)</span> 的顺序，点击解开对应的头部：
                  </div>

                  <div className="space-y-2">
                    {LAYERS_DATA.slice().reverse().map((layer) => {
                      const isRemaining = decapStack.some(item => item.id === layer.id);
                      const isNextToStrip = layer.id === LAYERS_DATA[decapIndex]?.id;
                      const isShaking = shakeId === layer.id;

                      return (
                        <button
                          key={layer.id}
                          disabled={!isRemaining}
                          onClick={() => handleDecapStrip(layer)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isShaking
                              ? 'osi-shake border-rose-500 bg-rose-950/40 text-rose-200'
                              : !isRemaining
                              ? 'border-slate-800 bg-slate-900/40 opacity-30 cursor-not-allowed'
                              : isNextToStrip
                              ? `${layer.borderColor} bg-slate-900/90 shadow-md hover:scale-[1.01]`
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="osi-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                L{layer.layerNum}
                              </span>
                              <span className="text-xs font-bold text-slate-100">{layer.layerName}</span>
                            </div>
                            <div className="osi-mono text-[11px] text-slate-400 mt-1">
                              解封校验: {layer.details.title}
                            </div>
                          </div>

                          <div>
                            {!isRemaining ? (
                              <span className="text-xs text-slate-500">已剥离</span>
                            ) : (
                              <span className="text-xs text-indigo-400 font-medium">&uarr; 剥离头部</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: DEVICE BOUNDARY CHECK */}
          {stage === 3 && (
            <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    网络设备最高解包层级辨析 ({deviceIdx + 1} / {DEVICE_CHALLENGES.length})
                  </span>
                  <h3 className="osi-display text-base font-bold text-slate-100 mt-0.5">
                    {DEVICE_CHALLENGES[deviceIdx].device}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                  考点：设备处理边界
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-5 leading-relaxed">
                {DEVICE_CHALLENGES[deviceIdx].desc}
                <div className="mt-2 text-amber-300 font-semibold">
                  ❓ 问题：当数据包流经该设备时，该设备最高需要解包到 OSI 模型的第几层进行处理？
                </div>
              </div>

              {/* Layer Selection Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { num: 2, label: 'L2 数据链路层', desc: 'MAC 地址/物理帧' },
                  { num: 3, label: 'L3 网络层', desc: 'IP 地址/分组转发' },
                  { num: 4, label: 'L4 传输层', desc: 'TCP/UDP 端口号' },
                  { num: 7, label: 'L7 应用层', desc: 'DPI 报文Payload' },
                ].map((opt) => {
                  const isSelected = selectedLayerNum === opt.num;
                  const isShaking = shakeId === `layer-${opt.num}`;

                  return (
                    <button
                      key={opt.num}
                      onClick={() => handleDeviceCheck(opt.num)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isShaking
                          ? 'osi-shake border-rose-500 bg-rose-950/40 text-rose-200'
                          : isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
                      }`}>
                      <div className="osi-mono text-sm font-bold text-slate-100 mb-1">{opt.label}</div>
                      <div className="text-[11px] text-slate-400">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Toast */}
          <div className="mt-4 min-h-[40px]">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && !errorMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
                <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Completion Victory Screen */}
      {isCompleted && (
        <div className="text-center py-8 px-4 bg-slate-900/90 rounded-xl border border-emerald-500/40">
          <Trophy size={48} className="mx-auto text-amber-300 mb-3 animate-bounce" />
          <h2 className="osi-display text-2xl font-bold text-emerald-400 mb-2">🎉 恭喜通关：OSI 七层封装大师！</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
            你已经彻底掌握了数据的 <span className="text-cyan-300">自顶向下封装</span>、<span className="text-indigo-300">自底向上拆包</span> 以及 <span className="text-emerald-300">二层/三层/七层网络设备的解包处理界限</span>！
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-lg mx-auto text-left text-xs text-slate-400 space-y-2 mb-6">
            <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">💡 软考知识点终极速记：</div>
            <div>• <strong className="text-cyan-300">发送端封装：</strong> 应用层 &rarr; 传输层(TCP/UDP端口) &rarr; 网络层(IP地址) &rarr; 数据链路层(MAC地址+FCS校验) &rarr; 物理层(比特流)。</div>
            <div>• <strong className="text-indigo-300">接收端拆包：</strong> 自底向上逐层校验解封，物理层比特流 &rarr; 帧 &rarr; IP包 &rarr; 端口段 &rarr; 应用数据。</div>
            <div>• <strong className="text-emerald-300">设备边界：</strong> 二层交换机查 MAC；三层路由器查 IP 并更新 TTL/MAC；应用网关解包至 L7 查 Payload。</div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
            <RotateCcw size={16} /> 再次练习关卡
          </button>
        </div>
      )}
    </div>
  );
}
