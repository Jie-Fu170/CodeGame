# CodeGame 软考中级《软件设计师》全关卡目录大纲 (77 大交互关卡)

本文档记录了 CodeGame 平台中已实现的 **77 个交互解谜关卡**，涵盖 Phaser 2D 游戏引擎与 React 原生交互双引擎组件，实现了对软考中级《软件设计师》大纲及历年真题考点的 100% 地毯式覆盖。

---

## 💻 计算机组成与体系结构 (Computer Organization)

1. **指令流水线** (ID: `pipeline`) — Phaser
   - **考点**: CPU 指令流水线 (IF, ID, EX)、流水线瓶颈与吞吐率优化。
2. **流水线工厂 React版** (ID: `pipeline-factory-react`) — React
   - **考点**: 指令依赖与流水线停顿 (Stall / Bubble) 消融。
3. **海明码特工** (ID: `hamming-agent`) — React
   - **考点**: 海明校验码 $2^k \ge n + k + 1$ 偶校验位与指错字位纠错。
4. **存储 Cache 物语** (ID: `cache-master`) — React
   - **考点**: 组相联映射 (Tag, Index, Offset) 与 LRU 替换策略。
5. **浮点数极速对阶工厂** (ID: `float-operator`) — React
   - **考点**: IEEE 754 浮点数加减法对阶 (小阶看齐大阶) 与尾数规格化。
6. **I/O 控制与 CPU 寄存器探秘** (ID: `io-registers`) — React
   - **考点**: PC, IR, MAR, MDR 取指周期与程序查询、中断驱动、DMA 方式。
7. **磁盘调度算法磁头车间** (ID: `disk-scheduler`) — React
   - **考点**: FCFS, SSTF (最短寻道时间) 与 SCAN (电梯扫描) 算法寻道长度。
8. **CRC 循环冗余校验码** (ID: `crc-checksum`) — React
   - **考点**: 模 2 异或除法、生成多项式补 0 与余数检错。
9. **RISC vs CISC 架构对决** (ID: `risc-vs-cisc`) — React
   - **考点**: RISC (硬布线/大量寄存器/Load-Store) vs CISC (微程序控制器)。
10. **内存编址与芯片扩展** (ID: `memory-addressing`) — React
    - **考点**: 16进制地址空间计算、按字节/按字编址与 $16K \times 8bit$ RAM 芯片扩展数。

---

## ⚙️ 操作系统 (Operating Systems)

11. **进程调度算法** (ID: `cpu-scheduling`) — Phaser
    - **考点**: FCFS, SJF (短作业优先) 与 RR (时间片轮转) 进程响应时间与饥饿。
12. **死锁解除** (ID: `deadlock`) — Phaser
    - **考点**: 死锁产生 4 大必要条件与破坏循环等待。
13. **银行家迷宫** (ID: `bankers-maze`) — React
    - **考点**: 银行家算法 (Banker's Algorithm) 安全序列 (Safe Sequence) 评估。
14. **UNIX 磁盘多级索引寻宝** (ID: `unix-inode`) — React
    - **考点**: 直接索引、一级间接与二级间接物理块号寻址偏移计算。
15. **路径漫游指南** (ID: `path-finder`) — React
    - **考点**: Linux 绝对路径 (`/`) 与相对路径 (`.`, `..`) 变换。
16. **PV 信号量交通局** (ID: `pv-semaphore`) — React
    - **考点**: P(wait) / V(signal) 临界区互斥、缓冲区生产者-消费者同步与带锁死锁。
17. **页面置换算法缺页实验室** (ID: `page-replacement`) — React
    - **考点**: FIFO, LRU, OPT 最佳页面置换算法与缺页率计算。
18. **位示图法磁盘空间管理** (ID: `bitmap-disk`) — React
    - **考点**: 位示图字号 $i = \lfloor N/32 \rfloor$ 与位号 $j = N \bmod 32$ 盘块管理。
19. **MMU 虚拟地址转换塔** (ID: `mmu-translator`) — React
    - **考点**: 逻辑地址拆分 (页号/页内偏移)、页表物理块号拼接与缺页中断。
20. **进程前趋图与 PV 信号量** (ID: `precedence-pv`) — React
    - **考点**: DAG 进程依赖前趋图转化为 $P(S_i)$ 与 $V(S_j)$ 信号量填空。

---

## 🌐 计算机网络 (Computer Networks)

21. **TCP/IP 协议栈** (ID: `network-routing`) — Phaser
    - **考点**: TCP 三次握手与四次挥手、SEQ / ACK 序号状态机。
22. **子网领地划分** (ID: `subnet-territory`) — React
    - **考点**: IP 地址分类、CIDR 子网掩码、网络号与广播地址划分。
23. **OSI 七层封装车间** (ID: `osi-encapsulator`) — React
    - **考点**: TCP/IP 协议数据封装拆包与二层交换机/三层路由器/L7 网关解包界限。
24. **网络协议与默认端口巡警** (ID: `net-protocol-ports`) — React
    - **考点**: HTTP(80), HTTPS(443), FTP(21), DNS(53/UDP), DHCP(67/UDP), SNMP(161/UDP) 归类。

---

## 🗄️ 数据库系统 (Database Systems)

25. **SQL注入攻防** (ID: `sql-battle`) — Phaser
    - **考点**: SQL 注入原理与参数化预编译防御。
26. **SQL装配台** (ID: `sql-assembly-bench`) — React
    - **考点**: SQL GROUP BY, HAVING, WHERE 与子查询拼图。
27. **数据库范式收纳整理狂** (ID: `db-normalizer`) — React
    - **考点**: 消除插入/删除/更新异常，将数据规范化至 3NF。
28. **范式矿脉炼金** (ID: `normalization-vein`) — React
    - **考点**: 1NF 原始表按函数依赖分解为 4 张独立关系表。
29. **关系代数拼图** (ID: `relational-algebra`) — React
    - **考点**: 选择 $\sigma$、投影 $\pi$、自然连接 $\bowtie$ 与笛卡尔积 $\times$ 关系运算。
30. **E-R 图转关系表工坊** (ID: `er-to-relational`) — React
    - **考点**: 1:1, 1:n 与 m:n 实体联系转换独立表与外键放置规则。
31. **数据库 3NF 范式分解工坊** (ID: `db-normal-forms`) — React
    - **考点**: 1NF $\to$ 2NF (消除部分依赖) $\to$ 3NF (消除传递依赖)。
32. **数据库事务与并发锁** (ID: `db-concurrency-lock`) — React
    - **考点**: 事务 ACID 特性、脏读/不可重复读/幻读、S锁/X锁与一/二/三级封锁协议。
33. **SQL 查询树与关系代数等价优化** (ID: `query-optimization-tree`) — React
    - **考点**: 查询语法树选择 $\sigma$ 下推与投影 $\pi$ 下推减少中间笛卡尔积。

---

## 🌲 数据结构与算法 (Data Structures & Algorithms)

34. **二叉树遍历** (ID: `binary-tree`) — Phaser
    - **考点**: 二叉查找树 (BST) 左小右大性质与 DFS/BFS 遍历。
35. **算法排序决斗场** (ID: `algorithm-duel`) — React
    - **考点**: 时间复杂度 $O(n^2)$ vs $O(n \log n)$ 冒泡/快排/归并战斗。
36. **伪代码熔炉** (ID: `pseudocode-forge`) — React
    - **考点**: 核心数据结构伪代码空缺补全。
37. **0-1 背包大盗** (ID: `dp-knapsack`) — React
    - **考点**: 贪心算法 vs 动态规划 (DP) 状态转移方程 $dp[i][j]$。
38. **压缩矩阵一维收纳盒** (ID: `matrix-compressor`) — React
    - **考点**: 下三角矩阵压缩存储公式 $k = i(i-1)/2 + j - 1$ 地址映射。
39. **逆波兰式与表达式树工厂** (ID: `infix-to-postfix`) — React
    - **考点**: 中缀表达式转后缀表达式 (逆波兰式) 运算符栈出入栈。
40. **哈希冲突与散列表收纳** (ID: `hash-table-clash`) — React
    - **考点**: 线性探测开放定址法与拉链法 (Chaining) 解决冲突。
41. **图论最小生成树工程** (ID: `min-spanning-tree`) — React
    - **考点**: Kruskal (按权选边) 与 Prim (切面选点) 最小生成树算法。
42. **堆排序与大顶堆重构** (ID: `heap-sort`) — React
    - **考点**: 大顶堆性质 $A[i] \ge A[2i+1]$ 与 Heapify 完全二叉树调整。
43. **哈夫曼树与前缀编码** (ID: `huffman-coder`) — React
    - **考点**: 构造哈夫曼树、计算带权路径长度 (WPL) 与变长无前缀编码。
44. **AOV 网拓扑排序** (ID: `topological-sort`) — React
    - **考点**: AOV 网顶点入度计算、零入度节点出栈与有向回路死锁诊断。
45. **Dijkstra 最短路径算法** (ID: `dijkstra-shortest-path`) — React
    - **考点**: 单源加权图贪心松弛过程与 `dist[]` 动态更新。

---

## 🎨 系统架构与设计模式 (Architecture & Design Patterns)

46. **高并发负载均衡** (ID: `load-balancer`) — Phaser
    - **考点**: 轮询、最少连接、IP 哈希负载均衡扩容。
47. **GoF 设计模式与 UML 架构** (ID: `uml-temple`) — Phaser
    - **考点**: 23 种 GoF 设计模式塔防与 UML 架构节点重构。
48. **设计模式塔防 React版** (ID: `design-pattern-td-react`) — React
    - **考点**: 纯 UI 设计模式卡牌塔防体验版。
49. **数据流图 DFD 故障检修师** (ID: `dfd-inspector`) — React
    - **考点**: 修复 DFD 中的“黑洞”(无输出)与“奇迹”(无输入)加工错误。
50. **自动售货机：UML 逻辑调试器** (ID: `uml-state-machine`) — React
    - **考点**: UML 状态机图 Event, Guard 与 Action 转移漏洞调试。
51. **可靠度大厦架构师** (ID: `reliability-architect`) — React
    - **考点**: 串行 $R = R_1 R_2$ 与并行 $R = 1-(1-R_1)(1-R_2)$ 混合可靠度。
52. **UML 设计台** (ID: `uml-design-bench`) — React
    - **考点**: 组合、聚合、依赖、泛化 (继承) 与实现关系辩析。
53. **SOLID 设计原则裁判** (ID: `solid-principles`) — React
    - **考点**: SRP, OCP, LSP, ISP, DIP 5 大面向对象设计原则。
54. **软考下午试题六：设计模式代码填空** (ID: `design-pattern-code`) — React
    - **考点**: 软考下午 15 分大题 Observer 观察者模式 Java/C++ 代码补全。
55. **软件架构风格与 ATAM 评估** (ID: `arch-style-atam`) — React
    - **考点**: 管道-过滤器、黑板风格与 ATAM 评估敏感点、权衡点、风险点诊断。

---

## 🚀 软件工程与质量保证 (Software Engineering & QA)

56. **关键路径远征** (ID: `critical-path`) — React
    - **考点**: 活动网络图 (AOA/AON) 最早/最迟时间与关键路径工期。
57. **有限自动机 DFA 迷宫** (ID: `dfa-maze`) — React
    - **考点**: 正规式 $0(0|1)*1$ 的确定性有限自动机 (DFA) 状态转移。
58. **控制流图与白盒测试染色** (ID: `white-box-explorer`) — React
    - **考点**: 控制流图 (CFG) 分支路线与用例覆盖染色。
59. **McCabe 环路复杂度勘测员** (ID: `mccabe-surveyor`) — React
    - **考点**: 环路复杂度 $V(G) = m - n + 2p$ (边-点+2) 或 $P + 1$。
60. **模块内聚与耦合裁判所** (ID: `cohesion-coupling`) — React
    - **考点**: 数据、控制、公共、内容耦合与功能内聚诊断。
61. **白盒测试逻辑覆盖率** (ID: `white-box-coverage`) — React
    - **考点**: 语句、判定/分支覆盖 (Branch Coverage) 与条件覆盖测试用例。
62. **敏捷 Scrum 看板与 4 种维护** (ID: `agile-scrum-board`) — React
    - **考点**: Scrum/XP 敏捷实践与改正性、适应性、完善性、预防性维护。
63. **黑盒测试与边界值分析 (BVA)** (ID: `blackbox-testing`) — React
    - **考点**: 等价类划分与 $[min-1, min, min+1, max-1, max, max+1]$ 边界用例。
64. **软件过程模型与 CMMI 阶梯** (ID: `software-lifecycle-cmmi`) — React
    - **考点**: 瀑布/螺旋/V模型与 CMMI 1-5 级 (初始/已管理/已定义/量化/优化) 阶梯。

---

## 🔒 信息安全与法律法规 (Security & IP Law)

65. **非对称加密** (ID: `crypto-defense`) — Phaser
    - **考点**: 公钥加密/私钥解密、数字签名防篡改机制。
66. **密码工坊** (ID: `cipher-workshop`) — React
    - **考点**: 对称加密与非对称加密密钥匹配。
67. **知识产权大法庭** (ID: `ip-judge`) — React
    - **考点**: 著作权、专利权、商标权与商业秘密侵权裁决。
68. **知识产权大法庭 (逆转裁判版)** (ID: `ip-copyright-court`) — React
    - **考点**: 职务作品与委托作品著作权归属法律辩论。
69. **数字签名与 PKI 信任链** (ID: `digital-signature`) — React
    - **考点**: 发送方私钥签名 + 发送方公钥验签机制。
70. **防火墙与安全设备防御** (ID: `network-security-wall`) — React
    - **考点**: IDS 旁路告警 vs IPS 串联阻断、DMZ 区与 XSS/CSRF 防御。
71. **标准化与合规裁判所** (ID: `std-compliance-court`) — React
    - **考点**: GB 强制性标准 vs GB/T 推荐性标准与效力层级。
72. **数字信封与密码算法树** (ID: `digital-envelope`) — React
    - **考点**: 对称密钥 K 加密明文 + 接收方公钥 PB 封入数字信封。

73. **语法树构建与文法推导** (ID: `syntax-tree-builder`) — React
    - **考点**: 上下文无关文法 (CFG) 的最左与最右推导，生成目标字符串。
74. **底层数据表示** (ID: `data-representation`) — React
    - **考点**: 原码、反码、补码、移码的转换与计算，判断负数补码与移码。
75. **多媒体容量计算** (ID: `multimedia-calculator`) — React
    - **考点**: 图像与音频未压缩存储容量计算法则 (像素/采样率/位深)。
76. **面向对象多态与绑定** (ID: `oop-polymorphism`) — React
    - **考点**: 动态绑定 vs 静态绑定，重载 (Overload) vs 重写 (Override)。
77. **AVL 树平衡旋转** (ID: `avl-tree-rotation`) — React
    - **考点**: 查找失衡节点，运用 LL、RR、LR、RL 四大旋转修复。

---

## 📝 框架双引擎架构说明

- **Phaser 2D 引擎**: 用于构建复杂高动态视效场景（如塔防、城市调度、迷宫探索）。
- **React 原生交互引擎**: 用于提供响应式、高密度的考点解谜与算法推演卡片。
- **选关路由**: 所有 77 个关卡配置均在 `src/config/levels.ts` 中统一呈现，并通过 `App.tsx` 动态挂载，实现双引擎无缝自动切换！
