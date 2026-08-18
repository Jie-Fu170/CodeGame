import { } from 'react';

export interface GameLevel {
  id: string;
  title: string;
  category: string;
  description: string;
  sceneKey?: string;
  hudComponent: string;
  themeColor: string;
  isNew?: boolean;
  isPremium?: boolean;
  engine?: 'phaser' | 'react';
  instructions?: string[];
}

export const LEVEL_CATEGORIES = {
  COMPUTER_ORG: '计算机组成原理',
  OS: '操作系统',
  NETWORK: '计算机网络',
  DATABASE: '数据库',
  DATA_STRUCTURE: '数据结构与算法',
  DESIGN_PATTERN: '设计模式',
  SECURITY: '信息安全',
  ARCHITECTURE: '系统架构',
  SOFTWARE_ENG: '软件工程',
  SELF_STUDY: '自考公共课'
};

export const LEVELS: GameLevel[] = [
  // --- 原有 Phaser 游戏 ---
  {
    id: 'pipeline',
    title: '指令流水线',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '深入CPU内部，管理指令流水线，优化执行效率',
    sceneKey: 'PipelineScene',
    hudComponent: 'PipelineHUD',
    themeColor: 'indigo',
    engine: 'phaser',
    instructions: [
      '管理 CPU 中的指令执行顺序与流水线瓶颈。',
      '观察阶段(IF/ID/EX)的耗时，通过升级瓶颈处理中心来提升指令吞吐率。',
      '在串行与流水线模式间切换，体验流水线重叠执行带来的性能飞跃！'
    ]
  },
  {
    id: 'cpu-scheduling',
    title: '进程调度算法',
    category: LEVEL_CATEGORIES.OS,
    description: '化身系统内核，合理分配CPU时间片，避免进程饥饿',
    sceneKey: 'OSCityScene',
    hudComponent: 'HUD',
    themeColor: 'blue',
    engine: 'phaser',
    instructions: [
      '你的目标是让系统吞吐量最大化，同时避免进程饥饿。',
      '注意观察左侧的“等待队列”，如果有大量短任务堆积，请尝试将调度算法切换为 SJF (短作业优先)。',
      '如果有长任务长时间得不到执行，请切换为 RR (时间片轮转) 或 FCFS。',
      '只有让右上角的“已完成进程”达到目标数量，才能通关！'
    ]
  },
  {
    id: 'deadlock',
    title: '死锁解除',
    category: LEVEL_CATEGORIES.OS,
    description: '识别资源分配图中的循环等待，并通过撤销进程解除死锁',
    sceneKey: 'DeadlockScene',
    hudComponent: 'HUD',
    themeColor: 'red',
    engine: 'phaser',
    instructions: [
      '系统中出现了多个互相等待资源的进程，形成了“死锁”。',
      '本关采用死锁恢复策略：点击红框进程，撤销该进程占有/请求的资源边，从而破坏“循环等待”条件。',
      '这与银行家算法的死锁避免不同；请及时处理红色报警节点，防止系统崩溃！'
    ]
  },
  {
    id: 'uml-temple',
    title: 'GoF 设计模式与 UML 架构',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '部署7种GoF设计模式防御塔，在波间答题与UML重构中深度掌握设计模式核心考点',
    sceneKey: 'UMLTempleScene',
    hudComponent: 'TowerHUD',
    themeColor: 'purple',
    engine: 'phaser',
    isPremium: true,
    instructions: [
      '选择底部的设计模式塔，点击网格空地建造。',
      '每种塔的能力映射真实设计模式的核心语义。',
      '每波怪物清空后会弹出知识答题，答对额外奖励30金币。',
      '放置塔时会显示该模式的知识卡片，帮助你记忆。',
      '合理搭配7种模式，抵挡10波Bug入侵！'
    ]
  },
  {
    id: 'sql-battle',
    title: 'SQL注入攻防',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '抵御恶意注入攻击，编写安全的数据库查询语句',
    sceneKey: 'SQLBattleScene',
    hudComponent: 'SQLConsole',
    themeColor: 'purple',
    engine: 'phaser',
    instructions: [
      '面对 Boss 的 SQL 注入攻击，补全正确的防注入与安全查询语句。',
      '选择正确的 SQL 关键字填空，拼接安全的预编译/过滤查询。',
      '击败 Boss，守卫数据库安全！'
    ]
  },
  {
    id: 'network-routing',
    title: 'TCP/IP 协议栈',
    category: LEVEL_CATEGORIES.NETWORK,
    description: '组装数据包，建立三次握手，建立可靠传输',
    sceneKey: 'NetworkScene',
    hudComponent: 'NetworkHUD',
    themeColor: 'emerald',
    engine: 'phaser',
    instructions: [
      '模拟 TCP 三次握手与四次挥手过程。',
      '根据当前 FSM 状态机，选择发送 SYN、ACK、FIN 或 DATA 报文。',
      '完成正确的报文交互，成功建立与终止网络连接。'
    ]
  },
  {
    id: 'crypto-defense',
    title: '非对称加密',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '利用公钥私钥体系，保卫核心数据安全',
    sceneKey: 'CryptoScene',
    hudComponent: 'CryptoHUD',
    themeColor: 'indigo',
    engine: 'phaser',
    instructions: [
      '学习公钥加密、私钥解密以及数字签名的核心机制。',
      '针对防窃听与防篡改任务，选择正确匹配的密钥对。',
      '依次完成加密与解密流程，保护核心机密数据。'
    ]
  },
  {
    id: 'binary-tree',
    title: '二叉树遍历',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '穿梭于森林迷宫，用深度优先探索未知节点',
    sceneKey: 'TreeScene',
    hudComponent: 'TreeHUD',
    themeColor: 'cyan',
    engine: 'phaser',
    instructions: [
      '用深度优先 (DFS) 或广度优先 (BFS) 遍历二叉搜索树 (BST)。',
      '在搜索或插入节点任务中，根据节点值大小选择向左子树或右子树移动。',
      '成功定位目标数值或找到正确的插入位置即可完成任务。'
    ]
  },
  {
    id: 'load-balancer',
    title: '高并发负载均衡',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '应对洪峰流量，动态扩容服务器，保持系统高可用',
    sceneKey: 'LoadBalancerScene',
    hudComponent: 'LoadBalancerHUD',
    themeColor: 'yellow',
    engine: 'phaser',
    instructions: [
      '面对高并发洪峰流量，合理选择负载均衡算法 (轮询 / 最少连接 / IP哈希)。',
      '观察各个节点的实时 CPU 负载与连接数，避免单节点过载宕机。',
      '支撑过指定时间倒计时，保持高可用状态通关。'
    ]
  },
  
  // --- 新增纯 React 游戏 ---
  {
    id: 'algorithm-duel',
    title: '算法排序决斗场',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '用复杂度最匹配的算法打倒每一波数据怪',
    hudComponent: 'AlgorithmDuel',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '怪物会带有不同的数据规模 (N) 和特征。',
      '选择合适的排序算法 (如冒泡、快排、归并) 来应对它们。',
      '如果算法的复杂度太高，你会受到伤害！'
    ]
  },
  {
    id: 'bankers-maze',
    title: '银行家迷宫',
    category: LEVEL_CATEGORIES.OS,
    description: '死锁避免策略，找到安全序列逃出生天',
    hudComponent: 'BankersMaze',
    themeColor: 'red',
    engine: 'react',
    isNew: true,
    instructions: [
      '利用银行家算法计算系统的安全性。',
      '判断分配请求后，系统是否依然存在可行安全序列 (Safe Sequence)。',
      '选择能安全避开死锁的分配路径通关。'
    ]
  },
  {
    id: 'cipher-workshop',
    title: '密码工坊',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '制作并匹配加密密钥，完成信息安全保卫任务',
    hudComponent: 'CipherWorkshop',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '学习对称加密与非对称加密算法的密钥匹配规则。',
      '根据算法类型匹配对应的秘钥对与加解密流程。',
      '完成加密校验通关。'
    ]
  },
  {
    id: 'critical-path',
    title: '关键路径远征',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '管理项目进度，找出关键路径以最短时间完成任务',
    hudComponent: 'CriticalPathExpedition',
    themeColor: 'orange',
    engine: 'react',
    isNew: true,
    instructions: [
      '分析项目 AOE 网中的各个活动节点与其紧前关系。',
      '计算各个事件的最早发生时间 ES 和最迟发生时间 LS。',
      '找出总时差为 0 的关键路径，确定项目的最短工期。'
    ]
  },
  {
    id: 'design-pattern-td-react',
    title: '设计模式塔防 (React版)',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '使用设计模式防守怪物，纯UI交互体验版',
    hudComponent: 'DesignPatternTD',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    isPremium: true,
    instructions: [
      '点击下方设计模式卡片在网格上建造防御塔。',
      '利用单例模式、工厂模式、观察者模式等的特定能力抵御 Bug。',
      '抵御所有波次怪物，守护核心系统。'
    ]
  },
  {
    id: 'pipeline-factory-react',
    title: '流水线工厂 (React版)',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '优化指令执行流水线，突破性能瓶颈',
    hudComponent: 'PipelineFactory',
    themeColor: 'blue',
    engine: 'react',
    isNew: true,
    instructions: [
      '点击两张指令卡互换位置，调整指令执行顺序。',
      '带有依赖箭头的指令顺序不能颠倒。',
      '将无依赖的独立指令（如 MUL、AND）插到有依赖的指令之间，消灭流水线停顿气泡。',
      '将停顿周期压缩至理论最小值（3星）即可通关。'
    ]
  },
  {
    id: 'pseudocode-forge',
    title: '伪代码熔炉',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '填补算法伪代码，完成数据结构的终极铸造',
    hudComponent: 'PseudocodeForge',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '填补常见算法与数据结构的伪代码空缺。',
      '理解循环条件、指针移动与边界控制。',
      '补全代码完成铸造。'
    ]
  },
  {
    id: 'sql-assembly-bench',
    title: 'SQL装配台',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '拼接SQL语句片段，完成数据查询任务',
    hudComponent: 'SQLAssemblyBench',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '将分散的 SQL 语法片段按逻辑顺序拼装。',
      '注意 WHERE, GROUP BY, HAVING, ORDER BY 的语法限制。',
      '构造出符合需求的 SQL 语句。'
    ]
  },
  {
    id: 'subnet-territory',
    title: '子网领地划分',
    category: LEVEL_CATEGORIES.NETWORK,
    description: '根据IP和掩码，精确划分网络子网领地',
    hudComponent: 'SubnetTerritory',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '根据给定的 IP 地址与子网掩码 CIDR 标记。',
      '计算网络地址、广播地址、可分配 IP 范围及子网数量。',
      '完成精确的子网分割。'
    ]
  },
  // --- 新增 GDD_LEVELS_19_33 关卡 ---
  {
    id: 'hamming-agent',
    title: '海明码特工',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '植入 parity 校验位，并利用指错字实施纠错。',
    hudComponent: 'HammingAgent',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      'Phase 1: 依据偶校验公式 (异或^)，计算放置在 2^k 位置的校验位 P1, P2, P4, P8。',
      'Phase 2: 面对被翻转的数据流，重新计算指错字 G8 G4 G2 G1。',
      '将 G8 G4 G2 G1 二进制转换成十进制数字，即可定位被翻转的比特位置并实施纠错！'
    ]
  },
  {
    id: 'cache-master',
    title: '存储 Cache 物语',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '组相联映射与 LRU 替换策略实战。',
    hudComponent: 'CacheMaster',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '学习组相联映射 (Set-Associative Mapping) 的标记 Tag、组号 Index、块内地址 Offset 计算。',
      '结合 LRU (最近最少使用) 算法更新 Cache 槽位。',
      '提高 Cache 命中率通关。'
    ]
  },
  {
    id: 'dfa-maze',
    title: '有限自动机 DFA 迷宫',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '识别正规式 0(0|1)*1 的状态流转',
    hudComponent: 'DFAMaze',
    themeColor: 'blue',
    engine: 'react',
    isNew: true,
    instructions: [
      '根据正规式 (如 0(0|1)*1) 的状态转移图。',
      '输入字符序列，观察初态 S0 到终态的转移路线。',
      '确保终态为接受状态即可走出迷宫。'
    ]
  },
  {
    id: 'unix-inode',
    title: 'UNIX 磁盘多级索引寻宝',
    category: LEVEL_CATEGORIES.OS,
    description: '计算直接与间接物理块索引偏移量',
    hudComponent: 'UnixInode',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '计算直接索引、一级间接索引、二级间接索引能寻址的最大逻辑块。',
      '根据逻辑字节偏移量，换算出对应的磁盘物理块号。'
    ]
  },
  {
    id: 'path-finder',
    title: '路径漫游指南',
    category: LEVEL_CATEGORIES.OS,
    description: 'Linux 相对路径与绝对路径实战训练',
    hudComponent: 'PathFinder',
    themeColor: 'green',
    engine: 'react',
    isNew: true,
    instructions: [
      '学习 Linux 绝对路径 (/) 与相对路径 (., ..) 的变换规则。',
      '根据当前工作目录，写出到达目标文件的最简路径。'
    ]
  },
  {
    id: 'white-box-explorer',
    title: '控制流图与白盒测试染色',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '通过输入参数，达成 100% 判定覆盖率与基本条件覆盖率。',
    hudComponent: 'WhiteBoxExplorer',
    themeColor: 'pink',
    engine: 'react',
    isNew: true,
    instructions: [
      '分析程序的控制流图 (CFG) 与条件分支。',
      '设计测试用例输入参数，覆盖 True/False 两个判定分支，并使 A、B 两个基本条件均取到真、假。'
    ]
  },
  {
    id: 'dfd-inspector',
    title: '数据流图 DFD 故障检修师',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '修复 DFD 中的"黑洞"与"奇迹"加工错误',
    hudComponent: 'DFDInspector',
    themeColor: 'orange',
    engine: 'react',
    isNew: true,
    instructions: [
      '检查数据流图 (DFD) 中的加工逻辑。',
      '找出并修复"黑洞"(只有输入没有输出)和"奇迹"(只有输出没有输入)等语法错误。'
    ]
  },
  {
    id: 'uml-state-machine',
    title: '自动售货机：UML 逻辑调试器',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '修复自动售货机的状态机转移错误',
    hudComponent: 'UMLStateMachine',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '检查 UML 状态机图的事件 (Event)、条件 (Guard) 与动作 (Action)。',
      '修复状态转移漏洞，使自动售货机逻辑严密。'
    ]
  },
  {
    id: 'dp-knapsack',
    title: '0-1 背包大盗',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '局部最优(贪心) vs 全局最优(动态规划)',
    hudComponent: 'DPKnapsack',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '对比贪心算法与动态规划 (DP) 状态转移方程。',
      '填补 DP 状态表 dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])。',
      '求出在容量限制下的最大价值。'
    ]
  },
  {
    id: 'db-normalizer',
    title: '数据库范式收纳整理狂',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '消除更新异常，将数据规范化至 3NF！',
    hudComponent: 'DBNormalizer',
    themeColor: 'blue',
    engine: 'react',
    isNew: true,
    isPremium: true,
    instructions: [
      '理解 1NF, 2NF, 3NF 的定义与消除传递函数依赖。',
      '将冗余的非主属性拆分至正确的独立关系表。'
    ]
  },
  {
    id: 'float-operator',
    title: '浮点数极速对阶工厂',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: 'IEEE 754 浮点数加法对阶与移位',
    hudComponent: 'FloatOperator',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      'IEEE 754 浮点数加减法实战。',
      '小阶看齐大阶，对阶时尾数右移，求和后规格化与舍入。'
    ]
  },
  {
    id: 'reliability-architect',
    title: '可靠度大厦架构师',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '计算串并联混合系统架构的总可靠度',
    hudComponent: 'ReliabilityArchitect',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '计算系统可靠度：串行系统 R = R1 * R2，并行系统 R = 1 - (1-R1)(1-R2)。',
      '设计符合最低可靠度指标的混合系统架构。'
    ]
  },
  {
    id: 'matrix-compressor',
    title: '压缩矩阵一维收纳盒',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '二维下三角矩阵向一维数组的地址映射',
    hudComponent: 'MatrixCompressor',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '本关采用 1 基数组下标，推导下三角矩阵压缩公式 k = i(i-1)/2 + j；若数组从 0 开始，则索引 k0 = k - 1。',
      '将二维坐标 (i, j) 映射到一维数组下标 k。'
    ]
  },
  {
    id: 'mccabe-surveyor',
    title: 'McCabe 环路复杂度勘测员',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '通过点边公式和判定节点公式计算 V(G)',
    hudComponent: 'McCabeSurveyor',
    themeColor: 'fuchsia',
    engine: 'react',
    isNew: true,
    isPremium: true,
    instructions: [
      '计算程序图环路复杂度 V(G) = m - n + 2p (边数 - 节点数 + 2) 或 V(G) = P + 1 (判定节点数 + 1)。',
      '准确求出线性无关的独立路径条数。'
    ]
  },
  {
    id: 'ip-judge',
    title: '知识产权大法庭',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '为不同的软件侵权纠纷指明正确的知识产权类型',
    hudComponent: 'IPJudge',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '区分著作权(版权)、专利权、商标权与商业秘密。',
      '为软件侵权案例与职务开发成果做出正确的法律归属判定。'
    ]
  },
  {
    id: 'normalization-vein',
    title: '范式矿脉炼金',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '把 1NF 原始订单表拆成 3NF，消除更新异常',
    hudComponent: 'NormalizationVein',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '顶部是未规范化的 1NF 原始表，红字标出了重复的冗余数据。',
      '把 8 个字段分别分配进订单表、客户表、商品表、订单明细表 4 张表。',
      '同一个字段可以出现在多张表中（外键）。判断依据：这个字段是被"谁"唯一决定的。',
      '分错时表会抖动并给出提示，全部拆分正确即通关。'
    ]
  },
  {
    id: 'uml-design-bench',
    title: 'UML 设计台',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '给图书馆管理系统的每条连线判定正确的 UML 关系',
    hudComponent: 'UmlDesignBench',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '点击图中带"?"的连线，为它选择正确的 UML 关系类型。',
      '判断依据：会不会随整体一起消失（组合）、能否脱离整体独立存在（聚合）、是不是临时借用（依赖）。',
      '"是一种"用泛化(继承)，接口的落地用实现，箭头形状和虚实线都要区分。',
      '全部 7 条关系判定正确即通关。'
    ]
  },
  {
    id: 'osi-encapsulator',
    title: 'OSI 七层封装车间',
    category: LEVEL_CATEGORIES.NETWORK,
    description: 'TCP/IP 协议栈数据封装、拆包与网络设备解包界限实战',
    hudComponent: 'OSIEncapsulator',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '阶段 1: 模拟发送端数据封装，按自顶向下 (Application -> Physical) 顺序添加协议头。',
      '阶段 2: 模拟接收端数据解包，按自底向上 (Physical -> Application) 顺序剥离校验头部。',
      '阶段 3: 识别二层交换机 (L2)、三层路由器 (L3) 与应用网关 (L7) 的最高解包处理边界。'
    ]
  },
  {
    id: 'pv-semaphore',
    title: 'PV 信号量交通局',
    category: LEVEL_CATEGORIES.OS,
    description: '信号量 P/V 操作与进程互斥、同步、死锁避坑实战',
    hudComponent: 'PVSemaphore',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '阶段 1: 单行桥临界区互斥，体验 P(wait) 与 V(signal) 对信号量 Mutex 数值的改变及阻塞队列管理。',
      '阶段 2: 生产者-消费者缓冲区同步，掌握 empty, full, mutex 3 个信号量的标准 PV 顺序。',
      '阶段 3: 诊断死锁产生原因（如带锁阻塞）与最小不发生死锁资源数的计算公式。'
    ]
  },
  {
    id: 'relational-algebra',
    title: '关系代数拼图',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '选择 σ、投影 π、自然连接 ⋈ 关系运算拼图实战',
    hudComponent: 'RelationalAlgebra',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '阶段 1: 选择运算 σ (Sigma)，行筛选符合条件元组。',
      '阶段 2: 投影运算 π (Pi)，列挑选目标属性。',
      '阶段 3: 自然连接 ⋈ 与笛卡尔积 × 的区别辩析。'
    ]
  },
  {
    id: 'disk-scheduler',
    title: '磁盘调度算法磁头车间',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: 'FCFS 先来先服务、SSTF 最短寻道、SCAN 电梯算法磁头寻道',
    hudComponent: 'DiskScheduler',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '模拟执行 FCFS (先来先服务)、SSTF (最短寻道时间优先) 与 SCAN (电梯扫描算法)。',
      '观察磁头在 0~199 磁道间的移动轨迹，对比算出的总寻道磁道数。'
    ]
  },
  {
    id: 'infix-to-postfix',
    title: '逆波兰式与表达式树工厂',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '中缀表达式转后缀表达式 (逆波兰式) 运算符栈压入弹出',
    hudComponent: 'InfixToPostfix',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '操作数直接输出到结果序列。',
      '运算符与括号压入运算符栈，利用优先级与括号匹配控制出栈顺序。'
    ]
  },
  {
    id: 'hash-table-clash',
    title: '哈希冲突与散列表收纳',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '开放定址线性探测法与拉链法 (Chaining) 解决哈希冲突',
    hudComponent: 'HashTableClash',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '计算 H(key) = key % 7 哈希值。',
      '体验开放定址法 (线性探测 Hi=(H(k)+i)%m) 与拉链法 (Chaining) 挂载链表处理冲突的过程。'
    ]
  },
  {
    id: 'min-spanning-tree',
    title: '图论最小生成树工程',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: 'Prim 算法与 Kruskal 算法生成最小生成树 (MST)',
    hudComponent: 'MinSpanningTree',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '体验 Kruskal 算法按权值升序选边且避开回路。',
      '体验 Prim 算法切面加点挑选最小连接权值。'
    ]
  },
  {
    id: 'io-registers',
    title: 'I/O 控制与 CPU 寄存器探秘',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: 'PC/IR/MAR/MDR 取指周期与程序查询、中断驱动、DMA 控制权转移',
    hudComponent: 'IORegisters',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '阶段 1: 指令在 PC -> MAR -> RAM -> MDR -> IR 间流动的取指过程。',
      '阶段 2: 辩析程序查询、中断驱动与 DMA (直接内存存取) 方式的 CPU 开销。'
    ]
  },
  {
    id: 'cohesion-coupling',
    title: '模块内聚与耦合裁判所',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '数据耦合、控制耦合、公共耦合、内容耦合与功能内聚诊断',
    hudComponent: 'CohesionCoupling',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '诊断模块交互代码中的耦合类型（数据、控制、公共、内容）。',
      '体会高内聚低耦合的架构要领。'
    ]
  },
  {
    id: 'solid-principles',
    title: 'SOLID 设计原则裁判',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: 'SRP, OCP, LSP, ISP, DIP 原则诊断与代码重构',
    hudComponent: 'SolidPrinciples',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '诊断代码重构案例中违反的 SOLID 面向对象设计原则（如正方形继承长方形违反 LSP）。'
    ]
  },
  {
    id: 'er-to-relational',
    title: 'E-R 图转关系表工坊',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '1:1、1:n 与 m:n 实体联系转换表结构与外键映射规则',
    hudComponent: 'ERToRelational',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '1:n 联系必须将 1 方主键作为外键放入 n 方表中。',
      'm:n 联系必须建立全新的独立联系表。'
    ]
  },
  {
    id: 'ip-copyright-court',
    title: '知识产权大法庭 (逆转裁判版)',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '职务作品与委托作品软件著作权与专利权法律归属辩论',
    hudComponent: 'IPCopyrightCourt',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '委托作品合同未约束著作权的，归受托人 (乙方) 所有。',
      '主要利用单位物质技术条件的职务作品，著作权归单位所有。'
    ]
  },
  {
    id: 'page-replacement',
    title: '页面置换算法缺页实验室',
    category: LEVEL_CATEGORIES.OS,
    description: 'FIFO 先进先出、LRU 最近最少使用、OPT 最佳置换与缺页率计算',
    hudComponent: 'PageReplacement',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '演练 3 个物理块槽位下的 FIFO, LRU, OPT 页面置换过程。',
      '观察缺页中断产生与缺页中断率计算。'
    ]
  },
  {
    id: 'heap-sort',
    title: '堆排序与大顶堆重构',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '大顶堆性质 A[i] >= A[2i+1] 与完全二叉树 Heapify 调整',
    hudComponent: 'HeapSort',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '点击节点两两交换，将二叉树重构满足大顶堆性质。'
    ]
  },
  {
    id: 'white-box-coverage',
    title: '白盒测试逻辑覆盖率',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '语句、判定/分支覆盖 (Branch Coverage)、条件覆盖与用例设计',
    hudComponent: 'WhiteBoxCoverage',
    themeColor: 'pink',
    engine: 'react',
    isNew: true,
    instructions: [
      '调整输入参数 A, B, X，触发所有代码分支的真/假路径，达成 100% 判定覆盖。'
    ]
  },
  {
    id: 'db-normal-forms',
    title: '数据库 3NF 范式分解工坊',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '1NF -> 2NF (消除部分依赖) -> 3NF (消除传递依赖) 规范化拆表',
    hudComponent: 'DBNormalForms',
    themeColor: 'blue',
    engine: 'react',
    isNew: true,
    instructions: [
      '拆分消除部分依赖提升至 2NF。',
      '拆分消除传递依赖提升至 3NF。'
    ]
  },
  {
    id: 'digital-signature',
    title: '数字签名与 PKI 信任链',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '公钥/私钥对称与非对称机制、数字签名 (发送方私钥) 与验签 (发送方公钥)',
    hudComponent: 'DigitalSignature',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '发送方使用【发送方私钥】对 Hash 摘要签名。',
      '接收方使用【发送方公钥】对数字签名验签。'
    ]
  },
  // --- 补全 10 大考点关卡 ---
  {
    id: 'crc-checksum',
    title: 'CRC 循环冗余校验码',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '模 2 除法 (XOR)、多项式二进制转换与余数校验码计算',
    hudComponent: 'CRCChecksum',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '根据生成多项式 G(X) 的阶数 r，在数据尾部补 r 个 0。',
      '计算模 2 不进位除法 (异或 XOR)，得出余数 CRC 校验码。',
      '在传输中测试接收端余数是否为 0 以检错。'
    ]
  },
  {
    id: 'risc-vs-cisc',
    title: 'RISC vs CISC 架构对决',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '硬布线 vs 微程序控制器、Load/Store 访存与寄存器对比',
    hudComponent: 'RiscVsCisc',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '判断指令集特性归属 (RISC vs CISC)。',
      'RISC 采用硬布线控制器、大量寄存器与 Load/Store 访存。',
      'CISC 采用微程序控制器与变长指令。'
    ]
  },
  {
    id: 'bitmap-disk',
    title: '位示图法磁盘空间管理',
    category: LEVEL_CATEGORIES.OS,
    description: '位示图 (Bitmap) 盘块管理、字号 (i) 与位号 (j) 换算公式',
    hudComponent: 'BitmapDisk',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '由磁盘物理块号 N 计算字号 i = ⌊N/32⌋ 与位号 j = N mod 32。',
      '扫描位示图中的 0/1 状态求已分配与空闲容量。'
    ]
  },
  {
    id: 'mmu-translator',
    title: 'MMU 虚拟地址转换塔',
    category: LEVEL_CATEGORIES.OS,
    description: '逻辑地址分解 (页号/页内偏移)、页表映射物理块号与缺页中断',
    hudComponent: 'MMUTranslator',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '分解十六进制逻辑地址的高位页号与低位页内偏移。',
      '查页表获取物理块号并拼接物理地址。',
      '识别 Valid=0 触发的缺页中断 (Page Fault)。'
    ]
  },
  {
    id: 'huffman-coder',
    title: '哈夫曼树与前缀编码',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '哈夫曼树构造、带权路径长度 (WPL) 计算与变长前缀编码',
    hudComponent: 'HuffmanCoder',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '每次合并权重最小的两个节点构造最优二叉树。',
      '计算 WPL = Σ(权重 * 路径长度)。',
      '分配左 0 右 1 变长无前缀编码。'
    ]
  },
  {
    id: 'topological-sort',
    title: 'AOV 网拓扑排序',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '顶点入度计算、零入度节点出栈与有向环死锁诊断',
    hudComponent: 'TopologicalSort',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '挑选入度为 0 的节点弹出并更新后继节点入度。',
      '生成完整的拓扑排序序列。',
      '诊断包含有向回路 (Cycle) 导致排序失败。'
    ]
  },
  {
    id: 'db-concurrency-lock',
    title: '数据库事务与并发锁',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '事务 ACID、脏读/不可重复读/幻读，S锁/X锁与一/二/三级封锁协议',
    hudComponent: 'DBConcurrencyLock',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '诊断读未提交引起的脏读 (Dirty Read) 异常。',
      '部署二级封锁协议 (读加 S 锁用完即释放) 消除脏读。',
      '掌握三级封锁协议消除不可重复读。'
    ]
  },
  {
    id: 'agile-scrum-board',
    title: '敏捷 Scrum 看板与 4 种维护',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: 'Scrum/XP 敏捷实践，改正性/适应性/完善性/预防性维护判定',
    hudComponent: 'AgileScrumBoard',
    themeColor: 'orange',
    engine: 'react',
    isNew: true,
    instructions: [
      '掌握 Scrum Sprint 与 XP 结对编程/TDD 敏捷实践。',
      '诊断 6 个工程案例对应的 4 种软件维护类型。'
    ]
  },
  {
    id: 'network-security-wall',
    title: '防火墙与安全设备防御',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '防火墙/IDS/IPS 拓扑部署、DMZ 隔离区与 XSS/CSRF 防御',
    hudComponent: 'NetworkSecurityWall',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '区分 IDS 旁路告警与 IPS 串联阻断部署。',
      '掌握 DMZ 区域访问隔离规则。',
      '防御 XSS 跨站脚本与 CSRF 跨站请求伪造。'
    ]
  },
  {
    id: 'std-compliance-court',
    title: '标准化与合规裁判所',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '国家标准 (GB 强制 / GB/T 推荐)、ISO/IEEE 代号与法律效力',
    hudComponent: 'StdComplianceCourt',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '区分 GB 强制性标准与 GB/T 推荐性标准。',
      '裁决国标、行标与企标的效力层级冲突。'
    ]
  },
  {
    id: 'memory-addressing',
    title: '内存编址与芯片扩展',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '十六进制地址空间计算、按字节/按字编址与 RAM 芯片扩展片数求解',
    hudComponent: 'MemoryAddressing',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '根据起始地址 80000H 与 BFFFFH 计算存储容量。',
      '掌握按字节编址与按字编址下寻址单元数换算。',
      '计算扩充 256KB 内存所需的 RAM 芯片数量。'
    ]
  },
  {
    id: 'precedence-pv',
    title: '进程前趋图与 PV 信号量',
    category: LEVEL_CATEGORIES.OS,
    description: 'DAG 前趋图转化为 P(Si) 与 V(Sj) 信号量代码段逻辑填空',
    hudComponent: 'PrecedencePV',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '前趋节点执行结束放置 V(S) 信号量通知后继。',
      '后继节点执行开始放置 P(S) 信号量等待前趋。'
    ]
  },
  {
    id: 'dijkstra-shortest-path',
    title: 'Dijkstra 最短路径算法',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '单源加权图贪心松弛过程与 dist[] 数组动态更新',
    hudComponent: 'DijkstraShortestPath',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '每次选择未访问集合中 dist 最小的节点。',
      '对相邻节点实施松弛操作 dist[v] = min(dist[v], dist[u] + w)。'
    ]
  },
  {
    id: 'blackbox-testing',
    title: '黑盒测试与边界值分析 (BVA)',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '等价类划分与 [min-1, min, min+1, max-1, max, max+1] 边界用例设计',
    hudComponent: 'BlackboxTesting',
    themeColor: 'pink',
    engine: 'react',
    isNew: true,
    instructions: [
      '挑选最严谨无冗余的边界值测试用例。',
      '覆盖区间边界极值与无效输入。'
    ]
  },
  {
    id: 'software-lifecycle-cmmi',
    title: '软件过程模型与 CMMI 阶梯',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '瀑布/螺旋(风险)/V模型(测试)与 CMMI 1-5 级成熟度塔匹配',
    hudComponent: 'SoftwareLifecycleCMMI',
    themeColor: 'orange',
    engine: 'react',
    isNew: true,
    instructions: [
      '匹配瀑布、螺旋、V模型与喷泉模型的核心适用场景。',
      '将特征描述填入 CMMI 1 至 5 级成熟度阶梯。'
    ]
  },
  {
    id: 'design-pattern-code',
    title: '软考下午试题六：设计模式代码填空',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '软考下午 15 分试题六：Observer 观察者模式 Java/C++ 代码填空',
    hudComponent: 'DesignPatternCode',
    themeColor: 'purple',
    engine: 'react',
    isNew: true,
    instructions: [
      '填补观察者接口、主题基类与 attach()/notifyAllObservers() 代码。'
    ]
  },
  {
    id: 'net-protocol-ports',
    title: '网络协议与默认端口巡警',
    category: LEVEL_CATEGORIES.NETWORK,
    description: 'HTTP(80)/HTTPS(443)/FTP(21)/DNS(53)/DHCP(67)/SNMP(161) 端口与 TCP/UDP 识别',
    hudComponent: 'NetProtocolPorts',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true,
    instructions: [
      '为常用应用层协议配置标准默认端口号。',
      '区分该协议基于 TCP 还是 UDP 传输层协议。'
    ]
  },
  {
    id: 'query-optimization-tree',
    title: 'SQL 查询树与关系代数等价优化',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '关系代数查询树选择 σ 下推与投影 π 下推减少中间笛卡尔积',
    hudComponent: 'QueryOptimizationTree',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true,
    instructions: [
      '下推选择 σ 与投影 π 节点至叶子节点。',
      '避免大型笛卡尔积中间结果生成。'
    ]
  },
  {
    id: 'digital-envelope',
    title: '数字信封与密码算法树',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '对称密钥 K 加密明文 + 接收方公钥 PB 封装信封的混合加密机制',
    hudComponent: 'DigitalEnvelope',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true,
    instructions: [
      '用对称密钥 K 加密明文文件。',
      '用接收方 Bob 的公钥 PB 加密 K 形成数字信封。'
    ]
  },
  {
    id: 'arch-style-atam',
    title: '软件架构风格与 ATAM 评估',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: 'ATAM / SAAM 评估方法敏感点、权衡点、风险点与非风险点诊断',
    hudComponent: 'ArchStyleATAM',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '诊断场景属于敏感点、权衡点 (折衷点) 还是风险点。'
    ]
  },
  {
    id: 'syntax-tree-builder',
    title: '语法树构建与文法推导',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '上下文无关文法 (CFG) 的最左与最右推导',
    hudComponent: 'SyntaxTreeBuilder',
    themeColor: 'blue',
    engine: 'react',
    isNew: true,
    instructions: [
      '根据给定的文法规则，选择正确的推导步骤。',
      '确保生成目标字符串。'
    ]
  },
  {
    id: 'data-representation',
    title: '底层数据表示 (原反补移)',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '原码、反码、补码、移码的转换与计算',
    hudComponent: 'DataRepresentation',
    themeColor: 'teal',
    engine: 'react',
    isNew: true,
    instructions: [
      '填入给定十进制数的 8 位二进制编码。',
      '掌握反码、补码和移码的生成规则。'
    ]
  },
  {
    id: 'multimedia-calculator',
    title: '多媒体容量计算',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '图像、音频未压缩存储容量计算',
    hudComponent: 'MultimediaCalculator',
    themeColor: 'fuchsia',
    engine: 'react',
    isNew: true,
    instructions: [
      '选择正确的计算公式，注意单位转换。',
      '计算出文件的大小 (MB)。'
    ]
  },
  {
    id: 'oop-polymorphism',
    title: '面向对象多态与绑定',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '动态绑定 vs 静态绑定，重载 vs 重写',
    hudComponent: 'OOPPolymorphism',
    themeColor: 'orange',
    engine: 'react',
    isNew: true,
    instructions: [
      '阅读代码，判断输出结果。',
      '区分编译期绑定与运行期绑定。'
    ]
  },
  {
    id: 'avl-tree-rotation',
    title: 'AVL 树平衡旋转',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: 'LL、RR、LR、RL 四大旋转失衡修复',
    hudComponent: 'AVLTreeRotation',
    themeColor: 'lime',
    engine: 'react',
    isNew: true,
    instructions: [
      '找出插入节点后第一个失去平衡的节点。',
      '选择合适的单旋或双旋操作来修复。'
    ]
  },
  {
    id: 'xjp-thought-study',
    title: '15040 习概通关课',
    category: LEVEL_CATEGORIES.SELF_STUDY,
    description: '自考15040《习近平新时代中国特色社会主义思想概论》：18章高频知识点、主观题框架与通关自测',
    hudComponent: 'XjpThoughtStudy',
    themeColor: 'amber',
    engine: 'react',
    isNew: true,
    instructions: [
      '按导论至第十七章完成高频知识点学习，并将已掌握章节标记为完成。',
      '使用10题即时自测检验易混固定搭配，正确率达到80%即可点亮通关状态。',
      '在考场策略页完成14天冲刺计划，并在临考前补齐考前12个月时政。'
    ]
  }
];

export const getLevelById = (id: string): GameLevel | undefined => {
  return LEVELS.find(level => level.id === id);
};

export const getLevelsByCategory = () => {
  const grouped: Record<string, GameLevel[]> = {};
  LEVELS.forEach(level => {
    if (!grouped[level.category]) {
      grouped[level.category] = [];
    }
    grouped[level.category].push(level);
  });
  return grouped;
};
