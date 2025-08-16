import { VSCodeAPI } from '../api/vscode';
import {
    WebviewCommand,
    WebviewErrorMessage
} from '../types/messages';

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
        console.error("Webview 错误:", event.error);
        const message: WebviewErrorMessage = {
            command: WebviewCommand.webviewError,
            error: event.error?.message || event.message || "未知错误",
            stack: event.error?.stack,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        };
        VSCodeAPI.postMessage(message);
    };

    private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error("未处理的 Promise 拒绝:", event.reason);
        const message: WebviewErrorMessage = {
            command: WebviewCommand.webviewError,
            error: `Promise 拒绝: ${event.reason}`,
            stack: undefined,
            filename: undefined,
            lineno: undefined,
            colno: undefined
        };
        VSCodeAPI.postMessage(message);
    };
} 