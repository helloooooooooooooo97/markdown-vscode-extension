import React, { useEffect, useState } from "react";
import MarkdownParser from "../../pkg/utils/blockParser";
import { useMarkdownStore } from "./store";


const testMarkdown = `
---
title: 测试
updatedAt: '2025-08-02T07:25:09.456Z'
tags: ["标签1", "标签2", "标签3"]
---

# 测试
## 测试
### 测试

$$
g_t = \nabla L(w_t)
$$

`

const MarkdownRenderer: React.FC = () => {
    const { setDocument, filePath, content, isLoading } = useMarkdownStore();
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
            <div className="text-4xl font-semibold pb-4 text-[#D4D4D4]">
                {filePath ? filePath.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, "") : "文件名"}
            </div>
            {parsedMarkdown}
        </div>
    );
};

export default MarkdownRenderer;
