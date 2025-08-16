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

## 状态管理

使用 Zustand store 统一管理状态：
- `content`: Markdown 原始内容
- `isLoading`: 加载状态
- `currentFileName`: 当前文件名
- `docs`: 解析后的文档块

## 消息处理

### MessageReceiveHandler
- 处理从 extension 到 webview 的消息
- 直接操作 store 更新状态
- 包含错误处理和事件监听

### TestFunctionManager
- 提供测试功能
- 发送消息到 extension
- 从 store 获取状态信息

## 文件结构

```
src/
├── components/
│   ├── MarkdownView.tsx    # Markdown 渲染组件
│   ├── TestPanel.tsx       # 测试面板组件
│   └── index.ts           # 组件导出
├── handlers/
│   ├── Receiver.ts        # 消息接收处理器
│   ├── TestFunctionManager.ts # 测试功能管理器
│   └── index.ts           # 处理器导出
├── store/
│   └── markdown/          # Markdown 状态管理
├── api/
│   └── vscode.ts          # VSCode API 接口
└── App.tsx                # 主应用组件
``` 