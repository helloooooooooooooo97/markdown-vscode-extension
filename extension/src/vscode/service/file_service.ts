import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class FileManager {
    private static instance: FileManager;

    private constructor() { }

    public static getInstance(): FileManager {
        if (!FileManager.instance) {
            FileManager.instance = new FileManager();
        }
        return FileManager.instance;
    }

    /**
     * 检查文件是否为 Markdown 文件
     */
    public isMarkdownFile(document: vscode.TextDocument): boolean {
        return document.languageId === "markdown" || document.languageId === "mdx";
    }

    /**
     * 获取文件内容
     */
    public getFileContent(document: vscode.TextDocument): string {
        return document.getText();
    }

    /**
     * 打开本地文件
     */
    public async openLocalFile(relativePath: string, basePath?: string): Promise<void> {
        try {
            console.log("开始处理本地文件打开请求，相对路径:", relativePath);

            const resolvedBasePath = this.resolveBasePath(basePath);
            if (!resolvedBasePath) {
                vscode.window.showErrorMessage("无法获取基准路径");
                return;
            }

            const targetPath = path.resolve(resolvedBasePath, relativePath);
            console.log("解析后的目标路径:", targetPath);

            if (!fs.existsSync(targetPath)) {
                console.log("文件不存在:", targetPath);
                vscode.window.showErrorMessage(`文件不存在: ${targetPath}`);
                return;
            }

            console.log("文件存在，准备打开:", targetPath);

            const document = await vscode.workspace.openTextDocument(targetPath);
            await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.One,
                preview: false
            });

            console.log("文件已成功打开");
            vscode.window.showInformationMessage(`已打开文件: ${path.basename(targetPath)}`);
        } catch (error) {
            console.error("打开本地文件失败:", error);
            vscode.window.showErrorMessage(`打开本地文件失败: ${error}`);
        }
    }

    /**
     * 更新 Markdown 文件内容
     */
    public async updateMarkdownContent(filePath: string, content: string): Promise<boolean> {
        try {
            console.log("开始更新 Markdown 文件内容:", filePath);

            if (!filePath) {
                console.log("没有活跃的 Markdown 文件路径");
                vscode.window.showErrorMessage("没有找到活跃的 Markdown 文件");
                return false;
            }

            const document = await vscode.workspace.openTextDocument(filePath);
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            edit.replace(document.uri, fullRange, content);

            const success = await vscode.workspace.applyEdit(edit);

            if (success) {
                console.log("成功更新 Markdown 文件内容");
                vscode.window.showInformationMessage("Markdown 文件已更新");
                return true;
            } else {
                console.error("更新 Markdown 文件失败");
                vscode.window.showErrorMessage("更新 Markdown 文件失败");
                return false;
            }
        } catch (error) {
            console.error("更新 Markdown 文件内容失败:", error);
            vscode.window.showErrorMessage(`更新失败: ${error}`);
            return false;
        }
    }

    /**
     * 解析基准路径
     */
    private resolveBasePath(basePath?: string): string | undefined {
        if (basePath) {
            return path.dirname(basePath);
        }

        // 尝试获取当前活动文档
        const currentEditor = vscode.window.activeTextEditor;
        if (currentEditor) {
            return path.dirname(currentEditor.document.fileName);
        }

        // 使用工作区根目录
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            return workspaceFolders[0].uri.fsPath;
        }

        return undefined;
    }
} 