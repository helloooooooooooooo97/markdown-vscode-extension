import { FileInfo } from '@supernode/shared';
import { Getter } from './store';

// Queries 操作接口
export interface FileQueries {
    getFilesByLanguage: (language: string) => FileInfo[];
    getFilesByComplexity: (complexity: string) => FileInfo[];
    getFilesWithCodeBlocks: () => FileInfo[];
    getFilesWithImages: () => FileInfo[];
    getFilesWithTables: () => FileInfo[];
    getFilesWithMath: () => FileInfo[];
    getTotalStats: () => {
        totalFiles: number;
        totalSize: number;
        totalWords: number;
        totalReadingTime: number;
    };
    getUniqueLanguages: () => string[];
    getUniqueComplexities: () => string[];
}

// Queries 操作实现
export const createQueries = (get: Getter): FileQueries => ({
    getFilesByLanguage: (language: string) => {
        return get().files.filter(file => file.languageId === language);
    },

    getFilesByComplexity: (complexity: string) => {
        return get().files.filter(file => file.contentAnalysis.complexity === complexity);
    },

    getFilesWithCodeBlocks: () => {
        return get().files.filter(file => file.contentAnalysis.hasCodeBlocks);
    },

    getFilesWithImages: () => {
        return get().files.filter(file => file.contentAnalysis.hasImages);
    },

    getFilesWithTables: () => {
        return get().files.filter(file => file.contentAnalysis.hasTables);
    },

    getFilesWithMath: () => {
        return get().files.filter(file => file.contentAnalysis.hasMath);
    },

    getTotalStats: () => {
        const files = get().filteredFiles; // 使用筛选后的文件而不是所有文件
        return {
            totalFiles: files.length,
            totalSize: files.reduce((sum, file) => sum + file.size, 0),
            totalWords: files.reduce((sum, file) => sum + file.documentStats.wordCount, 0),
            totalReadingTime: files.reduce((sum, file) => sum + file.documentStats.readingTimeMinutes, 0),
        };
    },

    getUniqueLanguages: () => {
        const files = get().filteredFiles; // 使用筛选后的文件
        return [...new Set(files.map(file => file.languageId))];
    },

    getUniqueComplexities: () => {
        const files = get().filteredFiles; // 使用筛选后的文件
        return [...new Set(files.map(file => file.contentAnalysis.complexity))];
    },
});