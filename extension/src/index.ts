import * as vscode from "vscode";

import { StatusBarManager } from "./service/StatusBarManager";
import { CommandManager } from "./event/command";
import { EventListeners } from "./event/listener";
import { AutoPreviewService } from "./service/auto_preview";
import { MarkdownWebviewProvider } from "./event/webview";
import { MarkdownFileScannerService } from "./service/markdown_file_analyzer";

export function activate(context: vscode.ExtensionContext) {
  console.log("Supernode Markdown Extension is now active!");

  // 注册事件：命令事件、
  const commandDisposables = CommandManager.registerCommands();
  const eventDisposables = EventListeners.registerAllListeners(context);

  // 设置扩展上下文
  MarkdownWebviewProvider.extensionContext = context;

  // 启动自动预览服务
  AutoPreviewService.start();

  // 启动时扫描Markdown文件并输出JSON
  MarkdownFileScannerService.startScanAndExport().catch(error => {
    console.error("启动时Markdown文件扫描失败:", error);
  });

  // 将所有可释放资源添加到上下文
  context.subscriptions.push(
    ...commandDisposables,
    ...eventDisposables,
    StatusBarManager.getStatusBarItem()
  );
}

export function deactivate() {
  console.log("Supernode Markdown Extension is now deactivated!");
  CommandManager.dispose();
  EventListeners.dispose();
  StatusBarManager.dispose();
}
