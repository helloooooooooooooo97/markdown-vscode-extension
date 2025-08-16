import * as vscode from "vscode";
import { MarkdownWebviewProvider } from "../service/webview_service";
import { MarkdownFileScannerService } from "../../pkg/services/MarkdownFileScannerService";

export class CommandManager {
    private static instance: CommandManager;
    private disposables: vscode.Disposable[] = [];

    private constructor() { }

    public static getInstance(): CommandManager {
        if (!CommandManager.instance) {
            CommandManager.instance = new CommandManager();
        }
        return CommandManager.instance;
    }

    /**
     * 注册所有命令
     */
    public registerCommands(): vscode.Disposable[] {
        const openPreviewCommand = vscode.commands.registerCommand(
            "supernode.openPreview",
            () => {
                MarkdownWebviewProvider.createOrShow();
            }
        );

        const scanMarkdownFilesCommand = vscode.commands.registerCommand(
            "supernode.scanMarkdownFiles",
            async () => {
                const scannerService = MarkdownFileScannerService.getInstance();
                await scannerService.startScanAndExport();
            }
        );

        this.disposables.push(openPreviewCommand, scanMarkdownFilesCommand);
        return [openPreviewCommand, scanMarkdownFilesCommand];
    }

    /**
     * 清理所有命令
     */
    public dispose(): void {
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
} 