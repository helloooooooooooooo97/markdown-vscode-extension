import { Block } from './type';
import { Getter } from './store';

// Queries 操作接口
export interface MarkdownQueries {
    getMarkdown: () => string;
}

// Queries 操作实现
export const createQueries = (get: Getter): MarkdownQueries => ({
    getMarkdown: () => {
        return get().blocks.map((block: Block) => block.lines.join('\n')).join('\n');
    }
}); 