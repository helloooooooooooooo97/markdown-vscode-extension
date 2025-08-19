import { FileInfo, DocumentStats, ContentAnalysis } from '@supernode/shared';

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

export type ViewMode = 'table' | 'card';