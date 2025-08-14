import { useState, useEffect } from "react";
import MarkdownRenderer from "./components/MarkdownRenderer";
import "./App.css";

declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
  }
}

function App() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading">
          <p>正在加载 Markdown 内容...</p>
        </div>
      ) : (
        <MarkdownRenderer content={content} />
      )}
    </div>
  );
}

export default App;
