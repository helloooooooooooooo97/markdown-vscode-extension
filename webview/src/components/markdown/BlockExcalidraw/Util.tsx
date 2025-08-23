export interface ExcalidrawData {
    type: string;
    version: number;
    source: string;
    elements: ExcalidrawElement[];
    appState: ExcalidrawAppState;
    files: ExcalidrawFiles;
}

type ExcalidrawElement = any;

export interface ExcalidrawAppState {
    viewBackgroundColor: string;
    gridSize: number;
    gridStep: number;
    gridModeEnabled: boolean;
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
                viewBackgroundColor: "#ffffff",
                gridSize: 20,
                gridStep: 5,
                gridModeEnabled: true
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
                viewBackgroundColor: parsed.appState?.viewBackgroundColor || "#ffffff",
                gridSize: parsed.appState?.gridSize || 20,
                gridStep: parsed.appState?.gridStep || 5,
                gridModeEnabled: parsed.appState?.gridModeEnabled || true
            },
        };
    }

    static View2Storage(elements: ExcalidrawElement[], appState: ExcalidrawAppState, files: ExcalidrawFiles): ExcalidrawData {
        return {
            ...this.emptyExcalidrawData,
            elements: elements || [],
            files: files || {},
            appState: {
                viewBackgroundColor: appState?.viewBackgroundColor || "#ffffff",
                gridSize: appState?.gridSize || 20,
                gridStep: appState?.gridStep || 5,
                gridModeEnabled: appState?.gridModeEnabled || true
            }
        }
    }
}

export default ExcalidrawUtil;