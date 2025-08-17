import { Block } from './type';
import { Setter, Getter } from './store';
import debounce from 'lodash/debounce';

// Mutations 操作接口
export interface MarkdownMutations {
    setDocument: (blocks: Block[]) => void;
    updateBlock: (id: string, lines: string[]) => void;
    generateBlockId: () => string;
    setCurrentFileName: (fileName: string) => void;
    setContent: (content: string) => void;
    setIsLoading: (loading: boolean) => void;
}

// Mutations 操作实现
export const createMutations = (set: Setter, _: Getter): MarkdownMutations => ({
    setDocument: (blocks: Block[]) => {
        set((state) => {
            state.docs = blocks;
        });
    },

    updateBlock: (id: string, lines: string[]) => {
        set((state) => {
            const block = state.docs.find((b: Block) => b.id === id);
            if (block) {
                block.lines = lines;
            }
            // vscode发起的更新，需要通知extension更新
            window?.vscode?.postMessage({
                command: 'updateMarkdownContentFromWebview',
                content: state.docs.map((b: Block) => b.lines.join('\n')).join('\n'),
                fileName: state.filePath, // 添加文件路径
            });
        });
    },

    setCurrentFileName: (fileName: string) => {
        set((state) => {
            state.filePath = fileName;
        });
    },

    generateBlockId: () => {
        return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    setContent: (content: string) => {
        set((state) => {
            state.content = content;
        });
    },

    setIsLoading: (loading: boolean) => {
        set((state) => {
            state.isLoading = loading;
        });
    }
}); 