import { FileFilter } from '../file/type';

/**
 * PIN工具类，用于处理PIN相关的数据转换和修复
 */
export class PinUtil {
    /**
     * 修复反序列化后的PIN filter，确保Date对象正确转换
     */
    static fixPinnedQueryFilter(filter: any): FileFilter {
        return {
            searchText: filter?.searchText || '',
            languageFilter: filter?.languageFilter || [],
            complexityFilter: filter?.complexityFilter || [],
            hasCodeBlocks: filter?.hasCodeBlocks ?? null,
            hasImages: filter?.hasImages ?? null,
            hasTables: filter?.hasTables ?? null,
            hasMath: filter?.hasMath ?? null,
            sizeRange: [
                filter?.sizeRange?.[0] ?? 0,
                filter?.sizeRange?.[1] ?? Infinity
            ] as [number, number],
            dateRange: [
                filter?.dateRange?.[0] ? new Date(filter.dateRange[0]) : null,
                filter?.dateRange?.[1] ? new Date(filter.dateRange[1]) : null
            ] as [Date | null, Date | null]
        };
    }

    /**
     * 修复反序列化后的PIN查询数据
     */
    static fixPinnedQuery(query: any) {
        if (!query) return query;
        return {
            ...query,
            // 转换Date字符串为Date对象
            createdAt: query.createdAt ? new Date(query.createdAt) : new Date(),
            lastUsed: query.lastUsed ? new Date(query.lastUsed) : new Date(),
            // 修复filter
            filter: PinUtil.fixPinnedQueryFilter(query.filter),
            // 确保sort字段完整
            sort: {
                field: query.sort?.field || 'fileName',
                order: query.sort?.order || 'ascend'
            }
        };
    }
}
