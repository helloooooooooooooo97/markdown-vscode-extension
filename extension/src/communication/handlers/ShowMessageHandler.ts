import * as vscode from "vscode";
import { ShowMessage } from "@supernode/shared";
import { MessageHandler } from "./MessageHandler";

/**
 * 显示消息处理器
 */
export class ShowMessageHandler extends MessageHandler {
    handle(message: ShowMessage): void {
        vscode.window.showInformationMessage(message.text);
    }

    getSupportedCommands(): string[] {
        return ["showMessage"];
    }
} 