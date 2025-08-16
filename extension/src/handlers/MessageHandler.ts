import * as vscode from "vscode";
import { WebviewMessage } from "@supernode/shared";

/**
 * 消息处理器基类
 */
export abstract class MessageHandler {
    protected context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    /**
     * 处理消息的抽象方法
     */
    abstract handle(message: WebviewMessage): Promise<void> | void;

    /**
     * 获取处理器支持的命令类型
     */
    abstract getSupportedCommands(): string[];
} 