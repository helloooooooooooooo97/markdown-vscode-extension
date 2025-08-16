import * as vscode from "vscode";
import { WebviewErrorMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";

/**
 * Webview错误处理器
 */
export class WebviewErrorHandler extends MessageHandler {
    handle(message: WebviewErrorMessage): void {
        console.error("Webview 报告错误:", message.error);
        if (message.stack) {
            console.error("错误堆栈:", message.stack);
        }
        if (message.filename) {
            console.error("错误文件:", message.filename, "行:", message.lineno, "列:", message.colno);
        }
        vscode.window.showErrorMessage(`预览错误: ${message.error}`);
    }

    getSupportedCommands(): string[] {
        return ["webviewError"];
    }
} 