// 基础消息接口
export interface WebviewMessage {
    command: string;
    [key: string]: any;
}

export enum CommonCommand {
    showMessage = "showMessage",
    openLocalFile = "openLocalFile",
}

// 显示消息
export interface ShowMessage extends WebviewMessage {
    command: CommonCommand.showMessage;
    text: string;
}


// 打开本地文件消息
export interface OpenLocalFileMessage extends WebviewMessage {
    command: CommonCommand.openLocalFile;
    path: string;
}
