import { Block } from './type';
import { Setter, Getter } from './store';
import { VscodeEventSource } from '@supernode/shared';
import { VSCodeAPI } from '../../communication/send';

// Mutations 操作接口
export interface MarkdownMutations {
    setContent: (content: string) => void;
    setBlocks: (blocks: Block[]) => void;
    updateBlock: (id: string, lines: string[]) => void;
    generateBlockId: () => string;
    setCurrentFileName: (fileName: string) => void;
    setSource: (source: VscodeEventSource) => void;
}

// Mutations 操作实现
export const createMutations = (set: Setter, _: Getter): MarkdownMutations => ({
    setContent: (content: string) => {
        set((state) => {
            state.content = content;
        });
    },

    setBlocks: (blocks: Block[]) => {
        set((state) => {
            state.blocks = blocks;
            // 只有当事件来源不是 MARKDOWNFILE 时才向 extension 发送更新消息
            if (state.source !== VscodeEventSource.MARKDOWNFILE) {
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
            // 只有当事件来源不是 MARKDOWNFILE 时才向 extension 发送更新消息
            if (state.source !== VscodeEventSource.MARKDOWNFILE) {
                VSCodeAPI.UpdateMarkdownContentFromWebviewMessage(state.blocks.map((b: Block) => b.lines.join('\n')).join('\n'), state.filePath);
            }

            console.log("updateBlock", state.blocks)
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
    }
}); 