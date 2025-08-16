import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { FileMetadata, FileMetadataExtractor } from "@supernode/shared";

export interface MarkdownFileInfo {
    fileName: string;
    filePath: string;
    relativePath: string;
    size: number;
    lastModified: Date;
    languageId: string;

    // 新增：完整的文件元数据（来自共享提取器）
    metadata: FileMetadata;

    // 新增：文档统计信息
    documentStats: DocumentStats;

    // 新增：内容分析
    contentAnalysis: ContentAnalysis;
}

// 新增接口定义
export interface DocumentStats {
    totalLines: number;
    contentLines: number;
    codeLines: number;
    commentLines: number;
    emptyLines: number;
    wordCount: number;
    characterCount: number;
    readingTimeMinutes: number;
}

export interface ContentAnalysis {
    language: string;
    topics: string[];
    summary: string;
    complexity: 'simple' | 'moderate' | 'complex';
    hasCodeBlocks: boolean;
    hasImages: boolean;
    hasTables: boolean;
    hasMath: boolean;
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

    private constructor() {
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

                    // 使用共享的 FileMetadataExtractor 提取完整元数据
                    const metadata = FileMetadataExtractor.ProcessSingleFile(filePath);

                    // 计算文档统计信息
                    console.log("开始计算文档统计信息...");
                    const documentStats = this.calculateDocumentStats(filePath);

                    // 分析内容
                    console.log("开始分析内容...");
                    const contentAnalysis = this.analyzeContent(filePath);

                    const fileInfo: MarkdownFileInfo = {
                        fileName,
                        filePath,
                        relativePath,
                        size: stats.size,
                        lastModified: stats.mtime,
                        languageId,
                        metadata,
                        documentStats,
                        contentAnalysis
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

                // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                outputPath = path.join(workspaceFolders[0].uri.fsPath, `markdown-files.json`);
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
 * 计算文档统计信息
 */
    private calculateDocumentStats(filePath: string): DocumentStats {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            const totalLines = lines.length;
            const emptyLines = lines.filter(line => line.trim() === '').length;
            const contentLines = totalLines - emptyLines;

            // 统计代码块
            const codeBlockRegex = /```[\s\S]*?```/g;
            const codeBlocks = content.match(codeBlockRegex) || [];
            const codeLines = codeBlocks.reduce((acc, block) => {
                const blockLines = block.split('\n').length - 2; // 减去 ``` 行
                return acc + Math.max(0, blockLines);
            }, 0);

            // 统计注释行
            const commentLines = lines.filter(line =>
                line.trim().startsWith('<!--') || line.trim().startsWith('-->')
            ).length;

            // 统计单词和字符
            const textContent = content.replace(/```[\s\S]*?```/g, ''); // 移除代码块
            const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
            const characterCount = textContent.length;

            // 估算阅读时间（假设每分钟200个单词）
            const readingTimeMinutes = Math.ceil(wordCount / 200);

            return {
                totalLines,
                contentLines,
                codeLines,
                commentLines,
                emptyLines,
                wordCount,
                characterCount,
                readingTimeMinutes
            };
        } catch (error) {
            console.error(`计算文档统计失败: ${filePath}`, error);
            return {
                totalLines: 0,
                contentLines: 0,
                codeLines: 0,
                commentLines: 0,
                emptyLines: 0,
                wordCount: 0,
                characterCount: 0,
                readingTimeMinutes: 0
            };
        }
    }

    /**
     * 分析文档内容
     */
    private analyzeContent(filePath: string): ContentAnalysis {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');

            // 检测语言（简单实现）
            const language = this.detectLanguage(content);

            // 提取主题关键词
            const topics = this.extractTopics(content);

            // 生成摘要
            const summary = this.generateSummary(content);

            // 评估复杂度
            const complexity = this.assessComplexity(content);

            // 检测内容类型
            const hasCodeBlocks = /```[\s\S]*?```/g.test(content);
            const hasImages = /!\[.*?\]\(.*?\)/g.test(content);
            const hasTables = /\|.*\|.*\|/g.test(content);
            const hasMath = /\$\$[\s\S]*?\$\$|\$[^\$]*\$/g.test(content);

            return {
                language,
                topics,
                summary,
                complexity,
                hasCodeBlocks,
                hasImages,
                hasTables,
                hasMath
            };
        } catch (error) {
            console.error(`分析内容失败: ${filePath}`, error);
            return {
                language: 'unknown',
                topics: [],
                summary: '',
                complexity: 'simple',
                hasCodeBlocks: false,
                hasImages: false,
                hasTables: false,
                hasMath: false
            };
        }
    }

    /**
     * 检测文档语言
     */
    private detectLanguage(content: string): string {
        // 简单的语言检测逻辑
        if (content.includes('```javascript') || content.includes('```js')) return 'javascript';
        if (content.includes('```typescript') || content.includes('```ts')) return 'typescript';
        if (content.includes('```python') || content.includes('```py')) return 'python';
        if (content.includes('```java')) return 'java';
        if (content.includes('```cpp') || content.includes('```c++')) return 'cpp';
        if (content.includes('```c#')) return 'csharp';
        if (content.includes('```go')) return 'go';
        if (content.includes('```rust')) return 'rust';
        return 'markdown';
    }

    /**
     * 提取主题关键词
     */
    private extractTopics(content: string): string[] {
        const topics: string[] = [];

        // 从标题中提取关键词
        const headingRegex = /^#{1,6}\s+(.+)$/gm;
        const headings = content.match(headingRegex) || [];
        headings.forEach(heading => {
            const title = heading.replace(/^#{1,6}\s+/, '');
            const words = title.split(/\s+/).filter(word => word.length > 2);
            topics.push(...words.slice(0, 3)); // 取前3个词
        });

        // 去重并限制数量
        return [...new Set(topics)].slice(0, 5);
    }

    /**
     * 生成文档摘要
     */
    private generateSummary(content: string): string {
        // 移除代码块和frontmatter
        const cleanContent = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/^---[\s\S]*?---/m, '');

        // 取前200个字符作为摘要
        const summary = cleanContent.trim().substring(0, 200);
        return summary.length === 200 ? summary + '...' : summary;
    }

    /**
 * 评估文档复杂度
 */
    private assessComplexity(content: string): 'simple' | 'moderate' | 'complex' {
        const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
        const headings = (content.match(/^#{1,6}\s+/gm) || []).length;
        const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
        const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
        const tables = (content.match(/\|.*\|.*\|/g) || []).length;

        const complexityScore = codeBlocks * 2 + headings + links + images + tables * 3;

        if (complexityScore < 10) return 'simple';
        if (complexityScore < 25) return 'moderate';
        return 'complex';
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