import {
  FileMetadata,
  GraphNode,
  GraphLink,
  GraphCategory,
  GraphMetaData,
  joinPath,
} from "../index";

export class GraphExtractor {
  // 工具函数：构建图谱数据
  static extract(files: FileMetadata[]): GraphMetaData {
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
      const category = getCategoryFromPath(file.filePath);
      if (!categoryMap.has(category)) {
        categoryMap.set(category, categoryIndex++);
      }
    });

    // 创建节点
    files.forEach((file) => {
      const category = getCategoryFromPath(file.filePath);
      const categoryId = categoryMap.get(category) || 0;

      const node: GraphNode = {
        id: file.filePath,
        name: file.filePath, // 保留名称用于tooltip
        path: file.filePath,
        size: 10,
        symbolSize: 10,
        category: categoryId,
      };
      nodes.push(node);
      nodeMap.set(file.filePath, node);
    });

    // 创建连接
    files.forEach((file) => {
      file.references.forEach((ref) => {
        // 将相对路径转换为绝对路径
        const absoluteRefPath = joinPath(file.filePath, ref.path);
        if (nodeMap.has(absoluteRefPath)) {
          links.push({
            source: file.filePath,
            target: absoluteRefPath,
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
