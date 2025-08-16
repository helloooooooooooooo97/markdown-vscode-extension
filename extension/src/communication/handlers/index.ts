import * as vscode from "vscode";
import { MessageHandler } from "./MessageHandler";
import { ShowMessageHandler } from "./ShowMessageHandler";
import { OpenLocalFileHandler } from "./OpenLocalFileHandler";
import { UpdateMarkdownContentHandler } from "./UpdateMarkdownContentHandler";
import { WebviewErrorHandler } from "./WebviewErrorHandler";
import { WebviewReadyHandler } from "./WebviewReadyHandler";
import { DebugInfoHandler } from "./DebugInfoHandler";

export class HandlerFactory {
    private context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }
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