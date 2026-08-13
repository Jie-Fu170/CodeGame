import { create } from 'zustand'

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR' | 'PRIORITY'

export type TowerType = 'SINGLETON' | 'FACTORY' | 'OBSERVER' | 'DECORATOR' | 'ADAPTER' | 'STRATEGY' | 'CHAIN' | 'PROXY' | 'BUILDER' | 'STATE' | 'PROTOTYPE' | 'FACADE'

interface GameState {
  hp: number
  maxHp: number
  score: number
  algorithm: SchedulingAlgorithm
  isGameOver: boolean
  isVictory: boolean
  aiFeedback: string | null
  
  // Voice Guide State
  voiceEnabled: boolean
  toggleVoice: () => void

  // Pipeline Factory State (1)
  isPipelined: boolean
  stageTimes: { IF: number, ID: number, EX: number }
  pipelineCompleted: number
  pipelineTarget: number
  
  // TCP Handshake State (9)
  tcpState: 'CLOSED' | 'SYN_SENT' | 'ESTABLISHED' | 'FIN_WAIT_1' | 'FIN_WAIT_2' | 'TIME_WAIT'
  expectedSeq: number | null
  expectedAck: number | null
  tcpDataSent: number
  lastServerPacket: string | null
  // Crypto Defense State (10)
  cryptoTasks: Array<{
    id: number
    title: string
    description: string
    steps: Array<{
      instruction: string
      correctKey: string
    }>
  }>
  currentCryptoTaskIndex: number
  currentCryptoStepIndex: number
  cryptoStatus: 'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILED'

  // Tree Mirage State (11)
  bstTasks: Array<{
    id: number
    type: 'SEARCH' | 'INSERT'
    targetValue: number
    title: string
    description: string
  }>
  currentBstTaskIndex: number
  bstCurrentNodeId: number
  bstStatus: 'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILED'

  // Apex of Architecture State (12)
  lbAlgorithm: 'RR' | 'LEAST_CONN' | 'IP_HASH'
  lbTimeLeft: number
  lbWarnings: string[]
  lbStatus: 'IDLE' | 'PLAYING' | 'SUCCESS' | 'FAILED'

  // OS City State (4.1)
  completedProcesses: number
  targetProcesses: number

  // Deadlock State (4.2)
  deadlocksResolved: number
  targetDeadlocks: number

  // TD State (7) - Design Pattern Tower Defense
  money: number
  hasSingleton: boolean
  selectedTowerType: TowerType | null
  wave: number
  maxWaves: number
  showQuiz: boolean
  quizCorrect: boolean | null
  showKnowledgeCard: TowerType | null

  // SQL Combat State (8)
  // Global Map State
  currentLevelId: string | null
  completedLevels: string[]

  sqlQuestions: any[]
  currentQuestionIndex: number
  bossHp: number
  maxBossHp: number
  playerHp: number
  maxPlayerHp: number
  isBossDefeated: boolean
  triggerPlayerAttack: number
  triggerBossAttack: number
  
  // Actions
  setLevel: (levelId: string) => void
  returnToMap: () => void
  completeLevel: (id: string) => void
  setAlgorithm: (alg: SchedulingAlgorithm) => void
  takeDamage: (amount: number) => void
  addScore: (points: number) => void
  completeProcess: () => void
  resolveDeadlock: () => void
  
  // Pipeline Actions
  setIsPipelined: (isPipelined: boolean) => void
  upgradeStage: (stage: 'IF'|'ID'|'EX') => void
  completePipelineTask: () => void
  
  // TD Actions
  setMoney: (amount: number) => void
  setHasSingleton: (has: boolean) => void
  setSelectedTowerType: (type: TowerType | null) => void
  setWave: (wave: number) => void
  setShowQuiz: (show: boolean) => void
  setQuizCorrect: (correct: boolean | null) => void
  setShowKnowledgeCard: (type: TowerType | null) => void

  // TCP Actions
  sendTcpPacket: (type: 'SYN' | 'ACK' | 'FIN' | 'DATA', seq: number, ack: number) => void
  serverReplyTcp: (type: string, seq: number, ack: number) => void
  // Crypto Actions
  submitCryptoKey: (key: string) => void
  nextCryptoTask: () => void

  // BST Actions
  submitBstDirection: (direction: 'LEFT' | 'RIGHT') => void
  nextBstTask: () => void

  // LB Actions
  setLbAlgorithm: (alg: 'RR' | 'LEAST_CONN' | 'IP_HASH') => void
  tickLbTime: () => void
  addLbWarning: (warning: string) => void
  resolveLbWarning: () => void

  gameOver: (victory: boolean, feedback: string) => void
  resetGame: () => void
  
  // SQL Actions
  submitAnswers: (answers: string[]) => void
}

const initialSqlQuestions = [
  {
    task: "查询出所有等级大于 30 级的玩家姓名！",
    schema: "Table: users (id, name, level)",
    template: "SELECT {0} FROM users WHERE {1} > 30",
    blanks: [
      { options: ["???", "name", "id", "*"], correct: "name" },
      { options: ["???", "level", "age", "score"], correct: "level" }
    ],
    hint: "提示：我们需要指定查询字段为 name，条件为 level。"
  },
  {
    task: "冗余数据出现了！找出表里所有重复的邮箱 (email)！",
    schema: "Table: accounts (id, email)",
    template: "SELECT email FROM accounts GROUP BY {0} HAVING {1} > 1",
    blanks: [
      { options: ["???", "email", "id", "name"], correct: "email" },
      { options: ["???", "COUNT(*)", "MAX(email)", "SUM(id)"], correct: "COUNT(*)" }
    ],
    hint: "提示：按邮箱分组使用 GROUP BY email，并用 HAVING COUNT(*) 筛选次数大于1的记录。"
  },
  {
    task: "BOSS 最后的护盾！查询每个部门 (dept_id) 中工资 (salary) 最高的人的名字！",
    schema: "Table: employees (id, name, salary, dept_id)",
    template: "SELECT name FROM employees WHERE (dept_id, salary) {0} (SELECT dept_id, {1} FROM employees {2} dept_id)",
    blanks: [
      { options: ["???", "IN", "=", "EXISTS"], correct: "IN" },
      { options: ["???", "MAX(salary)", "MIN(salary)", "COUNT(salary)"], correct: "MAX(salary)" },
      { options: ["???", "GROUP BY", "ORDER BY", "WHERE"], correct: "GROUP BY" }
    ],
    hint: "提示：主查询通过 IN 匹配子查询的结果；子查询需要用 MAX 查最高工资，并且用 GROUP BY 按部门分组。"
  }
]

export const useGameStore = create<GameState>((set) => ({
  hp: 100,
  maxHp: 100,
  score: 0,
  algorithm: 'FCFS',
  isGameOver: false,
  isVictory: false,
  aiFeedback: null,
  
  voiceEnabled: false,
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),

  // Pipeline defaults
  isPipelined: false,
  stageTimes: { IF: 2000, ID: 4000, EX: 2000 },
  pipelineCompleted: 0,
  pipelineTarget: 20,
  
  // TCP defaults
  tcpState: 'CLOSED',
  expectedAck: null,
  expectedSeq: null,
  tcpDataSent: 0,
  lastServerPacket: null,

  // Crypto defaults
  cryptoTasks: [
    {
      id: 1,
      title: "任务一：机密传输",
      description: "Alice 想发送一份机密合同给 Bob，防止窃听。",
      steps: [
        { instruction: "请选择密钥对【机密数据】进行加密", correctKey: "bob_pub" }
      ]
    },
    {
      id: 2,
      title: "任务二：身份认证",
      description: "Alice 想发布一份公开声明，要求所有人都能验证这是她发的，不可抵赖。",
      steps: [
        { instruction: "请选择密钥对【声明数据】进行数字签名", correctKey: "alice_priv" }
      ]
    },
    {
      id: 3,
      title: "任务三：数字信封 (高难度)",
      description: "Alice 想要发送 10GB 的超大机密视频给 Bob。由于非对称加密太慢，必须使用数字信封！",
      steps: [
        { instruction: "第一步：数据太大，请先选择密钥对【海量视频】进行高效加密", correctKey: "symmetric_key" },
        { instruction: "第二步：对称密钥不能明文传输，请选择密钥对【对称密钥】进行加密（封装数字信封）", correctKey: "bob_pub" }
      ]
    }
  ],
  currentCryptoTaskIndex: 0,
  currentCryptoStepIndex: 0,
  cryptoStatus: 'IDLE',

  // BST defaults
  bstTasks: [
    {
      id: 1,
      type: 'SEARCH',
      targetValue: 25,
      title: "任务一：基础查找",
      description: "追踪 Bug 的信号源，定位目标值 25。"
    },
    {
      id: 2,
      type: 'SEARCH',
      targetValue: 80,
      title: "任务二：深层追踪",
      description: "Bug 藏匿在更深的节点中，定位目标值 80。"
    },
    {
      id: 3,
      type: 'INSERT',
      targetValue: 60,
      title: "任务三：插入新节点",
      description: "为了封印 Bug，我们需要在正确的位置插入新节点 60！"
    }
  ],
  currentBstTaskIndex: 0,
  bstCurrentNodeId: 50, // Root node is 50
  bstStatus: 'IDLE',

  // LB defaults
  lbAlgorithm: 'RR',
  lbTimeLeft: 60,
  lbWarnings: [],
  lbStatus: 'IDLE',

  // OS City defaults
  completedProcesses: 0,
  targetProcesses: 30,
  
  // Deadlock defaults
  deadlocksResolved: 0,
  targetDeadlocks: 5,
  
  // TD defaults
  money: 200,
  hasSingleton: false,
  selectedTowerType: null,
  wave: 0,
  maxWaves: 10,
  showQuiz: false,
  quizCorrect: null,
  showKnowledgeCard: null,
  
  // Global Map defaults
  currentLevelId: null, // Default to map
  completedLevels: (() => {
    try {
      return JSON.parse(localStorage.getItem('code-game-progress') || '[]')
    } catch {
      return []
    }
  })(),

  // SQL Combat defaults
  sqlQuestions: initialSqlQuestions,
  currentQuestionIndex: 0,
  bossHp: 300,
  maxBossHp: 300,
  playerHp: 100,
  maxPlayerHp: 100,
  isBossDefeated: false,
  triggerPlayerAttack: 0,
  triggerBossAttack: 0,

  setLevel: (levelId) => set({ 
    currentLevelId: levelId, 
    isGameOver: false, 
    isVictory: false,
    cryptoStatus: 'PLAYING',
    currentCryptoTaskIndex: 0,
    currentCryptoStepIndex: 0,
    bstStatus: 'PLAYING',
    currentBstTaskIndex: 0,
    bstCurrentNodeId: 50,
    lbAlgorithm: 'RR',
    lbTimeLeft: 60,
    lbWarnings: [],
    lbStatus: 'PLAYING',
    hp: 100,
    money: 200,
    hasSingleton: false,
    selectedTowerType: null,
    wave: 0,
    showQuiz: false,
    quizCorrect: null,
    showKnowledgeCard: null
  }),

  returnToMap: () => set({ currentLevelId: null }),

  completeLevel: (id: string) => set((state) => {
    if (!state.completedLevels.includes(id)) {
      const newCompleted = [...state.completedLevels, id];
      localStorage.setItem('code-game-progress', JSON.stringify(newCompleted));
      return { completedLevels: newCompleted };
    }
    return {};
  }),

  setAlgorithm: (alg) => set({ algorithm: alg }),
  
  takeDamage: (amount) => set((state) => {
    const newHp = Math.max(0, state.hp - amount)
    if (newHp === 0 && !state.isGameOver) {
      const isPipelineLevel = state.currentLevelId === 'pipeline'
      const isDeadlockLevel = state.currentLevelId === 'deadlock'
      const isTDLevel = state.currentLevelId === 'uml-temple'
      const isTCPLevel = state.currentLevelId === 'network-routing'
      
      let feedback = "系统崩溃！当大量短任务堆积时，使用 FCFS 会导致长时间阻塞。尝试切换到 SJF（短作业优先）。"
      if (isPipelineLevel) feedback = "订单超时！串行执行效率太低，或者流水线瓶颈导致指令堆积。尝试开启流水线并升级最慢的环节！"
      if (isDeadlockLevel) feedback = "系统崩溃！死锁爆发导致整个系统僵死（互相等待资源）。必须及时破坏循环等待条件！"
      if (isTDLevel) feedback = "圣殿失守！高耦合怪摧毁了系统核心架构。尝试合理搭配设计模式防御塔！"
      if (isTCPLevel) feedback = "连接被重置 (RST)！您的握手/挥手顺序或序号计算错误，导致服务器强制断开连接。"

      return { 
        hp: 0, 
        isGameOver: true, 
        isVictory: false, 
        aiFeedback: feedback
      }
    }
    return { hp: newHp }
  }),
  
  addScore: (points) => set((state) => ({ score: state.score + points })),
  
  completeProcess: () => set((state) => {
    const newCompleted = state.completedProcesses + 1
    if (newCompleted >= state.targetProcesses && !state.isGameOver) {
      return {
        completedProcesses: newCompleted,
        isGameOver: true,
        isVictory: true,
        aiFeedback: "太棒了！你成功稳定了系统的运行。通过灵活切换调度算法，我们能最大化 CPU 的吞吐量。"
      }
    }
    return { completedProcesses: newCompleted }
  }),

  resolveDeadlock: () => set((state) => {
    const newResolved = state.deadlocksResolved + 1
    if (newResolved >= state.targetDeadlocks && !state.isGameOver) {
      return {
        deadlocksResolved: newResolved,
        isGameOver: true,
        isVictory: true,
        aiFeedback: "太棒了！你像闪电一样切断了死锁的循环等待链条，挽救了整个操作系统都市！"
      }
    }
    // Heal a bit
    const newHp = Math.min(state.maxHp, state.hp + 10)
    return { deadlocksResolved: newResolved, score: state.score + 200, hp: newHp }
  }),

  // Pipeline Logic
  setIsPipelined: (isPipelined) => set({ isPipelined }),
  upgradeStage: (stage) => set((state) => {
    // Upgrading reduces time by 2000ms, minimum 1000ms
    const cost = 50
    if (state.money < cost) return state
    
    const newTimes = { ...state.stageTimes }
    newTimes[stage] = Math.max(1000, newTimes[stage] - 2000)
    
    return { stageTimes: newTimes, money: state.money - cost }
  }),
  completePipelineTask: () => set((state) => {
    const newCompleted = state.pipelineCompleted + 1
    if (newCompleted >= state.pipelineTarget && !state.isGameOver) {
      return {
        pipelineCompleted: newCompleted,
        isGameOver: true,
        isVictory: true,
        aiFeedback: "太棒了！你成功打破了流水线的瓶颈。现在的指令就像丝绸一样顺滑流淌，满载运行！"
      }
    }
    return { pipelineCompleted: newCompleted, score: state.score + 10, money: state.money + 5 }
  }),

  setMoney: (amount) => set({ money: amount }),
  setHasSingleton: (has) => set({ hasSingleton: has }),
  setSelectedTowerType: (type) => set({ selectedTowerType: type }),
  setWave: (wave) => set({ wave }),
  setShowQuiz: (show) => set({ showQuiz: show, quizCorrect: null }),
  setQuizCorrect: (correct) => set({ quizCorrect: correct }),
  setShowKnowledgeCard: (type) => set({ showKnowledgeCard: type }),

  // TCP Logic
  sendTcpPacket: (type, seq, ack) => set((state) => {
    let valid = false
    let nextState = state.tcpState
    let nextExpectedAck = state.expectedAck
    let nextExpectedSeq = state.expectedSeq
    let nextDataSent = state.tcpDataSent

    if (state.tcpState === 'CLOSED' && type === 'SYN') {
      // 第一次握手: 发送 SYN
      valid = true
      nextState = 'SYN_SENT'
      nextExpectedAck = seq + 1
    } 
    else if (state.tcpState === 'SYN_SENT' && type === 'ACK' && seq === state.expectedSeq && ack === state.expectedAck) {
      // 第三次握手: 收到 SYN-ACK 后发送 ACK
      valid = true
      nextState = 'ESTABLISHED'
    }
    else if (state.tcpState === 'ESTABLISHED' && type === 'DATA' && seq === state.expectedSeq && ack === state.expectedAck) {
      // 数据传输阶段
      valid = true
      nextDataSent += 100
      nextExpectedSeq = state.expectedSeq! + 100
      // ack doesn't change when sending data, wait for server to ack it
    }
    else if (state.tcpState === 'ESTABLISHED' && type === 'FIN' && seq === state.expectedSeq && ack === state.expectedAck) {
      // 四次挥手: 主动断开 (FIN 1)
      valid = true
      nextState = 'FIN_WAIT_1'
      nextExpectedAck = seq + 1 // My own sequence increments
    }
    else if (state.tcpState === 'FIN_WAIT_2' && type === 'ACK' && seq === state.expectedSeq && ack === state.expectedAck) {
      // 四次挥手: 回复服务器的 FIN (ACK 4)
      valid = true
      nextState = 'TIME_WAIT'
    }

    if (!valid) {
      // Wrong packet or sequence!
      const newHp = Math.max(0, state.hp - 30)
      if (newHp === 0 && !state.isGameOver) {
        return { 
          hp: 0, 
          isGameOver: true, 
          isVictory: false, 
          aiFeedback: "连接被重置 (RST)！您的握手/挥手顺序或序号计算错误，导致服务器强制断开连接。"
        }
      }
      // Reset connection
      return { 
        hp: newHp, 
        tcpState: 'CLOSED',
        expectedAck: null,
        expectedSeq: null,
        tcpDataSent: 0,
        lastServerPacket: null
      }
    }

    return { 
      tcpState: nextState, 
      expectedAck: nextExpectedAck, 
      expectedSeq: nextExpectedSeq,
      tcpDataSent: nextDataSent
    }
  }),

  serverReplyTcp: (type, seq, ack) => set((state) => {
    let nextState = state.tcpState
    let nextExpectedSeq = state.expectedSeq
    let nextExpectedAck = state.expectedAck
    const packetLabel = `[${type.replace('_', '-')}] seq=${seq} ack=${ack}`

    if (type === 'SYN_ACK' && state.tcpState === 'SYN_SENT') {
      nextExpectedSeq = ack
      nextExpectedAck = seq + 1
    }
    else if (type === 'ACK' && state.tcpState === 'FIN_WAIT_1') {
      nextState = 'FIN_WAIT_2'
      nextExpectedSeq = ack
      nextExpectedAck = seq
    }
    else if (type === 'ACK' && state.tcpState === 'ESTABLISHED') {
      nextExpectedSeq = ack
      nextExpectedAck = seq
    }
    else if (type === 'FIN' && state.tcpState === 'FIN_WAIT_2') {
      nextExpectedSeq = ack
      nextExpectedAck = seq + 1
    }

    let isGameOver = false
    let isVictory = false
    let aiFeedback = null

    // Win condition check
    if (state.tcpState === 'TIME_WAIT') {
      isGameOver = true
      isVictory = true
      aiFeedback = "恭喜！您完美执行了 TCP 三次握手、数据传输、以及四次挥手！您的网络基础无比坚实！"
    }

    return {
      tcpState: nextState,
      expectedSeq: nextExpectedSeq,
      expectedAck: nextExpectedAck,
      lastServerPacket: packetLabel,
      isVictory,
      isGameOver,
      aiFeedback
    }
  }),

  submitCryptoKey: (key) => set((state) => {
    if (state.cryptoStatus !== 'PLAYING') return state
    
    const task = state.cryptoTasks[state.currentCryptoTaskIndex]
    const step = task.steps[state.currentCryptoStepIndex]
    
    if (key === step.correctKey) {
      // Correct!
      if (state.currentCryptoStepIndex + 1 < task.steps.length) {
        // Move to next step
        return { currentCryptoStepIndex: state.currentCryptoStepIndex + 1 }
      } else {
        // Task completed
        const isLastTask = state.currentCryptoTaskIndex === state.cryptoTasks.length - 1
        return { 
          cryptoStatus: 'SUCCESS',
          isGameOver: isLastTask,
          isVictory: isLastTask,
          aiFeedback: isLastTask ? "太棒了！您成功掌握了单向加密、数字签名以及最高级的数字信封技术！密码学大师诞生！" : null
        }
      }
    } else {
      // Wrong!
      const newHp = Math.max(0, state.hp - 30)
      if (newHp === 0 && !state.isGameOver) {
        return {
          hp: 0,
          isGameOver: true,
          isVictory: false,
          aiFeedback: "密钥选择错误！数据已被黑客截获，导致机密泄露！请牢记：公钥加密，私钥解密；私钥签名，公钥验证。"
        }
      }
      return { hp: newHp, cryptoStatus: 'FAILED' }
    }
  }),

  nextCryptoTask: () => set((state) => {
    if (state.currentCryptoTaskIndex + 1 < state.cryptoTasks.length) {
      return {
        currentCryptoTaskIndex: state.currentCryptoTaskIndex + 1,
        currentCryptoStepIndex: 0,
        cryptoStatus: 'PLAYING'
      }
    }
    return state
  }),

  submitBstDirection: (direction) => set((state) => {
    if (state.bstStatus !== 'PLAYING') return state

    const task = state.bstTasks[state.currentBstTaskIndex]
    
    // We hardcode the BST structure for this level
    /*
             50
           /    \
         30      70
        /  \    /  \
      20   40  65   80
       \
       25
    */
    const bstMap: Record<number, { left: number | null, right: number | null }> = {
      50: { left: 30, right: 70 },
      30: { left: 20, right: 40 },
      70: { left: 65, right: 80 },
      20: { left: null, right: 25 },
      40: { left: null, right: null },
      65: { left: null, right: null },
      80: { left: null, right: null },
      25: { left: null, right: null }
    }

    const currentVal = state.bstCurrentNodeId
    const targetVal = task.targetValue

    // Determine correct direction
    let correctDirection: 'LEFT' | 'RIGHT' | null = null
    if (targetVal < currentVal) correctDirection = 'LEFT'
    else if (targetVal > currentVal) correctDirection = 'RIGHT'

    if (direction === correctDirection) {
      // Correct!
      const nextNode = direction === 'LEFT' ? bstMap[currentVal].left : bstMap[currentVal].right
      
      if (nextNode !== null) {
        // Just move to the next node
        if (task.type === 'SEARCH' && nextNode === targetVal) {
          // Found it!
          const isLastTask = state.currentBstTaskIndex === state.bstTasks.length - 1
          return {
            bstCurrentNodeId: nextNode,
            bstStatus: 'SUCCESS',
            isGameOver: isLastTask,
            isVictory: isLastTask,
            aiFeedback: isLastTask ? "完美！您不仅掌握了 BST 查找，还学会了叶子插入！" : null
          }
        }
        return { bstCurrentNodeId: nextNode }
      } else {
        // It's a leaf node. 
        if (task.type === 'INSERT') {
          // Reached where it should be inserted!
          const isLastTask = state.currentBstTaskIndex === state.bstTasks.length - 1
          return {
            bstStatus: 'SUCCESS',
            isGameOver: isLastTask,
            isVictory: isLastTask,
            aiFeedback: isLastTask ? "完美！您不仅掌握了 BST 查找，还学会了叶子插入！" : null
          }
        }
      }
    }

    // Wrong direction!
    const newHp = Math.max(0, state.hp - 30)
    if (newHp === 0 && !state.isGameOver) {
      return {
        hp: 0,
        isGameOver: true,
        isVictory: false,
        aiFeedback: "二叉查找树原则：左子树 < 根 < 右子树！您选错了方向，导致探针坠入数据深渊！"
      }
    }
    return { hp: newHp, bstStatus: 'FAILED' }
  }),

  nextBstTask: () => set((state) => {
    if (state.currentBstTaskIndex + 1 < state.bstTasks.length) {
      return {
        currentBstTaskIndex: state.currentBstTaskIndex + 1,
        bstCurrentNodeId: 50,
        bstStatus: 'PLAYING'
      }
    }
    return state
  }),

  setLbAlgorithm: (alg) => set({ lbAlgorithm: alg }),
  
  tickLbTime: () => set((state) => {
    if (state.lbStatus !== 'PLAYING') return state
    const newTime = state.lbTimeLeft - 1
    if (newTime <= 0) {
      return { lbTimeLeft: 0, lbStatus: 'SUCCESS', isGameOver: true, isVictory: true }
    }
    return { lbTimeLeft: newTime }
  }),

  addLbWarning: (warning) => set((state) => ({ 
    lbWarnings: [...state.lbWarnings, warning] 
  })),

  resolveLbWarning: () => set((state) => ({
    lbWarnings: state.lbWarnings.slice(1)
  })),

  gameOver: (victory, feedback) => set({ isGameOver: true, isVictory: victory, aiFeedback: feedback }),
  
  resetGame: () => set((state) => ({
    hp: 100,
    score: 0,
    algorithm: 'FCFS',
    isGameOver: false,
    isVictory: false,
    aiFeedback: null,
    completedProcesses: 0,
    deadlocksResolved: 0,
    pipelineCompleted: 0,
    money: 200,
    hasSingleton: false,
    selectedTowerType: null,
    wave: 0,
    showQuiz: false,
    quizCorrect: null,
    showKnowledgeCard: null,
    tcpState: 'CLOSED',
    expectedAck: null,
    expectedSeq: null,
    tcpDataSent: 0,
    lastServerPacket: null,
    currentQuestionIndex: 0,
    bossHp: state.maxBossHp,
    playerHp: state.maxPlayerHp,
    isBossDefeated: false,
    currentCryptoTaskIndex: 0,
    currentCryptoStepIndex: 0,
    cryptoStatus: 'PLAYING',
    currentBstTaskIndex: 0,
    bstCurrentNodeId: 50,
    bstStatus: 'PLAYING',
    lbAlgorithm: 'RR',
    lbTimeLeft: 60,
    lbWarnings: [],
    lbStatus: 'PLAYING'
  })),

  submitAnswers: (answers) => set((state) => {
    const question = state.sqlQuestions[state.currentQuestionIndex]
    
    // Check if all answers are correct
    let isCorrect = true
    for (let i = 0; i < question.blanks.length; i++) {
      if (answers[i] !== question.blanks[i].correct) {
        isCorrect = false
        break
      }
    }
    
    if (isCorrect) {
      // Correct!
      const newBossHp = Math.max(0, state.bossHp - 100)
      const nextIndex = state.currentQuestionIndex + 1
      const isDefeated = newBossHp <= 0

      if (isDefeated) {
        return {
          bossHp: 0,
          isBossDefeated: true,
          triggerPlayerAttack: Date.now(),
          isGameOver: true,
          isVictory: true,
          aiFeedback: "太强了！你用精妙的 SQL 彻底清除了冗余数据，数据库海洋恢复了宁静！"
        }
      }

      return {
        bossHp: newBossHp,
        currentQuestionIndex: nextIndex,
        triggerPlayerAttack: Date.now(),
        aiFeedback: null // clear error
      }
    } else {
      // Incorrect!
      const newHp = Math.max(0, state.playerHp - 30)
      if (newHp <= 0) {
        return {
          playerHp: 0,
          triggerBossAttack: Date.now(),
          isGameOver: true,
          isVictory: false,
          aiFeedback: "你的 SQL 语法有误，或者没有满足需求。被魔王的数据流吞没了！\n\n" + question.hint
        }
      }
      return {
        playerHp: newHp,
        triggerBossAttack: Date.now(),
        aiFeedback: "SQL 执行失败！\n\n" + question.hint
      }
    }
  })
}))
