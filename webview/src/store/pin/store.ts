import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FileFilter, FileSort, ViewMode } from '../file/type';
import { PinMutations, createMutations } from './mutations';
import { PinQueries, createQueries } from './queries';
import { VSCodeAPI } from '../../communication/send';

export interface PinnedQuery {
    id: string;
    name: string;
    viewMode: ViewMode;
    filter: FileFilter;
    sort: FileSort;
    createdAt: Date;
    lastUsed: Date;
    showInSidebar: boolean; // 是否在侧边栏显示
    sidebarIcon: string; // 侧边栏图标（emoji或图标名称）
    sidebarOrder: number; // 侧边栏排序
}

export interface PinStore {
    pinnedQueries: PinnedQuery[];
    currentQuery: PinnedQuery | null;
    isInitialized: boolean; // 是否已初始化
}

export interface usePinStoreType extends PinStore, PinMutations, PinQueries {
    initialize: () => void;
    setPinnedQueries: (queries: PinnedQuery[]) => void;
}

export type Getter = () => usePinStoreType;
export type Setter = (fn: (state: usePinStoreType) => void) => void;

// 使用 immer 中间件，分离 mutation 和 queries
export const usePinStore = create<usePinStoreType>()(
    immer((set, get) => ({
        // 初始状态
        pinnedQueries: [],
        currentQuery: null,
        isInitialized: false,

        // 合并 mutations 和 queries
        ...createMutations(set),
        ...createQueries(get),

        // 需要访问store数据的方法
        exportQueries: () => {
            const queries = get().pinnedQueries;
            return JSON.stringify(queries, null, 2);
        },

        // 初始化方法
        initialize: () => {
            const state = get();
            if (!state.isInitialized) {
                // 从extension加载PIN数据
                VSCodeAPI.loadPinnedQueries();
                set((state) => {
                    state.isInitialized = true;
                });
            }
        },

        // 设置PIN数据（从extension加载）
        setPinnedQueries: (queries: PinnedQuery[]) => {
            set((state) => {
                state.pinnedQueries = queries;
            });
        },
    }))
);

// 添加subscribe来自动持久化
usePinStore.subscribe((state) => {
    // 当pinnedQueries发生变化时，自动保存到extension
    // 只有在已初始化且不是从extension加载数据时才保存
    if (state.isInitialized) {
        VSCodeAPI.savePinnedQueries(state.pinnedQueries);
    }
    console.log("pinnedQueries", state.pinnedQueries);
});

export default usePinStore; 