import * as vscode from "vscode";
import { ConfigurationManager } from "../managers/ConfigurationManager";
import { FileManager } from "../managers/FileManager";
import { MarkdownWebviewProvider } from "../providers/MarkdownWebviewProvider";

export class AutoPreviewService {
    private static instance: AutoPreviewService;
    private configManager: ConfigurationManager;
    private fileManager: FileManager;

    private constructor() {
        this.configManager = ConfigurationManager.getInstance();
        this.fileManager = FileManager.getInstance();
    }

    public static getInstance(): AutoPreviewService {
        if (!AutoPreviewService.instance) {
            AutoPreviewService.instance = new AutoPreviewService();
        }
        return AutoPreviewService.instance;
    }

    /**
     * 启动自动预览服务
     */
    public start(): void {
        const autoOpenPreview = this.configManager.getAutoOpenPreview();

        if (autoOpenPreview) {
            console.log("准备自动开启预览面板...");
            this.openPreviewWithSmartLogic();
        }
    }

    /**
     * 智能开启预览逻辑
     */
    private openPreviewWithSmartLogic(): void {
        const openPreview = () => {
            try {
                MarkdownWebviewProvider.createOrShow();
                console.log("预览面板创建成功");
            } catch (error) {
                console.error("创建预览面板时出错:", error);
            }
        };

        // 方法1: 如果当前有 Markdown 文件打开，立即创建
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && this.fileManager.isMarkdownFile(activeEditor.document)) {
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