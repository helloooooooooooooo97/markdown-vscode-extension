import * as vscode from "vscode";
import { openPreviewCommand, scanMarkdownFilesCommand, startFileWatchingCommand, stopFileWatchingCommand, refreshProblemsPanelCommand, clearAllDiagnosticsCommand, validatePathsCommand } from "../controller/command";

export class CommandManager {
    private static disposables: vscode.Disposable[] = [];
    public static registerCommands(): vscode.Disposable[] {
        CommandManager.disposables.push(
            openPreviewCommand,
            scanMarkdownFilesCommand,
            startFileWatchingCommand,
            stopFileWatchingCommand,
            refreshProblemsPanelCommand,
            clearAllDiagnosticsCommand,
            validatePathsCommand
        );
        return [
            openPreviewCommand,
            scanMarkdownFilesCommand,
            startFileWatchingCommand,
            stopFileWatchingCommand,
            refreshProblemsPanelCommand,
            clearAllDiagnosticsCommand,
            validatePathsCommand
        ];
    }

    public static dispose(): void {
        CommandManager.disposables.forEach(disposable => disposable.dispose());
        CommandManager.disposables = [];
    }
}