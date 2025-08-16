import fs from "fs";
import path from "path";
import { FileMetadata, Relation, FrontMatter, MarkdownHeading } from "./schema";
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
        file: string,
        stats: fs.Stats
    ): FileMetadata {
        const frontmatter = FrontMatterExtractor.extract(filePath);
        const referenceData = ReferenceExtractor.extract(filePath);
        const markdownHeadings = MarkdownHeadingExtractor.extract(filePath);
        const leafMarkdownHeadings =
            MarkdownHeadingExtractor.extractLeafMarkdownHeadingsPath(
                markdownHeadings
            );

        // 合并 next 关系：来自 referenceData 的 Relation[] 和来自 frontmatter 的 string[]
        const nextRelations = new Map<string, Relation>();
        referenceData.next.forEach((relation) => {
            nextRelations.set(relation.path, relation);
        });
        // 合并 prev 关系
        const prevRelations = new Map<string, Relation>();
        referenceData.prev.forEach((relation) => {
            prevRelations.set(relation.path, relation);
        });

        return {
            name: file.replace(/\.mdx?$/, ""),
            path: filePath,
            size: stats.size,
            createTime: stats.birthtime,
            modifyTime: stats.mtime,
            frontmatter,
            references: referenceData.references,
            referedBy: [],
            next: Array.from(nextRelations.values()),
            prev: Array.from(prevRelations.values()),
            markdownHeadings,
            leafMarkdownHeadings,
        };
    }
}

export class FrontMatterExtractor {
    /**
     * 解析路径字符串，支持两种格式：
     * 1. 简单路径格式: "path/to/file.mdx"
     * 2. Markdown链接格式: "[description](path/to/file.mdx)"
     */
    static parsePathString(pathString: string): Relation {
        // 匹配 Markdown 链接格式 [description](path)å
        const linkMatch = pathString.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return {
                path: linkMatch[2],
                description: linkMatch[1],
            };
        }
        // 简单路径格式
        return {
            path: pathString,
            description: "",
        };
    }

    /**
     * 处理路径数组，解析每个路径字符串并转换为 Relation 对象
     */
    static processPathArray(pathArray: string[], filePath: string): Relation[] {
        return pathArray.map((pathString) => {
            const parsed = this.parsePathString(pathString);
            return {
                path: pathString,
                description: parsed.description,
            };
        });
    }

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
    /**
     * 提取引用关系，保留原有逻辑（返回所有引用），并额外返回 next/prev 分类
     * 支持两种格式：
     * 1. 普通链接: [text](path)
     * 2. 关系链接: [>text](path) 或 [<text](path)
     *
     * 返回格式：
     * {
     *   references: string[],
     *   next: string[],
     *   prev: string[]
     * }
     */
    static extract(filePath: string): {
        references: Relation[];
        next: Relation[];
        prev: Relation[];
    } {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const { content: markdownContent } = matter(content);

            const references: Map<string, Relation> = new Map();
            const next: Map<string, Relation> = new Map();
            const prev: Map<string, Relation> = new Map();

            // 匹配Markdown链接 [text](url) 或 [>text](url) 或 [<text](url)
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

                    // 判断链接文本前缀来确定关系类型
                    if (text.startsWith(">")) {
                        // 后继节点关系
                        next.set(url, relation);
                    } else if (text.startsWith("<")) {
                        // 前驱节点关系
                        prev.set(url, relation);
                    }
                    // 所有链接都加入 references，保持原有逻辑
                    references.set(url, relation);
                }
            }

            return {
                references: Array.from(references.values()),
                next: Array.from(next.values()),
                prev: Array.from(prev.values()),
            };
        } catch (e) {
            return {
                references: [],
                next: [],
                prev: [],
            };
        }
    }
}

