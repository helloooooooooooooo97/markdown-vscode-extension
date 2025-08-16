import * as vscode from "vscode";

export class ConfigurationManager {
    private static instance: ConfigurationManager;
    private readonly configSection = 'supernode';

    private constructor() { }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager.instance) {
            ConfigurationManager.instance = new ConfigurationManager();
        }
        return ConfigurationManager.instance;
    }

    /**
     * 获取自动开启预览配置
     */
    public getAutoOpenPreview(): boolean {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get<boolean>('autoOpenPreview', true);
    }

    /**
     * 获取预览位置配置
     */
    public getPreviewPosition(): string {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get<string>('previewPosition', 'beside');
    }

    /**
     * 设置自动开启预览配置
     */
    public setAutoOpenPreview(value: boolean): Thenable<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.update('autoOpenPreview', value, vscode.ConfigurationTarget.Global);
    }

    /**
     * 设置预览位置配置
     */
    public setPreviewPosition(value: string): Thenable<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.update('previewPosition', value, vscode.ConfigurationTarget.Global);
    }
} 