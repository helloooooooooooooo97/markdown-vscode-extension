import * as vscode from "vscode";
import { openPreviewCommand, scanMarkdownFilesCommand } from "../controller/command";

export class CommandManager {
    private static disposables: vscode.Disposable[] = [];
    public static registerCommands(): vscode.Disposable[] {
        CommandManager.disposables.push(openPreviewCommand, scanMarkdownFilesCommand);
        return [openPreviewCommand, scanMarkdownFilesCommand];
    }

    public static dispose(): void {
        CommandManager.disposables.forEach(disposable => disposable.dispose());
        CommandManager.disposables = [];
    }
}