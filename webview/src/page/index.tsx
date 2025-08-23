import { useMemo, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
    FileTextOutlined,
    BugOutlined,
    FileExcelOutlined,
    FilePptOutlined,
} from "@ant-design/icons";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { VSCodeAPI } from "../communication/send/api";
import { TestPanel } from "../components";
import MarkdownView from "./word/view";
import FileView from "./excel/view";
import PresentationView from "./presentation/view";
import useMarkdownStore from "../store/markdown/store";
import { PinnedQuery, usePinStore } from "../store/pin/store";
import { PinUtil } from "../store/pin/utils";
import { useFileStore } from "../store/file/store";
import { VscodeEventSource } from "@supernode/shared";
const { Sider, Content } = Layout;

enum MenuKey {
    WORD = "word",
    EXCEL = "excel",
    PPT = "ppt",
    test = "test",
}

// 路由路径映射
const ROUTE_PATHS = {
    [MenuKey.WORD]: "/word",
    [MenuKey.EXCEL]: "/excel",
    [MenuKey.PPT]: "/ppt",
    [MenuKey.test]: "/test",
} as const;

// 路径到菜单键的映射
const PATH_TO_MENU_KEY: Record<string, MenuKey> = {
    "/word": MenuKey.WORD,
    "/excel": MenuKey.EXCEL,
    "/ppt": MenuKey.PPT,
    "/test": MenuKey.test,
};

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

// 主应用布局组件
const Router: React.FC = () => {
    const { setSource } = useMarkdownStore.getState();
    const navigate = useNavigate();
    const location = useLocation();
    const { updateLastUsed, pinnedQueries } = usePinStore();
    const { setFilter, setSort, setViewMode } = useFileStore();

    // 确保初始化时导航到默认路由
    useEffect(() => {
        console.log('Router: Current pathname:', location.pathname);
        if (location.pathname === '/' || location.pathname === '') {
            console.log('Router: Redirecting to /word');
            navigate('/word', { replace: true });
        }
    }, [location.pathname, navigate]);

    // 从当前路径获取活动菜单键
    const getActiveKey = (): string => {
        const path = location.pathname;
        console.log('Router: Getting active key for path:', path);
        const menuKey = PATH_TO_MENU_KEY[path];
        const activeKey = menuKey || MenuKey.WORD;
        console.log('Router: Active key:', activeKey);
        return activeKey;
    };

    const handleSidebarQueryClick = (queryId: string) => {
        const query = pinnedQueries.find(q => q.id === queryId);
        if (query) {
            // 使用PinUtil修复PIN的filter，确保Date对象正确转换
            const fixedFilter = PinUtil.fixPinnedQueryFilter(query.filter);

            setFilter(fixedFilter);
            setSort(query.sort);
            setViewMode(query.viewMode);
            updateLastUsed(query.id);
            navigate(ROUTE_PATHS[MenuKey.EXCEL]); // 使用路由导航
        }
    };

    const menuItems = useMemo(() => buildMenuItems(pinnedQueries), [pinnedQueries]);

    const handleMenuClick = ({ key }: { key: string }) => {
        // 检查是否是侧边栏查询
        if (key.startsWith('pin-')) {
            const queryId = key.replace('pin-', '');
            handleSidebarQueryClick(queryId);
        } else {
            // 导航到对应的路由
            const routePath = ROUTE_PATHS[key as MenuKey];
            if (routePath) {
                navigate(routePath);
            }
        }
    };

    const handleChangeEventSourceToWebview = () => {
        setSource(VscodeEventSource.WEBVIEW);
        VSCodeAPI.setEventSourceToWebview();
    };

    return (
        <Layout
            className="h-screen bg-[#1E1E1E]"
            onClick={() => handleChangeEventSourceToWebview()}
        >
            <Sider width={48} className="!bg-[#202020] border-r border-r-[#2A2A2A]">
                <Menu
                    mode="inline"
                    selectedKeys={[getActiveKey()]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="!bg-[#202020] !border-none !text-[#cccccc]"
                    theme="dark"
                    inlineCollapsed={true}
                    expandIcon={null}
                />
            </Sider>
            <Content className="!bg-[#1e1e1e] overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to="/word" replace />} />
                    <Route path="/word" element={<MarkdownView />} />
                    <Route path="/excel" element={<FileView />} />
                    <Route path="/ppt" element={<PresentationView />} />
                    <Route path="/test" element={<TestPanel />} />
                    {/* 添加通配符路由，确保所有未匹配的路径都重定向到 word */}
                    <Route path="*" element={<Navigate to="/word" replace />} />
                </Routes>
            </Content>
        </Layout>
    );
};

export default Router;