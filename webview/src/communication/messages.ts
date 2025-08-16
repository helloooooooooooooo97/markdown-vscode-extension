export interface WebviewMessage {
    command: string;
    [key: string]: any;
}

// 通用命令枚举
export enum CommonCommand {
    showMessage = "showMessage",
    openLocalFile = "openLocalFile",
}

// Extension 命令枚举
export enum ExtensionCommand {
    updateMarkdownContent = "updateMarkdownContent",
    showMessage = "showMessage",
    openLocalFile = "openLocalFile",
}

// Webview 命令枚举
export enum WebviewCommand {
    updateMarkdownContentFromWebview = "updateMarkdownContentFromWebview",
    webviewError = "webviewError",
    webviewReady = "webviewReady",
    debugInfo = "debugInfo",
}

// Extension 到 Webview 的消息类型
export interface UpdateMarkdownMessage extends WebviewMessage {
    command: ExtensionCommand.updateMarkdownContent;
    content: string;
    fileName: string;
}

export interface ShowMessage extends WebviewMessage {
    command: CommonCommand.showMessage;
    text: string;
}

export interface OpenLocalFileMessage extends WebviewMessage {
    command: CommonCommand.openLocalFile;
    path: string;
}

// Webview 到 Extension 的消息类型
export interface UpdateMarkdownContentFromWebviewMessage extends WebviewMessage {
    command: WebviewCommand.updateMarkdownContentFromWebview;
    content: string;
    fileName?: string;
}

export interface WebviewErrorMessage extends WebviewMessage {
    command: WebviewCommand.webviewError;
    error: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
}

export interface WebviewReadyMessage extends WebviewMessage {
    command: WebviewCommand.webviewReady;
}

export interface DebugInfoMessage extends WebviewMessage {
    command: WebviewCommand.debugInfo;
    info: any;
} 