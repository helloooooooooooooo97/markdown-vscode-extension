import fs from "fs";
import {
  FileMetadata,
  Relation,
  FrontMatter,
  MarkdownHeading,
  DocumentStats,
  ContentAnalysis,
  FileAnalysisResult,
  Complexity
} from "@supernode/shared";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Heading } from "mdast";


export class FileMetadataExtractor {
  /**
   * 单独处理一个文件，提取其元数据
   */
  static ProcessSingleFile(filePath: string): FileMetadata {
    const frontmatter = FrontMatterExtractor.extract(filePath);
    const referenceData = ReferenceExtractor.extract(filePath);
    const markdownHeadings = MarkdownHeadingExtractor.extract(filePath);
    const leafMarkdownHeadings =
      MarkdownHeadingExtractor.extractLeafMarkdownHeadingsPath(
        markdownHeadings
      );
    return {
      filePath: filePath,
      frontmatter,
      references: referenceData,
      markdownHeadings,
      leafMarkdownHeadings,
    };
  }

  /**
   * 完整分析文件，包括元数据、统计信息和内容分析
   * 只读取一次文件内容，避免重复计算
   */
  static ProcessFileWithAnalysis(filePath: string): FileAnalysisResult {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { content: markdownContent, data: frontmatter } = matter(content);

      // 提取元数据
      const metadata: FileMetadata = {
        filePath: filePath,
        frontmatter: frontmatter || {},
        references: ReferenceExtractor.extractFromContent(markdownContent),
        markdownHeadings:
          MarkdownHeadingExtractor.extractFromContent(markdownContent),
        leafMarkdownHeadings: [],
      };
      metadata.leafMarkdownHeadings =
        MarkdownHeadingExtractor.extractLeafMarkdownHeadingsPath(
          metadata.markdownHeadings
        );

      // 计算文档统计信息
      const documentStats = DocumentStatsCalculator.calculate(content);

      // 分析内容
      const contentAnalysis = ContentAnalyzer.analyze(content);

      return {
        metadata,
        documentStats,
        contentAnalysis,
      };
    } catch (error) {
      console.error(`处理文件失败: ${filePath}`, error);
      // 返回默认值
      return {
        metadata: {
          filePath: filePath,
          frontmatter: {},
          references: [],
          markdownHeadings: [],
          leafMarkdownHeadings: [],
        },
        documentStats: {
          totalLines: 0,
          contentLines: 0,
          codeLines: 0,
          commentLines: 0,
          emptyLines: 0,
          wordCount: 0,
          characterCount: 0,
          readingTimeMinutes: 0,
        },
        contentAnalysis: {
          language: "unknown",
          topics: [],
          summary: "",
          complexity: Complexity.SIMPLE,
          hasCodeBlocks: false,
          hasImages: false,
          hasTables: false,
          hasMath: false,
        },
      };
    }
  }
}

// frontmatter 提取器
export class FrontMatterExtractor {
  static extract(filePath: string): Record<string, any> {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data }: { data: FrontMatter } = matter(content);
      return data || {};
    } catch (e) {
      return {};
    }
  }
}

// markdown 提取器
export class MarkdownHeadingExtractor {
  static extract(filePath: string): MarkdownHeading[] {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { content: markdownContent } = matter(content);

      // 使用 unified 和 remark-parse 解析 markdown
      const processor = unified().use(remarkParse);
      const tree = processor.parse(markdownContent) as Root;

      const headings: MarkdownHeading[] = [];

      // 遍历 AST 树，只提取真正的标题节点
      const visit = (node: any) => {
        if (node.type === "heading") {
          const heading = node as Heading;
          const level = heading.depth;

          // 递归提取标题文本，包括链接和其他 Markdown 元素
          const text = MarkdownHeadingExtractor.extractTextFromNodes(
            heading.children
          );

          if (text) {
            headings.push({
              level,
              text,
              children: [],
            });
          }
        }

        // 递归处理子节点
        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);

      // 构建嵌套结构
      return MarkdownHeadingExtractor.buildHeadingHierarchy(headings);
    } catch (e) {
      // Logger.error(`MarkdownHeadingExtractor: 解析文件失败: ${filePath}, 错误: ${e}`);
      return [];
    }
  }

  // 递归提取节点中的所有文本内容
  private static extractTextFromNodes(nodes: any[]): string {
    if (!nodes || nodes.length === 0) return "";

    return nodes
      .map((node) => {
        switch (node.type) {
          case "text":
            return node.value || "";
          case "link":
            // 对于链接，提取链接文本
            return this.extractTextFromNodes(node.children || []);
          case "strong":
          case "emphasis":
            // 对于粗体和斜体，提取内容
            return this.extractTextFromNodes(node.children || []);
          case "inlineCode":
            // 对于行内代码，保留反引号
            return `\`${node.value || ""}\``;
          case "image":
            // 对于图片，提取 alt 文本
            return node.alt || "";
          default:
            // 对于其他类型的节点，递归处理子节点
            if (node.children) {
              return this.extractTextFromNodes(node.children);
            }
            return "";
        }
      })
      .join("");
  }

  // 构建标题层级嵌套结构
  private static buildHeadingHierarchy(
    headings: MarkdownHeading[]
  ): MarkdownHeading[] {
    const result: MarkdownHeading[] = [];
    const stack: MarkdownHeading[] = [];

    for (const heading of headings) {
      // 找到合适的父级
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(heading);
      } else {
        if (!stack[stack.length - 1].children) {
          stack[stack.length - 1].children = [];
        }
        stack[stack.length - 1].children!.push(heading);
      }

      stack.push(heading);
    }

    return result;
  }

  static extractFromContent(markdownContent: string): MarkdownHeading[] {
    try {
      const processor = unified().use(remarkParse);
      const tree = processor.parse(markdownContent) as Root;

      const headings: MarkdownHeading[] = [];

      const visit = (node: any) => {
        if (node.type === "heading") {
          const heading = node as Heading;
          const level = heading.depth;

          const text = MarkdownHeadingExtractor.extractTextFromNodes(
            heading.children
          );

          if (text) {
            headings.push({
              level,
              text,
              children: [],
            });
          }
        }

        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);

      return MarkdownHeadingExtractor.buildHeadingHierarchy(headings);
    } catch (e) {
      return [];
    }
  }

  static extractLeafMarkdownHeadingsPath(
    headings: MarkdownHeading[],
    parentPath: string[] = []
  ): string[] {
    const leafPaths: string[] = [];
    for (const heading of headings) {
      // 构造当前节点的路径标签
      const currentLabel = `${"#".repeat(heading.level)}${heading.text}`;
      const currentPath = [...parentPath, currentLabel];
      if (heading.children && heading.children.length > 0) {
        // 递归处理子节点
        leafPaths.push(
          ...this.extractLeafMarkdownHeadingsPath(heading.children, currentPath)
        );
      } else {
        // 叶子节点，记录完整路径
        leafPaths.push(currentPath.join("/"));
      }
    }
    return leafPaths;
  }
}

export class ReferenceExtractor {
  static extract(filePath: string): Relation[] {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { content: markdownContent } = matter(content);
      return this.extractFromContent(markdownContent);
    } catch (e) {
      return [];
    }
  }

  static extractFromContent(markdownContent: string): Relation[] {
    const references: Relation[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(markdownContent)) !== null) {
      let text = match[1].trim();
      let url = match[2];
      // 只处理 .md 和 .mdx 文件链接
      if (url.endsWith(".mdx") || url.endsWith(".md")) {
        const description = text;
        const relation: Relation = {
          path: url,
          description: description,
        };
        references.push(relation);
      }
    }
    return references;
  }
}

// 新增：文档统计计算器
export class DocumentStatsCalculator {
  static calculate(content: string): DocumentStats {
    const lines = content.split("\n");
    const totalLines = lines.length;
    const emptyLines = lines.filter((line) => line.trim() === "").length;
    const contentLines = totalLines - emptyLines;

    // 统计代码块
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = content.match(codeBlockRegex) || [];
    const codeLines = codeBlocks.reduce((acc, block) => {
      const blockLines = block.split("\n").length - 2; // 减去 ``` 行
      return acc + Math.max(0, blockLines);
    }, 0);

    // 统计注释行
    const commentLines = lines.filter(
      (line) => line.trim().startsWith("<!--") || line.trim().startsWith("-->")
    ).length;

    // 统计单词和字符
    const textContent = content.replace(/```[\s\S]*?```/g, ""); // 移除代码块
    const wordCount = textContent
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = textContent.length;

    // 估算阅读时间（假设每分钟200个单词）
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    return {
      totalLines,
      contentLines,
      codeLines,
      commentLines,
      emptyLines,
      wordCount,
      characterCount,
      readingTimeMinutes,
    };
  }
}

// 新增：内容分析器
export class ContentAnalyzer {
  static analyze(content: string): ContentAnalysis {
    // 检测语言（简单实现）
    const language = this.detectLanguage(content);

    // 提取主题关键词
    const topics = this.extractTopics(content);

    // 生成摘要
    const summary = this.generateSummary(content);

    // 评估复杂度
    const complexity = this.assessComplexity(content);

    // 检测内容类型
    const hasCodeBlocks = /```[\s\S]*?```/g.test(content);
    const hasImages = /!\[.*?\]\(.*?\)/g.test(content);
    const hasTables = /\|.*\|.*\|/g.test(content);
    const hasMath = /\$\$[\s\S]*?\$\$|\$[^\$]*\$/g.test(content);

    return {
      language,
      topics,
      summary,
      complexity,
      hasCodeBlocks,
      hasImages,
      hasTables,
      hasMath,
    };
  }

  private static detectLanguage(content: string): string {
    // 简单的语言检测逻辑
    if (content.includes("```javascript") || content.includes("```js"))
      return "javascript";
    if (content.includes("```typescript") || content.includes("```ts"))
      return "typescript";
    if (content.includes("```python") || content.includes("```py"))
      return "python";
    if (content.includes("```java")) return "java";
    if (content.includes("```cpp") || content.includes("```c++")) return "cpp";
    if (content.includes("```c#")) return "csharp";
    if (content.includes("```go")) return "go";
    if (content.includes("```rust")) return "rust";
    return "markdown";
  }

  private static extractTopics(content: string): string[] {
    const topics: string[] = [];

    // 从标题中提取关键词
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    const headings = content.match(headingRegex) || [];
    headings.forEach((heading) => {
      const title = heading.replace(/^#{1,6}\s+/, "");
      const words = title.split(/\s+/).filter((word) => word.length > 2);
      topics.push(...words.slice(0, 3)); // 取前3个词
    });

    // 去重并限制数量
    return [...new Set(topics)].slice(0, 5);
  }

  private static generateSummary(content: string): string {
    // 移除代码块和frontmatter
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^---[\s\S]*?---/m, "");

    // 取前200个字符作为摘要
    const summary = cleanContent.trim().substring(0, 200);
    return summary.length === 200 ? summary + "..." : summary;
  }

  private static assessComplexity(
    content: string
  ): Complexity {
    const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
    const headings = (content.match(/^#{1,6}\s+/gm) || []).length;
    const links = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const tables = (content.match(/\|.*\|.*\|/g) || []).length;

    const complexityScore =
      codeBlocks * 2 + headings + links + images + tables * 3;

    if (complexityScore < 10) return Complexity.SIMPLE;
    if (complexityScore < 25) return Complexity.MEDIUM;
    return Complexity.COMPLEX;
  }
}
