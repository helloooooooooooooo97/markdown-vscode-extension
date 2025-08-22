import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileManager } from "../service/file";
import { GraphExtractor, TagExtractor } from "@supernode/shared";
import { MarkdownWebviewProvider } from "../event/webview";
import { FileWatcherService } from "../service/file_watcher";
import { MarkdownFileScannerService } from "../service/markdown_file_analyzer";
import EventSource from "../event/source";
import { VscodeEventSource } from "@supernode/shared";

/**
 * 事件处理控制器
 */
export class EventController {
    private context: vscode.ExtensionContext;
    private fileWatcher: FileWatcherService;
    private fileSystemWatcher: vscode.FileSystemWatcher | undefined;
    private updateTimeout: NodeJS.Timeout | null = null;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.fileWatcher = FileWatcherService.getInstance();
        this.initializeFileWatcher();
    }

    // 设置事件来源为 WEBVIEW（当用户点击 webview 时调用）
    public setEventSourceToWebview(): void {
        EventSource.set(VscodeEventSource.WEBVIEW);
    }


    // 活跃编辑器变化
    public handleChangeActiveTextEditor(editor: vscode.TextEditor | undefined): void {
        if (editor) {
            const document = editor.document;
            if (FileManager.isMarkdownFile(document)) {
                EventSource.set(VscodeEventSource.MARKDOWNFILE);
                MarkdownWebviewProvider.currentPanel?.updateMarkdownContent(FileManager.getFileContent(document), document.fileName);
            } else {
                MarkdownWebviewProvider.currentPanel?.updateMarkdownContent("", "");
            }
        }
    }

    // 文档内容变化
    public handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
        const document = event.document;
        if (
            FileManager.isMarkdownFile(document) &&
            vscode.window.activeTextEditor?.document === document
        ) {
            MarkdownWebviewProvider.currentPanel?.updateMarkdownContent(FileManager.getFileContent(document), document.fileName);
        }
    }



    /**
     * 初始化文件监听器
     */
    private initializeFileWatcher(): void {
        // 监听 Markdown 文件变化
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
            '**/*.{md,mdx}',
            false, // 不监听文件夹创建
            false, // 不监听文件夹删除
            false  // 不监听文件夹变化
        );

        // 监听文件创建
        this.fileSystemWatcher.onDidCreate((uri) => {
            this.handleFileSystemChange('created', uri.fsPath);
        });

        // 监听文件修改
        this.fileSystemWatcher.onDidChange((uri) => {
            this.handleFileSystemChange('modified', uri.fsPath);
        });

        // 监听文件删除
        this.fileSystemWatcher.onDidDelete((uri) => {
            this.handleFileSystemChange('deleted', uri.fsPath);
        });

        // 添加文件变化监听器
        this.fileWatcher.addChangeListener((event) => {
            this.handleFileChangeEvent(event);
        });

        console.log("文件监听器已初始化");
    }

    /**
 * 处理文件系统变化事件
 */
    private async handleFileSystemChange(type: 'created' | 'modified' | 'deleted', filePath: string): Promise<void> {
        console.log(`文件系统变化: ${type} - ${filePath}`);
        try {
            if (type === 'deleted') {
                // 文件被删除，从缓存中移除并清除诊断
                this.fileWatcher.getCachedAnalysis(filePath);
                MarkdownFileScannerService.clearFileDiagnostics(filePath);
            } else {
                // 文件被创建或修改，先清除该文件的诊断，然后重新分析
                MarkdownFileScannerService.clearFileDiagnostics(filePath);

                const analysis = await this.reanalyzeFile(filePath);

                // 如果是修改事件，可能需要重新导出相关文件
                if (type === 'modified' && analysis) {
                    await this.handleFileModification(filePath, analysis);
                }
            }

            // 通知 webview 更新（使用防抖）
            this.debouncedUpdateWebview(filePath);

        } catch (error) {
            console.error(`处理文件系统变化失败: ${filePath}`, error);
        }
    }

    /**
 * 处理文件变化事件（来自 FileWatcherService）
 */
    private handleFileChangeEvent(event: any): void {
        console.log(`文件变化事件: ${event.type} - ${event.filePath}`);

        if (event.type === 'modified') {
            vscode.window.showInformationMessage(
                `文件 ${path.basename(event.filePath)} 已更新，相关数据已重新计算`
            );
        }
    }

    /**
 * 重新分析文件
 */
    private async reanalyzeFile(filePath: string): Promise<any> {
        try {
            // 使用 FileWatcherService 的缓存机制
            const analysis = this.fileWatcher.getCachedAnalysis(filePath);
            if (analysis) {
                return analysis;
            }

            // 如果缓存中没有，重新分析
            const { FileMetadataExtractor } = await import("../pkg/file_analyzer");
            const newAnalysis = FileMetadataExtractor.ProcessFileWithAnalysis(filePath);

            // 更新缓存
            this.fileWatcher.updateCachedAnalysis(filePath, newAnalysis);

            return newAnalysis;
        } catch (error) {
            console.error(`重新分析文件失败: ${filePath}`, error);
            return null;
        }
    }

    /**
     * 防抖更新 webview
     */
    private debouncedUpdateWebview(filePath: string): void {
        // 清除之前的定时器
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // 设置新的定时器
        this.updateTimeout = setTimeout(() => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.fileName === filePath) {
                if (FileManager.isMarkdownFile(activeEditor.document)) {
                    MarkdownWebviewProvider.currentPanel?.updateMarkdownContent(FileManager.getFileContent(activeEditor.document), activeEditor.document.fileName);
                }
            }
        }, 300); // 300ms 防抖延迟
    }

    /**
     * 处理文件修改事件
     */
    private async handleFileModification(filePath: string, analysis: any): Promise<void> {
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
                const cachedAnalysis = this.fileWatcher.getCachedAnalysis(fileUri.fsPath);
                if (cachedAnalysis) {
                    allFileMetadata.push(cachedAnalysis.metadata);
                } else {
                    // 如果缓存中没有，重新分析
                    const analysis = await this.reanalyzeFile(fileUri.fsPath);
                    if (analysis) {
                        allFileMetadata.push(analysis.metadata);
                    }
                }
            }

            // 重新生成 graph 和 tag 文件
            const graph = GraphExtractor.extract(allFileMetadata);
            const tag = TagExtractor.extract(allFileMetadata);

            // 导出更新后的文件
            const graphPath = path.join(basePath, ".supernode", "graph.json");
            const tagPath = path.join(basePath, ".supernode", "tag.json");

            fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');
            fs.writeFileSync(tagPath, JSON.stringify(tag, null, 2), 'utf8');

            console.log(`文件 ${path.basename(filePath)} 修改后，已重新生成 graph 和 tag 文件`);

            // 刷新 Problems 面板
            await MarkdownFileScannerService.refreshProblemsPanel();

        } catch (error) {
            console.error("处理文件修改事件失败:", error);
        }
    }
    /**
     * 启动文件监听服务
     */
    public startFileWatching(): void {
        try {
            // 预加载所有文件到缓存
            this.fileWatcher.preloadAllFiles().then(() => {
                // 开始监听文件变化
                this.fileWatcher.startWatching();
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
    public stopFileWatching(): void {
        this.fileWatcher.stopWatching();
        if (this.fileSystemWatcher) {
            this.fileSystemWatcher.dispose();
            this.fileSystemWatcher = undefined;
        }
        vscode.window.showInformationMessage("Markdown 文件监听服务已停止");
    }

    /**
     * 销毁资源
     */
    public dispose(): void {
        this.stopFileWatching();
    }
} 