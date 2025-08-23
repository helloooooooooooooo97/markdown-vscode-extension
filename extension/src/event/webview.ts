import * as vscode from "vscode";
import * as path from "path";
import { ConfigurationManager } from "../service/configuration";
import { FileManager } from "../service/file";
import { CommunicationLogger } from "../service/logger";
import { MessageHandler } from "../controller/webview";
import {
    WebviewMessage,
    UpdateMarkdownMessage,
    ExtensionCommand,
    VscodeEventSource,
    UpdateFileMetadataMessage,
    FileInfo,
    ReadFileContentResponseMessage,
    WriteFileContentResponseMessage,
    LoadPinnedQueriesResponseMessage,
    FileType
} from "@supernode/shared";
import EventSource from "./source";

export class MarkdownWebviewProvider {
    public static currentPanel: MarkdownWebviewProvider | undefined;
    public static readonly viewType = "markdownPreview";
    public static extensionContext: vscode.ExtensionContext | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private messageHandler!: MessageHandler;

    public static createOrShow() {
        const previewPosition = ConfigurationManager.getPreviewPosition();

        let column: vscode.ViewColumn;
        const activeEditor = vscode.window.activeTextEditor;

        switch (previewPosition) {
            case 'active':
                // 在当前活动编辑器位置显示
                column = activeEditor ? activeEditor.viewColumn! : vscode.ViewColumn.One;
                break;
            case 'second':
                // 在第二个编辑器组显示
                column = vscode.ViewColumn.Two;
                break;
            case 'beside':
            default:
                // 在活动编辑器旁边显示
                if (activeEditor) {
                    column = activeEditor.viewColumn === vscode.ViewColumn.One
                        ? vscode.ViewColumn.Two
                        : vscode.ViewColumn.One;
                } else {
                    column = vscode.ViewColumn.Two;
                }
                break;
        }

        // 如果已经有面板存在，就显示它
        if (MarkdownWebviewProvider.currentPanel) {
            MarkdownWebviewProvider.currentPanel._panel.reveal(column);
            return;
        }

        // 否则，创建一个新的面板
        const extensionPath = MarkdownWebviewProvider.extensionContext?.extensionPath;
        const projectRoot = extensionPath ? path.dirname(extensionPath) : "";

        const panel = vscode.window.createWebviewPanel(
            MarkdownWebviewProvider.viewType,
            "Markdown 预览",
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(projectRoot, "webview/dist")),
                ],
            }
        );

        MarkdownWebviewProvider.currentPanel = new MarkdownWebviewProvider(panel);
    }

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;

        // 初始化消息处理器
        this.initializeMessageHandler();

        // 设置初始HTML内容
        this._update();

        // 检查当前是否有markdown文件被选中
        this.checkCurrentMarkdownFile();

        // 监听面板关闭事件
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 处理来自webview的消息
        this._panel.webview.onDidReceiveMessage(
            (message: WebviewMessage) => {
                this.handleWebviewMessage(message);
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        MarkdownWebviewProvider.currentPanel = undefined;

        // 清理资源
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private sendMessage(message: WebviewMessage): void {
        CommunicationLogger.logExtensionToWebview(message, message.fileName);
        this._panel.webview.postMessage(message);
    }

    updateMarkdownContent(content: string, fileName: string): void {
        if (EventSource.value === VscodeEventSource.FILE) {
            const message: UpdateMarkdownMessage = {
                command: ExtensionCommand.updateMarkdownContent,
                content: content,
                fileName: fileName,
            };
            this.sendMessage(message);
        }
    }

    updateFileMetadata(files: FileInfo[]): void {
        const message: UpdateFileMetadataMessage = {
            command: ExtensionCommand.updateFileMetadata,
            files: files,
        };
        this.sendMessage(message);
    }

    readFileContentReponse(filePath: string, content: string, success: boolean, fileType: FileType): void {
        const message: ReadFileContentResponseMessage = {
            command: ExtensionCommand.readFileContentResponse,
            filePath: filePath,
            content: content,
            success: success,
            fileType: fileType,
        };
        this.sendMessage(message);
    }

    writeFileContentResponse(filePath: string, success: boolean, error?: string): void {
        const message: WriteFileContentResponseMessage = {
            command: ExtensionCommand.writeFileContentResponse,
            filePath: filePath,
            success: success,
            error: error,
        };
        this.sendMessage(message);
    }

    loadPinnedQueriesResponse(queries: any[], success: boolean, error?: string): void {
        const message: LoadPinnedQueriesResponseMessage = {
            command: ExtensionCommand.loadPinnedQueriesResponse,
            queries: queries,
            success: success,
            error: error,
        };
        this.sendMessage(message);
    }

    /**
     * 初始化消息处理器
     */
    private initializeMessageHandler(): void {
        if (!MarkdownWebviewProvider.extensionContext) {
            console.error("扩展上下文未设置");
            return;
        }

        this.messageHandler = new MessageHandler(MarkdownWebviewProvider.extensionContext);
        // 设置webview提供者引用，以便MessageHandler可以发送消息
        this.messageHandler.setWebviewProvider(this);
    }

    /**
     * 处理来自 WebView 的消息
     */
    private async handleWebviewMessage(message: WebviewMessage): Promise<void> {
        // 记录从webview接收的消息
        CommunicationLogger.logWebviewToExtension(message, message.fileName);
        console.log("收到webview消息:", message);

        // 使用消息处理器处理消息
        await this.messageHandler.handleMessage(message);
    }

    /**
     * 检查当前 Markdown 文件
     */
    private checkCurrentMarkdownFile(): void {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (editor) {
            const document: vscode.TextDocument = editor.document;
            if (FileManager.isMarkdownFile(document)) {
                const content: string = FileManager.getFileContent(document);
                const message: UpdateMarkdownMessage = {
                    command: ExtensionCommand.updateMarkdownContent,
                    content: content,
                    fileName: document.fileName,
                };
                this.sendMessage(message);
            }
        }
    }

    /**
     * 更新面板
     */
    private _update() {
        this._panel.title = "Markdown 预览";
        this._panel.webview.html = this._getHtmlForWebview();
    }

    /**
     * 获取 WebView 的 HTML 内容
     */
    private _getHtmlForWebview() {
        // 使用扩展上下文获取正确的路径
        const extensionPath = MarkdownWebviewProvider.extensionContext?.extensionPath;
        if (!extensionPath) {
            console.error("扩展上下文未设置");
            return this._getFallbackHtml();
        }

        // 从 extension 目录回到项目根目录
        const projectRoot = path.dirname(extensionPath);
        const htmlPath = path.join(projectRoot, "webview/dist/index.html");

        try {
            console.log("尝试读取HTML文件:", htmlPath);
            let htmlContent = require("fs").readFileSync(htmlPath, "utf8");
            console.log("成功读取HTML文件");

            // 替换资源路径为webview URI
            const scriptUri = this._panel.webview.asWebviewUri(
                vscode.Uri.file(
                    path.join(projectRoot, "webview/dist/assets/index.js")
                )
            );
            const styleUri = this._panel.webview.asWebviewUri(
                vscode.Uri.file(
                    path.join(projectRoot, "webview/dist/assets/index.css")
                )
            );

            console.log("脚本URI:", scriptUri.toString());
            console.log("样式URI:", styleUri.toString());

            htmlContent = htmlContent
                .replace("/assets/index.js", scriptUri.toString())
                .replace("/assets/index.css", styleUri.toString());

            return htmlContent;
        } catch (error) {
            console.error("读取HTML文件失败:", error);
            console.error("尝试的路径:", htmlPath);
            // 如果文件读取失败，返回一个简单的HTML
            return this._getFallbackHtml();
        }
    }

    /**
     * 获取备用 HTML 内容
     */
    private _getFallbackHtml(): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 预览</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
    }
  </style>
</head>
<body>
  <div id="root">
    <h1>Markdown 预览</h1>
    <p>加载中...</p>
  </div>
</body>
</html>`;
    }
}

