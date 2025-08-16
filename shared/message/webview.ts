import { WebviewMessage } from "./common";

//----------------------------------WEBVIEW TO EXTENSION----------------------------------

export enum WebviewCommand {
    updateMarkdownContentFromWebview = "updateMarkdownContentFromWebview",
    webviewError = "webviewError",
    webviewReady = "webviewReady",
    debugInfo = "debugInfo",
}

// 从 WebView 更新 Markdown 内容消息
export interface UpdateMarkdownContentFromWebviewMessage extends WebviewMessage {
    command: WebviewCommand.updateMarkdownContentFromWebview;
    content: string;
}

// WebView 错误消息
export interface WebviewErrorMessage extends WebviewMessage {
    command: WebviewCommand.webviewError;
    error: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
}

// WebView 准备就绪消息
export interface WebviewReadyMessage extends WebviewMessage {
    command: WebviewCommand.webviewReady;
}

// 调试信息消息
export interface DebugInfoMessage extends WebviewMessage {
    command: WebviewCommand.debugInfo;
    info: any;
}
