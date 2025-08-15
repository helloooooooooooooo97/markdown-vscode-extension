import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileManager } from "../managers/FileManager";

export interface MarkdownFileInfo {
    fileName: string;
    filePath: string;
    relativePath: string;
    size: number;
    lastModified: Date;
    languageId: string;
}

export interface MarkdownFileStats {
    totalFiles: number;
    totalSize: number;
    filesByExtension: {
        [key: string]: number;
    };
    files: MarkdownFileInfo[];
    scanTime: Date;
    workspacePath: string;
}

export class MarkdownFileScannerService {
    private static instance: MarkdownFileScannerService;
    private fileManager: FileManager;

    private constructor() {
        this.fileManager = FileManager.getInstance();
    }

    public static getInstance(): MarkdownFileScannerService {
        if (!MarkdownFileScannerService.instance) {
            MarkdownFileScannerService.instance = new MarkdownFileScannerService();
        }
        return MarkdownFileScannerService.instance;
    }

    /**
     * 扫描工作目录下的所有Markdown文件
     */
    public async scanMarkdownFiles(): Promise<MarkdownFileStats> {
        console.log("开始扫描工作目录下的Markdown文件...");

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error("没有找到工作区文件夹");
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const files: MarkdownFileInfo[] = [];
        let totalSize = 0;
        const filesByExtension: { [key: string]: number } = {};

        try {
            // 使用 VSCode 的文件系统 API 查找所有 Markdown 文件
            const markdownFiles = await vscode.workspace.findFiles(
                '**/*.{md,mdx}',
                '**/node_modules/**'
            );

            console.log(`找到 ${markdownFiles.length} 个Markdown文件`);

            for (const fileUri of markdownFiles) {
                const filePath = fileUri.fsPath;
                const relativePath = path.relative(workspacePath, filePath);
                const fileName = path.basename(filePath);
                const extension = path.extname(filePath).toLowerCase();

                try {
                    // 获取文件统计信息
                    const stats = fs.statSync(filePath);

                    // 确定语言ID
                    let languageId = "markdown";
                    if (extension === ".mdx") {
                        languageId = "mdx";
                    }

                    const fileInfo: MarkdownFileInfo = {
                        fileName,
                        filePath,
                        relativePath,
                        size: stats.size,
                        lastModified: stats.mtime,
                        languageId
                    };

                    files.push(fileInfo);
                    totalSize += stats.size;

                    // 统计文件扩展名
                    const ext = extension || ".md";
                    filesByExtension[ext] = (filesByExtension[ext] || 0) + 1;

                } catch (error) {
                    console.error(`无法读取文件信息: ${filePath}`, error);
                }
            }

            // 按文件名排序
            files.sort((a, b) => a.fileName.localeCompare(b.fileName));

            const stats: MarkdownFileStats = {
                totalFiles: files.length,
                totalSize,
                filesByExtension,
                files,
                scanTime: new Date(),
                workspacePath
            };

            console.log("Markdown文件扫描完成:", stats);
            return stats;

        } catch (error) {
            console.error("扫描Markdown文件时出错:", error);
            throw error;
        }
    }

    /**
     * 将统计结果输出为JSON文件
     */
    public async exportToJson(stats: MarkdownFileStats, outputPath?: string): Promise<string> {
        try {
            const jsonContent = JSON.stringify(stats, null, 2);

            if (!outputPath) {
                // 如果没有指定输出路径，在工作区根目录创建
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    throw new Error("没有找到工作区文件夹");
                }

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                outputPath = path.join(workspaceFolders[0].uri.fsPath, `markdown-files-${timestamp}.json`);
            }

            // 写入文件
            fs.writeFileSync(outputPath, jsonContent, 'utf8');

            console.log(`Markdown文件统计已导出到: ${outputPath}`);
            return outputPath;

        } catch (error) {
            console.error("导出JSON文件时出错:", error);
            throw error;
        }
    }

    /**
     * 在输出面板中显示统计结果
     */
    public displayStatsInOutput(stats: MarkdownFileStats): void {
        const outputChannel = vscode.window.createOutputChannel("Markdown Files Scanner");
        outputChannel.show();

        outputChannel.appendLine("=== Markdown 文件统计报告 ===");
        outputChannel.appendLine(`扫描时间: ${stats.scanTime.toLocaleString()}`);
        outputChannel.appendLine(`工作区路径: ${stats.workspacePath}`);
        outputChannel.appendLine(`总文件数: ${stats.totalFiles}`);
        outputChannel.appendLine(`总大小: ${this.formatFileSize(stats.totalSize)}`);
        outputChannel.appendLine("");

        outputChannel.appendLine("按扩展名统计:");
        Object.entries(stats.filesByExtension).forEach(([ext, count]) => {
            outputChannel.appendLine(`  ${ext}: ${count} 个文件`);
        });
        outputChannel.appendLine("");

        outputChannel.appendLine("文件列表:");
        stats.files.forEach((file, index) => {
            outputChannel.appendLine(`${index + 1}. ${file.fileName} (${this.formatFileSize(file.size)})`);
            outputChannel.appendLine(`   路径: ${file.relativePath}`);
            outputChannel.appendLine(`   修改时间: ${file.lastModified.toLocaleString()}`);
            outputChannel.appendLine("");
        });

        outputChannel.appendLine("=== 统计完成 ===");
    }

    /**
     * 格式化文件大小
     */
    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 启动扫描并输出结果
     */
    public async startScanAndExport(): Promise<void> {
        try {
            console.log("开始Markdown文件扫描和导出...");

            // 扫描文件
            const stats = await this.scanMarkdownFiles();

            // 导出JSON文件
            const outputPath = await this.exportToJson(stats);

            // 在输出面板显示结果
            this.displayStatsInOutput(stats);

            // 显示成功消息
            vscode.window.showInformationMessage(
                `Markdown文件扫描完成！共找到 ${stats.totalFiles} 个文件，已导出到: ${path.basename(outputPath)}`
            );

        } catch (error) {
            console.error("Markdown文件扫描失败:", error);
            vscode.window.showErrorMessage(`Markdown文件扫描失败: ${error}`);
        }
    }
} 