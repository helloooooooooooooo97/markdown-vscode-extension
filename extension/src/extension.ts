import * as vscode from "vscode";
import * as path from "path";

// 消息类型定义
interface WebviewMessage {
  command: string;
  [key: string]: any;
}

interface UpdateMarkdownMessage extends WebviewMessage {
  command: "updateMarkdownContent";
  content: string;
  fileName: string;
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Supernode Markdown Extension is now active!");

  // 创建状态栏图标
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "$(eye) 预览";
  statusBarItem.tooltip = "点击打开 Markdown 预览";
  statusBarItem.command = "supernode.openPreview";
  statusBarItem.show();

  // 注册打开 Markdown 预览面板的命令
  const openPreviewCommand = vscode.commands.registerCommand(
    "supernode.openPreview",
    () => {
      MarkdownWebviewProvider.createOrShow();
    }
  );

  // 监听文件选择变化
  const fileChangeDisposable = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor && MarkdownWebviewProvider.currentPanel) {
        const document = editor.document;
        if (
          document.languageId === "markdown" ||
          document.languageId === "mdx"
        ) {
          // 保存当前 Markdown 文档路径
          MarkdownWebviewProvider.lastActiveMarkdownPath = document.fileName;
          console.log("保存 Markdown 文档路径:", document.fileName);

          const message: UpdateMarkdownMessage = {
            command: "updateMarkdownContent",
            content: document.getText(),
            fileName: document.fileName,
          };
          MarkdownWebviewProvider.currentPanel.sendMessage(message);
        } else {
          // 如果不是markdown或mdx文件，清空内容
          const clearMessage: UpdateMarkdownMessage = {
            command: "updateMarkdownContent",
            content: "",
            fileName: "",
          };
          MarkdownWebviewProvider.currentPanel.sendMessage(clearMessage);
        }
      }
    }
  );

  // 监听文档内容变化
  const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (MarkdownWebviewProvider.currentPanel) {
        const document = event.document;
        if (
          (document.languageId === "markdown" ||
            document.languageId === "mdx") &&
          vscode.window.activeTextEditor?.document === document
        ) {
          const message: UpdateMarkdownMessage = {
            command: "updateMarkdownContent",
            content: document.getText(),
            fileName: document.fileName,
          };
          MarkdownWebviewProvider.currentPanel.sendMessage(message);
        }
      }
    }
  );

  context.subscriptions.push(
    openPreviewCommand,
    fileChangeDisposable,
    documentChangeDisposable,
    statusBarItem
  );
}

class MarkdownWebviewProvider {
  public static currentPanel: MarkdownWebviewProvider | undefined;
  public static readonly viewType = "markdownPreview";
  // 保存上一次活跃的 Markdown 文档路径
  public static lastActiveMarkdownPath: string | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow() {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // 如果已经有面板存在，就显示它
    if (MarkdownWebviewProvider.currentPanel) {
      MarkdownWebviewProvider.currentPanel._panel.reveal(column);
      return;
    }

    // 否则，创建一个新的面板
    const panel = vscode.window.createWebviewPanel(
      MarkdownWebviewProvider.viewType,
      "Markdown 预览",
      column || vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(__dirname, "../../webview/dist")),
        ],
      }
    );

    MarkdownWebviewProvider.currentPanel = new MarkdownWebviewProvider(panel);
  }

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;

    // 设置初始HTML内容
    this._update();

    // 检查当前是否有markdown文件被选中
    this.checkCurrentMarkdownFile();

    // 监听面板关闭事件
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // 处理来自webview的消息
    this._panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => {
        console.log("收到webview消息:", message);
        switch (message.command) {
          case "showMessage":
            vscode.window.showInformationMessage(message.text);
            return;
          case "openLocalFile":
            console.log("处理本地文件打开请求:", message.path);
            this.handleOpenLocalFile(message.path);
            return;
          default:
            console.log("未知消息类型:", message.command);
        }
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

  private handleOpenLocalFile(relativePath: string): void {
    try {
      console.log("开始处理本地文件打开请求，相对路径:", relativePath);

      // 优先使用保存的 Markdown 文档路径
      let basePath: string | undefined;

      if (MarkdownWebviewProvider.lastActiveMarkdownPath) {
        basePath = path.dirname(MarkdownWebviewProvider.lastActiveMarkdownPath);
        console.log("使用保存的 Markdown 文档路径:", MarkdownWebviewProvider.lastActiveMarkdownPath);
        console.log("基准目录:", basePath);
      } else {
        // 如果没有保存的路径，尝试获取当前活动文档
        const currentEditor = vscode.window.activeTextEditor;
        if (currentEditor) {
          basePath = path.dirname(currentEditor.document.fileName);
          console.log("使用当前活动文档路径:", currentEditor.document.fileName);
        } else {
          // 最后尝试使用工作区根目录
          const workspaceFolders = vscode.workspace.workspaceFolders;
          if (workspaceFolders && workspaceFolders.length > 0) {
            basePath = workspaceFolders[0].uri.fsPath;
            console.log("使用工作区根目录:", basePath);
          } else {
            vscode.window.showErrorMessage("无法获取基准路径");
            return;
          }
        }
      }

      // 解析相对路径
      const targetPath = path.resolve(basePath, relativePath);
      console.log("解析后的目标路径:", targetPath);

      // 检查文件是否存在
      const fs = require("fs");
      if (!fs.existsSync(targetPath)) {
        console.log("文件不存在:", targetPath);
        vscode.window.showErrorMessage(`文件不存在: ${targetPath}`);
        return;
      }

      console.log("文件存在，准备打开:", targetPath);

      // 打开文件
      vscode.workspace.openTextDocument(targetPath).then(
        (document) => {
          console.log("文档已加载，准备显示");
          vscode.window.showTextDocument(document, {
            viewColumn: vscode.ViewColumn.One,
            preview: false
          }).then(() => {
            console.log("文件已成功打开");
            vscode.window.showInformationMessage(`已打开文件: ${path.basename(targetPath)}`);
          });
        },
        (error) => {
          console.error("无法打开文件:", error);
          vscode.window.showErrorMessage(`无法打开文件: ${error.message}`);
        }
      );
    } catch (error) {
      console.error("打开本地文件失败:", error);
      vscode.window.showErrorMessage(`打开本地文件失败: ${error}`);
    }
  }

  private checkCurrentMarkdownFile(): void {
    const editor: vscode.TextEditor | undefined =
      vscode.window.activeTextEditor;
    if (editor) {
      const document: vscode.TextDocument = editor.document;
      if (document.languageId === "markdown" || document.languageId === "mdx") {
        const content: string = document.getText();
        const message: UpdateMarkdownMessage = {
          command: "updateMarkdownContent",
          content: content,
          fileName: document.fileName,
        };
        this.sendMessage(message);
      }
    }
  }

  private _update() {
    this._panel.title = "Markdown 预览";
    this._panel.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    // 读取HTML文件内容
    const htmlPath = path.join(__dirname, "../../webview/dist/index.html");

    try {
      let htmlContent = require("fs").readFileSync(htmlPath, "utf8");

      // 替换资源路径为webview URI
      const scriptUri = this._panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(__dirname, "../../webview/dist/assets/index.js")
        )
      );
      const styleUri = this._panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(__dirname, "../../webview/dist/assets/index.css")
        )
      );

      htmlContent = htmlContent
        .replace("/assets/index.js", scriptUri.toString())
        .replace("/assets/index.css", styleUri.toString());

      return htmlContent;
    } catch (error) {
      // 如果文件读取失败，返回一个简单的HTML
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
}

export function deactivate() {
  console.log("Supernode Markdown Extension is now deactivated!");
}
