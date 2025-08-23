import { PinnedQuery } from "./store";
import { Setter } from "./store";

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

// Mutations 操作实现
export const createMutations = (set: Setter): PinMutations => ({
    addPinnedQuery: (query) => {
        set((state) => {
            const newQuery: PinnedQuery = {
                ...query,
                id: Date.now().toString(),
                createdAt: new Date(),
                lastUsed: new Date(),
                showInSidebar: query.showInSidebar ?? false,
                sidebarIcon: query.sidebarIcon ?? '📌',
                sidebarOrder: state.pinnedQueries.length,
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
        // 这个方法需要访问store数据，所以在store.ts中实现
        return ""; // 临时返回，实际实现需要getter
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
                    showInSidebar: false,
                };
                state.pinnedQueries.push(duplicatedQuery);
            }
        });
    },
});
