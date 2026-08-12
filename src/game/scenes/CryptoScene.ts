import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

export class CryptoScene extends Phaser.Scene {
  private packetGroup!: Phaser.GameObjects.Group
  
  constructor() {
    super({ key: 'CryptoScene' })
  }

  create() {
    // Cyberpunk background
    this.add.rectangle(400, 300, 800, 600, 0x0a0a0a)
    
    // Draw Data Link
    const graphics = this.add.graphics()
    graphics.lineStyle(2, 0x4ade80, 0.5) // Green dotted line effect
    graphics.beginPath()
    graphics.moveTo(100, 300)
    graphics.lineTo(700, 300)
    graphics.strokePath()

    // Alice Node
    this.add.circle(100, 300, 40, 0x3b82f6)
    this.add.text(100, 300, 'Alice', { color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)

    // Bob Node
    this.add.circle(700, 300, 40, 0x10b981)
    this.add.text(700, 300, 'Bob', { color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)
    
    // Hacker Boss Node (Top Middle)
    this.add.circle(400, 100, 50, 0xef4444)
    this.add.text(400, 100, 'Hacker', { color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5)
    
    // Interception Beams
    const beam = this.add.graphics()
    beam.lineStyle(1, 0xef4444, 0.3)
    beam.beginPath()
    beam.moveTo(400, 150)
    beam.lineTo(400, 300)
    beam.strokePath()

    this.packetGroup = this.add.group()

    // Start spawning packets visually based on status
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnPacket,
      callbackScope: this,
      loop: true
    })
  }

  update() {
    const store = useGameStore.getState()
    // If playing, packets freeze in the middle
    // For visual simplicity, we will just animate a packet slowly and freeze it when it hits center (x=400)
    this.packetGroup.getChildren().forEach((p: any) => {
      const packet = p as Phaser.GameObjects.Container
      if (store.cryptoStatus === 'PLAYING') {
        if (packet.x < 400) {
          packet.x += 2
        }
      } else if (store.cryptoStatus === 'SUCCESS') {
        packet.x += 5
        // Glow green
        const bg = packet.list[0] as Phaser.GameObjects.Rectangle
        bg.fillColor = 0x10b981
      } else if (store.cryptoStatus === 'FAILED') {
        // Fly to hacker
        packet.y -= 3
        const bg = packet.list[0] as Phaser.GameObjects.Rectangle
        bg.fillColor = 0xef4444
      }
      
      // Cleanup
      if (packet.x > 800 || packet.y < 0) {
        packet.destroy()
      }
    })
  }

  private spawnPacket() {
    const store = useGameStore.getState()
    // Only spawn if there are no packets and we are in PLAYING state
    if (store.cryptoStatus !== 'PLAYING') return
    if (this.packetGroup.getChildren().length > 0) return

    const container = this.add.container(100, 300)
    
    const bg = this.add.rectangle(0, 0, 80, 40, 0x334155)
    bg.setStrokeStyle(2, 0x94a3b8)
    
    const text = this.add.text(0, 0, 'DATA', { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5)
    
    container.add([bg, text])
    this.packetGroup.add(container)
  }
}
