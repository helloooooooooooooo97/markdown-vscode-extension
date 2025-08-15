import { useState, useEffect } from "react";
import MarkdownRenderer from "./page/MarkdownRenderer";
import "./App.css";
declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
    vscode?: {
      postMessage: (message: any) => void;
    };
  }
}

function App() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [vscode, setVscode] = useState<any>(null);

  // 初始化 VSCode API
  useEffect(() => {
    if (window.acquireVsCodeApi) {
      const vscodeApi = window.acquireVsCodeApi();
      setVscode(vscodeApi);
      // 同时设置到全局变量，供其他组件使用
      window.vscode = vscodeApi;
    }
  }, []);

  useEffect(() => {
    // 监听来自扩展的消息
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      switch (message.command) {
        case "updateMarkdownContent":
          setContent(message.content || "");
          setIsLoading(false);
          break;
        case "showMessage":
          console.log("收到消息:", message.text);
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // 测试通信功能
  const testCommunication = () => {
    if (vscode) {
      console.log("发送测试消息...");
      vscode.postMessage({
        command: "showMessage",
        text: "来自 Webview 的测试消息！"
      });
    } else {
      console.error("VSCode API 未初始化");
    }
  };

  // 测试本地文件链接
  const testLocalFileLink = () => {
    if (vscode) {
      console.log("发送本地文件测试消息...");
      vscode.postMessage({
        command: "openLocalFile",
        path: "../test.md"
      });
    } else {
      console.error("VSCode API 未初始化");
    }
  };

  const testUpdateMarkdownContent = () => {
    if (vscode) {
      console.log("发送更新Markdown内容测试消息...");
      vscode.postMessage({
        command: "updateMarkdownContentFromWebview",
        content: "Hello, World!",
        fileName: "test.md"
      });
    } else {
      console.error("VSCode API 未初始化");
    }
  };

  return (
    <div className="app">
      {/* 测试按钮区域 */}
      <div style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
        marginBottom: "10px",
        background: "#f5f5f5"
      }}>
        <h3>调试测试区域</h3>
        <button
          onClick={testCommunication}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            background: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          测试通信
        </button>
        <button
          onClick={testLocalFileLink}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          测试本地文件链接
        </button>
        <button
          onClick={testUpdateMarkdownContent}
          style={{
            padding: "8px 16px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          测试更新Markdown内容
        </button>
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          VSCode API 状态: {vscode ? "✅ 已初始化" : "❌ 未初始化"}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <p>正在加载 Markdown 内容...</p>
        </div>
      ) : (
        <>
          <MarkdownRenderer content={content} />
        </>
      )}
    </div>
  );
}

export default App;
