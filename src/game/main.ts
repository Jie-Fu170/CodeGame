import Phaser from 'phaser'
import { LEVELS, getLevelById } from '../config/levels'
import { OSCityScene } from './scenes/OSCityScene'
import { SQLBattleScene } from './scenes/SQLBattleScene'
import { DeadlockScene } from './scenes/DeadlockScene'
import { UMLTempleScene } from './scenes/UMLTempleScene'
import { PipelineScene } from './scenes/PipelineScene'
import { NetworkScene } from './scenes/NetworkScene'
import { CryptoScene } from './scenes/CryptoScene'
import { TreeScene } from './scenes/TreeScene'
import { LoadBalancerScene } from './scenes/LoadBalancerScene'

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-game-container',
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false
    }
  },
  scene: [BootScene, OSCityScene, SQLBattleScene, DeadlockScene, UMLTempleScene, PipelineScene, NetworkScene, CryptoScene, TreeScene, LoadBalancerScene]
}

let game: Phaser.Game | null = null

export const initGame = () => {
  if (!game) {
    game = new Phaser.Game(config)
  }
  return game
}

export const switchScene = (levelId: string) => {
  if (!game) return

  const executeSwitch = () => {
    if (!game) return
    const targetLevel = getLevelById(levelId)

    // Stop all active/inactive scenes in Phaser except target
    if (game.scene && game.scene.scenes) {
      game.scene.scenes.forEach(s => {
        const key = s.sys.settings.key
        if (key && key !== targetLevel?.sceneKey) {
          game!.scene.stop(key)
        }
      })
    }

    if (targetLevel && targetLevel.sceneKey && targetLevel.engine !== 'react') {
      game.scene.start(targetLevel.sceneKey)
    }
  }

  if (game.isBooted) {
    executeSwitch()
  } else {
    game.events.once(Phaser.Core.Events.READY, executeSwitch)
  }
}

export const destroyGame = () => {
  if (game) {
    game.destroy(true)
    game = null
  }
}

// Trigger HMR
