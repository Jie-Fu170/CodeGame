# CodeGame 现有考点游戏目录 (Games Catalog)

本文档旨在记录当前框架中已经实现的所有考点游戏（关卡），涵盖了由 Phaser 引擎和原生 React 组件驱动的各类关卡。在未来进行新的游戏设计和扩展时，可以参考本文档。

---

## 💻 计算机组成原理

### 1. 指令流水线 (ID: `pipeline`)
- **考点**: CPU 指令流水线 (IF, ID, EX)、流水线瓶颈与优化。
- **游戏描述**: 深入 CPU 内部，玩家需要管理指令流水线，通过升级最慢的执行环节来打破性能瓶颈，优化执行效率。
- **引擎**: Phaser (`PipelineScene`) + `PipelineHUD`

### 2. 流水线工厂 React版 (ID: `pipeline-factory-react`)
- **考点**: CPU 指令执行流水线。
- **游戏描述**: 优化指令执行流水线，突破性能瓶颈的轻量化交互体验版。
- **引擎**: React (`PipelineFactory`)

---

## ⚙️ 操作系统

### 3. 进程调度算法 (ID: `cpu-scheduling`)
- **考点**: 常见进程调度算法 (FCFS, SJF, RR) 的原理与适用场景。
- **游戏描述**: 玩家化身系统内核，合理切换调度算法来分配 CPU 时间片，避免产生进程饥饿或系统阻塞。
- **引擎**: Phaser (`OSCityScene`) + `HUD`

### 4. 死锁解除 (ID: `deadlock`)
- **考点**: 死锁产生的必要条件、死锁预防与解除。
- **游戏描述**: 发生死锁危机，玩家需要实战解开错综复杂的资源依赖，破坏循环等待条件。
- **引擎**: Phaser (`DeadlockScene`) + `HUD`

### 5. 银行家迷宫 (ID: `bankers-maze`)
- **考点**: 死锁避免策略（银行家算法）。
- **游戏描述**: 纯前端交互版死锁避免策略，帮助玩家通过寻找安全序列来逃出生天。
- **引擎**: React (`BankersMaze`)

---

## 🌐 计算机网络

### 6. TCP/IP 协议栈 (ID: `network-routing`)
- **考点**: TCP 三次握手与四次挥手、序列号与确认号的计算。
- **游戏描述**: 玩家需要手动组装数据包类型 (SYN, ACK, FIN 等)，按照正确的顺序和序号与服务器建立可靠传输。
- **引擎**: Phaser (`NetworkScene`) + `NetworkHUD`

### 7. 子网领地划分 (ID: `subnet-territory`)
- **考点**: IP 地址分类、子网掩码与网络规划。
- **游戏描述**: 根据 IP 地址和给定的子网掩码，精确划分网络子网领地，强化对网络号和主机号边界的理解。
- **引擎**: React (`SubnetTerritory`)

---

## 🗄️ 数据库

### 8. SQL注入攻防 (ID: `sql-battle`)
- **考点**: 基础 SQL 语法、GROUP BY / HAVING、子查询。
- **游戏描述**: 玩家通过填空的方式编写正确的 SQL 查询语句，以此作为攻击手段抵御恶意数据。
- **引擎**: Phaser (`SQLBattleScene`) + `SQLConsole`

### 9. SQL装配台 (ID: `sql-assembly-bench`)
- **考点**: SQL 语句结构设计与嵌套。
- **游戏描述**: 将 SQL 关键字像积木一样拼接起来，通过视觉化装配完成复杂的数据查询任务。
- **引擎**: React (`SQLAssemblyBench`)

---

## 🌲 数据结构与算法

### 10. 二叉树遍历 (ID: `binary-tree`)
- **考点**: 二叉查找树 (BST) 的性质、节点查找与插入。
- **游戏描述**: 探针穿梭于二叉树森林迷宫中，遵循“左小右大”选择方向，寻找目标节点或在正确位置插入新节点。
- **引擎**: Phaser (`TreeScene`) + `TreeHUD`

### 11. 算法排序决斗场 (ID: `algorithm-duel`)
- **考点**: 排序算法复杂度评估 (O(n²), O(n log n))。
- **游戏描述**: 利用法力值召唤冒泡、快排等不同复杂度的卡牌算法来打倒数据怪，感受在大规模数据下复杂度的威力。
- **引擎**: React (`AlgorithmDuel`)

### 12. 伪代码熔炉 (ID: `pseudocode-forge`)
- **考点**: 经典算法（如二叉树遍历、动态规划等）的伪代码结构与边界条件。
- **游戏描述**: 填补算法伪代码中的空白浇口，像炼金一样完成数据结构核心逻辑的终极铸造。
- **引擎**: React (`PseudocodeForge`)

---

## 🏗️ 系统架构

### 13. 高并发负载均衡 (ID: `load-balancer`)
- **考点**: 负载均衡算法 (轮询、最少连接、IP 哈希)。
- **游戏描述**: 应对洪峰流量的挑战，动态切换负载均衡策略并扩容服务器，保持系统高可用。
- **引擎**: Phaser (`LoadBalancerScene`) + `LoadBalancerHUD`

---

## 🎨 设计模式

### 14. UML类图解析 (ID: `uml-temple`)
- **考点**: 常见设计模式与 UML 关系。
- **游戏描述**: 塔防游戏形式。玩家利用不同设计模式的“防御塔”组合击败高耦合的怪物。
- **引擎**: Phaser (`UMLTempleScene`) + `TowerHUD`

### 15. 设计模式塔防 React版 (ID: `design-pattern-td-react`)
- **考点**: 常见设计模式组件。
- **游戏描述**: 使用设计模式防守怪物，提供更加平滑轻量的前端纯 UI 塔防体验版。
- **引擎**: React (`DesignPatternTD`)

---

## 🔒 信息安全

### 16. 非对称加密 (ID: `crypto-defense`)
- **考点**: 公钥与私钥的使用、数字签名、数字信封。
- **游戏描述**: 正确选择使用发送方/接收方的公钥或私钥进行加密和签名，保卫数据安全。
- **引擎**: Phaser (`CryptoScene`) + `CryptoHUD`

### 17. 密码工坊 (ID: `cipher-workshop`)
- **考点**: 常见密码学技术实践（加解密交互）。
- **游戏描述**: 在工坊中亲手制作、匹配加密密钥，完成不同层级的信息安全保卫任务。
- **引擎**: React (`CipherWorkshop`)

---

## 🚀 软件工程 (NEW)

### 18. 关键路径远征 (ID: `critical-path`)
- **考点**: 项目进度管理、活动网络图 (AOA/AON)、关键路径分析。
- **游戏描述**: 找出项目工序耗时最长的核心链路（关键路径），以此最短时间完成整个项目。
- **引擎**: React (`CriticalPathExpedition`)

---

## 📝 框架双引擎扩展指南
目前 CodeGame 支持 **Phaser 渲染层** 和 **React 交互层** 两种开发引擎。在添加新游戏时：
1. 准备好组件：开发你的 Phaser 场景或纯 React 组件（推荐）。
2. 在 `src/config/levels.ts` 中注册：
   - 对于纯 React 游戏：配置 `engine: 'react'`，无需 `sceneKey`。
   - 对于 Phaser 游戏：配置 `engine: 'phaser'` (或留空默认)，需配置 `sceneKey`。
3. 保存后系统将自动挂载至选关菜单，双引擎能够自动无缝切换，互不干扰！
