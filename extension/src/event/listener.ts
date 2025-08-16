import * as vscode from "vscode";
import { EventController } from "../controller/listener";

export class EventListeners {
    private static disposables: vscode.Disposable[] = [];
    private static eventController: EventController;

    /**
     * 注册所有事件监听器
     */
    public static registerAllListeners(context: vscode.ExtensionContext, eventController?: EventController): vscode.Disposable[] {
        // 如果传入了 eventController，使用它；否则创建新的
        if (eventController) {
            EventListeners.eventController = eventController;
        } else {
            EventListeners.eventController = new EventController(context);
        }

        const disposables: vscode.Disposable[] = [];

        // 注册文件选择变化监听器
        const fileChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
            EventListeners.eventController.handleFileChange(editor);
        });

        // 注册文档内容变化监听器
        const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
            EventListeners.eventController.handleDocumentChange(event);
        });

        disposables.push(fileChangeDisposable, documentChangeDisposable);
        EventListeners.disposables.push(...disposables);

        return disposables;
    }

    /**
     * 清理所有监听器
     */
    public static dispose(): void {
        EventListeners.disposables.forEach(disposable => disposable.dispose());
        EventListeners.disposables = [];
        if (EventListeners.eventController) {
            EventListeners.eventController.dispose();
        }
    }
} 