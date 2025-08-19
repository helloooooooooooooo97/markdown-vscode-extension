import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileMetadataExtractor } from "../pkg/file_analyzer";
import { TagExtractor, GraphExtractor, FileAnalysisResult } from "@supernode/shared";

export interface FileChangeEvent {
    type: 'created' | 'modified' | 'deleted';
    filePath: string;
    analysis?: FileAnalysisResult;
}

export class FileWatcherService {
    private static instance: FileWatcherService;
    private fileSystemWatcher: vscode.FileSystemWatcher | undefined;
    private changeListeners: ((event: FileChangeEvent) => void)[] = [];
    private analysisCache: Map<string, FileAnalysisResult> = new Map();
    private isWatching = false;

    private constructor() { }

    static getInstance(): FileWatcherService {
        if (!FileWatcherService.instance) {
            FileWatcherService.instance = new FileWatcherService();
        }
        return FileWatcherService.instance;
    }

    /**
     * 开始监听 Markdown 文件变化
     */
    startWatching(): void {
        if (this.isWatching) {
            console.log("文件监听器已经在运行");
            return;
        }

        console.log("开始监听 Markdown 文件变化...");

        // 创建文件系统监听器
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
            '**/*.{md,mdx}',
            false, // 不监听文件夹创建
            false, // 不监听文件夹删除
            false  // 不监听文件夹变化
        );

        // 监听文件创建
        this.fileSystemWatcher.onDidCreate((uri) => {
            this.handleFileChange('created', uri.fsPath);
        });

        // 监听文件修改
        this.fileSystemWatcher.onDidChange((uri) => {
            this.handleFileChange('modified', uri.fsPath);
        });

        // 监听文件删除
        this.fileSystemWatcher.onDidDelete((uri) => {
            this.handleFileChange('deleted', uri.fsPath);
        });

        this.isWatching = true;
        console.log("Markdown 文件监听器已启动");
    }

    /**
     * 停止监听文件变化
     */
    stopWatching(): void {
        if (this.fileSystemWatcher) {
            this.fileSystemWatcher.dispose();
            this.fileSystemWatcher = undefined;
        }
        this.isWatching = false;
        console.log("Markdown 文件监听器已停止");
    }

    /**
     * 添加变化监听器
     */
    addChangeListener(listener: (event: FileChangeEvent) => void): void {
        this.changeListeners.push(listener);
    }

    /**
     * 移除变化监听器
     */
    removeChangeListener(listener: (event: FileChangeEvent) => void): void {
        const index = this.changeListeners.indexOf(listener);
        if (index > -1) {
            this.changeListeners.splice(index, 1);
        }
    }

    /**
     * 获取缓存的分析结果
     */
    getCachedAnalysis(filePath: string): FileAnalysisResult | undefined {
        return this.analysisCache.get(filePath);
    }

    /**
     * 更新缓存的分析结果
     */
    updateCachedAnalysis(filePath: string, analysis: FileAnalysisResult): void {
        this.analysisCache.set(filePath, analysis);
    }

    /**
     * 清除缓存
     */
    clearCache(): void {
        this.analysisCache.clear();
    }

    /**
     * 处理文件变化事件
     */
    private async handleFileChange(type: 'created' | 'modified' | 'deleted', filePath: string): Promise<void> {
        console.log(`文件变化: ${type} - ${filePath}`);

        const event: FileChangeEvent = {
            type,
            filePath
        };

        try {
            if (type === 'deleted') {
                // 文件被删除，从缓存中移除并清除诊断
                this.analysisCache.delete(filePath);
                const { MarkdownFileScannerService } = await import("./markdown_file_analyzer");
                MarkdownFileScannerService.clearFileDiagnostics(filePath);
            } else {
                // 文件被创建或修改，先清除该文件的诊断，然后重新分析
                const { MarkdownFileScannerService } = await import("./markdown_file_analyzer");
                MarkdownFileScannerService.clearFileDiagnostics(filePath);

                const analysis = FileMetadataExtractor.ProcessFileWithAnalysis(filePath);
                this.analysisCache.set(filePath, analysis);
                event.analysis = analysis;

                // 如果是修改事件，可能需要重新导出相关文件
                if (type === 'modified') {
                    await this.handleFileModification(filePath, analysis);
                }
            }

            // 通知所有监听器
            this.notifyListeners(event);

        } catch (error) {
            console.error(`处理文件变化失败: ${filePath}`, error);

            // 即使出错也要通知监听器
            this.notifyListeners(event);
        }
    }

    /**
     * 处理文件修改事件
     */
    private async handleFileModification(filePath: string, analysis: FileAnalysisResult): Promise<void> {
        try {
            // 获取工作区路径
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                return;
            }

            const basePath = workspaceFolders[0].uri.fsPath;

            // 重新计算所有文件的元数据
            const markdownFiles = await vscode.workspace.findFiles(
                '**/*.{md,mdx}',
                '**/node_modules/**'
            );

            const allFileMetadata = [];
            for (const fileUri of markdownFiles) {
                const cachedAnalysis = this.analysisCache.get(fileUri.fsPath);
                if (cachedAnalysis) {
                    allFileMetadata.push(cachedAnalysis.metadata);
                } else {
                    // 如果缓存中没有，重新分析
                    const analysis = FileMetadataExtractor.ProcessFileWithAnalysis(fileUri.fsPath);
                    this.analysisCache.set(fileUri.fsPath, analysis);
                    allFileMetadata.push(analysis.metadata);
                }
            }

            // 重新生成 graph 和 tag 文件
            const graph = GraphExtractor.extract(allFileMetadata);
            const tag = TagExtractor.extract(allFileMetadata);

            // 导出更新后的文件
            const graphPath = path.join(basePath, "supernode_graph.json");
            const tagPath = path.join(basePath, "supernode_tag.json");

            fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');
            fs.writeFileSync(tagPath, JSON.stringify(tag, null, 2), 'utf8');

            console.log(`文件 ${path.basename(filePath)} 修改后，已重新生成 graph 和 tag 文件`);

            // 刷新 Problems 面板
            const { MarkdownFileScannerService } = await import("./markdown_file_analyzer");
            await MarkdownFileScannerService.refreshProblemsPanel();

        } catch (error) {
            console.error("处理文件修改事件失败:", error);
        }
    }

    /**
     * 通知所有监听器
     */
    private notifyListeners(event: FileChangeEvent): void {
        this.changeListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error("监听器执行失败:", error);
            }
        });
    }

    /**
     * 预加载所有 Markdown 文件到缓存
     */
    async preloadAllFiles(): Promise<void> {
        console.log("开始预加载所有 Markdown 文件...");

        try {
            const markdownFiles = await vscode.workspace.findFiles(
                '**/*.{md,mdx}',
                '**/node_modules/**'
            );

            console.log(`找到 ${markdownFiles.length} 个 Markdown 文件，开始预加载...`);

            for (const fileUri of markdownFiles) {
                try {
                    const analysis = FileMetadataExtractor.ProcessFileWithAnalysis(fileUri.fsPath);
                    this.analysisCache.set(fileUri.fsPath, analysis);
                } catch (error) {
                    console.error(`预加载文件失败: ${fileUri.fsPath}`, error);
                }
            }

            console.log(`预加载完成，缓存了 ${this.analysisCache.size} 个文件的分析结果`);

        } catch (error) {
            console.error("预加载文件失败:", error);
        }
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats(): { totalFiles: number; cacheSize: number } {
        return {
            totalFiles: this.analysisCache.size,
            cacheSize: this.analysisCache.size
        };
    }
} 