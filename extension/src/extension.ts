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
        switch (message.command) {
          case "showMessage":
            vscode.window.showInformationMessage(message.text);
            return;
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
