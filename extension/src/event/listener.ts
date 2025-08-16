import * as vscode from "vscode";
import { FileManager } from "../service/file";
import { ExtensionCommand, UpdateMarkdownMessage } from "@supernode/shared";
import { MarkdownWebviewProvider } from "./webview";

export class EventListeners {
    private static disposables: vscode.Disposable[] = [];
    /**
     * 注册文件选择变化监听器
     */
    public static registerFileChangeListener(
        onMarkdownUpdate: (message: UpdateMarkdownMessage) => void
    ): vscode.Disposable {
        const disposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                const document = editor.document;
                console.log("鼠标点击的文档:", document.fileName);
                if (FileManager.isMarkdownFile(document)) {
                    const message: UpdateMarkdownMessage = {
                        command: ExtensionCommand.updateMarkdownContent,
                        content: FileManager.getFileContent(document),
                        fileName: document.fileName,
                    };
                    onMarkdownUpdate(message);
                } else {
                    // 如果不是markdown或mdx文件，清空内容
                    const clearMessage: UpdateMarkdownMessage = {
                        command: ExtensionCommand.updateMarkdownContent,
                        content: "",
                        fileName: "",
                    };
                    onMarkdownUpdate(clearMessage);
                }
            }
        });

        EventListeners.disposables.push(disposable);
        return disposable;
    }

    /**
     * 注册文档内容变化监听器
     */
    public static registerDocumentChangeListener(
        onMarkdownUpdate: (message: UpdateMarkdownMessage) => void
    ): vscode.Disposable {
        const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
            const document = event.document;
            if (
                FileManager.isMarkdownFile(document) &&
                vscode.window.activeTextEditor?.document === document
            ) {
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: FileManager.getFileContent(document),
                    fileName: document.fileName,
                };
                onMarkdownUpdate(message);
            }
        });

        EventListeners.disposables.push(disposable);
        return disposable;
    }

    /**
     * 注册所有事件监听器
     */
    public static registerAllListeners(): vscode.Disposable[] {
        const disposables: vscode.Disposable[] = [];

        // 注册文件选择变化监听器
        const fileChangeDisposable = EventListeners.registerFileChangeListener(
            (message: UpdateMarkdownMessage) => {
                if (MarkdownWebviewProvider.currentPanel) {
                    MarkdownWebviewProvider.currentPanel.sendMessage(message);
                }
            }
        );

        // 注册文档内容变化监听器
        const documentChangeDisposable = EventListeners.registerDocumentChangeListener(
            (message: UpdateMarkdownMessage) => {
                if (MarkdownWebviewProvider.currentPanel) {
                    MarkdownWebviewProvider.currentPanel.sendMessage(message);
                }
            }
        );

        disposables.push(fileChangeDisposable, documentChangeDisposable);
        return disposables;
    }

    /**
     * 清理所有监听器
     */
    public static dispose(): void {
        EventListeners.disposables.forEach(disposable => disposable.dispose());
        EventListeners.disposables = [];
    }
} 