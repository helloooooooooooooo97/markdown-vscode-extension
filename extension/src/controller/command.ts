import { MarkdownWebviewProvider } from "src/event/webview";
import { MarkdownFileScannerService } from "src/service/markdown_file_analyzer";
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