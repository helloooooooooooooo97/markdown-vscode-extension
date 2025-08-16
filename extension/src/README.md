# 扩展架构说明

## 重构后的架构

本次重构将原来的单体 `MarkdownWebviewProvider` 类拆分为更清晰的模块化架构：

### 1. 处理器 (Handlers)

位于 `handlers/` 目录下，每个处理器负责处理特定类型的消息：

- `MessageHandler.ts` - 处理器基类
- `ShowMessageHandler.ts` - 处理显示消息
- `OpenLocalFileHandler.ts` - 处理打开本地文件
- `UpdateMarkdownContentHandler.ts` - 处理更新Markdown内容
- `WebviewErrorHandler.ts` - 处理Webview错误
- `WebviewReadyHandler.ts` - 处理Webview准备就绪
- `DebugInfoHandler.ts` - 处理调试信息

### 2. 路由器 (Routers)

位于 `routers/` 目录下：

- `MessageRouter.ts` - 消息路由器，负责将消息分发到对应的处理器

### 3. 工厂 (Factories)

位于 `factories/` 目录下：

- `HandlerFactory.ts` - 处理器工厂，负责创建和配置所有处理器

### 4. 提供者 (Providers)

- `MarkdownWebviewProvider.ts` - 重构后的Webview提供者，现在只负责：
  - Webview面板的创建和管理
  - 消息的接收和路由
  - HTML内容的生成

## 架构优势

1. **单一职责原则**: 每个类都有明确的职责
2. **开闭原则**: 新增消息类型只需要添加新的处理器，无需修改现有代码
3. **可测试性**: 每个处理器都可以独立测试
4. **可维护性**: 代码结构更清晰，易于理解和维护
5. **可扩展性**: 可以轻松添加新的消息类型和处理器

## 使用方式

1. 创建新的消息处理器，继承 `MessageHandler` 基类
2. 在 `HandlerFactory` 中注册新的处理器
3. 路由器会自动处理消息分发

## 消息流程

1. Webview发送消息到 `MarkdownWebviewProvider`
2. `MarkdownWebviewProvider` 将消息传递给 `MessageRouter`
3. `MessageRouter` 根据消息类型找到对应的处理器
4. 处理器执行具体的业务逻辑 