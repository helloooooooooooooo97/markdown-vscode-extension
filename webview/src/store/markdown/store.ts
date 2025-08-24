import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Block } from './type';
import { createMutations, MarkdownMutations } from './mutations';
import { createQueries, MarkdownQueries } from './queries';
import { VscodeEventSource } from '@supernode/shared';
import { testMarkdown } from './factory';
import BlockSchemaParser from '../../pkg/utils/blockSchemParser';
export interface MarkdownStore {
    blocks: Block[];
    filePath: string; // 当前文件的路径
    source: VscodeEventSource; // 事件来源
}

export interface useMarkdownStoreType extends MarkdownStore, MarkdownMutations, MarkdownQueries { }
export type Getter = () => useMarkdownStoreType;
export type Setter = (fn: (state: useMarkdownStoreType) => void) => void;

// 使用 immer 中间件，分离 mutation 和 queries
export const useMarkdownStore = create<useMarkdownStoreType>()(
    immer((set, get) => ({
        blocks: new BlockSchemaParser(testMarkdown).parse(),
        filePath: "", // 当前文件的路径
        isLoading: true, // 加载状态
        source: VscodeEventSource.WEBVIEW, // 事件来源，如果事件来源是webview，则store变化会往extension同步，否则不往extension同步
        ...createMutations(set, get),
        ...createQueries(get)
    }))
);

export default useMarkdownStore;
