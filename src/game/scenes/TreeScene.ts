import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

export class TreeScene extends Phaser.Scene {
  private nodeMap: Record<number, { x: number, y: number }> = {}
  private probe!: Phaser.GameObjects.Arc
  private probeGlow!: Phaser.GameObjects.Arc
  private lastRenderedNodeId: number = 50

  constructor() {
    super({ key: 'TreeScene' })
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x020617) // Slate 950

    // Coordinates for the tree nodes
    this.nodeMap = {
      50: { x: 400, y: 150 },
      30: { x: 250, y: 250 },
      70: { x: 550, y: 250 },
      20: { x: 150, y: 350 },
      40: { x: 350, y: 350 },
      65: { x: 450, y: 350 },
      80: { x: 650, y: 350 },
      25: { x: 200, y: 450 }
    }

    // Edges
    const edges = [
      [50, 30], [50, 70],
      [30, 20], [30, 40],
      [70, 65], [70, 80],
      [20, 25]
    ]

    const graphics = this.add.graphics()
    graphics.lineStyle(2, 0x334155, 1) // Slate 700

    edges.forEach(([u, v]) => {
      graphics.beginPath()
      graphics.moveTo(this.nodeMap[u].x, this.nodeMap[u].y)
      graphics.lineTo(this.nodeMap[v].x, this.nodeMap[v].y)
      graphics.strokePath()
    })

    // Draw Nodes
    Object.entries(this.nodeMap).forEach(([val, pos]) => {
      this.add.circle(pos.x, pos.y, 24, 0x1e293b).setStrokeStyle(2, 0x64748b)
      this.add.text(pos.x, pos.y, val.toString(), {
        color: '#f8fafc',
        fontSize: '18px',
        fontStyle: 'bold',
        fontFamily: 'monospace'
      }).setOrigin(0.5)
    })

    // Create Probe
    this.probeGlow = this.add.circle(this.nodeMap[50].x, this.nodeMap[50].y, 30, 0x06b6d4, 0.4)
    this.probe = this.add.circle(this.nodeMap[50].x, this.nodeMap[50].y, 10, 0x22d3ee)
    
    this.tweens.add({
      targets: this.probeGlow,
      scale: 1.5,
      alpha: 0,
      duration: 1000,
      repeat: -1,
      yoyo: false
    })

    this.lastRenderedNodeId = 50
  }

  update() {
    const store = useGameStore.getState()
    
    // Check if store node changed
    if (store.bstCurrentNodeId !== this.lastRenderedNodeId) {
      this.lastRenderedNodeId = store.bstCurrentNodeId
      const targetPos = this.nodeMap[store.bstCurrentNodeId]
      
      if (targetPos) {
        this.tweens.add({
          targets: [this.probe, this.probeGlow],
          x: targetPos.x,
          y: targetPos.y,
          duration: 400,
          ease: 'Cubic.easeOut'
        })
      }
    }

    if (store.bstStatus === 'FAILED') {
      this.probe.fillColor = 0xef4444 // Red
      this.probeGlow.fillColor = 0xef4444
    } else if (store.bstStatus === 'SUCCESS') {
      this.probe.fillColor = 0x22c55e // Green
      this.probeGlow.fillColor = 0x22c55e
    } else {
      this.probe.fillColor = 0x22d3ee // Cyan
      this.probeGlow.fillColor = 0x06b6d4
    }
  }
}
