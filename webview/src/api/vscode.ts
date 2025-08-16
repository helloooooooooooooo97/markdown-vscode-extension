// VSCode API 接口定义
export interface VSCodeAPI {
    postMessage: (message: any) => void;
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
            this.instance.postMessage({ command: "webviewReady" });

            return this.instance;
        }
        return null;
    }

    static getInstance(): VSCodeAPI | null {
        return this.instance;
    }

    static postMessage(message: any): void {
        if (this.instance) {
            this.instance.postMessage(message);
        } else {
            console.error("VSCode API 未初始化");
        }
    }
}
