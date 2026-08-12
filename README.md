# 📘 CodeGame (代码大陆) — 软考中级《软件设计师》交互式备考游戏平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Online Demo](https://img.shields.io/badge/Online%20Demo-Cloudflare%20Pages-success?logo=cloudflare)](https://codegame-51x.pages.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![Phaser](https://img.shields.io/badge/Phaser-3.70-red?logo=phaser)](https://phaser.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

> 🌐 **官方在线体验地址**：👉 [https://codegame-51x.pages.dev/](https://codegame-51x.pages.dev/) (免安装，手机/电脑端浏览器即开即玩)  
> 🎓 **专为全国计算机技术与软件专业技术资格（水平）考试 —— 软考中级《软件设计师》打造！**  
> 告别死记硬背！将复杂的软考大纲核心考点（如 CPU流水线、PV操作与死锁、DFD数据流图、UML设计模式、数据库范式、McCabe圈复杂度等）转化为 2D 互动解谜游戏，助力高效刷题过考！

---

## 🌟 项目亮点

* **🎯 紧扣软考中级大纲**：全面覆盖《软件设计师》上午选择题与下午大题（案例分析、设计模式、数据流图、数据库设计等）的高频核心考点。
* **🎮 游戏化形象理解**：抽象原理可视化，通过游戏策略、模拟调试、参数调优和交互解谜，直观理解知识点底层逻辑。
* **⚡ 实时反馈与 AI 辅导**：结合动态 HUD 与 AI 导师提醒，边玩边学，快速查漏补缺。
* **🛠️ 强大技术栈**：基于 **React 18 + TypeScript + Phaser 3 游戏引擎 + Tailwind CSS** 构建。

---

## 📚 软考中级《软件设计师》考点关卡映射

### 💻 1. 计算机系统知识
* **CPU 指令流水线 (`pipeline` / `pipeline-factory`)**: 流水线周期、吞吐率计算、加速比优化。
* **海明校验码 (`hamming-agent`)**: 海明码校验位计算与纠错原理。
* **浮点数运算 (`float-operator`)**: 阶码、尾数与浮点数规格化。
* **Cache 内存映射与页面置换**: 内存地址映射与淘汰算法逻辑。

### ⚙️ 2. 操作系统与系统架构
* **进程调度算法 (`cpu-scheduling`)**: FCFS、SJF、时间片轮转（RR）调度过程体验。
* **死锁与银行家算法 (`deadlock` / `bankers-maze`)**: 资源分配图分析、破坏死锁四个必要条件及寻找安全序列。
* **Unix i-node 文件索引 (`unix-inode`)**: 直接/间接地址索引盘块数量计算。

### 📐 3. 软件工程与系统设计 (下午大题重难点)
* **数据流图 DFD 检查 (`dfd-inspector`)**: 数据流缺失、父子图平衡检查与存储处校验。
* **UML 设计与建模 (`uml-design-bench` / `uml-state-machine`)**: 类图、用例图、序列图与状态机图建模陷阱辨析。
* **设计模式塔防 (`design-pattern-td`)**: 23 种设计模式（创建型、结构型、行为型）场景选型防守。
* **McCabe 圈复杂度 (`mccabe-surveyor`)**: 控制流图环路复杂度计算（$V(G) = E - N + 2$）。
* **白盒测试覆盖 (`white-box-explorer`)**: 语句覆盖、判定覆盖、条件覆盖与路径覆盖。
* **软件可靠性计算 (`reliability-architect`)**: 串联与并联系统的可靠度与失效率计算。

### 🗄️ 4. 数据库系统技术
* **数据库规范化范式 (`db-normalizer` / `normalization-vein`)**: 1NF 到 3NF/BCNF 的函数依赖拆分与消除部分/传递依赖。
* **SQL 语法与攻防 (`sql-battle` / `sql-assembly-bench`)**: 分组统计、子查询、连接查询与 SQL 注入防范。

### 🌐 5. 计算机网络与信息安全
* **子网划分与 IP 路由 (`subnet-territory` / `ip-judge`)**: 子网掩码计算、网络号/广播号界定与 IP 合法性判定。
* **TCP/IP 协议三次握手 (`network-routing`)**: 报文标志位（SYN, ACK, FIN）与序列号/确认号演进。
* **密码学与网络安全 (`cipher-workshop`)**: 对称与非对称加密（RSA）、数字签名与 Hash 校验。

### 🧠 6. 数据结构与算法设计
* **背包问题动态规划 (`dp-knapsack`)**: 状态转移方程与最优解装配。
* **DFA 确定性有限自动机 (`dfa-maze`)**: 正则表达式与状态转换迷宫。
* **关键路径与最短路径 (`critical-path-expedition` / `path-finder`)**: AOE 网最早/最迟开始时间与 Dijkstra 最短路径计算。

---

## 🚀 本地运行指南

```bash
# 1. 克隆仓库
git clone https://github.com/Jie-Fu170/CodeGame.git
cd CodeGame

# 2. 安装依赖
npm install

# 3. 启动开发环境
npm run dev
```

浏览器访问 `http://localhost:5173` 即可开启软考游戏备考之旅！

---

## 🌐 在线体验与 部署

* **🔗 官方在线体验地址**：👉 [https://codegame-51x.pages.dev/](https://codegame-51x.pages.dev/) (免安装，手机/电脑端即开即玩)
* **⚡ 部署说明**：基于 Cloudflare Pages 托管，同时支持在 [Vercel](https://vercel.com/) 或 Netlify 上进行一键自动部署。

---

## 📄 开源许可证

本项目使用 [MIT License](LICENSE) 协议开源。
