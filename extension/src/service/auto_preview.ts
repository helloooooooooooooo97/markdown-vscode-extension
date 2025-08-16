import * as vscode from "vscode";
import { ConfigurationManager } from "./configuration";
import { FileManager } from "./file";
import { MarkdownWebviewProvider } from "../event/webview";

export class AutoPreviewService {
    public static start(): void {
        const autoOpenPreview = ConfigurationManager.getAutoOpenPreview();
        if (autoOpenPreview) {
            this.openPreviewWithSmartLogic();
        }
    }
    private static openPreviewWithSmartLogic(): void {
        const openPreview = () => {
            try {
                MarkdownWebviewProvider.createOrShow();
                console.log("预览面板创建成功");
            } catch (error) {
                console.error("创建预览面板时出错:", error);
            }
        };
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && FileManager.isMarkdownFile(activeEditor.document)) {
            console.log("检测到 Markdown 文件，立即创建预览面板");
            openPreview();
        } else {
            // 方法2: 延迟创建，等待用户操作
            setTimeout(() => {
                console.log("延迟创建预览面板...");
                openPreview();
            }, 2000);
        }
    }
} 