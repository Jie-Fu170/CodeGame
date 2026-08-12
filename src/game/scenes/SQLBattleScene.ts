import Phaser from 'phaser'
import { useGameStore } from '../../store/useGameStore'

export class SQLBattleScene extends Phaser.Scene {
  private playerSprite!: Phaser.GameObjects.Rectangle
  private bossSprite!: Phaser.GameObjects.Rectangle
  private dataStreamGroup!: Phaser.GameObjects.Group
  
  private lastPlayerAttackTime = 0
  private lastBossAttackTime = 0

  constructor() {
    super({ key: 'SQLBattleScene' })
  }

  create() {
    // Cyber/Ocean background
    this.add.rectangle(400, 300, 800, 600, 0x020617)
    
    // Grid effect
    const grid = this.add.grid(400, 300, 800, 600, 40, 40, 0x000000, 0, 0x1e293b, 0.5)
    
    // Floor
    this.add.rectangle(400, 500, 800, 200, 0x0f172a)
    this.add.line(0, 0, 0, 400, 800, 400, 0x3b82f6).setOrigin(0)

    // Player character (Left)
    this.playerSprite = this.add.rectangle(150, 350, 60, 100, 0x3b82f6)
    this.add.text(150, 280, 'Player', { color: '#60a5fa' }).setOrigin(0.5)
    
    // Boss Monster (Right)
    this.bossSprite = this.add.rectangle(650, 300, 160, 200, 0xef4444)
    this.add.text(650, 180, '冗余海怪', { fontSize: '24px', color: '#f87171', fontStyle: 'bold' }).setOrigin(0.5)
    
    // Floating animation for boss
    this.tweens.add({
      targets: this.bossSprite,
      y: 320,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    this.dataStreamGroup = this.add.group()
  }

  update() {
    const store = useGameStore.getState()

    // Trigger player attack animation if state updated
    if (store.triggerPlayerAttack > this.lastPlayerAttackTime) {
      this.lastPlayerAttackTime = store.triggerPlayerAttack
      this.firePlayerAttack()
    }

    // Trigger boss attack animation if state updated
    if (store.triggerBossAttack > this.lastBossAttackTime) {
      this.lastBossAttackTime = store.triggerBossAttack
      this.fireBossAttack()
    }
    
    // Boss defeated death animation
    if (store.isBossDefeated && this.bossSprite.active) {
      this.bossSprite.setActive(false)
      this.tweens.add({
        targets: this.bossSprite,
        alpha: 0,
        scale: 0.1,
        angle: 180,
        duration: 1000,
        onComplete: () => {
          this.bossSprite.setVisible(false)
        }
      })
    }
  }

  private firePlayerAttack() {
    // Jump back a bit
    this.tweens.add({
      targets: this.playerSprite,
      x: 130,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        // Fire data stream (SQL logic blast)
        const projectile = this.add.rectangle(180, 350, 40, 10, 0xa855f7)
        
        this.tweens.add({
          targets: projectile,
          x: 600,
          duration: 300,
          ease: 'Power2',
          onComplete: () => {
            projectile.destroy()
            // Hit effect on boss
            this.cameras.main.shake(200, 0.01)
            this.bossSprite.setFillStyle(0xffffff)
            this.time.delayedCall(100, () => {
              if(this.bossSprite.active) this.bossSprite.setFillStyle(0xef4444)
            })
            // Spawn hit particles (squares)
            for(let i=0; i<10; i++){
              const p = this.add.rectangle(600, Phaser.Math.Between(250, 350), 8, 8, 0xa855f7)
              this.tweens.add({
                targets: p,
                x: `+=${Phaser.Math.Between(-50, 50)}`,
                y: `+=${Phaser.Math.Between(-50, 50)}`,
                alpha: 0,
                duration: 500,
                onComplete: () => p.destroy()
              })
            }
          }
        })
      }
    })
  }

  private fireBossAttack() {
    // Boss leans forward
    this.tweens.add({
      targets: this.bossSprite,
      x: 600,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        // Boss fires red error stream
        const projectile = this.add.rectangle(570, 350, 60, 20, 0xef4444)
        
        this.tweens.add({
          targets: projectile,
          x: 180,
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            projectile.destroy()
            // Hit effect on player
            this.cameras.main.shake(300, 0.02)
            this.cameras.main.flash(200, 255, 0, 0, 0.2)
            this.playerSprite.setFillStyle(0xffffff)
            this.time.delayedCall(100, () => {
              this.playerSprite.setFillStyle(0x3b82f6)
            })
          }
        })
      }
    })
  }
}
