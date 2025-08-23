import { useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { HashRouter as Router } from "react-router-dom";
import { VSCodeAPI } from "./communication/send/api";
import { MessageReceiveHandler } from "./communication/receive";
import { MessageSendManager } from "./communication/send/event";
import MenuRouter from "./page/index";
import "./App.css";

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
          colorBgContainer: "#1e1e1e",
          colorBgElevated: "#202020",
          colorBorder: "#404040",
          colorText: "#cccccc",
          colorTextSecondary: "#999999",
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <MenuRouter />
      </Router>
    </ConfigProvider>
  );
}

export default App;