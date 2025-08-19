import * as vscode from "vscode";
import { WebviewMessage, ShowMessage, OpenLocalFileMessage, UpdateMarkdownContentFromWebviewMessage, VscodeEventSource, SetEventSourceMessage, CommonCommand, WebviewCommand, ExtensionCommand } from "@supernode/shared";
import { FileManager } from "../service/file";
import { MarkdownFileScannerService } from "../service/markdown_file_analyzer";
import EventSource from "../event/source";
import { MarkdownWebviewProvider } from "../event/webview";

// 从webview接收来的消息，然后去操作现有的
export class MessageHandler {
    private context: vscode.ExtensionContext;
    private webviewProvider: MarkdownWebviewProvider | undefined; // 添加webview提供者引用

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public setWebviewProvider(provider: MarkdownWebviewProvider): void {
        this.webviewProvider = provider;
    }

    public async handleMessage(message: WebviewMessage): Promise<void> {
        try {
            switch (message.command) {
                case CommonCommand.showMessage:
                    this.handleShowMessage(message as ShowMessage);
                    break;
                case CommonCommand.openLocalFile:
                    await this.handleOpenLocalFile(message as OpenLocalFileMessage);
                    break;
                case WebviewCommand.updateMarkdownContentFromWebview:
                    await this.handleUpdateMarkdownContent(message as UpdateMarkdownContentFromWebviewMessage);
                    break;
                case WebviewCommand.webviewError:
                    this.handleWebviewError(message);
                    break;
                case WebviewCommand.webviewReady:
                    this.handleWebviewReady(message);
                    break;
                case WebviewCommand.debugInfo:
                    this.handleDebugInfo(message);
                    break;
                case WebviewCommand.setEventSource:
                    this.handleSetEventSource(message as SetEventSourceMessage);
                    break;
                case WebviewCommand.getFileMetadata:
                    await this.handleGetFileMetadata(message);
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

    private async handleGetFileMetadata(message: WebviewMessage): Promise<void> {
        try {
            // 使用 MarkdownFileScannerService 扫描文件
            const stats = await MarkdownFileScannerService.scanMarkdownFiles();

            // 通过webview提供者发送消息
            if (this.webviewProvider) {
                this.webviewProvider.updateFileMetadata(stats.files);
                console.log("文件元数据已发送到webview，共", stats.files.length, "个文件");
            } else {
                console.error("webview提供者未设置，无法发送消息");
            }

        } catch (error) {
            console.error("获取文件元数据失败:", error);
            vscode.window.showErrorMessage(`获取文件元数据失败: ${error}`);
        }
    }
}

export class MessageSender {

}