import React from "react";
import { renderToString } from "katex";
import {
    InlineBold,
    InlineItalic,
    InlineCode,
    InlineLink,
    LatexInlineComponent,
    LatexInlineErrorComponent,
} from "../../components/markdown";

/**
 * 行内解析器类
 */
class InlineParser {
    /**
     * 统一解析所有行内元素（包括LaTeX、链接、代码、粗体、斜体）
     */
    static parseInlineElements(text: string): React.ReactNode[] {
        const parts: React.ReactNode[] = [];
        let currentText = text;
        let currentIndex = 0;

        // 正则表达式顺序：行内LaTeX、链接、粗体、斜体、代码
        // $...$、[text](url)、**text**、*text*、`code`
        const pattern =
            /\$([^\$]+)\$|\[([^\]]+)\]\(([^)]+)\)|\*\*([^\*]+)\*\*|\*([^\*]+)\*|`([^`]+)`/g;

        let match: RegExpExecArray | null;
        let lastIndex = 0;

        while ((match = pattern.exec(currentText)) !== null) {
            // 处理匹配前的普通文本
            if (match.index > lastIndex) {
                parts.push(currentText.slice(lastIndex, match.index));
            }

            if (match[1]) {
                // 行内LaTeX
                const latex = match[1].trim();
                try {
                    const html = renderToString(latex, {
                        throwOnError: false,
                        displayMode: true,
                        output: "htmlAndMathml",
                        leqno: false,
                        fleqn: false,
                        strict: false,
                        trust: true,
                        maxSize: 10,
                        maxExpand: 1000,
                    });
                    parts.push(
                        <LatexInlineComponent
                            key={`latex-inline-${currentIndex}`}
                            html={html}
                            index={currentIndex}
                        />
                    );
                } catch (error) {
                    console.error("LaTeX Rendering Error:", error);
                    parts.push(
                        <LatexInlineErrorComponent
                            key={`latex-inline-${currentIndex}`}
                            latex={latex}
                            index={currentIndex}
                        />
                    );
                }
                currentIndex++;
            } else if (match[2] && match[3]) {
                // 链接
                const linkText = match[2];
                const linkUrl = match[3];
                parts.push(
                    <InlineLink href={linkUrl} key={`link-${currentIndex}`}>
                        {InlineParser.parseInlineElements(linkText)}
                    </InlineLink>
                );
                currentIndex++;
            } else if (match[4]) {
                // 粗体
                parts.push(<InlineBold key={`bold-${currentIndex}`}>{match[4]}</InlineBold>);
                currentIndex++;
            } else if (match[5]) {
                // 斜体
                parts.push(<InlineItalic key={`italic-${currentIndex}`}>{match[5]}</InlineItalic>);
                currentIndex++;
            } else if (match[6]) {
                // 行内代码
                parts.push(
                    <InlineCode key={`inline-${currentIndex}`}>{match[6]}</InlineCode>
                );
                currentIndex++;
            }
            lastIndex = pattern.lastIndex;
        }

        // 处理最后一个匹配后的剩余文本
        if (lastIndex < currentText.length) {
            parts.push(currentText.slice(lastIndex));
        }

        return parts;
    }
}

export default InlineParser;