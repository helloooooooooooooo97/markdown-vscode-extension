import { WebviewMessage, WebviewCommand, WebviewReadyMessage, UpdateMarkdownContentFromWebviewMessage, CommonCommand, ShowMessage, OpenLocalFileMessage, DebugInfoMessage, WebviewErrorMessage } from '@supernode/shared/src';

// VSCode API 接口定义
export interface VSCodeAPI {
    postMessage: (message: WebviewMessage) => void;
    getState: () => any;
    setState: (state: any) => void;
}

// 全局类型声明
declare global {
    interface Window {
        acquireVsCodeApi: () => VSCodeAPI;
        vscode?: VSCodeAPI;
    }
}

// 简化的 VSCode API 管理器
export class VSCodeAPI {
    private static instance: VSCodeAPI | null = null;

    static initialize(): VSCodeAPI | null {
        if (window.acquireVsCodeApi) {
            this.instance = window.acquireVsCodeApi();
            window.vscode = this.instance;

            // 发送初始化完成消息
            const readyMessage: WebviewReadyMessage = {
                command: WebviewCommand.webviewReady
            };
            this.instance.postMessage(readyMessage);

            return this.instance;
        }
        return null;
    }

    static getInstance(): VSCodeAPI | null {
        return this.instance;
    }

    static postMessage(message: WebviewMessage): void {
        if (this.instance) {
            this.instance.postMessage(message);
        } else {
            console.error("VSCode API 未初始化");
        }
    }

    static changeMarkdownContent(content: string, filename: string): void {
        const message: UpdateMarkdownContentFromWebviewMessage = {
            command: WebviewCommand.updateMarkdownContentFromWebview,
            content: content,
            fileName: filename
        };
        this.postMessage(message);
    }

    static showMessage(message: string): void {
        const showMessage: ShowMessage = {
            command: CommonCommand.showMessage,
            text: message
        };
        this.postMessage(showMessage);
    }

    static openLocalFile(path: string): void {
        const openLocalFile: OpenLocalFileMessage = {
            command: CommonCommand.openLocalFile,
            path: path
        };
        this.postMessage(openLocalFile);
    }

    static sendDebugInfo(content: string, isLoading: boolean, info: string): void {
        const debugInfo: DebugInfoMessage = {
            command: WebviewCommand.debugInfo,
            content: content,
            isLoading: isLoading,
            info: info
        };
        this.postMessage(debugInfo);
    }

    static sendWebviewError(message: { error: string; stack?: string; filename?: string; lineno?: number; colno?: number }): void {
        const webviewError: WebviewErrorMessage = {
            command: WebviewCommand.webviewError,
            ...message
        };
        this.postMessage(webviewError);
    }
}