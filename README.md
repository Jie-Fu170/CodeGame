# 🎮 CodeGame (代码大陆) — 计算机基础考点游戏化学习平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![Phaser](https://img.shields.io/badge/Phaser-3.70-red?logo=phaser)](https://phaser.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

> 💡 将抽象难懂的计算机四大基础（计组、操作系统、计网、数据库）转化为交互式游戏关卡，让学习与复习不再枯燥！

---

## 🌟 核心特色

- **可视化抽象概念**：通过 2D 游戏场景与直观的交互界面，形象化演示 CPU 流水线、进程调度、TCP 三次握手等核心知识点。
- **游戏化趣味解谜**：融入策略与操作元素，玩家需通过算法选择、参数调优或命令组装来通关。
- **双引擎驱动**：采用 **Phaser 3** 游戏引擎进行重度场景渲染与物理模拟，同时结合 **React 18** 打造流畅的 HUD 交互与控制台界面。

---

## 📚 考点游戏目录

### 💻 计算机组成原理
* **CPU 指令流水线 (`pipeline`)**: 深入 CPU 内部，管理指令流水线（IF, ID, EX），通过升级执行瓶颈优化吞吐率。
* **流水线工厂轻量版 (`pipeline-factory-react`)**: 基于 React 的流水线交互体验，强化对吞吐量和延迟的直观感知。

### ⚙️ 操作系统
* **进程调度算法 (`cpu-scheduling`)**: 亲自扮演操作系统调度内核，灵活切换 FCFS、SJF、RR 等调度算法，分配时间片，避免进程饥饿。
* **死锁解除 (`deadlock`)**: 实战分析资源分配图，打破循环等待条件，化解系统死锁危机。
* **银行家迷宫 (`bankers-maze`)**: 通过寻找安全序列避开迷宫陷阱，深入掌握死锁避免（银行家算法）。

### 🌐 计算机网络
* **TCP/IP 协议栈 (`network-routing`)**: 手动组装数据包（SYN, ACK, FIN 等），精准计算序列号与确认号，完成建立与断开连接。
* **子网领地划分 (`subnet-territory`)**: 根据 IP 地址与子网掩码，划分网络领地，界定网络号与主机号边界。

### 🗄️ 数据库
* **SQL 注入攻防 (`sql-battle`)**: 编写与分析基础 SQL 语句（GROUP BY, HAVING, 子查询等），作为攻防手段抵御数据危机。

*(更多关卡不断更新中...)*

---

## 🚀 本地开发指南

### 前置要求
- [Node.js](https://nodejs.org/) (版本 >= 18.0.0)
- npm 或 pnpm / yarn

### 安装与运行步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/CodeGame.git
   cd CodeGame
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **复制环境变量示例（可选）**
   ```bash
   cp .env.example .env.local
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   在浏览器打开 `http://localhost:5173` 即可开始游戏体验。

5. **构建生产版本**
   ```bash
   npm run build
   ```

---

## 🌐 部署至 Vercel

本项目支持一键部署至 Vercel：

1. Fork 本仓库到你自己的 GitHub。
2. 登录 [Vercel 控制台](https://vercel.com/)，选择 `Add New Project` -> `Import Git Repository`。
3. Framework Preset 选择 **Vite**，点击 **Deploy** 即可自动构建上线！

---

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **语言**: TypeScript
- **游戏引擎**: Phaser 3
- **样式与UI**: Tailwind CSS, Lucide React
- **状态管理**: Zustand

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 协议开源。欢迎自由学习、修改与分享。
