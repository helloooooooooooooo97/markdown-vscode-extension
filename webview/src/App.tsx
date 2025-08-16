import { useEffect } from "react";
import { ConfigProvider, theme, Tabs } from "antd";
import { VSCodeAPI } from "./pkg/api/vscode";
import { MessageReceiveHandler, MessageSendManager } from "./pkg/router";
import { MarkdownView, TestPanel } from "./pkg/components";
import "./App.css";

const items = [
  {
    key: "markdown",
    label: "Markdown 渲染",
    children: <MarkdownView />
  },
  {
    key: "test",
    label: "连接测试",
    children: <TestPanel />
  }
];

function App() {
  useEffect(() => {
    // 初始化 VSCode API
    VSCodeAPI.initialize();

    // 创建消息接收处理器
    const messageReceiveHandler = new MessageReceiveHandler();
    messageReceiveHandler.init();

    // 创建消息发送处理器
    const messageSendManager = new MessageSendManager();
    messageSendManager.init();

    return () => {
      messageReceiveHandler.destroy();
      messageSendManager.destroy();
    };
  }, []);
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#1e1e1e',
          colorBgElevated: '#252526',
          colorBorder: '#404040',
          colorText: '#cccccc',
          colorTextSecondary: '#999999',
          borderRadius: 6,
        },
      }}
    >
      <Tabs
        defaultActiveKey="markdown"
        items={items}
        style={{
          background: "#252526",
          borderRadius: 8,
          padding: 16,
          minHeight: 400
        }}
        tabBarStyle={{
          marginBottom: 24
        }}
      />
    </ConfigProvider>
  );
}

export default App;
