import * as path from "path";
import * as vscode from "vscode";

/**
 * 路径配置管理器
 * 统一管理扩展中的各种路径配置
 */
export class PathConfig {
    private static _extensionContext: vscode.ExtensionContext | undefined;
    private static _projectRoot: string | undefined;
    private static _webviewDistPath: string | undefined;

    /**
     * 初始化路径配置
     * @param context 扩展上下文
     */
    public static initialize(context: vscode.ExtensionContext): void {
        this._extensionContext = context;
        this._projectRoot = context.extensionPath;
        this._webviewDistPath = path.join(this._projectRoot, "webview/dist");

        console.log("路径配置初始化完成:");
        console.log("  扩展路径:", this._extensionContext.extensionPath);
        console.log("  项目根目录:", this._projectRoot);
        console.log("  Webview dist 路径:", this._webviewDistPath);
    }

    /**
     * 获取扩展上下文
     */
    public static get extensionContext(): vscode.ExtensionContext | undefined {
        return this._extensionContext;
    }

    /**
     * 获取项目根目录路径
     */
    public static get projectRoot(): string {
        if (!this._projectRoot) {
            throw new Error("路径配置未初始化，请先调用 PathConfig.initialize()");
        }
        return this._projectRoot;
    }

    /**
     * 获取 webview dist 目录路径
     */
    public static get webviewDistPath(): string {
        if (!this._webviewDistPath) {
            throw new Error("路径配置未初始化，请先调用 PathConfig.initialize()");
        }
        return this._webviewDistPath;
    }

    /**
     * 获取 webview HTML 文件路径
     */
    public static get webviewHtmlPath(): string {
        return path.join(this.webviewDistPath, "index.html");
    }

    /**
     * 获取 webview 脚本文件路径
     */
    public static get webviewScriptPath(): string {
        return path.join(this.webviewDistPath, "assets/index.js");
    }

    /**
     * 获取 webview 样式文件路径
     */
    public static get webviewStylePath(): string {
        return path.join(this.webviewDistPath, "assets/index.css");
    }

    /**
     * 获取 webview dist 目录的 URI
     */
    public static get webviewDistUri(): vscode.Uri {
        return vscode.Uri.file(this.webviewDistPath);
    }

    /**
     * 验证关键路径是否存在
     */
    public static validatePaths(): boolean {
        const fs = require("fs");

        const pathsToCheck = [
            { name: "项目根目录", path: this.projectRoot },
            { name: "Webview dist 目录", path: this.webviewDistPath },
            { name: "HTML 文件", path: this.webviewHtmlPath },
            { name: "脚本文件", path: this.webviewScriptPath },
            { name: "样式文件", path: this.webviewStylePath }
        ];

        let allValid = true;

        for (const { name, path: filePath } of pathsToCheck) {
            if (!fs.existsSync(filePath)) {
                console.error(`❌ ${name}不存在:`, filePath);
                allValid = false;
            } else {
                console.log(`✅ ${name}存在:`, filePath);
            }
        }

        return allValid;
    }
}
