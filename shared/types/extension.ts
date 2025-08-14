import * as vscode from "vscode";

// Webview 提供者接口
export interface IWebviewProvider {
  createOrShow(extensionUri: vscode.Uri): void;
  sendMessage(message: any): void;
  dispose(): void;
}

// 扩展上下文接口
export interface IExtensionContext {
  subscriptions: vscode.Disposable[];
  extensionUri: vscode.Uri;
}

// 命令注册器接口
export interface ICommandRegistrar {
  registerCommand(
    command: string,
    callback: (...args: any[]) => any
  ): vscode.Disposable;
}

// 文件监听器接口
export interface IFileWatcher {
  onDidChangeActiveTextEditor(
    callback: (editor: vscode.TextEditor | undefined) => void
  ): vscode.Disposable;
  onDidChangeTextDocument(
    callback: (event: vscode.TextDocumentChangeEvent) => void
  ): vscode.Disposable;
}

// 状态栏项接口
export interface IStatusBarItem {
  text: string;
  tooltip: string;
  command: string;
  show(): void;
  dispose(): void;
}
