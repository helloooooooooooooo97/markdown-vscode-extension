import { FileMetadata } from "../file/schema";
import { DAGMetadata } from "./schema";
import { Node, Edge } from "reactflow";

// 路径拼接函数
export const joinPath = (basePath: string, relativePath: string): string => {
  // 判断basePath是否为绝对路径
  const isAbsolute = basePath.startsWith("/");

  // 移除basePath的文件名部分，只保留目录
  const baseDir = basePath.substring(0, basePath.lastIndexOf("/") + 1);

  // 处理相对路径
  let result = baseDir + relativePath;

  // 处理 ../ 和 ./ 的情况
  const parts = result.split("/");
  const resolvedParts: string[] = [];

  for (const part of parts) {
    if (part === "..") {
      // 回退一级目录
      if (resolvedParts.length > 0) {
        resolvedParts.pop();
      }
    } else if (part === "." || part === "") {
      // 忽略当前目录和空字符串
      continue;
    } else {
      resolvedParts.push(part);
    }
  }

  // 如果basePath是绝对路径，拼接结果前加上'/'
  return (isAbsolute ? "/" : "") + resolvedParts.join("/");
};

export class DAGExtractor {
  static extract(allFileMetadata: FileMetadata[]): DAGMetadata {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, boolean>();
    let edgeId = 1;
    for (const fileMetadata of allFileMetadata) {
      if (
        fileMetadata.frontmatter?.next?.length &&
        fileMetadata.frontmatter?.prev?.length
      ) {
        const currentPath = fileMetadata.filePath;
        if (!nodeMap.has(currentPath)) {
          // 提取文件名（不包含扩展名）
          const fileName = currentPath.split('/').pop()?.replace(/\.(mdx?|tsx?)$/, "") || "未知";
          nodes.push({
            id: currentPath,
            type: "dag",
            position: { x: 0, y: 0 }, // 位置将由布局算法计算
            data: {
              label: fileName,
              color: "#3b82f6", // 默认蓝色
            },
          });
          nodeMap.set(currentPath, true);
        }

        // 处理 prev 关系（当前节点指向的节点）
        for (const prev of fileMetadata.frontmatter?.prev || []) {
          const prevPath = joinPath(currentPath, prev);
          if (!nodeMap.has(prevPath)) {
            // 提取文件名（不包含扩展名）
            const prevName = prevPath.split('/').pop()?.replace(/\.(mdx?|tsx?)$/, "") || "未知";
            nodes.push({
              id: prevPath,
              type: "dag",
              position: { x: 0, y: 0 },
              data: {
                label: prevName,
                color: "#10b981", // 绿色表示前置节点
              },
            });
            nodeMap.set(prevPath, true);
          }

          // 创建边：prev -> current
          edges.push({
            id: `e${edgeId++}`,
            source: prevPath,
            target: currentPath,
            type: "straight",
            style: { stroke: "#10b981", strokeWidth: 2 },
            animated: false,
          });
        }

        // 处理 next 关系（指向当前节点的节点）
        for (const next of fileMetadata.frontmatter?.next || []) {
          const nextPath = joinPath(currentPath, next);
          // 创建 next 节点（如果不存在）
          if (!nodeMap.has(nextPath)) {
            // 提取文件名（不包含扩展名）
            const nextName = nextPath.split('/').pop()?.replace(/\.(mdx?|tsx?)$/, "") || "未知";
            nodes.push({
              id: nextPath,
              type: "dag",
              position: { x: 0, y: 0 },
              data: {
                label: nextName,
                color: "#f59e0b", // 橙色表示后续节点
              },
            });
            nodeMap.set(nextPath, true);
          }

          // 创建边：current -> next
          edges.push({
            id: `e${edgeId++}`,
            source: currentPath,
            target: nextPath,
            type: "straight",
            style: { stroke: "#f59e0b", strokeWidth: 2 },
            animated: false,
          });
        }
      }
    }

    return { nodes, edges };
  }
}