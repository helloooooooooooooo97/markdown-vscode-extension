import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  MarkerType,
  Connection,
  addEdge,
  BackgroundVariant,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { DAGUtils, DAGExtractor, FileInfo } from "@supernode/shared";
import { dagColors } from "./style";
import NodeRoundView from "./node/NodeRoundView";

const nodeTypes: NodeTypes = {
  dag: NodeRoundView,
};

// DAG组件配置接口
export interface DAGConfig {
  showHeader?: boolean; // 是否显示标题栏
  showControls?: boolean; // 是否显示控制按钮
  showMiniMap?: boolean; // 是否显示小地图
  showGrid?: boolean; // 是否显示网格背景
  height?: string; // 容器高度
  className?: string; // 外部className
  title?: string; // 标题文本
  enableNodeClick?: boolean; // 是否启用节点点击
  enableNodeDoubleClick?: boolean; // 是否启用节点双击
  enableAutoLayout?: boolean; // 是否启用自动布局
  enableReset?: boolean; // 是否启用重置功能
  enableValidation?: boolean; // 是否启用DAG验证
  fitView?: boolean; // 是否自动适应视图
  fitViewPadding?: number; // 视图适应时的内边距
  currentNodeID?: string; // 当前选中的节点ID
}

// 默认配置
const defaultConfig: Required<DAGConfig> = {
  showHeader: false,
  showControls: true,
  showMiniMap: true,
  showGrid: true,
  height: "70vh",
  className: "",
  title: "文档的DAG依赖关系图",
  enableNodeClick: true,
  enableNodeDoubleClick: true,
  enableAutoLayout: true,
  enableReset: true,
  enableValidation: true,
  fitView: true,
  fitViewPadding: 0.2,
  currentNodeID: "",
};

interface DAGPageProps {
  filteredFiles: FileInfo[];
  onNodeClick?: (filePath: string) => void;
  config?: DAGConfig;
}

const ViewDAG: React.FC<DAGPageProps> = ({ filteredFiles, onNodeClick, config = {} }) => {


  // 合并配置
  const finalConfig = { ...defaultConfig, ...config };

  // 将 FileInfo[] 转换为 DAGMetadata，然后通过 DAGExtractor 生成DAG数据
  const dagData = useMemo(() => {
    if (!filteredFiles || filteredFiles.length === 0) {
      return { nodes: [], edges: [] };
    }

    // 提取 FileMetadata 数组
    const fileMetadataArray = filteredFiles.map((file) => file.metadata);

    // 使用 DAGExtractor 生成DAG数据
    return DAGExtractor.extract(fileMetadataArray);
  }, [filteredFiles]);

  const [nodes, setNodes, onNodesChange] = useNodesState(dagData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dagData.edges);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(
    new Set()
  );
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(
    new Set()
  );
  const [settings, _] = useState({
    showGrid: finalConfig.showGrid,
    showControls: finalConfig.showControls,
    showMiniMap: finalConfig.showMiniMap,
    showLevels: true,
    theme: "light",
  });

  // 初始化时应用自动布局
  React.useEffect(() => {
    if (finalConfig.enableAutoLayout) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        DAGUtils.getLayoutedElements(dagData.nodes, dagData.edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [dagData]);

  // 处理 ReactFlow 初始化
  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
      // 初始化后立即居中
      if (finalConfig.fitView) {
        setTimeout(() => {
          try {
            instance.fitView({ padding: finalConfig.fitViewPadding });
          } catch (error) {
            console.warn("Initial fitView failed:", error);
          }
        }, 1);
      }
    },
    [finalConfig.fitView, finalConfig.fitViewPadding]
  );

  // 使用 ref 来获取 ReactFlow 实例，以便手动触发 fitView
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // 在节点更新后自动居中
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0 && finalConfig.fitView) {
      // 延迟执行，确保节点已经渲染完成
      setTimeout(() => {
        try {
          reactFlowInstance.fitView({ padding: finalConfig.fitViewPadding });
        } catch (error) {
          console.warn("fitView failed:", error);
        }
      }, 200);
    }
  }, [
    nodes,
    reactFlowInstance,
    finalConfig.fitView,
    finalConfig.fitViewPadding,
  ]);

  // 处理节点点击
  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      if (!finalConfig.enableNodeClick) return;

      // 调用外部传入的 onNodeClick 回调
      if (onNodeClick) {
        onNodeClick(node.id);
      }

      // 当存在当前节点ID时，只高亮当前节点
      if (!finalConfig.currentNodeID) {
        const { connectedNodes, connectedEdges } =
          DAGUtils.findWholeConnectedPath(node.id, edges);
        setHighlightedNodes(connectedNodes);
        setHighlightedEdges(connectedEdges);
      }
    },
    [nodes, edges, finalConfig.enableNodeClick, onNodeClick]
  );


  // 处理节点双击
  const handleNodeDoubleClick = useCallback(
    (_: any, node: Node) => {
      if (!finalConfig.enableNodeDoubleClick) return;
      if (node.id && onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [finalConfig.enableNodeDoubleClick, onNodeClick]
  );

  useEffect(() => {
    if (finalConfig.currentNodeID) {
      const { connectedEdges } = DAGUtils.findDirectConnectedPath(
        finalConfig.currentNodeID,
        edges
      );
      setHighlightedNodes(new Set([finalConfig.currentNodeID]));
      setHighlightedEdges(connectedEdges);
    }
  }, [finalConfig.currentNodeID, nodes, edges]);


  // 处理边连接
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds: Edge[]) => addEdge(params, eds));
    },
    [setEdges]
  );


  return (
    <div
      className={finalConfig.className}
      style={{
        height: finalConfig.height,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 主画布 */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: dagColors.background.primary,
        }}
      >
        <ReactFlow
          onInit={onInit}
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isHighlighted: highlightedNodes.has(node.id),
            },
          }))}
          edges={edges.map((edge) => ({
            ...edge,
            animated: highlightedEdges.has(edge.id),
            style: {
              ...edge.style,
              stroke: highlightedEdges.has(edge.id)
                ? dagColors.status.completed
                : dagColors.edge.primary,
              strokeWidth: highlightedEdges.has(edge.id) ? 3 : 2,
            },
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          nodeTypes={nodeTypes}
          fitView={true}
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            type: "straight",
            style: { stroke: dagColors.edge.primary, strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: dagColors.edge.primary,
            },
          }}
          proOptions={{ hideAttribution: true }}
        >
          {/* 设置背景 */}
          {settings.showGrid && (
            <Background
              color={dagColors.border.tertiary}
              gap={16}
              variant={BackgroundVariant.Dots}
            />
          )}
          {settings.showControls && <Controls />}
          {settings.showMiniMap && (
            <MiniMap
              style={{
                height: 120,
                width: 180,
                backgroundColor: dagColors.minimap.background,
                border: `1px solid ${dagColors.minimap.border}`,
                borderRadius: "4px",
              }}
              nodeColor={dagColors.minimap.node}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default ViewDAG;