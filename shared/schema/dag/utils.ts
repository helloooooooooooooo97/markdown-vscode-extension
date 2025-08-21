import { Node, Edge } from "reactflow";

interface ConnectedPath {
    connectedNodes: Set<string>;
    connectedEdges: Set<string>;
}

export class DAGUtils {
    // 拓扑排序 
    static topologicalSort(nodes: Node[], edges: Edge[]): string[] {
        const graph: { [key: string]: string[] } = {};
        const inDegree: { [key: string]: number } = {};

        // 初始化
        nodes.forEach(node => {
            graph[node.id] = [];
            inDegree[node.id] = 0;
        });

        // 构建邻接表和入度
        edges.forEach(edge => {
            graph[edge.source].push(edge.target);
            inDegree[edge.target]++;
        });

        // 拓扑排序
        const queue: string[] = [];
        const result: string[] = [];

        // 找到所有入度为0的节点
        Object.keys(inDegree).forEach(nodeId => {
            if (inDegree[nodeId] === 0) {
                queue.push(nodeId);
            }
        });

        while (queue.length > 0) {
            const current = queue.shift()!;
            result.push(current);

            graph[current].forEach(neighbor => {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }

        return result;
    }

    // 找到直接前驱节点和边，不要递归找
    static findDirectPrev(nodeId: string, edges: Edge[]): ConnectedPath {
        const connectedNodes = new Set<string>();
        const connectedEdges = new Set<string>();
        for (const edge of edges) {
            if (edge.target === nodeId) {
                connectedNodes.add(edge.source);
                connectedEdges.add(edge.id);
            }
        }
        return { connectedNodes, connectedEdges };
    }
    static findDirectNext(nodeId: string, edges: Edge[]): ConnectedPath {
        const connectedNodes = new Set<string>();
        const connectedEdges = new Set<string>();
        for (const edge of edges) {
            if (edge.source === nodeId) {
                connectedNodes.add(edge.target);
                connectedEdges.add(edge.id);
            }
        }
        return { connectedNodes, connectedEdges };
    }
    static findDirectConnectedPath(nodeId: string, edges: Edge[]): ConnectedPath {
        const directPrev = DAGUtils.findDirectNext(nodeId, edges);
        const directNext = DAGUtils.findDirectPrev(nodeId, edges);
        return { connectedNodes: new Set<string>([...directPrev.connectedNodes, ...directNext.connectedNodes]), connectedEdges: new Set<string>([...directPrev.connectedEdges, ...directNext.connectedEdges]) };
    }

    // 找到上下游所有节点和边
    static findDownstream(nodeId: string, edges: Edge[]): ConnectedPath {
        const visited = new Set<string>();
        const connectedNodes = new Set<string>();
        const connectedEdges = new Set<string>();

        const dfs = (currentNode: string) => {
            if (visited.has(currentNode)) return;
            visited.add(currentNode);
            connectedNodes.add(currentNode);

            edges.forEach(edge => {
                if (edge.source === currentNode) {
                    connectedEdges.add(edge.id);
                    dfs(edge.target);
                }
            });
        };

        dfs(nodeId);

        return { connectedNodes, connectedEdges };
    };
    static findUpstream(nodeId: string, edges: Edge[]): ConnectedPath {
        const visited = new Set<string>();
        const connectedNodes = new Set<string>();
        const connectedEdges = new Set<string>();

        const dfs = (currentNode: string) => {
            if (visited.has(currentNode)) return;
            visited.add(currentNode);
            connectedNodes.add(currentNode);

            edges.forEach(edge => {
                if (edge.target === currentNode) {
                    connectedEdges.add(edge.id);
                    dfs(edge.source);
                }
            });
        };

        dfs(nodeId);

        return { connectedNodes, connectedEdges };
    };
    static findWholeConnectedPath(nodeId: string, edges: Edge[]): ConnectedPath {
        const downstream = DAGUtils.findDownstream(nodeId, edges);
        const upstream = DAGUtils.findUpstream(nodeId, edges);
        return { connectedNodes: new Set<string>([...downstream.connectedNodes, ...upstream.connectedNodes]), connectedEdges: new Set<string>([...downstream.connectedEdges, ...upstream.connectedEdges]) };
    };

    // 获取布局后的节点和边
    static getLayoutedElements(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
        // 构建邻接表和入度
        const graph: { [key: string]: string[] } = {};
        const inDegree: { [key: string]: number } = {};
        const nodeMap: { [key: string]: Node } = {};

        // 初始化
        nodes.forEach(node => {
            graph[node.id] = [];
            inDegree[node.id] = 0;
            nodeMap[node.id] = node;
        });

        // 构建邻接表和入度
        edges.forEach(edge => {
            graph[edge.source].push(edge.target);
            inDegree[edge.target]++;
        });

        // 拓扑排序获取层级
        const levels: string[][] = [];
        const queue: string[] = [];

        // 找到所有入度为0的节点（第一层）
        Object.keys(inDegree).forEach(nodeId => {
            if (inDegree[nodeId] === 0) {
                queue.push(nodeId);
            }
        });

        // 按层级排序
        while (queue.length > 0) {
            const currentLevel: string[] = [];
            const levelSize = queue.length;

            for (let i = 0; i < levelSize; i++) {
                const current = queue.shift()!;
                currentLevel.push(current);

                // 处理当前节点的所有邻居
                graph[current].forEach(neighbor => {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] === 0) {
                        queue.push(neighbor);
                    }
                });
            }

            levels.push(currentLevel);
        }

        // 布局参数
        const levelSpacing = 200; // 层级间距
        const nodeSpacing = 100;  // 同层节点间距
        const startX = 100;       // 起始X坐标
        const startY = 100;       // 起始Y坐标

        // 计算每层节点的位置
        const layoutedNodes = nodes.map(node => {
            // 找到节点所在的层级
            let nodeLevelIndex = -1;
            let nodeIndexInLevel = -1;

            for (let i = 0; i < levels.length; i++) {
                const foundIndex = levels[i].indexOf(node.id);
                if (foundIndex !== -1) {
                    nodeLevelIndex = i;
                    nodeIndexInLevel = foundIndex;
                    break;
                }
            }

            if (nodeLevelIndex === -1) {
                // 如果节点不在任何层级中（可能是孤立节点），放在最后
                nodeLevelIndex = levels.length;
                nodeIndexInLevel = 0;
            }

            // 计算该层节点的总宽度
            const levelNodes = levels[nodeLevelIndex] || [node.id];
            const levelWidth = (levelNodes.length - 1) * nodeSpacing;
            const levelStartX = startX + nodeLevelIndex * levelSpacing;

            // 计算节点在该层中的位置
            const nodeIndex = levelNodes.indexOf(node.id);
            const x = levelStartX;
            const y = startY + nodeIndex * nodeSpacing - levelWidth / 2;

            return {
                ...node,
                position: { x, y },
            };
        });

        return { nodes: layoutedNodes, edges };
    };
}

