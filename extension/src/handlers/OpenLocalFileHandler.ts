import * as vscode from "vscode";
import { OpenLocalFileMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";
import { FileManager } from "../managers/FileManager";

/**
 * 打开本地文件处理器
 */
export class OpenLocalFileHandler extends MessageHandler {
    private fileManager: FileManager;

    constructor(context: vscode.ExtensionContext) {
        super(context);
        this.fileManager = FileManager.getInstance();
    }

    handle(message: OpenLocalFileMessage): void {
        vscode.window.showInformationMessage(message.path);
        this.fileManager.openLocalFile(message.path);
    }

    getSupportedCommands(): string[] {
        return ["openLocalFile"];
    }
} 