import React from "react";
import MarkdownParser from "./Parser";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content.trim()) {
    return (
      <div className="markdown-renderer empty">
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div className="markdown-renderer">
      {new MarkdownParser(content).parse()}
    </div>
  );
};

export default MarkdownRenderer;
