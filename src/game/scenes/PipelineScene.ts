import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

interface Task {
  id: number
  sprite: Phaser.GameObjects.Rectangle
  text: Phaser.GameObjects.Text
  stage: 'QUEUE' | 'IF' | 'ID' | 'EX' | 'DONE'
  stageStartTime: number
  targetX: number
}

export class PipelineScene extends Phaser.Scene {
  private tasks: Task[] = []
  private taskCounter = 0
  
  // Stations
  private stations = {
    IF: { x: 200, y: 300, name: '取指 (IF)' },
    ID: { x: 400, y: 300, name: '分析 (ID)' },
    EX: { x: 600, y: 300, name: '执行 (EX)' }
  }

  // Timer
  private globalTimer = 0
  private damageTimer = 0

  constructor() {
    super({ key: 'PipelineScene' })
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x0f172a)
    
    // Draw conveyor belts connecting stations
    const graphics = this.add.graphics()
    graphics.lineStyle(10, 0x334155)
    graphics.beginPath()
    graphics.moveTo(50, 300)
    graphics.lineTo(750, 300)
    graphics.strokePath()

    // Draw Stations
    Object.values(this.stations).forEach(st => {
      // Machine base
      this.add.rectangle(st.x, st.y, 80, 80, 0x1e293b).setStrokeStyle(4, 0x475569)
      this.add.text(st.x, st.y - 60, st.name, { color: '#94a3b8', fontSize: '14px', fontStyle: 'bold' }).setOrigin(0.5)
    })

    this.globalTimer = this.time.now
    this.damageTimer = this.time.now + 1000
    
    // Initial task
    this.spawnTask()
  }

  update(time: number, delta: number) {
    const store = useGameStore.getState()
    if (store.isGameOver) return

    // Slowly drain HP to act as a deadline
    if (time > this.damageTimer) {
      store.takeDamage(1)
      this.damageTimer = time + 500
    }

    const { isPipelined, stageTimes } = store

    // Ensure there's always something in QUEUE if we haven't reached target
    const queueTasks = this.tasks.filter(t => t.stage === 'QUEUE')
    if (queueTasks.length < 5 && this.taskCounter < store.pipelineTarget * 2) {
      this.spawnTask()
    }

    // Process tasks
    this.tasks.forEach(task => {
      let currentStationTime = 0
      let nextStage: any = null
      let canMove = false

      if (task.stage === 'QUEUE') {
        // Can enter IF?
        if (isPipelined) {
          const isIFOccupied = this.tasks.some(t => t.stage === 'IF')
          canMove = !isIFOccupied
        } else {
          // Sequential: can only enter if NO task is in IF, ID, or EX
          const isAnyOccupied = this.tasks.some(t => t.stage === 'IF' || t.stage === 'ID' || t.stage === 'EX')
          canMove = !isAnyOccupied
        }
        if (canMove) nextStage = 'IF'
      } 
      else if (task.stage === 'IF') {
        currentStationTime = stageTimes.IF
        if (time >= task.stageStartTime + currentStationTime) {
          const isIDOccupied = this.tasks.some(t => t.stage === 'ID')
          canMove = !isIDOccupied // Can only move if ID is empty (or about to be empty, but strictly checking empty prevents overlap)
          if (canMove) nextStage = 'ID'
        }
      }
      else if (task.stage === 'ID') {
        currentStationTime = stageTimes.ID
        if (time >= task.stageStartTime + currentStationTime) {
          const isEXOccupied = this.tasks.some(t => t.stage === 'EX')
          canMove = !isEXOccupied
          if (canMove) nextStage = 'EX'
        }
      }
      else if (task.stage === 'EX') {
        currentStationTime = stageTimes.EX
        if (time >= task.stageStartTime + currentStationTime) {
          canMove = true
          nextStage = 'DONE'
        }
      }

      // Transition stage
      if (canMove && nextStage) {
        task.stage = nextStage
        task.stageStartTime = time
        
        if (nextStage === 'IF') task.targetX = this.stations.IF.x
        if (nextStage === 'ID') task.targetX = this.stations.ID.x
        if (nextStage === 'EX') task.targetX = this.stations.EX.x
        if (nextStage === 'DONE') {
          task.targetX = 800
          store.completePipelineTask()
        }
      }

      // Visual movement (Tween to targetX)
      if (task.sprite.x < task.targetX) {
        task.sprite.x += delta * 0.3
        if (task.sprite.x > task.targetX) task.sprite.x = task.targetX
      }
      task.text.x = task.sprite.x
    })

    // Cleanup done tasks
    this.tasks = this.tasks.filter(t => {
      if (t.stage === 'DONE' && t.sprite.x >= 800) {
        t.sprite.destroy()
        t.text.destroy()
        return false
      }
      return true
    })
  }

  private spawnTask() {
    this.taskCounter++
    const startX = -50 - (this.tasks.filter(t => t.stage === 'QUEUE').length * 60)
    
    const sprite = this.add.rectangle(startX, 300, 40, 40, 0x3b82f6)
    const text = this.add.text(startX, 300, `#${this.taskCounter}`, { color: '#ffffff', fontSize: '12px' }).setOrigin(0.5)
    
    this.tasks.push({
      id: this.taskCounter,
      sprite,
      text,
      stage: 'QUEUE',
      stageStartTime: 0,
      targetX: 50 // The queue wait line
    })
  }
}
