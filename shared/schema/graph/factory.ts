import { FileMetadata, GraphNode, GraphLink, GraphCategory } from "../index";

export class GraphExtractor {
    // 工具函数：构建图谱数据
    static extract(files: FileMetadata[]): {
        nodes: GraphNode[];
        links: GraphLink[];
        categories: GraphCategory[];
    } {
        if (!files || files.length === 0) {
            return { nodes: [], links: [], categories: [] };
        }

        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];
        const nodeMap = new Map<string, GraphNode>();
        const categoryMap = new Map<string, number>();
        let categoryIndex = 0;

        // 创建节点分类（按文件路径层级）
        files.forEach((file) => {
            const category = getCategoryFromPath(file.path);
            if (!categoryMap.has(category)) {
                categoryMap.set(category, categoryIndex++);
            }
        });

        // 创建节点
        files.forEach((file) => {
            const category = getCategoryFromPath(file.path);
            const categoryId = categoryMap.get(category) || 0;

            const node: GraphNode = {
                id: file.path,
                name: file.name, // 保留名称用于tooltip
                path: file.path,
                size: file.size,
                symbolSize: calculateNodeSize(file.size),
                category: categoryId,
            };
            nodes.push(node);
            nodeMap.set(file.path, node);
        });

        // 创建连接
        files.forEach((file) => {
            file.references.forEach((ref) => {
                if (nodeMap.has(ref.path)) {
                    links.push({
                        source: file.path,
                        target: ref.path,
                    });
                }
            });

            file.next.forEach((next) => {
                if (nodeMap.has(next.path)) {
                    links.push({
                        source: file.path,
                        target: next.path,
                    });
                }
            });

            file.prev.forEach((prev) => {
                if (nodeMap.has(prev.path)) {
                    links.push({
                        source: prev.path,
                        target: file.path,
                    });
                }
            });

            file.frontmatter?.dag?.next.forEach((nextPath: string) => {
                if (nodeMap.has(nextPath)) {
                    links.push({
                        source: file.path,
                        target: nextPath,
                    });
                }
            });

            file.frontmatter?.dag?.prev.forEach((prevPath: string) => {
                if (nodeMap.has(prevPath)) {
                    links.push({
                        source: prevPath,
                        target: file.path,
                    });
                }
            });
        });
        // 创建分类
        const categories: GraphCategory[] = Array.from(categoryMap.keys()).map(
            (name) => ({ name })
        );
        return { nodes, links, categories };
    }
}


// 工具函数：根据文件路径获取分类
export const getCategoryFromPath = (filePath: string): string => {
    const pathParts = filePath.split("/");
    return pathParts.length > 2 ? pathParts[2] : "root";
};

// 工具函数：根据文件大小计算节点大小
export const calculateNodeSize = (fileSize: number): number => {
    return Math.max(8, Math.min(20, Math.log(fileSize) * 2.5)); // 增大节点大小，更清晰可见
};


// 工具函数：字符串哈希函数
export const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
};
