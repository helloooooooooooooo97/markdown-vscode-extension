import React, { useEffect, useState } from "react";
import MarkdownParser from "../utils/blockParser";
import { useMarkdownStore } from "../components/store/store";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { docs, setDocument } = useMarkdownStore();
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

  if (!content.trim()) {
    return (
      <div className="markdown-renderer empty">
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div className="markdown-renderer">
      {parsedMarkdown}
      <pre>{JSON.stringify(docs, null, 2)}</pre>
    </div>
  );
};

export default MarkdownRenderer;
