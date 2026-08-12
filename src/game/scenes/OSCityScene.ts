import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

interface ProcessData {
  id: string
  executionTime: number
  totalTime: number
  color: number
  priority: number
  sprite: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
}

export class OSCityScene extends Phaser.Scene {
  private cpuRect!: Phaser.GameObjects.Rectangle
  private readyQueue: ProcessData[] = []
  private currentProcess: ProcessData | null = null
  private nextSpawnTime = 0
  private processCounter = 0
  
  // Game balance
  private baseSpawnRate = 2000 // ms
  private maxQueueSize = 8
  private lastHpDrainTime = 0
  
  // RR algorithm state
  private timeQuantum = 1000 // 1 second per slice
  private currentSliceTime = 0

  constructor() {
    super({ key: 'OSCityScene' })
  }

  preload() {
    // We can load assets here later. Using basic shapes for now.
  }

  create() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x0f172a)

    // CPU Area (Center Right)
    this.add.text(550, 150, 'CPU 核心', { fontSize: '24px', color: '#60a5fa', fontStyle: 'bold' }).setOrigin(0.5)
    this.cpuRect = this.add.rectangle(550, 300, 150, 200, 0x1e293b).setStrokeStyle(4, 0x3b82f6)
    
    // Ready Queue Area (Left)
    this.add.text(200, 150, '等待队列 (Ready Queue)', { fontSize: '24px', color: '#94a3b8', fontStyle: 'bold' }).setOrigin(0.5)
    this.add.rectangle(200, 350, 120, 400, 0x1e293b).setStrokeStyle(2, 0x475569)

    // Initial spawn
    this.nextSpawnTime = this.time.now + 1000
  }

  update(time: number, delta: number) {
    const store = useGameStore.getState()
    
    if (store.isGameOver) return

    // 1. Spawn new processes
    if (time > this.nextSpawnTime) {
      this.spawnProcess()
      // Make it slightly faster over time, min 800ms
      const speedup = Math.max(800, this.baseSpawnRate - store.completedProcesses * 30)
      this.nextSpawnTime = time + speedup
    }

    // 2. Schedule next process if CPU is idle
    if (!this.currentProcess && this.readyQueue.length > 0) {
      this.scheduleNextProcess(store.algorithm)
    }

    // 3. Execute current process
    if (this.currentProcess) {
      this.executeProcess(delta, store)
    }

    // 4. Update visuals and layout
    this.updateQueueLayout()

    // 5. HP Drain if queue is congested (simulating system overload)
    if (this.readyQueue.length >= this.maxQueueSize) {
      if (time - this.lastHpDrainTime > 1000) {
        store.takeDamage(5) // Drain 5 HP per second if overloaded
        this.lastHpDrainTime = time
        // Flash red
        this.cameras.main.flash(200, 255, 0, 0, 0.3)
      }
    }
  }

  private spawnProcess() {
    this.processCounter++
    
    // Generate long jobs occasionally to test FCFS vs SJF
    const isLongJob = Math.random() < 0.2
    const baseTime = isLongJob ? Phaser.Math.Between(4000, 6000) : Phaser.Math.Between(500, 1500)
    
    // Assign color based on length
    const color = isLongJob ? 0xef4444 : 0x10b981 // Red for long, green for short

    const priority = Phaser.Math.Between(1, 3)

    const pX = 200
    const pY = -50 // Start offscreen

    const sprite = this.add.rectangle(pX, pY, 100, 40, color)
    const text = this.add.text(pX, pY, `P${this.processCounter} (Pr:${priority})\n${Math.ceil(baseTime/100)}`, { 
      fontSize: '14px', 
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5)

    const process: ProcessData = {
      id: `P${this.processCounter}`,
      executionTime: baseTime,
      totalTime: baseTime,
      color,
      priority,
      sprite,
      text
    }

    this.readyQueue.push(process)
  }

  private scheduleNextProcess(algorithm: string) {
    if (this.readyQueue.length === 0) return

    let selectedIndex = 0

    if (algorithm === 'SJF') {
      // Find process with shortest execution time
      let minTime = Infinity
      for (let i = 0; i < this.readyQueue.length; i++) {
        if (this.readyQueue[i].executionTime < minTime) {
          minTime = this.readyQueue[i].executionTime
          selectedIndex = i
        }
      }
    } else if (algorithm === 'PRIORITY') {
      // Find process with highest priority
      let maxPriority = -1
      for (let i = 0; i < this.readyQueue.length; i++) {
        if (this.readyQueue[i].priority > maxPriority) {
          maxPriority = this.readyQueue[i].priority
          selectedIndex = i
        }
      }
    }
    // FCFS and RR will just pick selectedIndex = 0

    this.currentProcess = this.readyQueue.splice(selectedIndex, 1)[0]
    this.currentSliceTime = 0

    // Animate to CPU
    this.tweens.add({
      targets: [this.currentProcess.sprite, this.currentProcess.text],
      x: 550,
      y: 300,
      duration: 300,
      ease: 'Power2'
    })
    
    this.cpuRect.setStrokeStyle(4, 0xf59e0b) // Active CPU color
  }

  private executeProcess(delta: number, store: any) {
    if (!this.currentProcess) return

    this.currentProcess.executionTime -= delta
    this.currentSliceTime += delta

    // Update text
    this.currentProcess.text.setText(`${this.currentProcess.id} (Pr:${this.currentProcess.priority})\n${Math.max(0, Math.ceil(this.currentProcess.executionTime/100))}`)

    // Add progress bar effect
    const progress = this.currentProcess.executionTime / this.currentProcess.totalTime
    this.currentProcess.sprite.scaleX = Math.max(0.1, progress)

    if (this.currentProcess.executionTime <= 0) {
      // Process finished
      this.currentProcess.sprite.destroy()
      this.currentProcess.text.destroy()
      this.currentProcess = null
      
      this.cpuRect.setStrokeStyle(4, 0x3b82f6) // Idle CPU color
      
      store.addScore(100)
      store.completeProcess()
      
      // Heal a tiny bit for completing
      if (store.hp < store.maxHp) {
        useGameStore.setState({ hp: Math.min(store.maxHp, store.hp + 2) })
      }
    } else if (store.algorithm === 'RR' && this.currentSliceTime >= this.timeQuantum) {
      // Preempt process
      this.readyQueue.push(this.currentProcess)
      this.currentProcess = null
      this.cpuRect.setStrokeStyle(4, 0x3b82f6) // Idle CPU color
    }
  }

  private updateQueueLayout() {
    const startY = 500
    const spacing = 50

    this.readyQueue.forEach((process, index) => {
      const targetY = startY - (index * spacing)
      const targetX = 200
      
      // Smoothly move queue items
      process.sprite.x = Phaser.Math.Linear(process.sprite.x, targetX, 0.1)
      process.text.x = Phaser.Math.Linear(process.text.x, targetX, 0.1)
      process.sprite.y = Phaser.Math.Linear(process.sprite.y, targetY, 0.1)
      process.text.y = Phaser.Math.Linear(process.text.y, targetY, 0.1)
    })
  }
}
