// 定义一个组件，用来对file references进行图谱渲染，要求可以点击跳转
import React, { useRef, useCallback, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { FileInfo, GraphExtractor } from "@supernode/shared";
import { EChartsGenerator } from "./util";

// 主图谱组件
export interface FileGraphProps {
  filteredFiles: FileInfo[];
  onNodeClick?: (filePath: string) => void;
  config?: {
    showTitle?: boolean;
    showLegend?: boolean;
    title?: string;
    subtitle?: string;
  };
}

const Graph: React.FC<FileGraphProps> = ({
  filteredFiles,
  onNodeClick,
  config = {
    showTitle: false,
    showLegend: false,
  },
}) => {
  // 将 FileInfo[] 转换为 FileMetadata[]，然后通过 GraphExtractor 生成图谱数据
  const graphData = useMemo(() => {
    if (!filteredFiles || filteredFiles.length === 0) {
      return { nodes: [], links: [], categories: [] };
    }

    // 提取 FileMetadata 数组
    const fileMetadataArray = filteredFiles.map((file) => file.metadata);

    // 使用 GraphExtractor 生成图谱数据
    return GraphExtractor.extract(fileMetadataArray);
  }, [filteredFiles]);
  const chartRef = useRef<ReactECharts>(null);
  const onChartClick = useCallback(
    (params: any) => {
      if (params.dataType === "node" && onNodeClick) {
        onNodeClick(params.data.path);
      }
    },
    [onNodeClick]
  );

  const option = useMemo(() => {
    return new EChartsGenerator(graphData).generateEChartsOption(config);
  }, [graphData, config]);

  return (
    <div
      style={{
        width: "100%",
        height: "800px",
      }}
    >
      {/* ECharts图谱 */}
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
        onEvents={{
          click: onChartClick,
        }}
      />
    </div>
  );
};

export default Graph;
