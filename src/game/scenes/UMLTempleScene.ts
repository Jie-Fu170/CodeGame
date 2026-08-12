import Phaser from 'phaser';
import { useGameStore } from '../../store/useGameStore';
import { soundManager } from '../../utils/audio';

export type TowerType = 'SINGLETON' | 'FACTORY' | 'OBSERVER' | 'DECORATOR' | 'ADAPTER' | 'STRATEGY' | 'CHAIN' | 'PROXY' | 'BUILDER' | 'STATE' | 'PROTOTYPE' | 'FACADE';
export type EnemyType = 'NULLPTR' | 'MEMLEAK' | 'DEADLOCK' | 'OVERFLOW';

interface EnemyConfig {
    hp: number;
    speed: number;
    leakDamage: number;
    killReward: number;
    color: number;
    size: number;
}

const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
    NULLPTR: { hp: 80, speed: 8000, leakDamage: 5, killReward: 8, color: 0xfb7185, size: 18 },
    MEMLEAK: { hp: 200, speed: 12000, leakDamage: 10, killReward: 15, color: 0x84cc16, size: 18 },
    DEADLOCK: { hp: 60, speed: 5000, leakDamage: 8, killReward: 10, color: 0xfacc15, size: 18 },
    OVERFLOW: { hp: 600, speed: 14000, leakDamage: 25, killReward: 50, color: 0xdc2626, size: 24 }
};

interface TowerConfig {
    name: string;
    shortName: string;
    color: number;
    cost: number;
    range: number;
    cooldown: number;
    damage: number;
    textColor: string;
}

const TOWER_CONFIGS: Record<TowerType, TowerConfig> = {
    SINGLETON: { name: '单例模式', shortName: '单例', color: 0xeab308, cost: 120, range: 200, cooldown: 1500, damage: 50, textColor: '#0f172a' },
    FACTORY:   { name: '工厂模式', shortName: '工厂', color: 0xa855f7, cost: 60, range: 200, cooldown: 2000, damage: 15, textColor: '#ffffff' },
    OBSERVER:  { name: '观察者模式', shortName: '观察', color: 0x3b82f6, cost: 50, range: 200, cooldown: 300, damage: 0, textColor: '#ffffff' },
    DECORATOR: { name: '装饰器模式', shortName: '装饰', color: 0x8b5cf6, cost: 40, range: 0, cooldown: 0, damage: 0, textColor: '#ffffff' },
    ADAPTER:   { name: '适配器模式', shortName: '适配', color: 0x10b981, cost: 45, range: 150, cooldown: 500, damage: 0, textColor: '#ffffff' },
    STRATEGY:  { name: '策略模式', shortName: '策略', color: 0xf97316, cost: 70, range: 250, cooldown: 1200, damage: 20, textColor: '#ffffff' },
    CHAIN:     { name: '责任链模式', shortName: '责任链', color: 0x06b6d4, cost: 55, range: 160, cooldown: 1000, damage: 25, textColor: '#0f172a' },
    PROXY:     { name: '代理模式', shortName: '代理', color: 0xf43f5e, cost: 50, range: 180, cooldown: 1200, damage: 30, textColor: '#ffffff' },
    BUILDER:   { name: '建造者模式', shortName: '建造', color: 0xf59e0b, cost: 65, range: 200, cooldown: 1800, damage: 25, textColor: '#0f172a' },
    STATE:     { name: '状态模式', shortName: '状态', color: 0xec4899, cost: 55, range: 180, cooldown: 1000, damage: 20, textColor: '#ffffff' },
    PROTOTYPE: { name: '原型模式', shortName: '原型', color: 0x14b8a6, cost: 30, range: 160, cooldown: 1000, damage: 18, textColor: '#ffffff' },
    FACADE:    { name: '外观模式', shortName: '外观', color: 0x6366f1, cost: 50, range: 160, cooldown: 0, damage: 0, textColor: '#ffffff' }
};

const WAVES: EnemyType[][] = [
    ['NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR'],
    ['NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'DEADLOCK', 'DEADLOCK'],
    ['MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK'],
    ['NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK'],
    ['MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'OVERFLOW'],
    ['NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK'],
    ['MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK'],
    ['NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'NULLPTR', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK'],
    ['MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK'],
    ['OVERFLOW', 'OVERFLOW', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'MEMLEAK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK', 'DEADLOCK']
];

class Enemy extends Phaser.GameObjects.Container {
    public t: number = 0;
    public hp: number;
    public maxHp: number;
    public config: EnemyConfig;
    private hpBar: Phaser.GameObjects.Graphics;
    private rect: Phaser.GameObjects.Rectangle;
    public path: Phaser.Curves.Path;

    constructor(scene: Phaser.Scene, config: EnemyConfig, path: Phaser.Curves.Path) {
        super(scene, 0, 0);
        this.config = config;
        this.maxHp = config.hp;
        this.hp = config.hp;
        this.path = path;

        this.rect = scene.add.rectangle(0, 0, config.size, config.size, config.color);
        this.add(this.rect);

        this.hpBar = scene.add.graphics();
        this.add(this.hpBar);
        this.drawHpBar();

        scene.add.existing(this);
        
        const startPoint = this.path.getPoint(0);
        this.setPosition(startPoint.x, startPoint.y);
    }

    drawHpBar() {
        this.hpBar.clear();
        this.hpBar.fillStyle(0x000000);
        this.hpBar.fillRect(-this.config.size / 2, -this.config.size / 2 - 8, this.config.size, 4);
        this.hpBar.fillStyle(0x22c55e);
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        this.hpBar.fillRect(-this.config.size / 2, -this.config.size / 2 - 8, this.config.size * hpPercent, 4);
    }

    takeDamage(amount: number): boolean {
        this.hp -= amount;
        this.drawHpBar();
        return this.hp <= 0;
    }
}

class Tower extends Phaser.GameObjects.Container {
    public type: TowerType;
    public config: TowerConfig;
    public lastFired: number = 0;
    public gridX: number;
    public gridY: number;
    
    // Strategy & Builder & State specific
    public attackCount: number = 0;
    
    // Adapter specific
    public aura?: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, type: TowerType, gridX: number, gridY: number) {
        super(scene, gridX, gridY);
        this.type = type;
        this.config = TOWER_CONFIGS[type];
        this.gridX = gridX;
        this.gridY = gridY;

        const rect = scene.add.rectangle(0, 0, 32, 32, this.config.color);
        rect.setStrokeStyle(1, 0xffffff, 0.4);
        this.add(rect);

        const fontSize = this.config.shortName.length > 2 ? '10px' : '12px';
        const text = scene.add.text(0, 0, this.config.shortName, {
            color: this.config.textColor,
            fontSize: fontSize,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(text);

        // Hover tooltip for placed tower
        rect.setInteractive({ useHandCursor: true });
        const tooltipBg = scene.add.rectangle(0, -26, 74, 18, 0x0f172a, 0.95)
            .setStrokeStyle(1, 0x64748b)
            .setVisible(false);
        const tooltipText = scene.add.text(0, -26, this.config.name, {
            fontSize: '11px',
            color: '#f8fafc',
            fontStyle: 'bold'
        }).setOrigin(0.5).setVisible(false);
        
        this.add([tooltipBg, tooltipText]);

        rect.on('pointerover', () => {
            tooltipBg.setVisible(true);
            tooltipText.setVisible(true);
        });
        rect.on('pointerout', () => {
            tooltipBg.setVisible(false);
            tooltipText.setVisible(false);
        });

        if (type === 'ADAPTER') {
            this.aura = scene.add.graphics();
            this.aura.fillStyle(0x10b981, 0.15);
            this.aura.fillCircle(0, 0, this.config.range);
            this.add(this.aura);
        }

        scene.add.existing(this);
    }
    
    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
    }
}

export class UMLTempleScene extends Phaser.Scene {
    private path!: Phaser.Curves.Path;
    private enemies: Enemy[] = [];
    private towers: Tower[] = [];
    
    private currentWaveIndex: number = 0;
    private spawnQueue: EnemyType[] = [];
    private spawnTimer: number = 0;
    
    private observerBuffUntil: number = 0;
    
    private waveInProgress: boolean = false;
    private timeSinceWaveEnded: number = 0;
    private preWaveDelay: number = 3000;
    private isWaitingForQuiz: boolean = false;

    constructor() {
        super('UMLTempleScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0f172a');
        this.drawGrid();
        this.createPath();

        this.input.on('pointerdown', this.handlePointerDown, this);
        
        // Initial delay before starting wave 1
        this.preWaveDelay = 3000;
        
        // Reset Zustand TD state on scene start
        const store = useGameStore.getState();
        store.setWave(1);
    }

    drawGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x1e293b, 0.3);
        for (let x = 0; x <= 800; x += 40) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, 600);
        }
        for (let y = 0; y <= 600; y += 40) {
            graphics.moveTo(0, y);
            graphics.lineTo(800, y);
        }
        graphics.strokePath();
    }

    createPath() {
        this.path = new Phaser.Curves.Path(0, 120);
        this.path.lineTo(800, 120);
        this.path.lineTo(800, 300);
        this.path.lineTo(0, 300);
        this.path.lineTo(0, 480);
        this.path.lineTo(800, 480);

        const graphics = this.add.graphics();
        graphics.lineStyle(30, 0x334155, 1);
        this.path.draw(graphics);
    }
    
    isPathCell(gx: number, gy: number): boolean {
        if (Math.abs(gy - 120) <= 30) return true;
        if (Math.abs(gy - 300) <= 30) return true;
        if (Math.abs(gy - 480) <= 30) return true;
        if (Math.abs(gx - 800) <= 30 && gy >= 120 && gy <= 300) return true;
        if (Math.abs(gx - 0) <= 30 && gy >= 300 && gy <= 480) return true;
        return false;
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        const store = useGameStore.getState();
        if (store.isGameOver || store.showQuiz) return;
        if (!store.selectedTowerType) return;

        const gx = Math.floor(pointer.x / 40) * 40 + 20;
        const gy = Math.floor(pointer.y / 40) * 40 + 20;

        if (this.isPathCell(gx, gy)) return;
        if (this.towers.some(t => t.gridX === gx && t.gridY === gy)) return;

        const type = store.selectedTowerType;
        const config = TOWER_CONFIGS[type];

        if (store.money < config.cost) return;
        if (type === 'SINGLETON' && store.hasSingleton) return;

        store.setMoney(store.money - config.cost);
        if (type === 'SINGLETON') store.setHasSingleton(true);

        const tower = new Tower(this, type, gx, gy);
        this.towers.push(tower);
        
        soundManager.playBuild();
        store.setShowKnowledgeCard(type);
        store.setSelectedTowerType(null);
    }

    startWave(waveIndex: number) {
        if (waveIndex >= WAVES.length) return;
        this.currentWaveIndex = waveIndex;
        this.spawnQueue = [...WAVES[waveIndex]];
        this.waveInProgress = true;
        this.spawnTimer = 0;
        this.isWaitingForQuiz = false;
        
        soundManager.playSiren();
        const store = useGameStore.getState();
        store.setWave(waveIndex + 1);
    }

    update(time: number, delta: number) {
        const store = useGameStore.getState();
        if (store.isGameOver) return;

        // Check if we are paused for Quiz
        if (store.showQuiz) {
            return;
        }

        // Handle wave progression logic
        if (this.isWaitingForQuiz && !store.showQuiz) {
            // Quiz was completed and closed, start pre-wave delay for next wave
            this.isWaitingForQuiz = false;
            this.preWaveDelay = 2000;
        }
        
        if (!this.waveInProgress) {
            if (this.isWaitingForQuiz) {
                return;
            }
            
            this.preWaveDelay -= delta;
            if (this.preWaveDelay <= 0) {
                if (this.currentWaveIndex < WAVES.length) {
                    this.startWave(this.currentWaveIndex);
                }
            }
            return;
        }

        // Spawning
        if (this.spawnQueue.length > 0) {
            this.spawnTimer -= delta;
            if (this.spawnTimer <= 0) {
                const enemyType = this.spawnQueue.shift()!;
                const enemy = new Enemy(this, ENEMY_CONFIGS[enemyType], this.path);
                this.enemies.push(enemy);
                this.spawnTimer = 1500;
            }
        }

        // Move enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            let speedMod = 1.0;
            for (const t of this.towers) {
                if (t.type === 'ADAPTER') {
                    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, t.gridX, t.gridY);
                    if (dist <= t.config.range) {
                        speedMod = 0.5;
                        break;
                    }
                }
            }
            
            enemy.t += (delta / enemy.config.speed) * speedMod;

            if (enemy.t >= 1) {
                store.takeDamage(enemy.config.leakDamage);
                enemy.destroy();
                this.enemies.splice(i, 1);
            } else {
                const p = this.path.getPoint(enemy.t);
                enemy.setPosition(p.x, p.y);
            }
        }

        // Towers fire
        for (const tower of this.towers) {
            const cooldownMod = this.getCooldownMultiplier(tower);
            if (tower.config.cooldown > 0 && time - tower.lastFired >= tower.config.cooldown * cooldownMod) {
                this.fireTower(tower, time);
            }
        }
        
        // Check wave end
        if (this.spawnQueue.length === 0 && this.enemies.length === 0) {
            this.waveInProgress = false;
            if (this.currentWaveIndex + 1 < 10) {
                this.currentWaveIndex++;
                this.isWaitingForQuiz = true;
                store.setShowQuiz(true);
                this.preWaveDelay = 2000;
            } else {
                // Victory
                if (store.gameOver) store.gameOver(true, 'Victory!');
            }
        }
    }

    getCooldownMultiplier(tower: Tower): number {
        let mult = 1.0;
        const isObserverActive = this.time.now < this.observerBuffUntil;
        if (isObserverActive) mult *= 0.5;

        // Facade buff: adjacent Facade tower reduces cooldown by 20%
        for (const t of this.towers) {
            if (t.type === 'FACADE' && t !== tower) {
                const dist = Math.abs(t.gridX - tower.gridX) + Math.abs(t.gridY - tower.gridY);
                if (dist <= 60) {
                    mult *= 0.8;
                    break;
                }
            }
        }
        return mult;
    }

    getDamageModifier(tower: Tower): number {
        let decorators = 0;
        for (const t of this.towers) {
            if (t.type === 'DECORATOR') {
                const dist = Math.abs(t.gridX - tower.gridX) + Math.abs(t.gridY - tower.gridY);
                if (dist === 40) decorators++;
            }
        }
        return 1 + (0.4 * decorators);
    }

    fireTower(tower: Tower, time: number) {
        if (tower.type === 'DECORATOR' || tower.type === 'ADAPTER' || tower.type === 'FACADE') return;
        
        const dmgMod = this.getDamageModifier(tower);
        soundManager.playLaser(tower.type === 'SINGLETON' ? 'heavy' : 'laser');

        if (tower.type === 'OBSERVER') {
            const hasEnemies = this.enemies.some(e => 
                Phaser.Math.Distance.Between(tower.gridX, tower.gridY, e.x, e.y) <= tower.config.range
            );
            if (hasEnemies) {
                tower.lastFired = time;
                this.observerBuffUntil = time + 500;
                
                const circle = this.add.circle(tower.gridX, tower.gridY, 10, 0x3b82f6);
                this.tweens.add({
                    targets: circle,
                    scale: tower.config.range / 10,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => circle.destroy()
                });
            }
            return;
        }

        if (tower.type === 'SINGLETON') {
            const inRange = this.enemies.filter(e => 
                Phaser.Math.Distance.Between(tower.gridX, tower.gridY, e.x, e.y) <= tower.config.range
            );
            if (inRange.length > 0) {
                tower.lastFired = time;
                inRange.sort((a, b) => b.hp - a.hp);
                const target = inRange[0];
                this.attackEnemy(target, tower.config.damage * dmgMod);
                
                const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0xeab308).setOrigin(0);
                line.setLineWidth(3);
                this.tweens.add({
                    targets: line,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => line.destroy()
                });
            }
        } else if (tower.type === 'FACTORY') {
            const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
            if (target) {
                tower.lastFired = time;
                for (let i = 0; i < 2; i++) {
                    const drone = this.add.circle(tower.gridX, tower.gridY, 5, 0xa855f7);
                    this.tweens.add({
                        targets: drone,
                        x: target.x + Phaser.Math.Between(-10, 10),
                        y: target.y + Phaser.Math.Between(-10, 10),
                        duration: 300 + i * 100,
                        onComplete: () => {
                            drone.destroy();
                            if (this.enemies.includes(target)) {
                                this.attackEnemy(target, tower.config.damage * dmgMod);
                            }
                        }
                    });
                }
            }
        } else if (tower.type === 'PROXY') {
            const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
            if (target) {
                tower.lastFired = time;
                this.attackEnemy(target, tower.config.damage * dmgMod);
                
                const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0xf43f5e).setOrigin(0);
                line.setLineWidth(2);
                this.tweens.add({
                    targets: line,
                    alpha: 0,
                    duration: 180,
                    onComplete: () => line.destroy()
                });
            }
        } else if (tower.type === 'BUILDER') {
            const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
            if (target) {
                tower.lastFired = time;
                tower.attackCount++;
                const bonusDmg = Math.min(50, tower.attackCount * 5);
                this.attackEnemy(target, (tower.config.damage + bonusDmg) * dmgMod);
                
                const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0xf59e0b).setOrigin(0);
                line.setLineWidth(3);
                this.tweens.add({
                    targets: line,
                    alpha: 0,
                    duration: 250,
                    onComplete: () => line.destroy()
                });
            }
        } else if (tower.type === 'STATE') {
            tower.lastFired = time;
            tower.attackCount++;
            const isAttackForm = (Math.floor(tower.attackCount / 2) % 2) === 0;

            if (isAttackForm) {
                const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
                if (target) {
                    this.attackEnemy(target, 45 * dmgMod);
                    const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0xec4899).setOrigin(0);
                    this.tweens.add({ targets: line, alpha: 0, duration: 200, onComplete: () => line.destroy() });
                }
            } else {
                const inRange = this.enemies.filter(e => Phaser.Math.Distance.Between(tower.gridX, tower.gridY, e.x, e.y) <= 220);
                if (inRange.length > 0) {
                    inRange.forEach(e => this.attackEnemy(e, 15 * dmgMod));
                    const circle = this.add.circle(tower.gridX, tower.gridY, 10, 0xec4899);
                    this.tweens.add({
                        targets: circle,
                        scale: 220 / 10,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => circle.destroy()
                    });
                }
            }
        } else if (tower.type === 'PROTOTYPE') {
            const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
            if (target) {
                tower.lastFired = time;
                this.attackEnemy(target, tower.config.damage * dmgMod);
                
                const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0x14b8a6).setOrigin(0);
                this.tweens.add({
                    targets: line,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => line.destroy()
                });
            }
        } else if (tower.type === 'STRATEGY') {
            const mode = tower.attackCount % 3;
            let range, dmg, splash;
            if (mode === 0) { range = 250; dmg = 20; splash = false; }
            else if (mode === 1) { range = 100; dmg = 40; splash = false; }
            else { range = 180; dmg = 12; splash = true; }
            
            if (splash) {
                const inRange = this.enemies.filter(e => 
                    Phaser.Math.Distance.Between(tower.gridX, tower.gridY, e.x, e.y) <= range
                );
                if (inRange.length > 0) {
                    tower.lastFired = time;
                    tower.attackCount++;
                    inRange.forEach(e => this.attackEnemy(e, dmg * dmgMod));
                    
                    const circle = this.add.circle(tower.gridX, tower.gridY, 10, 0xf97316);
                    this.tweens.add({
                        targets: circle,
                        scale: range / 10,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => circle.destroy()
                    });
                }
            } else {
                const target = this.getNearestEnemy(tower.gridX, tower.gridY, range);
                if (target) {
                    tower.lastFired = time;
                    tower.attackCount++;
                    this.attackEnemy(target, dmg * dmgMod);
                    
                    const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0xf97316).setOrigin(0);
                    this.tweens.add({
                        targets: line,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => line.destroy()
                    });
                }
            }
        } else if (tower.type === 'CHAIN') {
            const target = this.getNearestEnemy(tower.gridX, tower.gridY, tower.config.range);
            if (target) {
                tower.lastFired = time;
                this.attackEnemy(target, tower.config.damage * dmgMod);
                
                const line = this.add.line(0, 0, tower.gridX, tower.gridY, target.x, target.y, 0x06b6d4).setOrigin(0);
                this.tweens.add({
                    targets: line,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => line.destroy()
                });
                
                const otherChainTowers = this.towers.filter(t => t !== tower && t.type === 'CHAIN');
                if (otherChainTowers.length > 0) {
                    otherChainTowers.sort((a, b) => 
                        Phaser.Math.Distance.Between(tower.gridX, tower.gridY, a.gridX, a.gridY) -
                        Phaser.Math.Distance.Between(tower.gridX, tower.gridY, b.gridX, b.gridY)
                    );
                    const nextChain = otherChainTowers[0];
                    if (Phaser.Math.Distance.Between(tower.gridX, tower.gridY, nextChain.gridX, nextChain.gridY) <= 150) {
                        const chainLine = this.add.line(0, 0, tower.gridX, tower.gridY, nextChain.gridX, nextChain.gridY, 0x06b6d4).setOrigin(0);
                        this.tweens.add({
                            targets: chainLine,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => chainLine.destroy()
                        });
                        if (this.enemies.includes(target)) {
                            this.attackEnemy(target, (tower.config.damage * 0.6) * dmgMod);
                        }
                    }
                }
            }
        }
    }

    getNearestEnemy(x: number, y: number, range: number): Enemy | null {
        let nearest: Enemy | null = null;
        let minDist = range;
        for (const e of this.enemies) {
            const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
            if (dist <= minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    }

    attackEnemy(enemy: Enemy, damage: number) {
        if (!this.enemies.includes(enemy)) return;
        
        // Hit spark effect
        const spark = this.add.circle(enemy.x, enemy.y, 4, 0xffffff);
        this.tweens.add({
            targets: spark,
            scale: 2.5,
            alpha: 0,
            duration: 120,
            onComplete: () => spark.destroy()
        });

        const died = enemy.takeDamage(damage);
        if (died) {
            soundManager.playExplosion();
            
            // Shockwave ring explosion
            const ring = this.add.circle(enemy.x, enemy.y, enemy.config.size / 2, enemy.config.color, 0.8);
            this.tweens.add({
                targets: ring,
                scale: 3,
                alpha: 0,
                duration: 250,
                onComplete: () => ring.destroy()
            });

            if (enemy.config.size > 20) {
                // Boss camera shake
                this.cameras.main.shake(150, 0.008);
            }

            const store = useGameStore.getState();
            store.setMoney(store.money + enemy.config.killReward);
            enemy.destroy();
            const idx = this.enemies.indexOf(enemy);
            if (idx !== -1) {
                this.enemies.splice(idx, 1);
            }
        } else {
            soundManager.playHit();
        }
    }
}
