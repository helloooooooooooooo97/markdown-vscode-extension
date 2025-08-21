import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { FileFilter, FileSort, ViewMode } from '../file/type';

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
}

export interface PinMutations {
    addPinnedQuery: (query: Omit<PinnedQuery, 'id' | 'createdAt' | 'lastUsed'>) => void;
    removePinnedQuery: (id: string) => void;
    updatePinnedQuery: (id: string, updates: Partial<PinnedQuery>) => void;
    setCurrentQuery: (query: PinnedQuery | null) => void;
    updateLastUsed: (id: string) => void;
    clearAllPinnedQueries: () => void;
    toggleSidebarVisibility: (id: string) => void;
    updateSidebarIcon: (id: string, icon: string) => void;
    updateSidebarOrder: (id: string, order: number) => void;
    exportQueries: () => string;
    importQueries: (data: string) => boolean;
    duplicateQuery: (id: string) => void;
}

export interface PinQueries {
    getPinnedQueryById: (id: string) => PinnedQuery | undefined;
    getMostUsedQueries: (limit?: number) => PinnedQuery[];
    getRecentQueries: (limit?: number) => PinnedQuery[];
    getSidebarQueries: () => PinnedQuery[];
}

export interface usePinStoreType extends PinStore, PinMutations, PinQueries { }

export type Getter = () => usePinStoreType;
export type Setter = (fn: (state: usePinStoreType) => void) => void;

// 使用 immer 中间件，分离 mutation 和 queries
export const usePinStore = create<usePinStoreType>()(
    immer((set, get) => ({
        // 初始状态
        pinnedQueries: [],
        currentQuery: null,

        // Mutations
        addPinnedQuery: (query) => {
            set((state) => {
                const newQuery: PinnedQuery = {
                    ...query,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                    lastUsed: new Date(),
                    showInSidebar: query.showInSidebar ?? false, // 使用传入的值，如果没有则默认为 false
                    sidebarIcon: query.sidebarIcon ?? '📌', // 使用传入的值，如果没有则默认为 📌
                    sidebarOrder: state.pinnedQueries.length, // 默认排序
                };
                state.pinnedQueries.push(newQuery);
            });
        },

        removePinnedQuery: (id) => {
            set((state) => {
                state.pinnedQueries = state.pinnedQueries.filter(q => q.id !== id);
                if (state.currentQuery?.id === id) {
                    state.currentQuery = null;
                }
            });
        },

        updatePinnedQuery: (id, updates) => {
            set((state) => {
                const query = state.pinnedQueries.find(q => q.id === id);
                if (query) {
                    Object.assign(query, updates);
                }
            });
        },

        setCurrentQuery: (query) => {
            set((state) => {
                state.currentQuery = query;
            });
        },

        updateLastUsed: (id) => {
            set((state) => {
                const query = state.pinnedQueries.find(q => q.id === id);
                if (query) {
                    query.lastUsed = new Date();
                }
            });
        },

        clearAllPinnedQueries: () => {
            set((state) => {
                state.pinnedQueries = [];
                state.currentQuery = null;
            });
        },

        toggleSidebarVisibility: (id) => {
            set((state) => {
                const query = state.pinnedQueries.find(q => q.id === id);
                if (query) {
                    query.showInSidebar = !query.showInSidebar;
                }
            });
        },

        updateSidebarIcon: (id, icon) => {
            set((state) => {
                const query = state.pinnedQueries.find(q => q.id === id);
                if (query) {
                    query.sidebarIcon = icon;
                }
            });
        },

        updateSidebarOrder: (id, order) => {
            set((state) => {
                const query = state.pinnedQueries.find(q => q.id === id);
                if (query) {
                    query.sidebarOrder = order;
                }
            });
        },

        exportQueries: () => {
            const queries = get().pinnedQueries;
            return JSON.stringify(queries, null, 2);
        },

        importQueries: (data) => {
            try {
                const queries = JSON.parse(data);
                if (Array.isArray(queries)) {
                    set((state) => {
                        state.pinnedQueries = queries;
                    });
                    return true;
                }
                return false;
            } catch (error) {
                console.error('导入查询失败:', error);
                return false;
            }
        },

        duplicateQuery: (id) => {
            set((state) => {
                const originalQuery = state.pinnedQueries.find(q => q.id === id);
                if (originalQuery) {
                    const duplicatedQuery: PinnedQuery = {
                        ...originalQuery,
                        id: Date.now().toString(),
                        name: `${originalQuery.name} (副本)`,
                        createdAt: new Date(),
                        lastUsed: new Date(),
                        showInSidebar: false, // 副本默认不在侧边栏显示
                    };
                    state.pinnedQueries.push(duplicatedQuery);
                }
            });
        },

        // Queries
        getPinnedQueryById: (id) => {
            return get().pinnedQueries.find(q => q.id === id);
        },

        getMostUsedQueries: (limit = 5) => {
            const queries = [...get().pinnedQueries];
            return queries
                .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
                .slice(0, limit);
        },

        getRecentQueries: (limit = 5) => {
            const queries = [...get().pinnedQueries];
            return queries
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit);
        },

        getSidebarQueries: () => {
            return get().pinnedQueries.filter(q => q.showInSidebar);
        },
    }))
);

export default usePinStore; 