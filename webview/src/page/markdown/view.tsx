import { Spin } from "antd";
import MarkdownRenderer from "../../store/markdown/view.tsx";
import { useMarkdownStore } from "../../store/markdown/store.ts";

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