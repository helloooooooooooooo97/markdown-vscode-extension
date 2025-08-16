import { VSCodeAPI } from '../api/vscode';
import { useMarkdownStore } from '../store/markdown/store';
import {
    WebviewCommand,
    UpdateMarkdownContentFromWebviewMessage,
    DebugInfoMessage,
    ShowMessage,
    OpenLocalFileMessage,
    CommonCommand
} from '../types/messages';

// 简化的测试功能管理器
export class TestFunctionManager {

    testCommunication(): void {
        const message: ShowMessage = {
            command: CommonCommand.showMessage,
            text: "来自 Webview 的测试消息！"
        };
        VSCodeAPI.postMessage(message);
    }

    testLocalFileLink(): void {
        const message: OpenLocalFileMessage = {
            command: CommonCommand.openLocalFile,
            path: "../test.md"
        };
        VSCodeAPI.postMessage(message);
    }

    testUpdateMarkdownContent(): void {
        const message: UpdateMarkdownContentFromWebviewMessage = {
            command: WebviewCommand.updateMarkdownContentFromWebview,
            content: "Hello, World!",
            fileName: "test.md"
        };
        VSCodeAPI.postMessage(message);
    }

    sendDebugInfo(): void {
        const { content, isLoading } = useMarkdownStore.getState();
        const message: DebugInfoMessage = {
            command: WebviewCommand.debugInfo,
            info: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                contentLength: content.length,
                isLoading: isLoading
            }
        };
        VSCodeAPI.postMessage(message);
    }
} 