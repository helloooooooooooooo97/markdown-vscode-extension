import * as vscode from "vscode";

export class StatusBarManager {
    private static statusBarItem: vscode.StatusBarItem;

    private static initialize(): void {
        if (StatusBarManager.statusBarItem) return; // 已经初始化过了

        StatusBarManager.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        StatusBarManager.initializeStatusBar();
    }

    /**
     * 初始化状态栏
     */
    private static initializeStatusBar(): void {
        StatusBarManager.statusBarItem.text = "$(eye) 预览";
        StatusBarManager.statusBarItem.tooltip = "点击打开 Markdown 预览";
        StatusBarManager.statusBarItem.command = "supernode.openPreview";
        StatusBarManager.statusBarItem.show();
    }

    /**
     * 显示状态栏
     */
    public static show(): void {
        StatusBarManager.initialize();
        StatusBarManager.statusBarItem.show();
    }

    /**
     * 隐藏状态栏
     */
    public static hide(): void {
        StatusBarManager.initialize();
        StatusBarManager.statusBarItem.hide();
    }

    /**
     * 更新状态栏文本
     */
    public static updateText(text: string): void {
        StatusBarManager.initialize();
        StatusBarManager.statusBarItem.text = text;
    }

    /**
     * 更新状态栏提示
     */
    public static updateTooltip(tooltip: string): void {
        StatusBarManager.initialize();
        StatusBarManager.statusBarItem.tooltip = tooltip;
    }

    /**
     * 获取状态栏项（用于注册到扩展上下文）
     */
    public static getStatusBarItem(): vscode.StatusBarItem {
        StatusBarManager.initialize();
        return StatusBarManager.statusBarItem;
    }

    /**
     * 销毁状态栏
     */
    public static dispose(): void {
        if (StatusBarManager.statusBarItem) {
            StatusBarManager.statusBarItem.dispose();
        }
    }
} 