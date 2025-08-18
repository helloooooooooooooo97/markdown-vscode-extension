import { useEffect, useState } from "react";
import { Card, Typography, Space, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useMarkdownStore } from "../../store/markdown/store";

const { Title } = Typography;

const StoreMonitor = () => {
    const store = useMarkdownStore();
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // 监听 store 变化
    useEffect(() => {
        setLastUpdate(new Date());
    }, [store]);

    // 只提取 store 中的变量数据，过滤掉函数
    const getStoreData = () => {
        const { docs, filePath, content, isLoading, source } = store;
        return {
            docs,
            filePath,
            content,
            isLoading,
            source
        };
    };

    return (
        <div style={{ padding: "24px" }}>
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

export default StoreMonitor; 