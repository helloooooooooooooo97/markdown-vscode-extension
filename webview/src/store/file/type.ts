import { FileInfo, DocumentStats, ContentAnalysis } from '@supernode/shared'

export interface FileFilter {
    searchText: string;
    languageFilter: string[];
    complexityFilter: string[];
    hasCodeBlocks: boolean | null;
    hasImages: boolean | null;
    hasTables: boolean | null;
    hasMath: boolean | null;
    sizeRange: [number, number];
    dateRange: [Date | null, Date | null];
}

export interface FileSort {
    field: keyof FileInfo | keyof DocumentStats | keyof ContentAnalysis;
    order: 'ascend' | 'descend';
}

export enum ViewMode {
    TABLE = 'table', // 表格
    CARD = 'card',   // 卡片
    GRAPH = 'graph', // 图谱
    DAG = 'dag',     // 有向无环图
    TREE = 'tree',   // 树
    LIST = 'list'    // 列表
}