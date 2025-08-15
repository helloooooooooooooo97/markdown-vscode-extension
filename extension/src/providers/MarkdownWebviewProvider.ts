import * as vscode from "vscode";
import * as path from "path";
import { ConfigurationManager } from "../managers/ConfigurationManager";
import { FileManager } from "../managers/FileManager";
import {
    WebviewMessage,
    UpdateMarkdownMessage,
    ShowMessage,
    OpenLocalFileMessage,
    UpdateMarkdownContentFromWebviewMessage,
    WebviewErrorMessage,
    WebviewReadyMessage,
    DebugInfoMessage
} from "../types/messages";

export class MarkdownWebviewProvider {
    public static currentPanel: MarkdownWebviewProvider | undefined;
    public static readonly viewType = "markdownPreview";
    // 保存上一次活跃的 Markdown 文档路径
    public static lastActiveMarkdownPath: string | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private configManager: ConfigurationManager;
    private fileManager: FileManager;

    public static createOrShow() {
        const configManager = ConfigurationManager.getInstance();
        const previewPosition = configManager.getPreviewPosition();

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
        const panel = vscode.window.createWebviewPanel(
            MarkdownWebviewProvider.viewType,
            "Markdown 预览",
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(__dirname, "../../../webview/dist")),
                ],
            }
        );

        MarkdownWebviewProvider.currentPanel = new MarkdownWebviewProvider(panel);
    }

    private constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this.configManager = ConfigurationManager.getInstance();
        this.fileManager = FileManager.getInstance();

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

    public sendMessage(message: WebviewMessage): void {
        this._panel.webview.postMessage(message);
    }

    /**
     * 处理来自 WebView 的消息
     */
    private handleWebviewMessage(message: WebviewMessage): void {
        console.log("收到webview消息:", message);

        switch (message.command) {
            case "showMessage":
                this.handleShowMessage(message as ShowMessage);
                break;
            case "openLocalFile":
                this.handleOpenLocalFile(message as OpenLocalFileMessage);
                break;
            case "updateMarkdownContentFromWebview":
                this.handleUpdateMarkdownContentFromWebview(message as UpdateMarkdownContentFromWebviewMessage);
                break;
            case "webviewError":
                this.handleWebviewError(message as WebviewErrorMessage);
                break;
            case "webviewReady":
                this.handleWebviewReady(message as WebviewReadyMessage);
                break;
            case "debugInfo":
                this.handleDebugInfo(message as DebugInfoMessage);
                break;
            default:
                console.log("未知消息类型:", message.command);
        }
    }

    /**
     * 处理显示消息
     */
    private handleShowMessage(message: ShowMessage): void {
        vscode.window.showInformationMessage(message.text);
    }

    /**
     * 处理打开本地文件
     */
    private handleOpenLocalFile(message: OpenLocalFileMessage): void {
        vscode.window.showInformationMessage(message.path);
        this.fileManager.openLocalFile(message.path, MarkdownWebviewProvider.lastActiveMarkdownPath);
    }

    /**
     * 处理从 WebView 更新 Markdown 内容
     */
    private async handleUpdateMarkdownContentFromWebview(message: UpdateMarkdownContentFromWebviewMessage): Promise<void> {
        vscode.window.showInformationMessage(message.content);
        await this.fileManager.updateMarkdownContent(
            MarkdownWebviewProvider.lastActiveMarkdownPath!,
            message.content
        );
    }

    /**
     * 处理 WebView 错误
     */
    private handleWebviewError(message: WebviewErrorMessage): void {
        console.error("Webview 报告错误:", message.error);
        if (message.stack) {
            console.error("错误堆栈:", message.stack);
        }
        if (message.filename) {
            console.error("错误文件:", message.filename, "行:", message.lineno, "列:", message.colno);
        }
        vscode.window.showErrorMessage(`预览错误: ${message.error}`);
    }

    /**
     * 处理 WebView 准备就绪
     */
    private handleWebviewReady(message: WebviewReadyMessage): void {
        console.log("Webview 已准备就绪");
    }

    /**
     * 处理调试信息
     */
    private handleDebugInfo(message: DebugInfoMessage): void {
        console.log("Webview 调试信息:", message.info);
    }

    /**
     * 检查当前 Markdown 文件
     */
    private checkCurrentMarkdownFile(): void {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (editor) {
            const document: vscode.TextDocument = editor.document;
            if (this.fileManager.isMarkdownFile(document)) {
                const content: string = this.fileManager.getFileContent(document);
                const message: UpdateMarkdownMessage = {
                    command: "updateMarkdownContent",
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
        // 读取HTML文件内容
        const htmlPath = path.join(__dirname, "../../../webview/dist/index.html");

        try {
            let htmlContent = require("fs").readFileSync(htmlPath, "utf8");

            // 替换资源路径为webview URI
            const scriptUri = this._panel.webview.asWebviewUri(
                vscode.Uri.file(
                    path.join(__dirname, "../../../webview/dist/assets/index.js")
                )
            );
            const styleUri = this._panel.webview.asWebviewUri(
                vscode.Uri.file(
                    path.join(__dirname, "../../../webview/dist/assets/index.css")
                )
            );

            htmlContent = htmlContent
                .replace("/assets/index.js", scriptUri.toString())
                .replace("/assets/index.css", styleUri.toString());

            return htmlContent;
        } catch (error) {
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