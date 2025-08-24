/**
 * 该文件用于提取和实现 Markdown 块级结构的 Schema 解析逻辑，不涉及 React 组件渲染。
 * 只负责将 Markdown 文本解析为 Block 数据结构数组。
 */

import ExcalidrawUtil from "../../components/markdown/BlockExcalidraw/Util";
import { Block, BlockType } from "../../store/markdown/type";
import { HeadingNumberGenerator } from "./HeadingNumberGenerator";

/**
 * 块级 Schema 解析器
 */
class BlockSchemaParser {
    lines: string[];
    blocks: Block[];
    filePath: string;
    blockIDSet: Set<string>;
    headingNumberGenerator: HeadingNumberGenerator;

    constructor(text: string, filePath: string = "") {
        this.lines = text.split("\n");
        this.blocks = [];
        this.filePath = filePath;
        this.blockIDSet = new Set();
        this.headingNumberGenerator = new HeadingNumberGenerator();
    }

    /**
     * 生成块的唯一ID
     */
    private getBlockID(blockType: BlockType, startIndex: number, filePath: string, content: string): string {
        let str = `${blockType.toLowerCase()}:${filePath}:${content}`;
        if (this.blockIDSet.has(str)) {
            str = `${blockType.toLowerCase()}:${filePath}:${startIndex}:${content}`;
        }
        this.blockIDSet.add(str);
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * 创建block并生成id
     */
    private createBlock(
        lines: string[],
        startIndex: number,
        endIndex: number,
        type: BlockType,
        filePath?: string,
        storage?: any
    ): Block {
        const content = lines.slice(startIndex, endIndex + 1).join('\n');
        const id = this.getBlockID(type, startIndex, this.filePath, content);
        const block: Block = {
            id,
            lines: lines.slice(startIndex, endIndex + 1),
            type: type,
            filePath: filePath,
            storage: storage,
            isLoading: type === BlockType.Excalidraw ? true : false,
            startIndex: startIndex,
            endIndex: endIndex,
        };
        this.blocks.push(block);
        return block;
    }

    /**
     * 解析 Frontmatter
     */
    private parseFrontmatter(startIndex: number): Block | null {
        if (startIndex !== 0) return null;
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("---")) {
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith("---")) {
                    break;
                }
                i++;
            }
            const block = this.createBlock(this.lines, startIndex, i, BlockType.FrontMatter);
            return block;
        }
        return null;
    }

    /**
     * 解析分割线
     */
    private parseDivider(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("---")) {
            const block = this.createBlock(this.lines, startIndex, startIndex, BlockType.Divider);
            return block;
        }
        return null;
    }

    /**
     * 解析代码块
     */
    private parseCodeBlock(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("```")) {
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith("```")) {
                    break;
                }
                i++;
            }
            const block = this.createBlock(this.lines, startIndex, i, BlockType.Code);
            return block;
        }
        return null;
    }

    /**
     * 解析块级 LaTeX
     */
    private parseBlockLatex(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim() === "$$") {
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim() === "$$") {
                    break;
                }
                i++;
            }
            const block = this.createBlock(this.lines, startIndex, i, BlockType.Latex);
            return block;
        }
        return null;
    }

    /**
     * 解析表格
     */
    private parseTable(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (
            typeof line === "string" &&
            /^\s*\|(.+)\|\s*$/.test(line) &&
            startIndex + 1 < this.lines.length &&
            /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(this.lines[startIndex + 1])
        ) {
            let i = startIndex + 2;
            while (i < this.lines.length && /^\s*\|(.+)\|\s*$/.test(this.lines[i])) {
                i++;
            }
            const block = this.createBlock(this.lines, startIndex, i - 1, BlockType.Table);
            return block;
        }
        return null;
    }

    /**
     * 解析标题
     */
    private parseHeading(line: string, index: number): Block | null {
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const number = this.headingNumberGenerator.generateNumber(level);

            const block = this.createBlock(this.lines, index, index, BlockType.Heading);
            block.attrs = {
                level: level,
                number: number
            };

            return block;
        }
        return null;
    }

    /**
     * 解析无序列表
     */
    private parseList(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        const listMatch = typeof line === "string" ? line.match(/^[-*+]\s+(.*)$/) : null;
        if (listMatch) {
            let j = startIndex + 1;
            while (j < this.lines.length) {
                const nextListMatch = this.lines[j].match(/^[-*+]\s+(.*)$/);
                if (nextListMatch) {
                    j++;
                } else {
                    break;
                }
            }
            const block = this.createBlock(this.lines, startIndex, j - 1, BlockType.List);
            return block;
        }
        return null;
    }

    /**
     * 解析 TODO 块
     */
    private parseTodoBlock(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (
            typeof line === "string" &&
            (line.trim().startsWith("[✓]") || line.trim().startsWith("[ ]"))
        ) {
            const block = this.createBlock(this.lines, startIndex, startIndex, BlockType.Todo);
            return block;
        }
        return null;
    }

    /**
     * 解析引用块
     */
    private parseReferenceBlock(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith(">")) {
            let i = startIndex + 1;
            // 继续查找连续的引用行
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith(">")) {
                    i++;
                } else if (typeof currentLine === "string" && currentLine.trim() === "") {
                    // 空行可以分隔引用块
                    break;
                } else {
                    // 非引用行，结束引用块
                    break;
                }
            }
            const block = this.createBlock(this.lines, startIndex, i - 1, BlockType.Reference);
            return block;
        }
        return null;
    }

    /**
     * 解析 Excalidraw 块
     */
    private parseExcalidrawBlock(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (
            typeof line === "string" &&
            line.trim().startsWith("<BlockExcalidraw") &&
            line.trim().endsWith(">")
        ) {
            const refer = ExcalidrawUtil.extractReferFromLine(line);
            const block = this.createBlock(this.lines, startIndex, startIndex, BlockType.Excalidraw, refer || "");
            return block;
        }
        return null;
    }

    /**
     * 解析信息块
     */
    private parseInfoBlock(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith(":::")) {
            let i = startIndex + 1;
            while (i < this.lines.length) {
                const currentLine = this.lines[i];
                if (typeof currentLine === "string" && currentLine.trim().startsWith(":::")) {
                    break;
                }
                i++;
            }
            const block = this.createBlock(this.lines, startIndex, i, BlockType.Alert);
            return block;
        }
        return null;
    }

    /**
     * 解析 iframe
     */
    private parseIframe(startIndex: number): Block | null {
        const line = this.lines[startIndex];
        if (typeof line === "string" && line.trim().startsWith("<iframe")) {
            const iframeMatch = line.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/);
            if (iframeMatch) {
                const block = this.createBlock(this.lines, startIndex, startIndex, BlockType.Iframe);
                return block;
            }
        }
        return null;
    }

    /**
     * 主解析流程
     * 只返回 Block 数组，不涉及组件
     */
    parse(): Block[] {
        this.blocks = [];
        this.headingNumberGenerator.reset(); // 重置标题序号生成器
        let hasFrontmatter = false;
        if (this.lines.length > 0) {
            const firstLine = this.lines[0];
            if (typeof firstLine === "string" && firstLine.trim().startsWith("---")) {
                hasFrontmatter = true;
            }
        }
        // 如果没有 frontmatter，添加一个默认 frontmatter block
        if (!hasFrontmatter) {
            this.createBlock([], 0, 0, BlockType.FrontMatter);
        }

        for (let i = 0; i < this.lines.length; i++) {
            let line: string = this.lines[i];

            // Frontmatter
            const frontmatterResult = this.parseFrontmatter(i);
            if (frontmatterResult) {
                i = frontmatterResult.endIndex;
                continue;
            }

            const dividerResult = this.parseDivider(i);
            if (dividerResult) {
                i = dividerResult.endIndex;
                continue;
            }

            const todoResult = this.parseTodoBlock(i);
            if (todoResult) {
                i = todoResult.endIndex;
                continue;
            }

            const referenceResult = this.parseReferenceBlock(i);
            if (referenceResult) {
                i = referenceResult.endIndex;
                continue;
            }

            const excalidrawResult = this.parseExcalidrawBlock(i);
            if (excalidrawResult) {
                i = excalidrawResult.endIndex;
                continue;
            }

            const codeBlockResult = this.parseCodeBlock(i);
            if (codeBlockResult) {
                i = codeBlockResult.endIndex;
                continue;
            }

            const tableResult = this.parseTable(i);
            if (tableResult) {
                i = tableResult.endIndex;
                continue;
            }

            if (typeof line === "string") {
                const headingBlock = this.parseHeading(line, i);
                if (headingBlock) {
                    continue;
                }
            }

            const listResult = this.parseList(i);
            if (listResult) {
                i = listResult.endIndex;
                continue;
            }

            const infoBlockResult = this.parseInfoBlock(i);
            if (infoBlockResult) {
                i = infoBlockResult.endIndex;
                continue;
            }

            const iframeResult = this.parseIframe(i);
            if (iframeResult) {
                i = iframeResult.endIndex;
                continue;
            }

            if (typeof line === "string" && line.trim() === "") {
                continue;
            }

            const blockLatexResult = this.parseBlockLatex(i);
            if (blockLatexResult) {
                i = blockLatexResult.endIndex;
                continue;
            }

            // 普通段落
            if (typeof line === "string") {
                this.createBlock(this.lines, i, i, BlockType.Paragraph);
                continue;
            }
            // 兜底
            this.createBlock(this.lines, i, i, BlockType.Paragraph);
        }
        return this.blocks;
    }
}

export default BlockSchemaParser;
