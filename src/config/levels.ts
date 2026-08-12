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
  SOFTWARE_ENG: '软件工程'
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
    engine: 'phaser'
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
    description: '银行家算法实战，解开错综复杂的资源依赖',
    sceneKey: 'DeadlockScene',
    hudComponent: 'HUD',
    themeColor: 'red',
    engine: 'phaser',
    instructions: [
      '系统中出现了多个互相等待资源的进程，形成了“死锁”。',
      '你需要点击画面中出现死锁的节点，破坏它们的“循环等待”条件。',
      '及时点击红色报警节点，防止系统崩溃！'
    ]
  },
  {
    id: 'uml-temple',
    title: 'UML类图解析',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '部署7种设计模式防御塔，在波间答题中深度掌握GoF设计模式核心知识',
    sceneKey: 'UMLTempleScene',
    hudComponent: 'TowerHUD',
    themeColor: 'purple',
    engine: 'phaser',
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
    engine: 'phaser'
  },
  {
    id: 'network-routing',
    title: 'TCP/IP 协议栈',
    category: LEVEL_CATEGORIES.NETWORK,
    description: '组装数据包，建立三次握手，建立可靠传输',
    sceneKey: 'NetworkScene',
    hudComponent: 'NetworkHUD',
    themeColor: 'emerald',
    engine: 'phaser'
  },
  {
    id: 'crypto-defense',
    title: '非对称加密',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '利用公钥私钥体系，保卫核心数据安全',
    sceneKey: 'CryptoScene',
    hudComponent: 'CryptoHUD',
    themeColor: 'indigo',
    engine: 'phaser'
  },
  {
    id: 'binary-tree',
    title: '二叉树遍历',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '穿梭于森林迷宫，用深度优先探索未知节点',
    sceneKey: 'TreeScene',
    hudComponent: 'TreeHUD',
    themeColor: 'cyan',
    engine: 'phaser'
  },
  {
    id: 'load-balancer',
    title: '高并发负载均衡',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '应对洪峰流量，动态扩容服务器，保持系统高可用',
    sceneKey: 'LoadBalancerScene',
    hudComponent: 'LoadBalancerHUD',
    themeColor: 'yellow',
    engine: 'phaser'
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
    isNew: true
  },
  {
    id: 'cipher-workshop',
    title: '密码工坊',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '制作并匹配加密密钥，完成信息安全保卫任务',
    hudComponent: 'CipherWorkshop',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true
  },
  {
    id: 'critical-path',
    title: '关键路径远征',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '管理项目进度，找出关键路径以最短时间完成任务',
    hudComponent: 'CriticalPathExpedition',
    themeColor: 'orange',
    engine: 'react',
    isNew: true
  },
  {
    id: 'design-pattern-td-react',
    title: '设计模式塔防 (React版)',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '使用设计模式防守怪物，纯UI交互体验版',
    hudComponent: 'DesignPatternTD',
    themeColor: 'purple',
    engine: 'react',
    isNew: true
  },
  {
    id: 'pipeline-factory-react',
    title: '流水线工厂 (React版)',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '优化指令执行流水线，突破性能瓶颈',
    hudComponent: 'PipelineFactory',
    themeColor: 'blue',
    engine: 'react',
    isNew: true
  },
  {
    id: 'pseudocode-forge',
    title: '伪代码熔炉',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '填补算法伪代码，完成数据结构的终极铸造',
    hudComponent: 'PseudocodeForge',
    themeColor: 'amber',
    engine: 'react',
    isNew: true
  },
  {
    id: 'sql-assembly-bench',
    title: 'SQL装配台',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '拼接SQL语句片段，完成数据查询任务',
    hudComponent: 'SQLAssemblyBench',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true
  },
  {
    id: 'subnet-territory',
    title: '子网领地划分',
    category: LEVEL_CATEGORIES.NETWORK,
    description: '根据IP和掩码，精确划分网络子网领地',
    hudComponent: 'SubnetTerritory',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true
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
    isNew: true
  },
  {
    id: 'cache-master',
    title: '存储 Cache 物语',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: '组相联映射与 LRU 替换策略实战。',
    hudComponent: 'CacheMaster',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true
  },
  {
    id: 'dfa-maze',
    title: '有限自动机 DFA 迷宫',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '识别正规式 0(0|1)*1 的状态流转',
    hudComponent: 'DFAMaze',
    themeColor: 'blue',
    engine: 'react',
    isNew: true
  },
  {
    id: 'unix-inode',
    title: 'UNIX 磁盘多级索引寻宝',
    category: LEVEL_CATEGORIES.OS,
    description: '计算直接与间接物理块索引偏移量',
    hudComponent: 'UnixInode',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true
  },
  {
    id: 'path-finder',
    title: '路径漫游指南',
    category: LEVEL_CATEGORIES.OS,
    description: 'Linux 相对路径与绝对路径实战训练',
    hudComponent: 'PathFinder',
    themeColor: 'green',
    engine: 'react',
    isNew: true
  },
  {
    id: 'white-box-explorer',
    title: '控制流图与白盒测试染色',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '通过输入参数，达成 100% 判定覆盖率。',
    hudComponent: 'WhiteBoxExplorer',
    themeColor: 'pink',
    engine: 'react',
    isNew: true
  },
  {
    id: 'dfd-inspector',
    title: '数据流图 DFD 故障检修师',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '修复 DFD 中的"黑洞"与"奇迹"加工错误',
    hudComponent: 'DFDInspector',
    themeColor: 'orange',
    engine: 'react',
    isNew: true
  },
  {
    id: 'uml-state-machine',
    title: '自动售货机：UML 逻辑调试器',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '修复自动售货机的状态机转移错误',
    hudComponent: 'UMLStateMachine',
    themeColor: 'purple',
    engine: 'react',
    isNew: true
  },
  {
    id: 'dp-knapsack',
    title: '0-1 背包大盗',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '局部最优(贪心) vs 全局最优(动态规划)',
    hudComponent: 'DPKnapsack',
    themeColor: 'amber',
    engine: 'react',
    isNew: true
  },
  {
    id: 'db-normalizer',
    title: '数据库范式收纳整理狂',
    category: LEVEL_CATEGORIES.DATABASE,
    description: '消除更新异常，将数据规范化至 3NF！',
    hudComponent: 'DBNormalizer',
    themeColor: 'blue',
    engine: 'react',
    isNew: true
  },
  {
    id: 'float-operator',
    title: '浮点数极速对阶工厂',
    category: LEVEL_CATEGORIES.COMPUTER_ORG,
    description: 'IEEE 754 浮点数加法对阶与移位',
    hudComponent: 'FloatOperator',
    themeColor: 'cyan',
    engine: 'react',
    isNew: true
  },
  {
    id: 'reliability-architect',
    title: '可靠度大厦架构师',
    category: LEVEL_CATEGORIES.ARCHITECTURE,
    description: '计算串并联混合系统架构的总可靠度',
    hudComponent: 'ReliabilityArchitect',
    themeColor: 'emerald',
    engine: 'react',
    isNew: true
  },
  {
    id: 'matrix-compressor',
    title: '压缩矩阵一维收纳盒',
    category: LEVEL_CATEGORIES.DATA_STRUCTURE,
    description: '二维下三角矩阵向一维数组的地址映射',
    hudComponent: 'MatrixCompressor',
    themeColor: 'indigo',
    engine: 'react',
    isNew: true
  },
  {
    id: 'mccabe-surveyor',
    title: 'McCabe 环路复杂度勘测员',
    category: LEVEL_CATEGORIES.SOFTWARE_ENG,
    description: '通过点边公式和判定节点公式计算 V(G)',
    hudComponent: 'McCabeSurveyor',
    themeColor: 'fuchsia',
    engine: 'react',
    isNew: true
  },
  {
    id: 'ip-judge',
    title: '知识产权大法庭',
    category: LEVEL_CATEGORIES.SECURITY,
    description: '为不同的软件侵权纠纷指明正确的知识产权类型',
    hudComponent: 'IPJudge',
    themeColor: 'amber',
    engine: 'react',
    isNew: true
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
