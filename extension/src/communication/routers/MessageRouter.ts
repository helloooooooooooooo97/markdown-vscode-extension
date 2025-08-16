import * as vscode from "vscode";
import { WebviewMessage } from "@supernode/shared";
import { MessageHandler } from "../handlers/MessageHandler";

/**
 * 消息路由管理器
 */
export class MessageRouter {
    private handlers: Map<string, MessageHandler> = new Map();
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.registerHandlers();
    }

    /**
     * 初始化处理器
     */
    private registerHandlers(): void {
        // 这里可以动态注册处理器，或者通过依赖注入的方式
        // 暂时保持简单，后续可以优化为自动发现和注册
    }

    /**
     * 注册单个处理器
     */
    public registerHandler(command: string, handler: MessageHandler): void {
        this.handlers.set(command, handler);
    }

    /**
     * 注册多个处理器
     */
    public registerMultipleHandlers(handlers: Array<{ command: string; handler: MessageHandler }>): void {
        handlers.forEach(({ command, handler }) => {
            this.registerHandler(command, handler);
        });
    }

    /**
     * 路由消息到对应的处理器
     */
    public async routeMessage(message: WebviewMessage): Promise<void> {
        const handler = this.handlers.get(message.command);

        if (handler) {
            try {
                await handler.handle(message);
            } catch (error) {
                console.error(`处理消息 ${message.command} 时发生错误:`, error);
                vscode.window.showErrorMessage(`处理消息时发生错误: ${error}`);
            }
        } else {
            console.log("未知消息类型:", message.command);
            console.log("可用的处理器:", Array.from(this.handlers.keys()));
        }
    }

    /**
     * 获取所有注册的命令
     */
    public getRegisteredCommands(): string[] {
        return Array.from(this.handlers.keys());
    }

    /**
     * 检查是否支持某个命令
     */
    public supportsCommand(command: string): boolean {
        return this.handlers.has(command);
    }
} 