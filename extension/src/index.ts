import * as vscode from "vscode";

import { StatusBarManager } from "./service/layout/status_bar";
import { CommandManager } from "./event/command";
import { EventListeners } from "./event/listener";
import { AutoPreviewService } from "./service/auto_preview";
import { MarkdownWebviewProvider } from "./event/webview";
import { MarkdownFileScannerService } from "./service/markdown_file_analyzer";
import { EventController } from "./controller/listener";

export function activate(context: vscode.ExtensionContext) {
  console.log("Supernode Markdown Extension is now active!");

  // 初始化事件控制器
  const eventController = new EventController(context);

  // 注册事件：命令事件、
  const commandDisposables = CommandManager.registerCommands();
  const eventDisposables = EventListeners.registerAllListeners(context, eventController);

  // 设置扩展上下文
  MarkdownWebviewProvider.extensionContext = context;

  // 启动自动预览服务
  AutoPreviewService.start();

  // 启动时扫描Markdown文件并输出JSON
  MarkdownFileScannerService.startScanAndExport().catch(error => {
    console.error("启动时Markdown文件扫描失败:", error);
  });

  // 启动文件监听服务
  eventController.startFileWatching();

  // 将所有可释放资源添加到上下文
  context.subscriptions.push(
    ...commandDisposables,
    ...eventDisposables,
    StatusBarManager.getStatusBarItem(),
    eventController // 添加事件控制器到订阅列表，确保在扩展停用时正确释放资源
  );
}

export function deactivate() {
  console.log("Supernode Markdown Extension is now deactivated!");
  CommandManager.dispose();
  EventListeners.dispose();
  StatusBarManager.dispose();
}
