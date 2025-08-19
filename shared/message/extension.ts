import { WebviewMessage } from "./common";
import { FileInfo } from "../schema/file/schema";

//----------------------------------EXTENSION TO WEBVIEW----------------------------------

export enum ExtensionCommand {
    updateMarkdownContent = "updateMarkdownContent",
    showMessage = "showMessage",
    openLocalFile = "openLocalFile",
    updateFileMetadata = "updateFileMetadata",
}

// 更新 Markdown 内容消息
export interface UpdateMarkdownMessage extends WebviewMessage {
    command: ExtensionCommand.updateMarkdownContent;
    content: string;
    fileName: string;
}

// 更新文件元数据消息
export interface UpdateFileMetadataMessage extends WebviewMessage {
    command: ExtensionCommand.updateFileMetadata;
    files: FileInfo[];
}