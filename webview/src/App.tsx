import { useEffect, useState } from "react";
import { ConfigProvider, theme, Layout, Menu } from "antd";
import { FileTextOutlined, BugOutlined } from "@ant-design/icons";
import { VSCodeAPI } from "./communication/send/manual_vscode";
import { MessageReceiveHandler } from "./communication/receive/MessageReceiveHandler";
import { MessageSendManager } from "./communication/send/auto_send";
import { TestPanel } from "./components";
import MarkdownView from "./page/markdown/view";
import "./App.css";

const { Sider, Content } = Layout;

// 定义菜单项
const menuItems = [
  {
    key: "markdown",
    icon: <FileTextOutlined />,
    label: "Markdown",
  },
  {
    key: "test",
    icon: <BugOutlined />,
    label: "连接测试",
  }
];

// 渲染内容组件
const renderContent = (activeKey: string) => {
  switch (activeKey) {
    case "markdown":
      return <MarkdownView />;
    case "test":
      return <TestPanel />;
    default:
      return <MarkdownView />;
  }
};

function App() {
  const [activeKey, setActiveKey] = useState("markdown");

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

  const handleMenuClick = ({ key }: { key: string }) => {
    setActiveKey(key);
  };

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
      <Layout className="h-screen bg-[#1E1E1E]">
        <Sider
          width={48}
          className="!bg-[#202020] border-r border-r-[#2A2A2A]"
        >
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={handleMenuClick}
            className="!bg-[#202020] !border-none !text-[#cccccc]"
            theme="dark"
            inlineCollapsed={true}
            expandIcon={null}
          />
        </Sider>
        <Content className="!bg-[#1e1e1e] overflow-auto">
          {renderContent(activeKey)}
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
