import * as vscode from "vscode";
import { MessageHandler } from "../handlers";
import {
    ShowMessageHandler,
    OpenLocalFileHandler,
    UpdateMarkdownContentHandler,
    WebviewErrorHandler,
    WebviewReadyHandler,
    DebugInfoHandler
} from "../handlers";

/**
 * 处理器工厂
 */
export class HandlerFactory {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    /**
     * 创建所有处理器
     */
    public createAllHandlers(): Array<{ command: string; handler: MessageHandler }> {
        return [
            { command: "showMessage", handler: new ShowMessageHandler(this.context) },
            { command: "openLocalFile", handler: new OpenLocalFileHandler(this.context) },
            { command: "updateMarkdownContentFromWebview", handler: new UpdateMarkdownContentHandler(this.context) },
            { command: "webviewError", handler: new WebviewErrorHandler(this.context) },
            { command: "webviewReady", handler: new WebviewReadyHandler(this.context) },
            { command: "debugInfo", handler: new DebugInfoHandler(this.context) }
        ];
    }
} 