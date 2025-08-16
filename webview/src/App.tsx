import { useEffect } from "react";
import { ConfigProvider, theme, Tabs } from "antd";
import { VSCodeAPI } from "./communication/send/manual_vscode";
import { MessageReceiveHandler } from "./communication/receive/MessageReceiveHandler";
import { MessageSendManager } from "./communication/send/auto_send";
import { TestPanel } from "./components";
import MarkdownView from "./store/markdown/view";
import "./App.css";

const items = [
  {
    key: "markdown",
    label: "Markdown",
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
        className="bg-[#191919] px-8"
        tabBarStyle={{
          marginBottom: 24
        }}
      />
    </ConfigProvider>
  );
}

export default App;
