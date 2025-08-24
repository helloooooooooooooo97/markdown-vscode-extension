export interface ExcalidrawData {
    type: string;
    version: number;
    source: string;
    elements: ExcalidrawElement[];
    appState: ExcalidrawAppState;
    files: ExcalidrawFiles;
}

type ExcalidrawElement = any;

// 增加 theme 字段，支持存储夜间/日间模式
export interface ExcalidrawAppState {
    viewBackgroundColor: string;
    gridSize: number;
    gridStep: number;
    gridModeEnabled: boolean;
    theme?: "light" | "dark";
}

export interface ExcalidrawFiles {
    [key: string]: any;
}

export class ExcalidrawUtil {

    /**
     * 从BlockExcalidraw标签中提取refer路径
     */
    static extractReferFromLine(line: string): string | null {
        const referMatch = line.trim().match(/refer="([^"]+)"/);
        return referMatch ? referMatch[1] : null;
    }

    static get emptyExcalidrawData(): ExcalidrawData {
        return {
            type: "excalidraw",
            version: 2,
            source: "localfile",
            elements: [],
            appState: {
                viewBackgroundColor: "#f8f9fa",
                gridSize: 20,
                gridStep: 5,
                gridModeEnabled: true,
                theme: "dark" // 默认夜间模式
            },
            files: {}
        };
    }

    static storage2View = (content: string): ExcalidrawData => {
        const parsed = JSON.parse(content);
        return {
            ...this.emptyExcalidrawData,
            elements: parsed.elements || [],
            files: parsed.files || {},
            appState: {
                viewBackgroundColor: parsed.appState?.viewBackgroundColor || "#f8f9fa",
                gridSize: parsed.appState?.gridSize || 20,
                gridStep: parsed.appState?.gridStep || 5,
                gridModeEnabled: parsed.appState?.gridModeEnabled ?? true,
                theme: parsed.appState?.theme || "dark"
            },
        };
    }

    static View2Storage(elements: ExcalidrawElement[], appState: ExcalidrawAppState, files: ExcalidrawFiles): ExcalidrawData {
        return {
            ...this.emptyExcalidrawData,
            elements: elements || [],
            files: files || {},
            appState: {
                viewBackgroundColor: appState?.viewBackgroundColor || "#f8f9fa",
                gridSize: appState?.gridSize || 20,
                gridStep: appState?.gridStep || 5,
                gridModeEnabled: appState?.gridModeEnabled !== undefined ? appState.gridModeEnabled : true,
                theme: appState?.theme || "dark"
            }
        }
    }
}

export default ExcalidrawUtil;