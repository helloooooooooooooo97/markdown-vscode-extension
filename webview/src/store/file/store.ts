import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FileFilter, FileSort, ViewMode } from './type';
import { FileInfo } from '@supernode/shared';
import { createMutations, FileMutations } from './mutations';
import { createQueries, FileQueries } from './queries';

export interface FileStore {
    files: FileInfo[];
    filteredFiles: FileInfo[];
    filter: FileFilter;
    sort: FileSort;
    viewMode: ViewMode;
    isLoading: boolean;
    selectedFiles: string[];
}

export interface useFileStoreType extends FileStore, FileMutations, FileQueries { }
export type Getter = () => useFileStoreType;
export type Setter = (fn: (state: useFileStoreType) => void) => void;

// 使用 immer 中间件，分离 mutation 和 queries
export const useFileStore = create<useFileStoreType>()(
    immer((set, get) => ({
        // 初始状态
        files: [],
        filteredFiles: [],
        filter: {
            searchText: '',
            languageFilter: [],
            complexityFilter: [],
            hasCodeBlocks: null,
            hasImages: null,
            hasTables: null,
            hasMath: null,
            sizeRange: [0, Infinity],
            dateRange: [null, null],
        },
        sort: {
            field: 'fileName',
            order: 'ascend',
        },
        viewMode: ViewMode.TABLE,
        isLoading: true,
        selectedFiles: [],
        ...createMutations(set, get),
        ...createQueries(get)
    }))
);

export default useFileStore;