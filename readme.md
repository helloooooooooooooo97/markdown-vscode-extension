# Supernode VSCode Extension - 重构版

这是一个重构后的 VSCode 扩展项目，采用了更好的架构设计，实现了扩展核心与 Webview 的完全分离。

## 🏗️ 项目架构

```
supernode-vscode-extension-new/
├── extension/              # VSCode 扩展核心
│   ├── src/
│   │   └── extension.ts    # 扩展主入口文件
│   ├── dist/               # 构建输出目录
│   ├── package.json        # 扩展配置
│   └── tsconfig.json       # TypeScript 配置
├── webview/                # Webview 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── App.tsx         # 主应用组件
│   │   ├── main.tsx        # 应用入口
│   │   └── App.css         # 样式文件
│   ├── dist/               # 构建输出目录
│   ├── index.html          # HTML 模板
│   ├── vite.config.ts      # Vite 配置
│   └── package.json        # 前端依赖配置
├── shared/                 # 共享类型和常量
│   ├── types/              # 类型定义
│   ├── constants/          # 常量定义
│   ├── index.ts            # 导出文件
│   └── package.json        # 共享包配置
├── package.json            # 根配置文件
├── makefile                # 构建脚本
└── readme.md               # 项目说明
```

## ✨ 主要特性

- **模块化架构**: 扩展核心与 Webview 完全分离
- **类型安全**: 使用 TypeScript 确保类型安全
- **现代化前端**: 使用 React 18 + Vite 构建 Webview
- **开发体验**: 支持热重载和并发开发
- **Markdown 预览**: 实时预览 Markdown 文件内容

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- VSCode >= 1.74.0

### 安装依赖

```bash
# 安装所有依赖（推荐）
npm run install:all

# 或者使用 make 命令
make install
```

### 开发模式

```bash
# 启动开发模式（同时监听 extension 和 webview）
npm run dev

# 或者使用 make 命令
make dev
```

这将同时启动扩展的监听模式和 Webview 的开发服务器。

### 构建项目

```bash
# 构建所有包
npm run build

# 或者使用 make 命令
make build
```

### 清理构建文件

```bash
# 清理所有构建文件
npm run clean

# 或者使用 make 命令
make clean
```

## 🎯 VSCode 扩展启动命令

### 调试模式启动

1. **准备调试环境**
   ```bash
   # 快速构建并准备调试
   make debug
   ```

2. **在 VSCode 中启动调试**
   - 按 `F5` 键启动调试
   - 或者点击调试面板中的"启动调试"按钮

3. **测试扩展功能**
   - 在新窗口中打开一个 `.md` 文件
   - 使用命令面板（`Ctrl+Shift+P`）运行 `Supernode: 打开 Markdown 预览`
   - 或者点击编辑器标题栏中的预览按钮

### 命令说明

| 命令 | 说明 | 快捷键 |
|------|------|--------|
| `Supernode: 打开 Markdown 预览` | 打开当前 Markdown 文件的预览面板 | 无 |

### 激活条件

扩展会在以下情况下自动激活：
- 打开 Markdown 文件（`.md`, `.mdx`）
- 执行预览命令

## 🔧 开发指南

### 常用命令

```bash
# 一键启动（安装依赖 + 构建 + 调试准备）
make start

# 快速重启（清理并重新构建）
make restart

# 检查构建状态
make status

# 监听模式构建
make watch

# 自动构建模式（推荐）
make auto
```

### 添加新功能

1. 在 `shared/types/` 中定义新的消息类型
2. 在 `extension/src/extension.ts` 中实现扩展端逻辑
3. 在 `webview/src/components/` 中实现前端界面
4. 更新相应的类型定义和通信协议

### 调试技巧

- **扩展端调试**: 使用 VSCode 的扩展调试功能，设置断点
- **Webview 调试**: 在预览面板中右键选择"检查元素"打开开发者工具
- **日志查看**: 在 VSCode 的输出面板中选择"Supernode Extension"查看日志

### 文件结构说明

#### Extension 包 (`extension/`)

VSCode 扩展的核心逻辑，负责：
- 扩展激活和生命周期管理
- 命令注册和响应
- Webview 面板管理
- 文件监听和内容同步

#### Webview 包 (`webview/`)

独立的前端应用，负责：
- React 组件渲染
- 用户界面交互
- 与扩展的通信
- Markdown 内容展示

#### Shared 包 (`shared/`)

共享的类型定义和常量，确保扩展和 Webview 之间的类型一致性。

## 📝 许可证

MIT License