import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

interface Node {
  id: string
  type: 'P' | 'R'
  sprite: Phaser.GameObjects.Arc | Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
  x: number
  y: number
}

interface Edge {
  from: string
  to: string
  graphics: Phaser.GameObjects.Graphics
  isCycle: boolean
}

export class DeadlockScene extends Phaser.Scene {
  private nodes: Map<string, Node> = new Map()
  private edges: Edge[] = []
  
  private nextEventTime = 0
  private deadlockTimer = 0
  private isDeadlocked = false
  private cycleNodes: Set<string> = new Set()

  // Layout
  private pNodes = ['P1', 'P2', 'P3', 'P4', 'P5']
  private rNodes = ['R1', 'R2', 'R3', 'R4', 'R5']

  constructor() {
    super({ key: 'DeadlockScene' })
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x0f172a)
    this.add.text(400, 50, '资源分配图 (点击红框进程强制撤销)', { fontSize: '24px', color: '#94a3b8' }).setOrigin(0.5)

    // Create Nodes in a circle
    const centerX = 400
    const centerY = 320
    const radius = 200

    const totalNodes = this.pNodes.length + this.rNodes.length
    const allIds = [...this.pNodes, ...this.rNodes]
    
    // Shuffle them a bit so P and R are mixed visually, but let's keep P on left, R on right for readability, or just a circle
    allIds.forEach((id, i) => {
      const angle = (i / totalNodes) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      const isProcess = id.startsWith('P')
      
      let sprite: any
      if (isProcess) {
        // Process is circle
        sprite = this.add.circle(x, y, 30, 0x3b82f6)
        sprite.setInteractive({ useHandCursor: true })
        sprite.on('pointerdown', () => this.handleNodeClick(id))
      } else {
        // Resource is square
        sprite = this.add.rectangle(x, y, 50, 50, 0x10b981)
      }

      const text = this.add.text(x, y, id, { color: '#ffffff', fontSize: '18px', fontStyle: 'bold' }).setOrigin(0.5)

      this.nodes.set(id, { id, type: isProcess ? 'P' : 'R', sprite, text, x, y })
    })

    this.nextEventTime = this.time.now + 1000
  }

  update(time: number) {
    const store = useGameStore.getState()
    if (store.isGameOver) return

    if (this.isDeadlocked) {
      // Shaking effect
      this.cameras.main.scrollX = Phaser.Math.Between(-5, 5)
      this.cameras.main.scrollY = Phaser.Math.Between(-5, 5)

      if (time > this.deadlockTimer) {
        // Failed to break deadlock in time
        store.takeDamage(40)
        this.clearGraph()
        this.isDeadlocked = false
        this.cameras.main.scrollX = 0
        this.cameras.main.scrollY = 0
        this.cameras.main.flash(500, 255, 0, 0)
        this.nextEventTime = time + 2000
      }
      return
    }

    if (time > this.nextEventTime) {
      this.addRandomEdge()
      // Gradually speed up
      const speed = Math.max(500, 2000 - store.deadlocksResolved * 300)
      this.nextEventTime = time + speed
    }
  }

  private addRandomEdge() {
    // 1. Pick a random P and random R
    const p = Phaser.Utils.Array.GetRandom(this.pNodes)
    const r = Phaser.Utils.Array.GetRandom(this.rNodes)

    // Check existing edges for R
    let rHolder = null
    for (const e of this.edges) {
      if (e.from === r && e.to.startsWith('P')) {
        rHolder = e.to
      }
    }

    let from = p
    let to = r
    
    // If R is held by someone else, P requests R (P -> R). 
    // If R is free, R is assigned to P (R -> P).
    if (!rHolder) {
      from = r
      to = p
    }

    // Avoid duplicates
    if (this.edges.find(e => e.from === from && e.to === to)) return

    // Create edge visual
    const graphics = this.add.graphics()
    this.edges.push({ from, to, graphics, isCycle: false })
    
    this.drawEdges()
    this.checkCycles()
  }

  private drawEdges() {
    this.edges.forEach(e => {
      e.graphics.clear()
      const color = e.isCycle ? 0xef4444 : (e.from.startsWith('R') ? 0x10b981 : 0xeab308)
      e.graphics.lineStyle(e.isCycle ? 6 : 3, color, 0.8)
      
      const nFrom = this.nodes.get(e.from)!
      const nTo = this.nodes.get(e.to)!
      
      e.graphics.beginPath()
      e.graphics.moveTo(nFrom.x, nFrom.y)
      e.graphics.lineTo(nTo.x, nTo.y)
      e.graphics.strokePath()
      
      // Draw arrow head (approximate)
      const angle = Phaser.Math.Angle.Between(nFrom.x, nFrom.y, nTo.x, nTo.y)
      const arrowX = nTo.x - Math.cos(angle) * 35
      const arrowY = nTo.y - Math.sin(angle) * 35
      
      e.graphics.fillStyle(color, 1)
      e.graphics.fillTriangle(
        arrowX, arrowY,
        arrowX - Math.cos(angle - 0.5) * 15, arrowY - Math.sin(angle - 0.5) * 15,
        arrowX - Math.cos(angle + 0.5) * 15, arrowY - Math.sin(angle + 0.5) * 15
      )
    })
  }

  private checkCycles() {
    // Build adjacency list
    const adj = new Map<string, string[]>()
    this.edges.forEach(e => {
      if (!adj.has(e.from)) adj.set(e.from, [])
      adj.get(e.from)!.push(e.to)
    })

    const visited = new Set<string>()
    const recStack = new Set<string>()
    const parent = new Map<string, string>()

    let cycleFound: string[] = []

    const dfs = (v: string): boolean => {
      visited.add(v)
      recStack.add(v)

      const neighbors = adj.get(v) || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          parent.set(neighbor, v)
          if (dfs(neighbor)) return true
        } else if (recStack.has(neighbor)) {
          // Cycle found!
          let curr = v
          cycleFound.push(neighbor)
          while (curr !== neighbor) {
            cycleFound.push(curr)
            curr = parent.get(curr)!
          }
          cycleFound.push(neighbor)
          return true
        }
      }
      recStack.delete(v)
      return false
    }

    for (const node of Array.from(this.nodes.keys())) {
      if (!visited.has(node)) {
        if (dfs(node)) break
      }
    }

    if (cycleFound.length > 0) {
      this.isDeadlocked = true
      this.deadlockTimer = this.time.now + 4000 // 4 seconds to react
      this.cycleNodes = new Set(cycleFound)
      
      // Highlight edges in cycle
      for (let i = 0; i < cycleFound.length - 1; i++) {
        const u = cycleFound[i+1]
        const v = cycleFound[i]
        const edge = this.edges.find(e => e.from === u && e.to === v)
        if (edge) edge.isCycle = true
      }
      this.drawEdges()
      
      // Highlight cycle P nodes
      this.cycleNodes.forEach(nodeId => {
        if (nodeId.startsWith('P')) {
          const node = this.nodes.get(nodeId)!
          if (node.sprite instanceof Phaser.GameObjects.Arc) {
            node.sprite.setStrokeStyle(4, 0xef4444)
          }
        }
      })
    }
  }

  private handleNodeClick(id: string) {
    if (!this.isDeadlocked) return
    
    if (this.cycleNodes.has(id)) {
      // Break the deadlock!
      // Remove all edges originating from this process (Preempting its requests)
      this.edges = this.edges.filter(e => e.from !== id && e.to !== id)
      
      this.isDeadlocked = false
      this.cycleNodes.clear()
      this.cameras.main.scrollX = 0
      this.cameras.main.scrollY = 0
      
      // Reset visuals
      this.edges.forEach(e => e.isCycle = false)
      this.nodes.forEach((n, k) => {
        if (n.type === 'P' && n.sprite instanceof Phaser.GameObjects.Arc) {
          n.sprite.setStrokeStyle(0)
        }
      })
      this.drawEdges()
      
      // Notify store
      useGameStore.getState().resolveDeadlock()
      
      // Flash green
      this.cameras.main.flash(200, 0, 255, 0)
      this.nextEventTime = this.time.now + 1000
    }
  }

  private clearGraph() {
    this.edges.forEach(e => e.graphics.destroy())
    this.edges = []
    this.nodes.forEach(n => {
      if (n.type === 'P' && n.sprite instanceof Phaser.GameObjects.Arc) {
        n.sprite.setStrokeStyle(0)
      }
    })
  }
}
