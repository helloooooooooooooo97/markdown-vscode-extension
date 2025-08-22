import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme, Layout, Menu } from "antd";
import {
  FileTextOutlined,
  BugOutlined,
  FileExcelOutlined,
  FilePptOutlined,
} from "@ant-design/icons";
import { VSCodeAPI } from "./communication/send/manual_vscode";
import { MessageReceiveHandler } from "./communication/receive/MessageReceiveHandler";
import { MessageSendManager } from "./communication/send/auto_send";
import { TestPanel } from "./components";
import MarkdownView from "./page/word/view";
import FileView from "./page/excel/view";
import PresentationView from "./page/presentation/view";
import useMarkdownStore from "./store/markdown/store";
import { PinnedQuery, usePinStore } from "./store/pin/store";
import { useFileStore } from "./store/file/store";
import { VscodeEventSource } from "@supernode/shared";
import "./App.css";
const { Sider, Content } = Layout;

enum MenuKey {
  WORD = "word",
  EXCEL = "excel",
  PPT = "ppt",
  test = "test",
}

// 构建菜单项
const buildMenuItems = (pinnedQueries: PinnedQuery[]) => {
  const baseItems = [
    {
      key: MenuKey.WORD,
      icon: <FileTextOutlined />,
      label: "word",
    },
    {
      key: MenuKey.PPT,
      icon: <FilePptOutlined />,
      label: "ppt",
    },
    {
      key: MenuKey.EXCEL,
      icon: <FileExcelOutlined />,
      label: "excel",
    },
    {
      key: MenuKey.test,
      icon: <BugOutlined />,
      label: "连接测试",
    },
  ];

  const sidebarItems = pinnedQueries
    .filter((query) => query.showInSidebar)
    .map((query) => ({
      key: `pin-${query.id}`,
      icon: <span style={{ fontSize: '16px' }}>{query.sidebarIcon}</span>,
      label: query.name,
    }));

  console.log("sidebarItems", sidebarItems);

  return [...baseItems, ...sidebarItems];
};

function App() {
  const { setSource } = useMarkdownStore.getState();
  const [activeKey, setActiveKey] = useState<MenuKey>(MenuKey.WORD);
  const { updateLastUsed, pinnedQueries } = usePinStore();
  const { setFilter, setSort, setViewMode } = useFileStore();
  const handleSidebarQueryClick = (queryId: string) => {
    const query = pinnedQueries.find(q => q.id === queryId);
    if (query) {
      setFilter(query.filter);
      setSort(query.sort);
      setViewMode(query.viewMode);
      updateLastUsed(query.id);
      setActiveKey(MenuKey.EXCEL); // 切换到excel的搜索页面
    }
  };

  const menuItems = useMemo(() => buildMenuItems(pinnedQueries), [pinnedQueries]);

  // 渲染内容组件
  const renderContent = (activeKey: MenuKey) => {
    switch (activeKey) {
      case MenuKey.WORD:
        return <MarkdownView />;
      case MenuKey.EXCEL:
        return <FileView />;
      case MenuKey.PPT:
        return <PresentationView />;
      case MenuKey.test:
        return <TestPanel />;
      default:
        return <MarkdownView />;
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    // 检查是否是侧边栏查询
    if (key.startsWith('pin-')) {
      const queryId = key.replace('pin-', '');
      handleSidebarQueryClick(queryId);
    } else {
      setActiveKey(key as MenuKey);
    }
  };

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


  const handleChangeEventSourceToWebview = () => {
    setSource(VscodeEventSource.WEBVIEW);
    VSCodeAPI.setEventSourceToWebview();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#1e1e1e",
          colorBgElevated: "transparent",
          colorBorder: "#404040",
          colorText: "#cccccc",
          colorTextSecondary: "#999999",
          borderRadius: 6,
        },
      }}
    >

      <Layout
        className="h-screen bg-[#1E1E1E]"
        onClick={() => handleChangeEventSourceToWebview()}
      >
        <Sider width={48} className="!bg-[#202020] border-r border-r-[#2A2A2A]">
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