import { Spin } from "antd";
import MarkdownRenderer from "../page/MarkdownRenderer";
import { useMarkdownStore } from "../store/markdown/store";

const MarkdownView = () => {
    const { content, isLoading } = useMarkdownStore();

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <Spin tip="正在加载 Markdown 内容..." size="large" />
            </div>
        );
    }

    return <MarkdownRenderer content={content} />;
};

export default MarkdownView; 