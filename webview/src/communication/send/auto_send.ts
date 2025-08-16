import { VSCodeAPI } from './manual_vscode';

// 监听器发送
export class MessageSendManager {
    init(): void {
        window.addEventListener("error", this.handleError);
        window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
    }

    destroy(): void {
        window.removeEventListener("error", this.handleError);
        window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    }

    private handleError = (event: ErrorEvent) => {
        VSCodeAPI.sendWebviewError({ error: event.error?.message || event.message || "未知错误", stack: event.error?.stack, filename: event.filename, lineno: event.lineno, colno: event.colno });
    };

    private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        VSCodeAPI.sendWebviewError({ error: `Promise 拒绝: ${event.reason}` });
    };
} 