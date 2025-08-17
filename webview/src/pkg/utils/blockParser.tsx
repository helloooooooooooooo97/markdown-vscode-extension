import React from "react";
import { renderToString } from "katex";
import * as yaml from "js-yaml";
import {
    BlockCode,
    BlockHeading,
    BlockList,
    BlockParagraph,
    BlockTable,
    BlockLatex,
    BlockLatexError,
    BlockAlert,
    BlockIframe,
    BlockFrontMatter,
    BlockWrapper,
} from "../../components/markdown";

import InlineParser from "./inlineParser";
import { Block, BlockType } from "../../store/markdown/type";

/**
 * 块级解析器类
 */
class BlockParser {
    lines: string[];
    elements: React.ReactNode[];
    blocks: Block[];

    constructor(text: string) {
        this.lines = text.split("\n");
        this.elements = [];
        this.blocks = [];
    }

    /**
     * 创建block并生成id
     */
    createBlock(lines: string[], startIndex: number, endIndex: number, type: BlockType): Block {
        const id = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const block: Block = {
            id,
            lines: lines.slice(startIndex, endIndex + 1),
            type: type
        };
        this.blocks.push(block);
        return block;
    }

    /**
     * 包装block元素
     */
    wrapBlock(block: Block, element: React.ReactNode): React.ReactNode {
        return (
            <BlockWrapper
                key={block.id}
                block={block}
                onClick={(block) => {
                    console.log('Block clicked:', block);
                    // 这里可以添加点击处理逻辑
                }}
                onMouseEnter={(block) => {
                    console.log('Block hovered:', block);
                    // 这里可以添加悬停处理逻辑
                }}
            >
                {element}
            </BlockWrapper>
        );
    }

    /**
     * 解析表格
     */
    parseTable(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        if (
            typeof line === "string" &&
            /^\s*\|(.+)\|\s*$/.test(line) &&
            startIndex + 1 < this.lines.length &&
            /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(this.lines[startIndex + 1])
        ) {
            // 解析表头
            const headerLine = line.trim();
            const headerCells = headerLine
                .replace(/^\|/, "")
                .replace(/\|$/, "")
                .split("|")
                .map((cell) => InlineParser.parseInlineElements(cell.trim()));

            // 解析分隔线（跳过）
            let i = startIndex + 2;

            // 解析表格内容
            const rows: React.ReactNode[][] = [];
            while (i < this.lines.length && /^\s*\|(.+)\|\s*$/.test(this.lines[i])) {
                const rowLine = this.lines[i].trim();
                const rowCells = rowLine
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                    .split("|")
                    .map((cell) => InlineParser.parseInlineElements(cell.trim()));
                rows.push(rowCells);
                i++;
            }
            // 创建block
            const block = this.createBlock(this.lines, startIndex, i - 1, BlockType.Table);

            return {
                element: this.wrapBlock(block, (
                    <BlockTable
                        blockId={block.id}
                        headers={headerCells}
                        rows={rows}
                    />
                )),
                nextIndex: i - 1,
            };
        }
        return null;
    }

    /**
     * 解析无序列表
     */
    parseList(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        const listMatch =
            typeof line === "string" ? line.match(/^[-*+]\s+(.*)$/) : null;
        if (listMatch) {
            // 解析第一个列表项的行内元素
            const firstItemContent = InlineParser.parseInlineElements(listMatch[1]);
            const items = [firstItemContent];

            let j = startIndex + 1;
            while (j < this.lines.length) {
                const nextListMatch = this.lines[j].match(/^[-*+]\s+(.*)$/);
                if (nextListMatch) {
                    // 解析每个列表项的行内元素
                    const itemContent = InlineParser.parseInlineElements(nextListMatch[1]);
                    items.push(itemContent);
                    j++;
                } else {
                    break;
                }
            }
            // 创建block
            const block = this.createBlock(this.lines, startIndex, j - 1, BlockType.List);

            return {
                element: this.wrapBlock(block, <BlockList blockId={block.id} items={items} />),
                nextIndex: j - 1,
            };
        }
        return null;
    }

    /**
     * 解析标题
     */
    parseHeading(line: string, index: number): React.ReactNode | null {
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            // 创建block
            const block = this.createBlock(this.lines, index, index, BlockType.Heading);

            return this.wrapBlock(block, (
                <BlockHeading blockId={block.id} level={level}>
                    {headingMatch[2]}
                </BlockHeading>
            ));
        }
        return null;
    }

    /**
     * 解析代码块
     */
    parseCodeBlock(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("```")) {
            // 提取语言标识符
            const languageMatch = line.trim().match(/^```(\w+)?/);
            const language = languageMatch ? languageMatch[1] : undefined;

            const codeLines: string[] = [];
            let i = startIndex + 1;

            // 收集代码块内容直到遇到结束标记
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith("```")) {
                    break;
                }
                codeLines.push(currentLine);
                i++;
            }

            // 创建block
            const block = this.createBlock(this.lines, startIndex, i, BlockType.Code);

            return {
                element: this.wrapBlock(block, (
                    <BlockCode
                        blockId={block.id}
                        code={codeLines.join("\n")}
                        language={language}
                    />
                )),
                nextIndex: i,
            };
        }
        return null;
    }

    /**
     * 解析块级 LaTeX
     */
    parseBlockLatex(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];

        // 检查是否以 $$ 开始
        if (typeof line === "string" && line.trim() === "$$") {
            const latexLines: string[] = [];
            let i = startIndex + 1;

            // 收集直到找到结束的 $$
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim() === "$$") {
                    try {
                        const latex = latexLines.join("\n");
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

                        // 创建block
                        const block = this.createBlock(this.lines, startIndex, i, BlockType.Latex);

                        return {
                            element: this.wrapBlock(block, (
                                <BlockLatex
                                    blockId={block.id}
                                    html={html}
                                    index={startIndex}
                                />
                            )),
                            nextIndex: i,
                        };
                    } catch (error) {
                        console.error("LaTeX Rendering Error:", error);
                        // 创建block
                        const block = this.createBlock(this.lines, startIndex, i, BlockType.Latex);

                        return {
                            element: this.wrapBlock(block, (
                                <BlockLatexError
                                    blockId={block.id}
                                    latex={latexLines.join("\n")}
                                    index={startIndex}
                                />
                            )),
                            nextIndex: i,
                        };
                    }
                }
                latexLines.push(currentLine);
                i++;
            }
        }
        return null;
    }

    /**
     * 解析信息块
     */
    parseInfoBlock(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith(":::")) {
            // 提取类型信息，例如 :::info 中的 info
            const typeMatch = line.trim().match(/^:::(.+)$/);
            const type = typeMatch ? typeMatch[1].trim() : "info";

            const infoBlockLines: string[] = [];
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith(":::")) {
                    break;
                }
                infoBlockLines.push(currentLine);
                i++;
            }
            // 创建block
            const block = this.createBlock(this.lines, startIndex, i, BlockType.Alert);

            // 解析信息块内的每一行内容
            const parsedContent = infoBlockLines.map((line, lineIndex) => {
                const inlineParts = InlineParser.parseInlineElements(line);
                return (
                    <BlockParagraph key={`info-line-${startIndex}-${lineIndex}`} blockId={block.id}>
                        {inlineParts}
                    </BlockParagraph>
                );
            });

            return {
                element: this.wrapBlock(block, <BlockAlert blockId={block.id} type={type}>{parsedContent}</BlockAlert>),
                nextIndex: i,
            };
        }
        return null;
    }

    /**
     * 解析 iframe
     */
    parseIframe(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("<iframe")) {
            // 尝试解析单行的 iframe 标签
            const iframeMatch = line.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/);
            if (iframeMatch) {
                const src = iframeMatch[1];
                // 提取其他属性
                const widthMatch = line.match(/width=["']([^"']+)["']/);
                const heightMatch = line.match(/height=["']([^"']+)["']/);
                const sandboxMatch = line.match(/sandbox=["']([^"']+)["']/);

                // 创建block
                const block = this.createBlock(this.lines, startIndex, startIndex, BlockType.Iframe);

                return {
                    element: this.wrapBlock(block, (
                        <BlockIframe
                            blockId={block.id}
                            src={src}
                            width={widthMatch ? widthMatch[1] : undefined}
                            height={heightMatch ? heightMatch[1] : undefined}
                            sandbox={sandboxMatch ? sandboxMatch[1] : undefined}
                        />
                    )),
                    nextIndex: startIndex + 1,
                };
            }
        }
        return null;
    }

    /**
     * 解析 Frontmatter
     */
    parseFrontmatter(
        startIndex: number
    ): { element: React.ReactNode; nextIndex: number } | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("---")) {
            const frontmatterLines: string[] = [];
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith("---")) {
                    break;
                }
                frontmatterLines.push(currentLine);
                i++;
            }

            // 使用 js-yaml 解析 YAML 格式的 frontmatter
            let frontmatterData: Record<string, any> = {};
            try {
                const yamlContent = frontmatterLines.join("\n");
                if (yamlContent.trim()) {
                    frontmatterData = yaml.load(yamlContent) as Record<string, any> || {};
                }
            } catch (error) {
                console.error("Frontmatter YAML parsing error:", error);
                frontmatterData = { error: "Failed to parse frontmatter" };
            }

            // 创建block
            const block = this.createBlock(this.lines, startIndex, i, BlockType.FrontMatter);

            return {
                element: this.wrapBlock(block, <BlockFrontMatter blockId={block.id} data={frontmatterData} />),
                nextIndex: i,
            };
        }
        return null;
    }

    /**
     * 主解析流程
     */
    parse(): React.ReactNode[] {
        // 清空之前的blocks
        this.blocks = [];

        // 遍历每一行，逐步解析
        for (let i = 0; i < this.lines.length; i++) {
            let line: string = this.lines[i];

            // Frontmatter
            const frontmatterResult = this.parseFrontmatter(i);
            if (frontmatterResult) {
                this.elements.push(frontmatterResult.element);
                i = frontmatterResult.nextIndex;
                continue;
            }

            // 代码块
            const codeBlockResult = this.parseCodeBlock(i);
            if (codeBlockResult) {
                this.elements.push(codeBlockResult.element);
                i = codeBlockResult.nextIndex;
                continue;
            }

            // 表格
            const tableResult = this.parseTable(i);
            if (tableResult) {
                this.elements.push(tableResult.element);
                i = tableResult.nextIndex;
                continue;
            }

            // 标题
            if (typeof line === "string") {
                const headingNode = this.parseHeading(line, i);
                if (headingNode) {
                    this.elements.push(headingNode);
                    continue;
                }
            }

            // 无序列表
            const listResult = this.parseList(i);
            if (listResult) {
                this.elements.push(listResult.element);
                i = listResult.nextIndex;
                continue;
            }

            // 信息块
            const infoBlockResult = this.parseInfoBlock(i);
            if (infoBlockResult) {
                this.elements.push(infoBlockResult.element);
                i = infoBlockResult.nextIndex;
                continue;
            }

            // iframe
            const iframeResult = this.parseIframe(i);
            if (iframeResult) {
                this.elements.push(iframeResult.element);
                i = iframeResult.nextIndex;
                continue;
            }

            // 空行
            if (typeof line === "string" && line.trim() === "") {
                continue;
            }

            // 块级 LaTeX
            const blockLatexResult = this.parseBlockLatex(i);
            if (blockLatexResult) {
                this.elements.push(blockLatexResult.element);
                i = blockLatexResult.nextIndex;
                continue;
            }

            // 行内内容（包括行内latex、粗体、斜体、代码、链接等）
            if (typeof line === "string") {
                const inlineParts = InlineParser.parseInlineElements(line);
                if (inlineParts.length > 0) {
                    // 创建block
                    const block = this.createBlock(this.lines, i, i, BlockType.Paragraph);
                    this.elements.push(
                        this.wrapBlock(block, <BlockParagraph blockId={block.id}>{inlineParts}</BlockParagraph>)
                    );
                }
                continue;
            }
            // 兜底：如果不是字符串，直接原样包裹
            // 创建block
            const block = this.createBlock(this.lines, i, i, BlockType.Paragraph);
            this.elements.push(this.wrapBlock(block, <BlockParagraph blockId={block.id}>{line}</BlockParagraph>));
        }


        // 返回解析后的所有元素
        return this.elements;
    }

    /**
     * 获取解析过程中创建的blocks
     */
    getBlocks(): Block[] {
        return this.blocks;
    }
}

export default BlockParser;
