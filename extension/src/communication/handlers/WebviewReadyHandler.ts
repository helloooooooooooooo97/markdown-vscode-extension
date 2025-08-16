import * as vscode from "vscode";
import { WebviewReadyMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";

/**
 * Webview准备就绪处理器
 */
export class WebviewReadyHandler extends MessageHandler {
    handle(message: WebviewReadyMessage): void {
        console.log("Webview 已准备就绪");
    }

    getSupportedCommands(): string[] {
        return ["webviewReady"];
    }
} 