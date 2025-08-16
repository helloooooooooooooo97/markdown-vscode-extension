import { WebviewMessage, WebviewCommand, WebviewReadyMessage } from '../types/messages';

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
}
