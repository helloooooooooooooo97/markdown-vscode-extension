// 基础消息接口
export interface WebviewMessage {
    command: string;
    [key: string]: any;
}

//----------------------------------EXTENSION TO WEBVIEW----------------------------------

// 更新 Markdown 内容消息
export interface UpdateMarkdownMessage extends WebviewMessage {
    command: "updateMarkdownContent";
    content: string;
    fileName: string;
}

// 显示消息
export interface ShowMessage extends WebviewMessage {
    command: "showMessage";
    text: string;
}


// 打开本地文件消息
export interface OpenLocalFileMessage extends WebviewMessage {
    command: "openLocalFile";
    path: string;
}

//----------------------------------WEBVIEW TO EXTENSION----------------------------------

// 从 WebView 更新 Markdown 内容消息
export interface UpdateMarkdownContentFromWebviewMessage extends WebviewMessage {
    command: "updateMarkdownContentFromWebview";
    content: string;
}

// WebView 错误消息
export interface WebviewErrorMessage extends WebviewMessage {
    command: "webviewError";
    error: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
}

// WebView 准备就绪消息
export interface WebviewReadyMessage extends WebviewMessage {
    command: "webviewReady";
}

// 调试信息消息
export interface DebugInfoMessage extends WebviewMessage {
    command: "debugInfo";
    info: any;
} 