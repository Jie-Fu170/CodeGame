import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

export class LoadBalancerScene extends Phaser.Scene {
  private servers: { A: Phaser.GameObjects.Rectangle, B: Phaser.GameObjects.Rectangle, C: Phaser.GameObjects.Rectangle } = {} as any
  private serverLoad: { A: number, B: number, C: number } = { A: 0, B: 0, C: 0 }
  private serverCapacity = { A: 200, B: 100, C: 30 } // C is very weak
  private serverBars: { A: Phaser.GameObjects.Rectangle, B: Phaser.GameObjects.Rectangle, C: Phaser.GameObjects.Rectangle } = {} as any
  private requestsGroup!: Phaser.Physics.Arcade.Group
  
  private rrIndex = 0
  private spawnTimer!: Phaser.Time.TimerEvent
  private tickTimer!: Phaser.Time.TimerEvent
  
  private currentPhase = 1 // 1: RR kills C, need LC. 2: Session warning, need IP Hash
  private elapsedTime = 0

  constructor() {
    super({ key: 'LoadBalancerScene', physics: { arcade: { gravity: { x: 0, y: 0 } } } })
  }

  create() {
    this.add.rectangle(400, 300, 800, 600, 0x0f172a)

    // Load Balancer (Center Top)
    this.add.rectangle(400, 150, 200, 50, 0xf97316).setStrokeStyle(4, 0xffedd5)
    this.add.text(400, 150, 'Load Balancer', { color: '#000', fontStyle: 'bold', fontSize: '20px' }).setOrigin(0.5)

    // Servers (Bottom)
    const sx = [200, 400, 600]
    const ids = ['A', 'B', 'C']
    const names = ['Server A\n(High-End)', 'Server B\n(Standard)', 'Server C\n(Legacy)']
    
    sx.forEach((x, i) => {
      const id = ids[i] as 'A'|'B'|'C'
      
      this.add.rectangle(x, 450, 120, 100, 0x1e293b).setStrokeStyle(2, 0x475569)
      this.add.text(x, 450, names[i], { color: '#cbd5e1', align: 'center', fontSize: '14px' }).setOrigin(0.5)
      
      this.servers[id] = this.add.rectangle(x, 450, 120, 100, 0xffffff, 0)
      
      // Load bar bg
      this.add.rectangle(x, 530, 100, 10, 0x000000)
      // Load bar fill
      this.serverBars[id] = this.add.rectangle(x - 50, 530, 0, 10, 0x22c55e).setOrigin(0, 0.5)
    })

    this.requestsGroup = this.physics.add.group()

    this.spawnTimer = this.time.addEvent({ delay: 300, callback: this.spawnRequest, callbackScope: this, loop: true })
    this.tickTimer = this.time.addEvent({ delay: 1000, callback: this.processTick, callbackScope: this, loop: true })
  }

  update() {
    const store = useGameStore.getState()
    if (store.lbStatus !== 'PLAYING') {
      this.spawnTimer.paused = true
      this.tickTimer.paused = true
      
      if (store.lbStatus === 'SUCCESS' && !this.sys.isProcessing) {
        this.sys.isProcessing = true
        this.triggerFireworks()
      }
      return
    } else {
      this.spawnTimer.paused = false
      this.tickTimer.paused = false
      this.sys.isProcessing = false
    }

    // Requests logic
    this.requestsGroup.getChildren().forEach((r: any) => {
      const req = r as Phaser.Physics.Arcade.Sprite
      if (req.y > 450) {
        // Hit server
        const targetServer = req.getData('target') as 'A'|'B'|'C'
        const reqColor = req.getData('color') // For IP Hash logic
        
        this.serverLoad[targetServer] += 10
        
        // Session Drop logic (Phase 2)
        if (this.currentPhase === 2) {
          // If color dictates it must go to A (e.g. Red -> A, Blue -> B, Green -> C)
          // Simplified: If IP Hash is used, it's correct. Otherwise, we drop sessions!
          if (store.lbAlgorithm !== 'IP_HASH') {
            // Randomly lose HP due to lost session
            if (Math.random() > 0.5) {
              const newHp = Math.max(0, store.hp - 2)
              useGameStore.setState({ hp: newHp })
            }
          }
        }

        req.destroy()
        this.updateBars()
      }
    })
    
    // Check game over by load
    if (this.serverLoad.A >= this.serverCapacity.A || 
        this.serverLoad.B >= this.serverCapacity.B || 
        this.serverLoad.C >= this.serverCapacity.C) {
      
      const newHp = Math.max(0, store.hp - 1) // Drain HP rapidly if any server is overloaded
      useGameStore.setState({ hp: newHp })
      
      if (newHp === 0 && !store.isGameOver) {
        useGameStore.getState().gameOver(false, "服务器崩溃！未能抵御住流量洪峰，请反思负载均衡策略。")
        useGameStore.setState({ lbStatus: 'FAILED' })
      }
    }
  }

  private spawnRequest() {
    const x = Phaser.Math.Between(380, 420)
    const req = this.physics.add.sprite(x, -20, '') // Using a simple graphic
    const color = Phaser.Math.RND.pick([0xef4444, 0x3b82f6, 0x22c55e])
    
    const store = useGameStore.getState()
    
    // Generate graphics dynamically
    const g = this.make.graphics({x: 0, y: 0, add: false})
    g.fillStyle(this.currentPhase === 2 ? color : 0xffffff)
    g.fillCircle(8, 8, 8)
    g.generateTexture(`req_${this.currentPhase}_${color}`, 16, 16)
    req.setTexture(`req_${this.currentPhase}_${color}`)

    let target: 'A'|'B'|'C' = 'A'
    
    if (store.lbAlgorithm === 'RR') {
      const ids: ('A'|'B'|'C')[] = ['A', 'B', 'C']
      target = ids[this.rrIndex % 3]
      this.rrIndex++
    } else if (store.lbAlgorithm === 'LEAST_CONN') {
      const loads = [
        { id: 'A', load: this.serverLoad.A / this.serverCapacity.A },
        { id: 'B', load: this.serverLoad.B / this.serverCapacity.B },
        { id: 'C', load: this.serverLoad.C / this.serverCapacity.C }
      ]
      loads.sort((a, b) => a.load - b.load)
      target = loads[0].id as 'A'|'B'|'C'
    } else if (store.lbAlgorithm === 'IP_HASH') {
      if (color === 0xef4444) target = 'A'
      else if (color === 0x3b82f6) target = 'B'
      else target = 'C'
    }

    req.setData('target', target)
    req.setData('color', color)
    
    const targetX = target === 'A' ? 200 : target === 'B' ? 400 : 600
    
    // Move to LB first, then to server
    this.tweens.add({
      targets: req,
      y: 150,
      x: 400,
      duration: 300,
      onComplete: () => {
        this.physics.moveTo(req, targetX, 450, 400)
      }
    })

    this.requestsGroup.add(req)
  }

  private processTick() {
    this.elapsedTime++
    const store = useGameStore.getState()
    store.tickLbTime()
    
    // Process load (Servers process requests)
    this.serverLoad.A = Math.max(0, this.serverLoad.A - 30) // A is fast
    this.serverLoad.B = Math.max(0, this.serverLoad.B - 15) // B is medium
    this.serverLoad.C = Math.max(0, this.serverLoad.C - 5)  // C is very slow
    
    this.updateBars()

    // Phase management
    if (this.elapsedTime === 10) {
      this.spawnTimer.delay = 150 // Speed up! RR will kill C now.
      store.addLbWarning("流量激增！请注意服务器负载！如果某台服务器能力差，应该使用【最小连接数】！")
    }

    if (this.elapsedTime === 30) {
      this.currentPhase = 2
      this.spawnTimer.delay = 100 // Massive traffic
      store.addLbWarning("需要会话保持 (Session)！请切换到【源地址哈希 (IP Hash)】以保证同一个用户被路由到同一台机器！")
    }
  }

  private updateBars() {
    const ids: ('A'|'B'|'C')[] = ['A', 'B', 'C']
    ids.forEach(id => {
      const pct = Math.min(1, this.serverLoad[id] / this.serverCapacity[id])
      this.serverBars[id].width = 100 * pct
      
      let color = 0x22c55e
      if (pct > 0.8) {
        color = 0xef4444 // Red
        // Flash server
        this.servers[id].setFillStyle(0xef4444, 0.5)
      } else if (pct > 0.5) {
        color = 0xeab308 // Yellow
        this.servers[id].setFillStyle(0xffffff, 0)
      } else {
        this.servers[id].setFillStyle(0xffffff, 0)
      }
      
      this.serverBars[id].fillColor = color
    })
  }
  
  private triggerFireworks() {
    // Huge particle explosion
    const particles = this.add.particles(400, 300, 'req_2_16729344', {
      speed: { min: 200, max: 600 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 2000,
      blendMode: 'ADD',
      tint: [ 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff ],
      quantity: 10
    })
    
    this.time.addEvent({
      delay: 500,
      repeat: 10,
      callback: () => {
        particles.setX(Phaser.Math.Between(100, 700))
        particles.setY(Phaser.Math.Between(100, 500))
        particles.explode(50)
      }
    })
  }
}
