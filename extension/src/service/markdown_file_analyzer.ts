import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileMetadata } from "@supernode/shared";
import { FileAnalysisResult, FileMetadataExtractor } from "../pkg/file";
import { TagExtractor, GraphExtractor } from "@supernode/shared";
import { FileWatcherService } from "./file_watcher";

export interface MarkdownFileInfo {
    fileName: string;
    filePath: string;
    relativePath: string;
    size: number;
    lastModified: Date;
    languageId: string;
    metadata: FileMetadata;
    documentStats: DocumentStats;
    contentAnalysis: ContentAnalysis;
}

// 从 pkg/file 中导入接口
import { DocumentStats, ContentAnalysis } from "../pkg/file";

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
    private static fileWatcher = FileWatcherService.getInstance();
    /**
     * 扫描工作目录下的所有Markdown文件
     */
    static async scanMarkdownFiles(): Promise<MarkdownFileStats> {
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

                    // 使用新的 FileMetadataExtractor 进行完整分析
                    const analysis = FileMetadataExtractor.ProcessFileWithAnalysis(filePath);

                    const fileInfo: MarkdownFileInfo = {
                        fileName,
                        filePath,
                        relativePath,
                        size: stats.size,
                        lastModified: stats.mtime,
                        languageId,
                        metadata: analysis.metadata,
                        documentStats: analysis.documentStats,
                        contentAnalysis: analysis.contentAnalysis
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
    static async exportToJson(stats: MarkdownFileStats): Promise<string> {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                throw new Error("没有找到工作区文件夹");
            }

            const basePath = workspaceFolders[0].uri.fsPath;

            // 1. stats 文件
            const statsPath = path.join(basePath, "supernode_stats.json");
            fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');

            // 2. graph 文件
            const graph = GraphExtractor.extract(stats.files.map(file => file.metadata));
            const graphPath = path.join(basePath, "supernode_graph.json");
            fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');

            // 3. tag 文件
            const tag = TagExtractor.extract(stats.files.map(file => file.metadata));
            const tagPath = path.join(basePath, "supernode_tag.json");
            fs.writeFileSync(tagPath, JSON.stringify(tag, null, 2), 'utf8');

            return "文件已导出";

        } catch (error) {
            console.error("导出JSON文件时出错:", error);
            throw error;
        }
    }
    /**
     * 格式化文件大小
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 启动文件监听服务
     */
    static startFileWatching(): void {
        try {
            // 预加载所有文件到缓存
            this.fileWatcher.preloadAllFiles().then(() => {
                // 开始监听文件变化
                this.fileWatcher.startWatching();

                // 添加变化监听器
                this.fileWatcher.addChangeListener((event: any) => {
                    console.log(`文件变化事件: ${event.type} - ${event.filePath}`);

                    if (event.type === 'modified') {
                        vscode.window.showInformationMessage(
                            `文件 ${path.basename(event.filePath)} 已更新，相关数据已重新计算`
                        );
                    }
                });

                vscode.window.showInformationMessage("Markdown 文件监听服务已启动");
            });

        } catch (error) {
            console.error("启动文件监听服务失败:", error);
            vscode.window.showErrorMessage("启动文件监听服务失败");
        }
    }

    /**
     * 停止文件监听服务
     */
    static stopFileWatching(): void {
        this.fileWatcher.stopWatching();
        vscode.window.showInformationMessage("Markdown 文件监听服务已停止");
    }

    /**
     * 获取缓存统计信息
     */
    static getCacheStats(): { totalFiles: number; cacheSize: number } {
        return this.fileWatcher.getCacheStats();
    }




    /**
     * 启动扫描并输出结果
     */
    static async startScanAndExport(): Promise<void> {
        try {
            console.log("开始Markdown文件扫描和导出...");

            // 扫描文件
            const stats = await this.scanMarkdownFiles();

            // 导出JSON文件
            const outputPath = await this.exportToJson(stats);

            // 在 Problems 面板中显示缺失内容警告
            await this.displayMissingContentWarnings(stats);

            // 显示成功消息
            vscode.window.showInformationMessage(
                `Markdown文件扫描完成！共找到 ${stats.totalFiles} 个文件，已导出到: ${path.basename(outputPath)}`
            );

        } catch (error) {
            console.error("Markdown文件扫描失败:", error);
            vscode.window.showErrorMessage(`Markdown文件扫描失败: ${error}`);
        }
    }

    /**
     * 在 Problems 面板中显示缺失内容警告
     */
    static async displayMissingContentWarnings(stats: MarkdownFileStats): Promise<void> {
        console.log("开始显示缺失内容警告...");

        // 创建诊断集合
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('supernode-missing-content');

        // 清除之前的诊断
        diagnosticCollection.clear();

        let warningCount = 0;
        let processedFiles = 0;

        console.log(`开始处理 ${stats.files.length} 个文件...`);

        for (const file of stats.files) {
            processedFiles++;
            console.log(`处理文件 ${processedFiles}/${stats.files.length}: ${file.fileName}`);

            const diagnostics: vscode.Diagnostic[] = [];

            // 检查文件是否有缺失内容
            if (file.metadata && file.metadata.markdownHeadings) {
                console.log(`检查文件 ${file.fileName} 的缺失内容...`);
                const missingItems = await this.checkMissingContent(file.metadata);
                console.log(`文件 ${file.fileName} 的缺失内容:`, missingItems);

                if (missingItems.length > 0) {
                    warningCount++;

                    // 创建诊断信息
                    const diagnostic = new vscode.Diagnostic(
                        new vscode.Range(0, 0, 0, 0), // 在文件开头显示
                        `缺失内容: ${missingItems.join(', ')}`,
                        vscode.DiagnosticSeverity.Warning
                    );

                    diagnostic.source = 'Supernode';
                    diagnostic.code = 'missing-content';

                    diagnostics.push(diagnostic);
                    console.log(`为文件 ${file.fileName} 创建了诊断信息`);
                }
            } else {
                console.log(`文件 ${file.fileName} 没有元数据或标题信息`);
            }

            // 如果有诊断信息，添加到集合中
            if (diagnostics.length > 0) {
                const uri = vscode.Uri.file(file.filePath);
                diagnosticCollection.set(uri, diagnostics);
                console.log(`将诊断信息添加到集合中: ${file.filePath}`);
            }
        }

        console.log(`处理完成，发现 ${warningCount} 个警告`);

        if (warningCount > 0) {
            vscode.window.showWarningMessage(
                `发现 ${warningCount} 个文件存在内容缺失问题，请在 Problems 面板中查看详情`
            );
        } else {
            console.log("没有发现缺失内容问题");
            vscode.window.showInformationMessage("没有发现内容缺失问题");
        }
    }

    /**
 * 检查文件的缺失内容
 */
    private static async checkMissingContent(metadata: any): Promise<string[]> {
        const missingItems: string[] = [];

        // 从 TagExtractor 的结果中检查缺失内容
        // 这里我们需要重新计算 TagExtractor 的结果来获取准确的缺失信息
        try {
            // 获取所有文件的元数据来计算标签
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return missingItems;
            }

            // 获取当前工作区的所有 Markdown 文件
            const markdownFiles = await vscode.workspace.findFiles(
                '**/*.{md,mdx}',
                '**/node_modules/**'
            );

            // 提取所有文件的元数据
            const allFileMetadata = [];
            for (const fileUri of markdownFiles) {
                try {
                    const fileMetadata = FileMetadataExtractor.ProcessSingleFile(fileUri.fsPath);
                    allFileMetadata.push(fileMetadata);
                } catch (error) {
                    console.error(`提取文件元数据失败: ${fileUri.fsPath}`, error);
                }
            }

            // 使用 TagExtractor 计算标签
            const tagMetadata = TagExtractor.extract(allFileMetadata);

            // 查找当前文件对应的标签信息
            for (const tag of tagMetadata) {
                for (const row of tag.rows) {
                    if (row.filePath === metadata.filePath && row.missing && row.missing.length > 0) {
                        missingItems.push(...row.missing);
                    }
                }
            }
        } catch (error) {
            console.error('检查缺失内容时出错:', error);
        }

        return missingItems;
    }
} 