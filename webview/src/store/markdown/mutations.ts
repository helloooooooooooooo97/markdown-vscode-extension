import { Block, BlockType } from './type';
import { Setter, Getter } from './store';
import { VscodeEventSource, joinPath } from '@supernode/shared';
import { VSCodeAPI } from '../../communication/send';

// Mutations 操作接口
export interface MarkdownMutations {
    setBlocks: (blocks: Block[]) => void;
    updateBlock: (id: string, lines: string[]) => void;
    updateBlockStorage: (id: string, storage: any) => void;
    generateBlockId: () => string;
    setCurrentFileName: (fileName: string) => void;
    setSource: (source: VscodeEventSource) => void;
    updateBlockIsLoading: (id: string, isLoading: boolean) => void;
}

// Mutations 操作实现
export const createMutations = (set: Setter, _: Getter): MarkdownMutations => ({
    setBlocks: (blocks: Block[]) => {
        set((state) => {
            state.blocks = blocks;
            // 只有当事件来源不是 MARKDOWNFILE 时才向 extension 发送更新消息
            if (state.source !== VscodeEventSource.FILE) {
                VSCodeAPI.UpdateMarkdownContentFromWebviewMessage(state.blocks.map((b: Block) => b.lines.join('\n')).join('\n'), state.filePath);
            }
            console.log("setBlocks", state.blocks)
        });
    },

    updateBlock: (id: string, lines: string[]) => {
        set((state) => {
            const block = state.blocks.find((b: Block) => b.id === id);
            if (block) {
                block.lines = lines;
            }
            // 只有当事件来源不是 FILE 时才向 extension 发送更新消息
            if (state.source !== VscodeEventSource.FILE) {
                VSCodeAPI.UpdateMarkdownContentFromWebviewMessage(state.blocks.map((b: Block) => b.lines.join('\n')).join('\n'), state.filePath);
            }
            console.log("updateBlock", state.blocks)
        });
    },

    updateBlockStorage: (id: string, storage: any) => {
        set((state) => {
            const block = state.blocks.find((b: Block) => b.id === id);
            if (block) {
                block.storage = JSON.parse(JSON.stringify(storage));
                if (block?.type === BlockType.Excalidraw && state.source === VscodeEventSource.WEBVIEW) {
                    VSCodeAPI.saveExcalidrawData(joinPath(state.filePath, block.filePath || ""), storage);
                }
            }
            console.log("updateBlockStorage", id, storage)
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

    setSource: (source: VscodeEventSource) => {
        set((state) => {
            state.source = source;
        });
    },

    updateBlockIsLoading: (id: string, isLoading: boolean) => {
        set((state) => {
            const block = state.blocks.find((b: Block) => b.id === id);
            if (block) {
                block.isLoading = isLoading;
            }
        });
    }
}); 