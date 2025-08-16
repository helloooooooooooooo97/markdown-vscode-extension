import React, { useEffect, useState } from "react";
import MarkdownParser from "../../pkg/utils/blockParser";
import { useMarkdownStore } from "./store";


const testMarkdown = `
---
title: 测试
date: 2021-01-01
tags: [1, 2, 3]
---

# 测试
## 测试
### 测试
`

const MarkdownRenderer: React.FC = () => {
    const { setDocument, currentFileName, content, isLoading } = useMarkdownStore();
    const [parsedMarkdown, setParsedMarkdown] = useState<React.ReactNode[]>([]);
    useEffect(() => {
        if (isLoading) {
            const parser = new MarkdownParser(testMarkdown);
            const markdown = parser.parse(); // 解析并获取渲染结果
            const blocks = parser.getBlocks();
            setDocument(blocks);
            setParsedMarkdown(markdown); // 保存解析结果用于渲染
        } else {
            const parser = new MarkdownParser(content);
            const markdown = parser.parse(); // 解析并获取渲染结果
            const blocks = parser.getBlocks();
            setDocument(blocks);
            setParsedMarkdown(markdown); // 保存解析结果用于渲染
        }
    }, [content, isLoading]);

    return (
        <div>
            <div>{currentFileName}</div>
            {parsedMarkdown}
        </div>
    );
};

export default MarkdownRenderer;
