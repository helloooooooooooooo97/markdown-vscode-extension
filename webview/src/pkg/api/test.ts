import { VSCodeAPI } from './vscode';
import { useMarkdownStore } from '../../store/markdown/store';

// 简化的测试功能管理器
export class TestFunctionManager {

    testCommunication(): void {
        VSCodeAPI.showMessage("来自 Webview 的测试消息！");
    }

    testLocalFileLink(): void {
        VSCodeAPI.openLocalFile("../test.md");
    }

    testUpdateMarkdownContent(): void {
        VSCodeAPI.changeMarkdownContent("Hello, World!", "test.md");
    }

    sendDebugInfo(): void {
        const { content, isLoading } = useMarkdownStore.getState();
        VSCodeAPI.sendDebugInfo(content, isLoading, "test");
    }
}   