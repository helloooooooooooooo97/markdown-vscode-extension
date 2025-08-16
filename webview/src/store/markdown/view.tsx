import React, { useEffect, useState } from "react";
import MarkdownParser from "../../pkg/utils/blockParser";
import { useMarkdownStore } from "./store";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const { setDocument } = useMarkdownStore();
    const [parsedMarkdown, setParsedMarkdown] = useState<React.ReactNode[]>([]);
    useEffect(() => {
        if (content.trim()) {
            const parser = new MarkdownParser(content);
            const markdown = parser.parse(); // 解析并获取渲染结果
            const blocks = parser.getBlocks();
            setDocument(blocks);
            setParsedMarkdown(markdown); // 保存解析结果用于渲染
        }
    }, [content]);

    return (
        <div className="markdown-renderer">
            {parsedMarkdown}
        </div>
    );
};

export default MarkdownRenderer;
