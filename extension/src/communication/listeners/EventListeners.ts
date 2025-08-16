import * as vscode from "vscode";
import { FileManager } from "../../pkg/managers/FileManager";
import { ExtensionCommand, UpdateMarkdownMessage } from "@supernode/shared";

export class EventListeners {
    private static instance: EventListeners;
    private fileManager: FileManager;
    private disposables: vscode.Disposable[] = [];

    private constructor() {
        this.fileManager = FileManager.getInstance();
    }

    public static getInstance(): EventListeners {
        if (!EventListeners.instance) {
            EventListeners.instance = new EventListeners();
        }
        return EventListeners.instance;
    }

    /**
     * 注册文件选择变化监听器
     */
    public registerFileChangeListener(
        onMarkdownUpdate: (message: UpdateMarkdownMessage) => void
    ): vscode.Disposable {
        const disposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                const document = editor.document;
                console.log("鼠标点击的文档:", document.fileName);
                if (this.fileManager.isMarkdownFile(document)) {
                    const message: UpdateMarkdownMessage = {
                        command: ExtensionCommand.updateMarkdownContent,
                        content: this.fileManager.getFileContent(document),
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

        this.disposables.push(disposable);
        return disposable;
    }

    /**
     * 注册文档内容变化监听器
     */
    public registerDocumentChangeListener(
        onMarkdownUpdate: (message: UpdateMarkdownMessage) => void
    ): vscode.Disposable {
        const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
            const document = event.document;
            if (
                this.fileManager.isMarkdownFile(document) &&
                vscode.window.activeTextEditor?.document === document
            ) {
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: this.fileManager.getFileContent(document),
                    fileName: document.fileName,
                };
                onMarkdownUpdate(message);
            }
        });

        this.disposables.push(disposable);
        return disposable;
    }

    /**
     * 清理所有监听器
     */
    public dispose(): void {
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
} 