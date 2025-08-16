import * as vscode from "vscode";
import { DebugInfoMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";

/**
 * 调试信息处理器
 */
export class DebugInfoHandler extends MessageHandler {
    handle(message: DebugInfoMessage): void {
        console.log("Webview 调试信息:", message.info);
    }

    getSupportedCommands(): string[] {
        return ["debugInfo"];
    }
} 