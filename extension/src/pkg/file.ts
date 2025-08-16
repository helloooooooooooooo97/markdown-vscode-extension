import fs from "fs";
import { FileMetadata, Relation, FrontMatter, MarkdownHeading } from "@supernode/shared";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { Root, Heading } from "mdast";

export class FileMetadataExtractor {
    /**
     * 单独处理一个文件，提取其元数据
     */
    static ProcessSingleFile(
        filePath: string,
    ): FileMetadata {
        const frontmatter = FrontMatterExtractor.extract(filePath);
        const referenceData = ReferenceExtractor.extract(filePath);
        const markdownHeadings = MarkdownHeadingExtractor.extract(filePath);
        const leafMarkdownHeadings = MarkdownHeadingExtractor.extractLeafMarkdownHeadingsPath(markdownHeadings);
        return {
            filePath: filePath,
            frontmatter,
            references: referenceData,
            markdownHeadings,
            leafMarkdownHeadings,
        };
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
        } catch (e) {
            return [];
        }
    }
}