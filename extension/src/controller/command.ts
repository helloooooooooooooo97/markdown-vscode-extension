import { MarkdownWebviewProvider } from "../event/webview";
import { MarkdownFileScannerService } from "../service/markdown_file_analyzer";
import { PathConfig } from "../service/path_config";
import * as vscode from "vscode";

export const openPreviewCommand = vscode.commands.registerCommand(
    "supernode.openPreview",
    () => {
        MarkdownWebviewProvider.createOrShow();
    }
);

export const scanMarkdownFilesCommand = vscode.commands.registerCommand(
    "supernode.scanMarkdownFiles",
    async () => {
        await MarkdownFileScannerService.startScanAndExport();
    }
);

export const startFileWatchingCommand = vscode.commands.registerCommand(
    "supernode.startFileWatching",
    () => {
        // 这里需要通过 context 获取 EventController 实例
        // 暂时使用 MarkdownFileScannerService 的方法
        MarkdownFileScannerService.startFileWatching();
    }
);

export const stopFileWatchingCommand = vscode.commands.registerCommand(
    "supernode.stopFileWatching",
    () => {
        // 这里需要通过 context 获取 EventController 实例
        // 暂时使用 MarkdownFileScannerService 的方法
        MarkdownFileScannerService.stopFileWatching();
    }
);

export const refreshProblemsPanelCommand = vscode.commands.registerCommand(
    "supernode.refreshProblemsPanel",
    async () => {
        await MarkdownFileScannerService.refreshProblemsPanel();
    }
);

export const clearAllDiagnosticsCommand = vscode.commands.registerCommand(
    "supernode.clearAllDiagnostics",
    () => {
        MarkdownFileScannerService.clearAllDiagnostics();
        vscode.window.showInformationMessage("已清除所有诊断信息");
    }
);

export const validatePathsCommand = vscode.commands.registerCommand(
    "supernode.validatePaths",
    () => {
        const isValid = PathConfig.validatePaths();
        if (isValid) {
            vscode.window.showInformationMessage("✅ 所有路径验证通过");
        } else {
            vscode.window.showErrorMessage("❌ 路径验证失败，请检查控制台输出");
        }
    }
);

