import * as vscode from "vscode";

export class ConfigurationManager {
    private static readonly configSection = 'supernode';

    /**
     * 获取自动开启预览配置
     */
    public static getAutoOpenPreview(): boolean {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.configSection);
        return config.get<boolean>('autoOpenPreview', true);
    }

    /**
     * 获取预览位置配置
     */
    public static getPreviewPosition(): string {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.configSection);
        return config.get<string>('previewPosition', 'beside');
    }

    /**
     * 设置自动开启预览配置
     */
    public static setAutoOpenPreview(value: boolean): Thenable<void> {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.configSection);
        return config.update('autoOpenPreview', value, vscode.ConfigurationTarget.Global);
    }

    /**
     * 设置预览位置配置
     */
    public static setPreviewPosition(value: string): Thenable<void> {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.configSection);
        return config.update('previewPosition', value, vscode.ConfigurationTarget.Global);
    }
} 