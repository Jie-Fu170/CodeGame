import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

export class NetworkScene extends Phaser.Scene {
  private clientNode!: Phaser.GameObjects.Arc
  private serverNode!: Phaser.GameObjects.Arc
  
  private lastTcpState = 'CLOSED'
  private lastDataSent = 0
  
  // To handle server automated responses
  private isProcessingServerReply = false

  constructor() {
    super({ key: 'NetworkScene' })
  }

  create() {
    // Cyberpunk background
    this.add.rectangle(400, 300, 800, 600, 0x050510)
    
    // Draw Fiber Optic Cable
    const graphics = this.add.graphics()
    graphics.lineStyle(4, 0x1e3a8a)
    graphics.beginPath()
    graphics.moveTo(150, 300)
    graphics.lineTo(650, 300)
    graphics.strokePath()

    // Draw Client (Left)
    this.clientNode = this.add.circle(150, 300, 50, 0x3b82f6)
    this.add.text(150, 300, 'Client\n(You)', { color: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5)

    // Draw Server (Right)
    this.serverNode = this.add.circle(650, 300, 50, 0x8b5cf6)
    this.add.text(650, 300, 'Server\n(Boss)', { color: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5)

    this.lastTcpState = 'CLOSED'
  }

  update() {
    const store = useGameStore.getState()
    if (store.isGameOver) return

    // Detect state changes triggered by the user in HUD
    if (store.tcpState !== this.lastTcpState && !this.isProcessingServerReply) {
      const oldState = this.lastTcpState
      const newState = store.tcpState
      this.lastTcpState = newState

      // Client just sent SYN
      if (oldState === 'CLOSED' && newState === 'SYN_SENT') {
        this.firePacket(150, 650, 'SYN', 0x3b82f6, () => {
          // Server receives SYN, sends SYN-ACK
          this.isProcessingServerReply = true
          this.time.delayedCall(500, () => {
            this.firePacket(650, 150, 'SYN-ACK', 0x8b5cf6, () => {
              store.serverReplyTcp('SYN_ACK', 300, 101)
              this.isProcessingServerReply = false
            })
          })
        })
      }
      
      // Client just sent ACK (to establish)
      if (oldState === 'SYN_SENT' && newState === 'ESTABLISHED') {
        this.firePacket(150, 650, 'ACK', 0x3b82f6, () => {
          // No server reply needed for this bare ACK
        })
      }
      
      // Client just sent FIN
      if (oldState === 'ESTABLISHED' && newState === 'FIN_WAIT_1') {
        this.firePacket(150, 650, 'FIN', 0x3b82f6, () => {
          this.isProcessingServerReply = true
          this.time.delayedCall(500, () => {
            this.firePacket(650, 150, 'ACK', 0x8b5cf6, () => {
              store.serverReplyTcp('ACK', 301, store.expectedAck || 0) // ack the FIN
              
              // Server immediately sends its own FIN (simulating no more data from server)
              this.time.delayedCall(1000, () => {
                this.firePacket(650, 150, 'FIN', 0x8b5cf6, () => {
                  store.serverReplyTcp('FIN', 301, store.expectedAck || 0)
                  this.isProcessingServerReply = false
                })
              })
            })
          })
        })
      }
      
      // Client just sent Final ACK
      if (oldState === 'FIN_WAIT_2' && newState === 'TIME_WAIT') {
        this.firePacket(150, 650, 'ACK', 0x3b82f6, () => {
          // Connection fully closed. Player wins.
        })
      }
    }

    // Detect data sent
    if (store.tcpDataSent > this.lastDataSent && !this.isProcessingServerReply) {
      this.lastDataSent = store.tcpDataSent
      this.firePacket(150, 650, 'DATA', 0x10b981, () => {
        this.isProcessingServerReply = true
        this.time.delayedCall(300, () => {
          this.firePacket(650, 150, 'ACK', 0x8b5cf6, () => {
            store.serverReplyTcp('ACK', 301, store.expectedAck || 0)
            this.isProcessingServerReply = false
          })
        })
      })
    }
  }

  private firePacket(startX: number, endX: number, label: string, color: number, onComplete: () => void) {
    const packet = this.add.rectangle(startX, 280, 40, 20, color)
    const text = this.add.text(startX, 280, label, { fontSize: '10px', color: '#fff' }).setOrigin(0.5)

    this.tweens.add({
      targets: [packet, text],
      x: endX,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        packet.destroy()
        text.destroy()
        
        // Flash receiver node
        const receiverNode = endX === 650 ? this.serverNode : this.clientNode
        this.tweens.add({
          targets: receiverNode,
          scale: 1.2,
          yoyo: true,
          duration: 100
        })

        onComplete()
      }
    })
  }
}
