import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileManager } from "../service/file";
import { ExtensionCommand, UpdateMarkdownMessage, GraphExtractor, TagExtractor } from "@supernode/shared";
import { MarkdownWebviewProvider } from "../event/webview";
import { FileWatcherService } from "../service/file_watcher";
import { MarkdownFileScannerService } from "../service/markdown_file_analyzer";

/**
 * 事件处理控制器
 */
export class EventController {
    private context: vscode.ExtensionContext;
    private fileWatcher: FileWatcherService;
    private fileSystemWatcher: vscode.FileSystemWatcher | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.fileWatcher = FileWatcherService.getInstance();
        this.initializeFileWatcher();
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

            // 通知 webview 更新
            this.notifyWebviewOfFileChange(type, filePath);

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
            const graphPath = path.join(basePath, "supernode_graph.json");
            const tagPath = path.join(basePath, "supernode_tag.json");

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
     * 通知 webview 文件变化
     */
    private notifyWebviewOfFileChange(type: string, filePath: string): void {
        // 如果当前活动的编辑器是变化的文件，更新 webview
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.fileName === filePath) {
            if (FileManager.isMarkdownFile(activeEditor.document)) {
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: FileManager.getFileContent(activeEditor.document),
                    fileName: activeEditor.document.fileName,
                };
                this.sendMessageToWebview(message);
            }
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
     * 处理文件选择变化
     */
    public handleFileChange(editor: vscode.TextEditor | undefined): void {
        if (editor) {
            const document = editor.document;
            console.log("鼠标点击的文档:", document.fileName);

            if (FileManager.isMarkdownFile(document)) {
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: FileManager.getFileContent(document),
                    fileName: document.fileName,
                };
                this.sendMessageToWebview(message);
            } else {
                // 如果不是markdown或mdx文件，清空内容
                const clearMessage: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: "",
                    fileName: "",
                };
                this.sendMessageToWebview(clearMessage);
            }
        }
    }

    /**
     * 处理文档内容变化
     */
    public handleDocumentChange(event: vscode.TextDocumentChangeEvent): void {
        const document = event.document;
        if (
            FileManager.isMarkdownFile(document) &&
            vscode.window.activeTextEditor?.document === document
        ) {
            const message: UpdateMarkdownMessage = {
                command: ExtensionCommand.updateMarkdownContent,
                content: FileManager.getFileContent(document),
                fileName: document.fileName,
            };
            this.sendMessageToWebview(message);
        }
    }

    /**
     * 发送消息到 Webview
     */
    private sendMessageToWebview(message: UpdateMarkdownMessage): void {
        if (MarkdownWebviewProvider.currentPanel) {
            MarkdownWebviewProvider.currentPanel.sendMessage(message);
        }
    }

    /**
     * 销毁资源
     */
    public dispose(): void {
        this.stopFileWatching();
    }
} 