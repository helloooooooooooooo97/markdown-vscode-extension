import { Button, Card, Space, Typography } from "antd";
import { TestFunctionManager } from "./api";
import { useMarkdownStore } from "../../store/markdown/store";
import { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const TestPanel = () => {
    const { blocks } = useMarkdownStore();
    const testFunctionManager = new TestFunctionManager();

    const testCommunication = () => testFunctionManager.testCommunication();
    const testLocalFileLink = () => testFunctionManager.testLocalFileLink();
    const testUpdateMarkdownContent = () => testFunctionManager.testUpdateMarkdownContent();
    const sendDebugInfo = () => testFunctionManager.sendDebugInfo();

    const store = useMarkdownStore();
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // 监听 store 变化
    useEffect(() => {
        setLastUpdate(new Date());
    }, [store]);

    // 只提取 store 中的变量数据，过滤掉函数
    const getStoreData = () => {
        const { blocks, filePath, source } = store;
        return {
            blocks,
            filePath,
            source
        };
    };
    return (
        <div style={{
            padding: "24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
        }}>
            <Title level={4}>调试测试区域</Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Space>
                    <Button type="primary" onClick={testCommunication}>
                        测试通信
                    </Button>
                    <Button onClick={testLocalFileLink}>
                        测试本地文件链接
                    </Button>
                    <Button onClick={testUpdateMarkdownContent}>
                        测试更新Markdown内容
                    </Button>
                    <Button onClick={sendDebugInfo}>
                        发送调试信息
                    </Button>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    VSCode API 状态: ✅ 已初始化
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    内容长度: {blocks.map(block => block.lines.join('\n')).join('\n').length} 字符
                </Text>
            </Space>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* 标题和操作区域 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title level={3}>Store 数据监控</Title>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => setLastUpdate(new Date())}
                    >
                        刷新 ({lastUpdate.toLocaleTimeString()})
                    </Button>
                </div>

                {/* Store 变量数据 */}
                <Card title="Store 变量数据" size="small">
                    <div style={{
                        padding: 12,
                        borderRadius: 4,
                        fontFamily: "monospace",
                        fontSize: 12,
                        overflow: "auto"
                    }}>
                        <pre>{JSON.stringify(getStoreData(), null, 2)}</pre>
                    </div>
                </Card>
            </Space>
        </div>
    );
};

export default TestPanel; 