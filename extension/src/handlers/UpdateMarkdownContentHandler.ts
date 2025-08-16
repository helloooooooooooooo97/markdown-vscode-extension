import * as vscode from "vscode";
import { UpdateMarkdownContentFromWebviewMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";
import { FileManager } from "../managers/FileManager";

/**
 * 更新Markdown内容处理器
 */
export class UpdateMarkdownContentHandler extends MessageHandler {
    private fileManager: FileManager;

    constructor(context: vscode.ExtensionContext) {
        super(context);
        this.fileManager = FileManager.getInstance();
    }

    async handle(message: UpdateMarkdownContentFromWebviewMessage): Promise<void> {
        vscode.window.showInformationMessage(message.content);
        // 从消息中获取文件路径，如果没有则使用当前活动文档
        const filePath = message.fileName || vscode.window.activeTextEditor?.document.fileName;
        if (filePath) {
            await this.fileManager.updateMarkdownContent(filePath, message.content);
        } else {
            vscode.window.showErrorMessage("无法确定要更新的文件路径");
        }
    }

    getSupportedCommands(): string[] {
        return ["updateMarkdownContentFromWebview"];
    }
} 