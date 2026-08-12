import { useGameStore } from '../store/useGameStore'
import { Radio, Zap, Shield, ShieldAlert, ArrowRightCircle } from 'lucide-react'

export const NetworkHUD = () => {
  const { hp, maxHp, tcpState, tcpDataSent, sendTcpPacket, expectedSeq, expectedAck, lastServerPacket } = useGameStore()
  
  const hpPercentage = (hp / maxHp) * 100
  const hpColor = hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'

  // Determine current needed action for hint purposes (optional, maybe too easy?)
  // Let's just provide the buttons and let the user figure it out based on state.

  const renderFsm = () => {
    const states = ['CLOSED', 'SYN_SENT', 'ESTABLISHED', 'FIN_WAIT_1', 'FIN_WAIT_2', 'TIME_WAIT']
    return (
      <div className="flex items-center gap-2 mt-4 text-xs font-mono">
        {states.map((s, idx) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`px-2 py-1 rounded ${tcpState === s ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-slate-800 text-slate-500'}`}>
              {s}
            </div>
            {idx < states.length - 1 && <ArrowRightCircle size={14} className="text-slate-600" />}
          </div>
        ))}
      </div>
    )
  }

  // Pre-define some realistic sequences to choose from. 
  // We want the user to pick the one with the correct SEQ and ACK.
  // The initial SYN is seq=100.
  const seqBase = expectedSeq || 100
  const ackBase = expectedAck || 0

  const options = [
    { type: 'SYN', seq: 100, ack: 0 },
    { type: 'ACK', seq: seqBase, ack: ackBase },
    { type: 'ACK', seq: seqBase + 1, ack: ackBase }, // Wrong SEQ
    { type: 'ACK', seq: seqBase, ack: ackBase - 1 }, // Wrong ACK
    { type: 'DATA', seq: seqBase, ack: ackBase },
    { type: 'FIN', seq: seqBase, ack: ackBase },
  ] as const

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 z-10">
      
      {/* Top Bar */}
      <div className="flex justify-between w-full pointer-events-auto">
        <div className="flex flex-col gap-3 w-72">
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-2 font-bold text-lg">
              Client Health (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-slate-400 mt-1">{hp} / {maxHp}</div>
            
            <div className="mt-2 text-sm text-blue-400">
              已传输数据: {tcpDataSent} / 300 Bytes
            </div>
          </div>
        </div>

        {/* FSM Display */}
        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-auto max-w-2xl">
          <div className="flex items-center gap-2 text-blue-300 mb-2 font-bold text-xl border-b border-slate-700 pb-2">
            <Radio /> TCP Finite State Machine (客户端端)
          </div>
          {renderFsm()}
          {lastServerPacket && (
            <div className="mt-3 text-sm text-purple-400 font-mono text-center animate-pulse">
              Boss 刚刚发来了: {lastServerPacket}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pointer-events-auto flex justify-center mb-4">
        <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-3">
          <div className="text-slate-400 text-sm font-bold text-center">构建并发送报文 (Select Packet to Send)</div>
          
          <div className="grid grid-cols-3 gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => sendTcpPacket(opt.type, opt.seq, opt.ack)}
                className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-blue-500 transition-all text-slate-300 hover:text-white group active:scale-95"
              >
                <div className="text-lg font-bold group-hover:text-blue-400">[{opt.type}]</div>
                <div className="text-xs font-mono text-slate-400">seq={opt.seq}</div>
                {opt.type !== 'SYN' && <div className="text-xs font-mono text-slate-400">ack={opt.ack}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
