import * as vscode from "vscode";
import { FileManager } from "../service/file";
import { ExtensionCommand, UpdateMarkdownMessage } from "@supernode/shared";
import { MarkdownWebviewProvider } from "../event/webview";

/**
 * 事件处理控制器
 */
export class EventController {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    /**
     * 处理文件选择变化
     */
    public handleFileChange(editor: vscode.TextEditor | undefined): void {
        if (editor) {
            const document = editor.document;
            console.log("鼠标点击的文档:", document.fileName);

            if (FileManager.isMarkdownFile(document)) {
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: FileManager.getFileContent(document),
                    fileName: document.fileName,
                };
                this.sendMessageToWebview(message);
            } else {
                // 如果不是markdown或mdx文件，清空内容
                const clearMessage: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: "",
                    fileName: "",
                };
                this.sendMessageToWebview(clearMessage);
            }
        }
    }

    /**
     * 处理文档内容变化
     */
    public handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
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
            this.sendMessageToWebview(message);
        }
    }

    /**
     * 发送消息到 Webview
     */
    private sendMessageToWebview(message: UpdateMarkdownMessage): void {
        if (MarkdownWebviewProvider.currentPanel) {
            MarkdownWebviewProvider.currentPanel.sendMessage(message);
        }
    }
} 