import * as vscode from "vscode";

export class StatusBarManager {
    private static instance: StatusBarManager;
    private statusBarItem: vscode.StatusBarItem;

    private constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.initializeStatusBar();
    }

    public static getInstance(): StatusBarManager {
        if (!StatusBarManager.instance) {
            StatusBarManager.instance = new StatusBarManager();
        }
        return StatusBarManager.instance;
    }

    /**
     * 初始化状态栏
     */
    private initializeStatusBar(): void {
        this.statusBarItem.text = "$(eye) 预览";
        this.statusBarItem.tooltip = "点击打开 Markdown 预览";
        this.statusBarItem.command = "supernode.openPreview";
        this.statusBarItem.show();
    }

    /**
     * 显示状态栏
     */
    public show(): void {
        this.statusBarItem.show();
    }

    /**
     * 隐藏状态栏
     */
    public hide(): void {
        this.statusBarItem.hide();
    }

    /**
     * 更新状态栏文本
     */
    public updateText(text: string): void {
        this.statusBarItem.text = text;
    }

    /**
     * 更新状态栏提示
     */
    public updateTooltip(tooltip: string): void {
        this.statusBarItem.tooltip = tooltip;
    }

    /**
     * 获取状态栏项（用于注册到扩展上下文）
     */
    public getStatusBarItem(): vscode.StatusBarItem {
        return this.statusBarItem;
    }

    /**
     * 销毁状态栏
     */
    public dispose(): void {
        this.statusBarItem.dispose();
    }
} 