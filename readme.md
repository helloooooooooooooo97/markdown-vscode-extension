# Supernode VSCode Extension - 重构版

这是一个重构后的 VSCode 扩展项目，采用了更好的架构设计，实现了扩展核心与 Webview 的完全分离。

## 🏗️ 项目架构

```
supernode-vscode-extension-new/
├── packages/
│   ├── extension/          # VSCode 扩展核心
│   │   ├── src/
│   │   │   ├── api/        # API 接口层
│   │   │   ├── webview/    # Webview 管理器
│   │   │   └── extension.ts
│   │   └── package.json
│   └── webview/            # Webview 前端应用
│       ├── src/
│       │   ├── components/ # React 组件
│       │   ├── types/      # 类型定义
│       │   └── utils/      # 工具函数
│       └── package.json
├── shared/                 # 共享类型和常量
└── package.json           # 根配置文件
```

## ✨ 主要特性

- **模块化架构**: 扩展核心与 Webview 完全分离
- **类型安全**: 使用 TypeScript 确保类型安全
- **现代化前端**: 使用 React 18 + Vite 构建 Webview
- **开发体验**: 支持热重载和并发开发
- **Markdown 预览**: 实时预览 Markdown 文件内容

## 🚀 快速开始

### 安装依赖

```bash
npm run install:all
```

### 开发模式

```bash
npm run dev
```

这将同时启动扩展的监听模式和 Webview 的开发服务器。

### 构建项目

```bash
npm run build
```

### 清理构建文件

```bash
npm run clean
```

## 📦 包结构说明

### Extension 包 (`packages/extension/`)

VSCode 扩展的核心逻辑，负责：
- 扩展激活和生命周期管理
- 命令注册
- Webview 面板管理
- 文件监听和内容同步

### Webview 包 (`packages/webview/`)

独立的前端应用，负责：
- React 组件渲染
- 用户界面交互
- 与扩展的通信
- Markdown 内容展示

### Shared 包 (`shared/`)

共享的类型定义和常量，确保扩展和 Webview 之间的类型一致性。

## 🔧 开发指南

### 添加新功能

1. 在 `shared/types/` 中定义新的消息类型
2. 在 `packages/extension/src/api/` 中实现扩展端逻辑
3. 在 `packages/webview/src/components/` 中实现前端界面
4. 更新相应的类型定义和通信协议

### 调试

- 扩展端：使用 VSCode 的扩展调试功能
- Webview：使用浏览器开发者工具

## 📝 许可证

MIT License