import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Block } from './type';

// 导入操作模块
import { createMutations, MarkdownMutations } from './mutations';
import { createQueries, MarkdownQueries } from './queries';

// 状态接口
export interface MarkdownStore {
    docs: Block[];
}

// 类型定义
export interface useMarkdownStoreType extends MarkdownStore, MarkdownMutations, MarkdownQueries { }
export type Getter = () => useMarkdownStoreType;
export type Setter = (fn: (state: useMarkdownStoreType) => void) => void;

// 使用 immer 中间件，分离 mutation 和 queries
export const useMarkdownStore = create<useMarkdownStoreType>()(
    immer((set, get) => ({
        // 初始状态
        docs: [],
        // 组合所有操作
        ...createMutations(set, get),
        ...createQueries(get)
    }))
);

export default useMarkdownStore;
