import { PinnedQuery } from "./store";
import { Getter } from "./store";

export interface PinQueries {
    getPinnedQueryById: (id: string) => PinnedQuery | undefined;
    getMostUsedQueries: (limit?: number) => PinnedQuery[];
    getRecentQueries: (limit?: number) => PinnedQuery[];
    getSidebarQueries: () => PinnedQuery[];
}

// Queries 操作实现
export const createQueries = (get: Getter): PinQueries => ({
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
});