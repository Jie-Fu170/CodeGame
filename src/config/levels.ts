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
    title: 'GoF 设计模式与 UML 架构',
    category: LEVEL_CATEGORIES.DESIGN_PATTERN,
    description: '部署7种GoF设计模式防御塔，在波间答题与UML重构中深度掌握设计模式核心考点',
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
    description: '通过输入参数，达成 100% 判定覆盖率。',
    hudComponent: 'WhiteBoxExplorer',
    themeColor: 'pink',
    engine: 'react',
    isNew: true,
    instructions: [
      '分析程序的控制流图 (CFG) 与条件分支。',
      '设计测试用例输入参数，使得测试覆盖率达到 100% 判定覆盖/条件覆盖。'
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
      '推导对称矩阵 / 三角矩阵压缩存储公式 k = i(i-1)/2 + j - 1。',
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
