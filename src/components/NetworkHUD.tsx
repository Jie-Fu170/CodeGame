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
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2 sm:mt-4 text-[10px] sm:text-xs font-mono">
        {states.map((s, idx) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${tcpState === s ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-slate-800 text-slate-500'}`}>
              {s}
            </div>
            {idx < states.length - 1 && <ArrowRightCircle size={12} className="text-slate-600 shrink-0 hidden xs:inline" />}
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
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-2 sm:p-6 pt-10 sm:pt-14 z-10 overflow-y-auto">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between w-full pointer-events-auto gap-2 sm:gap-4">
        <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-72">
          <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 text-slate-300 mb-1 sm:mb-2 font-bold text-xs sm:text-lg">
              Client Health (HP)
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ease-out ${hpColor}`}
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1">
              <span>{hp} / {maxHp}</span>
              <span className="text-blue-400 font-bold">已传: {tcpDataSent}/300B</span>
            </div>
          </div>
        </div>

        {/* FSM Display */}
        <div className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-5 rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] w-full sm:w-auto max-w-2xl">
          <div className="flex items-center gap-2 text-blue-300 mb-1 sm:mb-2 font-bold text-xs sm:text-xl border-b border-slate-700 pb-1 sm:pb-2">
            <Radio size={16} /> TCP 状态机 (客户端)
          </div>
          {renderFsm()}
          {lastServerPacket && (
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-purple-400 font-mono text-center animate-pulse">
              Boss 发来: {lastServerPacket}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pointer-events-auto flex justify-center mb-2 sm:mb-4">
        <div className="bg-slate-900/95 backdrop-blur-xl p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-2 w-full max-w-lg">
          <div className="text-slate-400 text-xs sm:text-sm font-bold text-center">构建并发送报文 (Select Packet to Send)</div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => sendTcpPacket(opt.type, opt.seq, opt.ack)}
                className="flex flex-col items-center justify-center p-1.5 sm:p-3 rounded-lg border-2 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-blue-500 transition-all text-slate-300 hover:text-white group active:scale-95"
              >
                <div className="text-xs sm:text-lg font-bold group-hover:text-blue-400">[{opt.type}]</div>
                <div className="text-[10px] sm:text-xs font-mono text-slate-400">seq={opt.seq}</div>
                {opt.type !== 'SYN' && <div className="text-[10px] sm:text-xs font-mono text-slate-400">ack={opt.ack}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
