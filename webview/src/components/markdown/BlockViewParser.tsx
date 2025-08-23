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
    BlockDivider,
    BlockTodo,
    BlockExcalidraw,
    BlockReference,
    BlockWrapper,
} from ".";
import InlineParser from "../../pkg/utils/inlineParser";
import { Block, BlockType } from "../../store/markdown/type";
import { getDefaultFrontmatterData } from "./BlockFrontMatter/const";

// 抽象基类
abstract class BlockViewRenderer {
    block: Block;
    constructor(block: Block) {
        this.block = block;
    }
    abstract render(): React.ReactNode;
}

// FrontMatter 渲染器
class FrontMatterRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，从 lines 中解析 YAML 数据
        let frontmatterData: Record<string, any> = getDefaultFrontmatterData();

        try {
            // 提取 frontmatter 内容（去掉开头的 --- 和结尾的 ---）
            const lines = this.block.lines;
            if (lines.length >= 3 && lines[0].trim() === "---" && lines[lines.length - 1].trim() === "---") {
                // 使用 js-yaml 解析 YAML
                const yamlContent = lines.slice(1, -1).join("\n");
                const parsedData = yaml.load(yamlContent) as Record<string, any>;
                if (parsedData) {
                    // 合并解析的数据和默认数据
                    frontmatterData = { ...frontmatterData, ...parsedData };
                    console.log("Final frontmatterData", frontmatterData)
                }
            }
        } catch (error) {
            console.error("Frontmatter YAML parsing error:", error);
        }

        return (
            <BlockFrontMatter
                key={this.block.id}
                blockId={this.block.id}
                data={frontmatterData}
            />
        );
    }
}

// Divider 渲染器
class DividerRenderer extends BlockViewRenderer {
    render() {
        return <BlockDivider key={this.block.id} blockId={this.block.id} />;
    }
}

// Heading 渲染器
class HeadingRenderer extends BlockViewRenderer {
    render() {
        const line = this.block.lines[0] || "";
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        const level = match ? match[1].length : 1;
        const text = match ? match[2] : this.block.lines.join(" ");
        // 参考 blockParser.tsx，解析标题内容的行内元素
        const headingContent = InlineParser.parseInlineElements(text);
        return (
            <BlockHeading key={this.block.id} blockId={this.block.id} level={level}>
                {headingContent}
            </BlockHeading>
        );
    }
}

// 段落渲染器
class ParagraphRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，解析段落内容的行内元素
        const paragraphContent = InlineParser.parseInlineElements(this.block.lines.join(" "));
        return (
            <BlockParagraph key={this.block.id} blockId={this.block.id}>
                {paragraphContent}
            </BlockParagraph>
        );
    }
}

// 列表渲染器
class ListRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，items 应为行内内容数组
        const items: React.ReactNode[] = [];
        for (const line of this.block.lines) {
            const listMatch = line.match(/^[-*+]\s+(.*)$/);
            if (listMatch) {
                const itemContent = InlineParser.parseInlineElements(listMatch[1]);
                items.push(itemContent);
            }
        }
        return (
            <BlockList key={this.block.id} blockId={this.block.id} items={items} />
        );
    }
}

// Todo 渲染器
class TodoRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，BlockTodo 需要 data: {checked, text}
        // 解析 [✓] 或 [ ] 前缀
        const line = this.block.lines[0] || "";
        const trimmed = line.trim();
        const checked = trimmed.startsWith("[✓]");
        // 提取todo文本内容
        const text = trimmed.replace(/^\[(✓| )\]\s?/, "");
        const data = { checked, text };
        return (
            <BlockTodo key={this.block.id} blockId={this.block.id} data={data} />
        );
    }
}

// 代码块渲染器
class CodeRenderer extends BlockViewRenderer {
    render() {
        const firstLine = this.block.lines[0] || "";
        const langMatch = typeof firstLine === "string" ? firstLine.match(/^```(\w+)?/) : null;
        const language = langMatch ? langMatch[1] : undefined;
        // 去除首尾 ```
        const codeLines = this.block.lines.slice(1, this.block.lines.length - 1);
        return (
            <BlockCode
                key={this.block.id}
                blockId={this.block.id}
                code={codeLines.join("\n")}
                language={language}
            />
        );
    }
}

// LaTeX 块渲染器
class LatexRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，BlockLatex 需要 html, index, blockId
        // 这里只能简单渲染 latex 源码为 html
        const latexLines = this.block.lines.slice(1, this.block.lines.length - 1);
        const latex = latexLines.join("\n");
        try {
            const html = renderToString(latex, { displayMode: true, throwOnError: false });
            return (
                <BlockLatex
                    key={this.block.id}
                    blockId={this.block.id}
                    html={html}
                    index={this.block.id}
                />
            );
        } catch (error) {
            return (
                <BlockLatexError
                    key={this.block.id}
                    blockId={this.block.id}
                    latex={latex}
                    index={this.block.id}
                />
            );
        }
    }
}

// 表格渲染器
class TableRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，headers/rows 需为 ReactNode[]/ReactNode[][]
        const lines = this.block.lines;
        if (lines.length < 2) {
            return (
                <BlockTable
                    key={this.block.id}
                    blockId={this.block.id}
                    headers={[]}
                    rows={[]}
                />
            );
        }
        // 第一行为表头，第二行为分隔线，后续为数据
        const headerLine = lines[0].trim();
        const headerCells = headerLine
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => InlineParser.parseInlineElements(cell.trim()));

        const rows: React.ReactNode[][] = [];
        for (let i = 2; i < lines.length; i++) {
            const rowLine = lines[i].trim();
            if (/^\s*\|(.+)\|\s*$/.test(rowLine)) {
                const rowCells = rowLine
                    .replace(/^\|/, "")
                    .replace(/\|$/, "")
                    .split("|")
                    .map((cell) => InlineParser.parseInlineElements(cell.trim()));
                rows.push(rowCells);
            }
        }

        return (
            <BlockTable
                key={this.block.id}
                blockId={this.block.id}
                headers={headerCells}
                rows={rows}
            />
        );
    }
}

// Alert 渲染器
class AlertRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，解析信息块类型和内容
        const typeLine = this.block.lines[0] || "";
        const typeMatch = typeLine.match(/^:::\s*(\w+)/);
        const type = typeMatch ? typeMatch[1] : "info";

        // 解析信息块内的每一行内容（跳过第一行的类型标识和最后一行结束标识）
        const contentLines = this.block.lines.slice(1, -1);
        const parsedContent = contentLines.map((line, lineIndex) => {
            const inlineParts = InlineParser.parseInlineElements(line);
            return (
                <BlockParagraph
                    key={`info-line-${this.block.id}-${lineIndex}`}
                    blockId={this.block.id}
                >
                    {inlineParts}
                </BlockParagraph>
            );
        });

        return (
            <BlockAlert key={this.block.id} blockId={this.block.id} type={type}>
                {parsedContent}
            </BlockAlert>
        );
    }
}

// Excalidraw 渲染器
class ExcalidrawRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，从单行中提取 refer 属性
        const line = this.block.lines[0] || "";
        const referMatch = line.trim().match(/refer="([^"]+)"/);
        const refer = referMatch ? referMatch[1] : "";

        return (
            <BlockExcalidraw key={this.block.id} blockId={this.block.id} refer={refer} />
        );
    }
}

// Iframe 渲染器
class IframeRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，src/width/height/sandbox 需从 lines[0] 解析
        // 这里简单解析
        const line = this.block.lines[0] || "";
        // src
        let src = "";
        let width: string | undefined = undefined;
        let height: string | undefined = undefined;
        let sandbox: string | undefined = undefined;
        const srcMatch = line.match(/src=["']([^"']+)["']/);
        if (srcMatch) src = srcMatch[1];
        const widthMatch = line.match(/width=["']([^"']+)["']/);
        if (widthMatch) width = widthMatch[1];
        const heightMatch = line.match(/height=["']([^"']+)["']/);
        if (heightMatch) height = heightMatch[1];
        const sandboxMatch = line.match(/sandbox=["']([^"']+)["']/);
        if (sandboxMatch) sandbox = sandboxMatch[1];
        return (
            <BlockIframe
                key={this.block.id}
                blockId={this.block.id}
                src={src}
                width={width}
                height={height}
                sandbox={sandbox}
            />
        );
    }
}

// Reference 渲染器
class ReferenceRenderer extends BlockViewRenderer {
    render() {
        // 解析引用块内容，格式为 > xxx
        const lines = this.block.lines;
        const referenceContent = lines.map((line, index) => {
            // 移除开头的 > 符号并解析行内元素
            const content = line.replace(/^>\s*/, "");
            const parsedContent = InlineParser.parseInlineElements(content);
            return (
                <div key={`reference-line-${this.block.id}-${index}`}>
                    {parsedContent}
                </div>
            );
        });

        return (
            <BlockReference key={this.block.id} blockId={this.block.id}>
                {referenceContent}
            </BlockReference>
        );
    }
}

// 默认兜底渲染器
class DefaultRenderer extends BlockViewRenderer {
    render() {
        // 参考 blockParser.tsx，解析默认内容的行内元素
        const defaultContent = InlineParser.parseInlineElements(this.block.lines.join("\n"));
        return (
            <BlockParagraph key={this.block.id} blockId={this.block.id}>
                {defaultContent}
            </BlockParagraph>
        );
    }
}

// BlockType 到渲染器的映射
const blockTypeToRenderer: Record<BlockType, new (block: Block) => BlockViewRenderer> = {
    [BlockType.FrontMatter]: FrontMatterRenderer,
    [BlockType.Divider]: DividerRenderer,
    [BlockType.Heading]: HeadingRenderer,
    [BlockType.Paragraph]: ParagraphRenderer,
    [BlockType.List]: ListRenderer,
    [BlockType.Todo]: TodoRenderer,
    [BlockType.Code]: CodeRenderer,
    [BlockType.Latex]: LatexRenderer,
    [BlockType.Table]: TableRenderer,
    [BlockType.Alert]: AlertRenderer,
    [BlockType.Excalidraw]: ExcalidrawRenderer,
    [BlockType.Iframe]: IframeRenderer,
    [BlockType.Reference]: ReferenceRenderer,
};

export function renderBlockView(block: Block): React.ReactNode {
    const RendererClass = blockTypeToRenderer[block.type] || DefaultRenderer;
    const renderer = new RendererClass(block);
    return <BlockWrapper block={block}>{renderer.render()}</BlockWrapper>;
}