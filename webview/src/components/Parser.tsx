import React from "react";
import { renderToString } from "katex";
import {
  CodeBlock,
  Heading,
  List,
  Paragraph,
  Table,
  Bold,
  Italic,
  InlineCode,
  LinkComponent,
  LatexInlineComponent,
  LatexErrorComponent,
  LatexBlockComponent,
  LatexBlockErrorComponent,
} from "./Components";

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
            <LatexErrorComponent
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
          <LinkComponent href={linkUrl} key={`link-${currentIndex}`}>
            {InlineParser.parseInlineElements(linkText)}
          </LinkComponent>
        );
        currentIndex++;
      } else if (match[4]) {
        // 粗体
        parts.push(<Bold key={`bold-${currentIndex}`}>{match[4]}</Bold>);
        currentIndex++;
      } else if (match[5]) {
        // 斜体
        parts.push(<Italic key={`italic-${currentIndex}`}>{match[5]}</Italic>);
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

/**
 * 块级解析器类
 */
class BlockParser {
  lines: string[];
  elements: React.ReactNode[];
  codeBlock: string[] | null;

  constructor(text: string) {
    this.lines = text.split("\n");
    this.elements = [];
    this.codeBlock = null;
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
      return {
        element: (
          <Table
            key={`table-${startIndex}`}
            headers={headerCells}
            rows={rows}
          />
        ),
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
      const items = [listMatch[1]];
      let j = startIndex + 1;
      while (j < this.lines.length) {
        const nextListMatch = this.lines[j].match(/^[-*+]\s+(.*)$/);
        if (nextListMatch) {
          items.push(nextListMatch[1]);
          j++;
        } else {
          break;
        }
      }
      return {
        element: <List key={`list-${startIndex}`} items={items} />,
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
      return (
        <Heading key={`heading-${index}`} level={level}>
          {headingMatch[2]}
        </Heading>
      );
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

            return {
              element: (
                <LatexBlockComponent
                  key={`latex-block-${startIndex}`}
                  html={html}
                  index={startIndex}
                />
              ),
              nextIndex: i,
            };
          } catch (error) {
            console.error("LaTeX Rendering Error:", error);
            return {
              element: (
                <LatexBlockErrorComponent
                  key={`latex-block-${startIndex}`}
                  latex={latexLines.join("\n")}
                  index={startIndex}
                />
              ),
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
   * 主解析流程
   */
  parse(): React.ReactNode[] {
    // 遍历每一行，逐步解析
    for (let i = 0; i < this.lines.length; i++) {
      let line: string = this.lines[i];

      // 代码块（多行）
      if (typeof line === "string" && line.trim().startsWith("```")) {
        if (this.codeBlock === null) {
          this.codeBlock = [];
        } else {
          this.elements.push(
            <CodeBlock
              key={`codeblock-${i}`}
              code={this.codeBlock.join("\n")}
            />
          );
          this.codeBlock = null;
        }
        continue;
      }
      if (this.codeBlock !== null && typeof line === "string") {
        this.codeBlock.push(line);
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
          this.elements.push(
            <Paragraph key={`para-${i}`}>{inlineParts}</Paragraph>
          );
        }
        continue;
      }

      // 兜底：如果不是字符串，直接原样包裹
      this.elements.push(<Paragraph key={`para-${i}`}>{line}</Paragraph>);
    }

    // 处理结尾未闭合的代码块
    if (this.codeBlock !== null) {
      this.elements.push(
        <CodeBlock key={`codeblock-end`} code={this.codeBlock.join("\n")} />
      );
    }
    // 返回解析后的所有元素
    return this.elements;
  }
}

export default BlockParser;
