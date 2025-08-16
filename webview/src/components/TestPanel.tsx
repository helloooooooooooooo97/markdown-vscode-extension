import { Button, Space, Typography } from "antd";
import { TestFunctionManager } from "../handlers";
import { useMarkdownStore } from "../store/markdown/store";

const { Title, Text } = Typography;

const TestPanel = () => {
    const { content, isLoading } = useMarkdownStore();
    const testFunctionManager = new TestFunctionManager();

    const testCommunication = () => testFunctionManager.testCommunication();
    const testLocalFileLink = () => testFunctionManager.testLocalFileLink();
    const testUpdateMarkdownContent = () => testFunctionManager.testUpdateMarkdownContent();
    const sendDebugInfo = () => testFunctionManager.sendDebugInfo();

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
                    内容长度: {content.length} 字符
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    加载状态: {isLoading ? "加载中" : "已完成"}
                </Text>
            </Space>
        </div>
    );
};

export default TestPanel; 