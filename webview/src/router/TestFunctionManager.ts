import { VSCodeAPI } from '../api/vscode';
import { useMarkdownStore } from '../store/markdown/store';

// 简化的测试功能管理器
export class TestFunctionManager {

    testCommunication(): void {
        VSCodeAPI.postMessage({
            command: "showMessage",
            text: "来自 Webview 的测试消息！"
        });
    }

    testLocalFileLink(): void {
        VSCodeAPI.postMessage({
            command: "openLocalFile",
            path: "../test.md"
        });
    }

    testUpdateMarkdownContent(): void {
        VSCodeAPI.postMessage({
            command: "updateMarkdownContentFromWebview",
            content: "Hello, World!",
            fileName: "test.md"
        });
    }

    sendDebugInfo(): void {
        const { content, isLoading } = useMarkdownStore.getState();
        VSCodeAPI.postMessage({
            command: "debugInfo",
            info: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                contentLength: content.length,
                isLoading: isLoading
            }
        });
    }
} 