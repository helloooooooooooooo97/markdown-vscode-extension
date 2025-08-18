import * as vscode from "vscode";
import { WebviewMessage, ShowMessage, OpenLocalFileMessage, UpdateMarkdownContentFromWebviewMessage, VscodeEventSource, SetEventSourceMessage } from "@supernode/shared";
import { FileManager } from "../service/file";
import EventSource from "../event/source";

// 从webview接收来的消息，然后去操作现有的
export class MessageHandler {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async handleMessage(message: WebviewMessage): Promise<void> {
        try {
            switch (message.command) {
                case "showMessage":
                    this.handleShowMessage(message as ShowMessage);
                    break;
                case "openLocalFile":
                    await this.handleOpenLocalFile(message as OpenLocalFileMessage);
                    break;
                case "updateMarkdownContentFromWebview":
                    await this.handleUpdateMarkdownContent(message as UpdateMarkdownContentFromWebviewMessage);
                    break;
                case "webviewError":
                    this.handleWebviewError(message);
                    break;
                case "webviewReady":
                    this.handleWebviewReady(message);
                    break;
                case "debugInfo":
                    this.handleDebugInfo(message);
                    break;
                case "setEventSource":
                    this.handleSetEventSource(message as SetEventSourceMessage);
                    break;
                default:
                    console.log("未知消息类型:", message.command);
            }
        } catch (error) {
            console.error(`处理消息 ${message.command} 时发生错误:`, error);
            vscode.window.showErrorMessage(`处理消息时发生错误: ${error}`);
        }
    }

    private handleShowMessage(message: ShowMessage): void {
        vscode.window.showInformationMessage(message.text);
    }

    private async handleOpenLocalFile(message: OpenLocalFileMessage): Promise<void> {
        await FileManager.openLocalFile(message.path);
    }

    private async handleUpdateMarkdownContent(message: UpdateMarkdownContentFromWebviewMessage): Promise<void> {
        if (message.fileName) {
            await FileManager.updateMarkdownContent(message.fileName, message.content);
        } else {
            console.error("更新 Markdown 内容失败：缺少文件名");
            vscode.window.showErrorMessage("更新失败：缺少文件名");
        }
    }

    private handleWebviewError(message: any): void {
        console.error("Webview 错误:", message);
    }

    private handleWebviewReady(message: any): void {
        console.log("Webview 准备就绪:", message);
    }

    private handleDebugInfo(message: any): void {
        console.log("调试信息:", message);
    }

    private handleSetEventSource(message: SetEventSourceMessage): void {
        if (message.source === "webview") {
            EventSource.set(VscodeEventSource.WEBVIEW);
            console.log("事件来源已设置为 WEBVIEW");
        }
    }
}

export class MessageSender {

}