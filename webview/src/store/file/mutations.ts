import { FileFilter, FileSort, ViewMode } from './type';
import { FileInfo } from '@supernode/shared';
import { Setter, Getter } from './store';

// Mutations 操作接口
export interface FileMutations {
    setFiles: (files: FileInfo[]) => void;
    setFilter: (filter: Partial<FileFilter>) => void;
    setSort: (sort: FileSort) => void;
    setViewMode: (mode: ViewMode) => void;
    setIsLoading: (loading: boolean) => void;
    setSelectedFiles: (files: string[]) => void;
    toggleFileSelection: (filePath: string) => void;
    clearFilter: () => void;
    clearSort: () => void;
}

// 应用过滤和排序
const applyFilterAndSort = (files: FileInfo[], filter: FileFilter, sort: FileSort): FileInfo[] => {
    let filtered = files.filter(file => {
        // 搜索文本过滤
        if (filter.searchText) {
            const searchLower = filter.searchText.toLowerCase();
            const matchesSearch =
                file.fileName.toLowerCase().includes(searchLower) ||
                file.relativePath.toLowerCase().includes(searchLower) ||
                file.metadata.frontmatter.title?.toLowerCase().includes(searchLower) ||
                file.contentAnalysis.topics.some(topic => topic.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;
        }

        // 语言过滤
        if (filter.languageFilter.length > 0 && !filter.languageFilter.includes(file.languageId)) {
            return false;
        }

        // 复杂度过滤
        if (filter.complexityFilter.length > 0 && !filter.complexityFilter.includes(file.contentAnalysis.complexity)) {
            return false;
        }

        // 特性过滤
        if (filter.hasCodeBlocks !== null && file.contentAnalysis.hasCodeBlocks !== filter.hasCodeBlocks) {
            return false;
        }
        if (filter.hasImages !== null && file.contentAnalysis.hasImages !== filter.hasImages) {
            return false;
        }
        if (filter.hasTables !== null && file.contentAnalysis.hasTables !== filter.hasTables) {
            return false;
        }
        if (filter.hasMath !== null && file.contentAnalysis.hasMath !== filter.hasMath) {
            return false;
        }

        // 大小范围过滤
        if (file.size < filter.sizeRange[0] || file.size > filter.sizeRange[1]) {
            return false;
        }

        // 日期范围过滤
        if (filter.dateRange[0] && file.lastModified < filter.dateRange[0]) {
            return false;
        }
        if (filter.dateRange[1] && file.lastModified > filter.dateRange[1]) {
            return false;
        }

        return true;
    });

    // 排序
    filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        if (sort.field in a) {
            aValue = (a as any)[sort.field];
            bValue = (b as any)[sort.field];
        } else if (sort.field in a.documentStats) {
            aValue = (a.documentStats as any)[sort.field];
            bValue = (b.documentStats as any)[sort.field];
        } else if (sort.field in a.contentAnalysis) {
            aValue = (a.contentAnalysis as any)[sort.field];
            bValue = (b.contentAnalysis as any)[sort.field];
        } else {
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sort.order === 'ascend'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sort.order === 'ascend' ? aValue - bValue : bValue - aValue;
        }

        if (aValue instanceof Date && bValue instanceof Date) {
            return sort.order === 'ascend'
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime();
        }

        return 0;
    });

    return filtered;
};

// Mutations 操作实现
export const createMutations = (set: Setter, _: Getter): FileMutations => ({
    setFiles: (files: FileInfo[]) => {
        set((state) => {
            state.files = files;
            state.filteredFiles = applyFilterAndSort(files, state.filter, state.sort);
        });
    },

    setFilter: (filter: Partial<FileFilter>) => {
        set((state) => {
            state.filter = { ...state.filter, ...filter };
            state.filteredFiles = applyFilterAndSort(state.files, state.filter, state.sort);
        });
    },

    setSort: (sort: FileSort) => {
        set((state) => {
            state.sort = sort;
            state.filteredFiles = applyFilterAndSort(state.files, state.filter, state.sort);
        });
    },

    setViewMode: (viewMode: ViewMode) => {
        set((state) => {
            state.viewMode = viewMode;
        });
    },

    setIsLoading: (isLoading: boolean) => {
        set((state) => {
            state.isLoading = isLoading;
        });
    },

    setSelectedFiles: (selectedFiles: string[]) => {
        set((state) => {
            state.selectedFiles = selectedFiles;
        });
    },

    toggleFileSelection: (filePath: string) => {
        set((state) => {
            const index = state.selectedFiles.indexOf(filePath);
            if (index > -1) {
                state.selectedFiles.splice(index, 1);
            } else {
                state.selectedFiles.push(filePath);
            }
        });
    },

    clearFilter: () => {
        set((state) => {
            state.filter = {
                searchText: '',
                languageFilter: [],
                complexityFilter: [],
                hasCodeBlocks: null,
                hasImages: null,
                hasTables: null,
                hasMath: null,
                sizeRange: [0, Infinity],
                dateRange: [null, null],
            };
            state.filteredFiles = applyFilterAndSort(state.files, state.filter, state.sort);
        });
    },

    clearSort: () => {
        set((state) => {
            state.sort = {
                field: 'fileName',
                order: 'ascend',
            };
            state.filteredFiles = applyFilterAndSort(state.files, state.filter, state.sort);
        });
    },
});