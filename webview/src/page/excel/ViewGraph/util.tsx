import { GraphNode, GraphLink, GraphCategory } from "@supernode/shared";

// 基础颜色定义
const BaseColor = {
  red: "#e06c75",
  orange: "#e9ab64",
  yellow: "#e9c46a",
  green: "#57a773",
  blue: "#337ea9",
  purple: "#a084ca",
  pink: "#e06c75",
};

// 预定义的基础色池：红、橙、黄、绿、青、蓝、紫
export const COLOR_POOL = [
  BaseColor.red,
  BaseColor.orange,
  BaseColor.yellow,
  BaseColor.green,
  BaseColor.blue,
  BaseColor.purple,
  BaseColor.pink,
];

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: GraphCategory[];
}

export interface ChartConfig {
  showTitle?: boolean;
  showLegend?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * 工具类：提供各种工具函数
 */
export class GraphUtils {
  /**
   * 字符串哈希函数
   */
  static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
  }

  /**
   * 根据字符串生成颜色
   */
  static generateColorFromString(str: string): string {
    const hash = this.hashString(str);
    return COLOR_POOL[hash % COLOR_POOL.length];
  }

  /**
   * 获取节点数量
   */
  static getNodeCount(graphData: GraphData): number {
    return graphData.nodes.length;
  }

  /**
   * 获取链接数量
   */
  static getLinkCount(graphData: GraphData): number {
    return graphData.links.length;
  }

  /**
   * 获取分类数量
   */
  static getCategoryCount(graphData: GraphData): number {
    return graphData.categories.length;
  }
}

/**
 * ECharts 配置生成器类
 */
export class EChartsGenerator {
  private graphData: GraphData;

  constructor(graphData: GraphData) {
    this.graphData = graphData;
  }

  /**
   * 获取标题配置
   */
  private getTitleOption(config?: { title?: string; subtitle?: string }) {
    return {
      text: config?.title || "文档引用关系图谱",
      subtext:
        config?.subtitle ||
        `共${this.graphData.nodes.length}个文件，${this.graphData.links.length}个引用关系`,
      top: "2%",
      left: "2%",
      textStyle: {
        fontSize: 16,
      },
      subtextStyle: {
        fontSize: 11,
      },
    };
  }

  /**
   * 获取图例配置
   */
  private getLegendOption() {
    return [
      {
        data: this.graphData.categories.map((cat) => ({
          name: cat.name,
          itemStyle: {
            color: GraphUtils.generateColorFromString(cat.name),
          },
        })),
        top: "2%",
        right: "2%",
        orient: "vertical",
        textStyle: {
          fontSize: 12,
        },
        itemGap: 8,
        itemWidth: 12,
        itemHeight: 8,
      },
    ];
  }

  /**
   * 获取系列配置
   */
  private getSeriesOption() {
    return [
      {
        type: "graph",
        layout: "force",
        data: this.graphData.nodes,
        links: this.graphData.links,
        categories: this.graphData.categories,
        roam: true, // 允许缩放和平移
        draggable: true, // 允许拖拽节点
        label: {
          show: false, // 关闭节点文本渲染，提高性能
        },
        force: {
          edgeLength: 30, // 增加边长度，让节点分布更开
          repulsion: 40, // 增加斥力，让节点分布更均匀
          gravity: 0.1, // 减小引力，让节点分布更开
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 3,
          },
        },
        lineStyle: {
          opacity: 0.4, // 降低透明度，减少视觉干扰
          curveness: 0.05, // 减少弯曲度
        },
        itemStyle: {
          color: "#4a9eff", // 默认颜色
        },
      },
    ];
  }

  /**
   * 生成 ECharts 配置选项
   */
  public generateEChartsOption(config?: ChartConfig) {
    const showTitle = config?.showTitle ?? true;
    const showLegend = config?.showLegend ?? true;

    return {
      title: showTitle ? this.getTitleOption(config) : undefined,
      legend: showLegend ? this.getLegendOption() : undefined,
      animationDuration: 0, // 关闭动画，参考官网
      animationEasingUpdate: "linear",
      series: this.getSeriesOption(),
    };
  }

  /**
   * 更新图表数据
   */
  public updateGraphData(newGraphData: GraphData) {
    this.graphData = newGraphData;
  }

  /**
   * 获取当前图表数据
   */
  public getGraphData(): GraphData {
    return this.graphData;
  }

  /**
   * 获取节点数量
   */
  public getNodeCount(): number {
    return GraphUtils.getNodeCount(this.graphData);
  }

  /**
   * 获取链接数量
   */
  public getLinkCount(): number {
    return GraphUtils.getLinkCount(this.graphData);
  }

  /**
   * 获取分类数量
   */
  public getCategoryCount(): number {
    return GraphUtils.getCategoryCount(this.graphData);
  }
}
