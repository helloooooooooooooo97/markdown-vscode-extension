import React, { useEffect, useState } from "react";
import MarkdownParser from "../utils/blockParser";
import { useMarkdownStore } from "../store/markdown/store";

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

  if (!content.trim()) {
    return (
      <div className="markdown-renderer empty" style={{
        textAlign: 'center',
        padding: '40px',
        color: '#999999'
      }}>
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div className="markdown-renderer" style={{
      backgroundColor: '#1e1e1e',
      color: '#cccccc',
      lineHeight: '1.6',
      fontSize: '14px'
    }}>
      {parsedMarkdown}
      {/* 调试信息 - 可以注释掉 */}
      {/* <pre style={{ 
        backgroundColor: '#252526', 
        padding: '15px', 
        borderRadius: '6px',
        fontSize: '12px',
        overflow: 'auto'
      }}>
        {JSON.stringify(docs, null, 2)}
      </pre> */}
    </div>
  );
};

export default MarkdownRenderer;
