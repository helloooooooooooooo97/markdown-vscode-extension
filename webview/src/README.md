# Webview 项目结构

## 组件分离

项目已经将功能分离为以下组件：

### App.tsx
- 主应用组件
- 负责初始化 VSCode API 和消息处理器
- 使用 Tabs 组织不同的功能页面

### MarkdownView 组件
- 负责 Markdown 内容的渲染
- 处理加载状态显示
- 直接使用 store 中的 content 和 isLoading 状态

### TestPanel 组件
- 提供调试和测试功能
- 包含通信测试、文件链接测试等
- 显示当前状态信息

## 类型安全

项目使用本地定义的消息类型，避免导入 shared 包中可能包含 Node.js 模块的文件：

### 消息类型
- `WebviewMessage`: 基础消息接口
- `WebviewCommand`: Webview 发送的命令枚举
- `ExtensionCommand`: Extension 发送的命令枚举
- `CommonCommand`: 通用命令枚举
- 各种具体的消息类型（如 `UpdateMarkdownMessage`, `ShowMessage` 等）

### 使用方式
```typescript
import { 
  WebviewCommand, 
  ExtensionCommand,
  UpdateMarkdownMessage 
} from '../types/messages';

// 发送类型安全的消息
const message: UpdateMarkdownMessage = {
  command: ExtensionCommand.updateMarkdownContent,
  content: "Hello World",
  fileName: "test.md"
};
```

## 状态管理

使用 Zustand store 统一管理状态：
- `content`: Markdown 原始内容
- `isLoading`: 加载状态
- `currentFileName`: 当前文件名
- `docs`: 解析后的文档块

## 消息处理

### MessageReceiveHandler
- 处理从 extension 到 webview 的消息
- 使用 shared 包的类型定义确保类型安全
- 直接操作 store 更新状态

### MessageSendManager
- 处理错误事件和未处理的 Promise 拒绝
- 发送错误消息到 extension
- 使用 shared 包的类型定义

### TestFunctionManager
- 提供测试功能
- 发送消息到 extension
- 从 store 获取状态信息
- 使用 shared 包的类型定义

## 文件结构

```
src/
├── components/
│   ├── MarkdownView.tsx    # Markdown 渲染组件
│   ├── TestPanel.tsx       # 测试面板组件
│   └── index.ts           # 组件导出
├── router/
│   ├── MessageReceiveHandler.ts # 消息接收处理器
│   ├── MessageSendManager.ts    # 消息发送管理器
│   ├── TestFunctionManager.ts   # 测试功能管理器
│   └── index.ts                 # 路由导出
├── store/
│   └── markdown/          # Markdown 状态管理
├── api/
│   └── vscode.ts          # VSCode API 接口
├── types/
│   ├── messages.ts        # 消息类型定义
│   └── index.ts           # 类型导出
└── App.tsx                # 主应用组件
``` 