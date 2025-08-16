import { WebviewMessage } from "./common";

//----------------------------------EXTENSION TO WEBVIEW----------------------------------

export enum ExtensionCommand {
    updateMarkdownContent = "updateMarkdownContent",
    showMessage = "showMessage",
    openLocalFile = "openLocalFile",
}

// 更新 Markdown 内容消息
export interface UpdateMarkdownMessage extends WebviewMessage {
    command: ExtensionCommand.updateMarkdownContent;
    content: string;
    fileName: string;
}

// 显示消息
export interface ShowMessage extends WebviewMessage {
    command: ExtensionCommand.showMessage;
    text: string;
}


// 打开本地文件消息
export interface OpenLocalFileMessage extends WebviewMessage {
    command: ExtensionCommand.openLocalFile;
    path: string;
}
