import * as vscode from "vscode";

import { UpdateMarkdownMessage } from "@supernode/shared";
import { StatusBarManager } from "./pkg/managers/StatusBarManager";
import { CommandManager } from "./vscode/commands/CommandManager";
import { EventListeners } from "./communication/listeners/EventListeners";
import { AutoPreviewService } from "./pkg/services/AutoPreviewService";
import { MarkdownWebviewProvider } from "./vscode/service/webview_service";
import { MarkdownFileScannerService } from "./pkg/services/MarkdownFileScannerService";

export function activate(context: vscode.ExtensionContext) {
  console.log("Supernode Markdown Extension is now active!");

  // 设置扩展上下文
  MarkdownWebviewProvider.extensionContext = context;

  // 初始化各个管理器和服务
  const statusBarManager = StatusBarManager.getInstance();
  const commandManager = CommandManager.getInstance();
  const eventListeners = EventListeners.getInstance();
  const autoPreviewService = AutoPreviewService.getInstance();
  const markdownScannerService = MarkdownFileScannerService.getInstance();

  // 注册命令
  const commandDisposables = commandManager.registerCommands();

  // 注册事件监听器
  const fileChangeDisposable = eventListeners.registerFileChangeListener(
    (message: UpdateMarkdownMessage) => {
      if (MarkdownWebviewProvider.currentPanel) {
        MarkdownWebviewProvider.currentPanel.sendMessage(message);
      }
    }
  );

  const documentChangeDisposable = eventListeners.registerDocumentChangeListener(
    (message: UpdateMarkdownMessage) => {
      if (MarkdownWebviewProvider.currentPanel) {
        MarkdownWebviewProvider.currentPanel.sendMessage(message);
      }
    }
  );

  // 启动自动预览服务
  autoPreviewService.start();

  // 启动时扫描Markdown文件并输出JSON
  markdownScannerService.startScanAndExport().catch(error => {
    console.error("启动时Markdown文件扫描失败:", error);
  });

  // 将所有可释放资源添加到上下文
  context.subscriptions.push(
    ...commandDisposables,
    fileChangeDisposable,
    documentChangeDisposable,
    statusBarManager.getStatusBarItem()
  );
}

export function deactivate() {
  console.log("Supernode Markdown Extension is now deactivated!");
  StatusBarManager.getInstance().dispose();
  CommandManager.getInstance().dispose();
  EventListeners.getInstance().dispose();
}
