import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { WebviewMessage } from "@supernode/shared";

export interface CommunicationLogEntry {
    timestamp: string;
    direction: "extension-to-webview" | "webview-to-extension";
    command: string;
    message: any;
    fileName?: string;
    error?: string;
}

export class CommunicationLogger {
    private static logFilePath: string;
    private static isEnabled: boolean = true;
    private static maxLogSize: number = 10 * 1024 * 1024; // 10MB
    private static maxLogFiles: number = 5;

    private static initialize(): void {
        if (CommunicationLogger.logFilePath) return; // 已经初始化过了

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            throw new Error("没有找到工作区文件夹");
        }
        CommunicationLogger.logFilePath = path.join(workspaceFolders[0].uri.fsPath, `communication.log`);
    }

    /**
     * 记录从extension发送到webview的消息
     */
    public static logExtensionToWebview(message: WebviewMessage, fileName?: string): void {
        CommunicationLogger.initialize();
        if (!CommunicationLogger.isEnabled) return;

        const logEntry: CommunicationLogEntry = {
            timestamp: new Date().toISOString(),
            direction: "extension-to-webview",
            command: message.command,
            message: CommunicationLogger.sanitizeMessage(message),
            fileName: fileName
        };

        CommunicationLogger.writeLogEntry(logEntry);
        console.log(`[通信日志] Extension → Webview: ${message.command}`, message);
    }

    /**
     * 记录从webview发送到extension的消息
     */
    public static logWebviewToExtension(message: WebviewMessage, fileName?: string): void {
        CommunicationLogger.initialize();
        if (!CommunicationLogger.isEnabled) return;

        const logEntry: CommunicationLogEntry = {
            timestamp: new Date().toISOString(),
            direction: "webview-to-extension",
            command: message.command,
            message: CommunicationLogger.sanitizeMessage(message),
            fileName: fileName
        };

        CommunicationLogger.writeLogEntry(logEntry);
        console.log(`[通信日志] Webview → Extension: ${message.command}`, message);
    }

    /**
     * 记录通信错误
     */
    public static logError(direction: "extension-to-webview" | "webview-to-extension", error: string, command?: string): void {
        CommunicationLogger.initialize();
        if (!CommunicationLogger.isEnabled) return;

        const logEntry: CommunicationLogEntry = {
            timestamp: new Date().toISOString(),
            direction: direction,
            command: command || "unknown",
            message: {},
            error: error
        };

        CommunicationLogger.writeLogEntry(logEntry);
        console.error(`[通信日志] 错误 (${direction}): ${error}`);
    }

    /**
     * 写入日志条目到文件
     */
    private static writeLogEntry(logEntry: CommunicationLogEntry): void {
        try {
            // 检查日志文件大小
            CommunicationLogger.checkLogFileSize();

            const logLine = JSON.stringify(logEntry) + "\n";
            fs.appendFileSync(CommunicationLogger.logFilePath, logLine, "utf8");
        } catch (error) {
            // 如果写入失败，只在控制台输出错误，不影响扩展运行
            console.warn("写入通信日志失败，但扩展继续运行:", error);
            // 可以选择禁用日志记录以避免持续错误
            if (error && typeof error === 'object' && 'code' in error) {
                const errorCode = (error as any).code;
                if (errorCode === 'EROFS' || errorCode === 'EACCES') {
                    console.warn("由于文件系统权限问题，通信日志记录已禁用");
                    CommunicationLogger.isEnabled = false;
                }
            }
        }
    }

    /**
     * 检查并管理日志文件大小
     */
    private static checkLogFileSize(): void {
        try {
            if (fs.existsSync(CommunicationLogger.logFilePath)) {
                const stats = fs.statSync(CommunicationLogger.logFilePath);
                if (stats.size > CommunicationLogger.maxLogSize) {
                    CommunicationLogger.rotateLogFiles();
                }
            }
        } catch (error) {
            console.warn("检查日志文件大小失败:", error);
        }
    }

    /**
     * 轮转日志文件
     */
    private static rotateLogFiles(): void {
        try {
            const logDir = path.dirname(CommunicationLogger.logFilePath);
            const baseName = path.basename(CommunicationLogger.logFilePath, ".log");

            // 删除最旧的日志文件
            const oldestLogFile = path.join(logDir, `${baseName}.${CommunicationLogger.maxLogFiles}.log`);
            if (fs.existsSync(oldestLogFile)) {
                fs.unlinkSync(oldestLogFile);
            }

            // 重命名现有的日志文件
            for (let i = CommunicationLogger.maxLogFiles - 1; i >= 1; i--) {
                const oldFile = path.join(logDir, `${baseName}.${i}.log`);
                const newFile = path.join(logDir, `${baseName}.${i + 1}.log`);
                if (fs.existsSync(oldFile)) {
                    fs.renameSync(oldFile, newFile);
                }
            }

            // 重命名当前日志文件
            const backupFile = path.join(logDir, `${baseName}.1.log`);
            fs.renameSync(CommunicationLogger.logFilePath, backupFile);
        } catch (error) {
            console.warn("轮转日志文件失败:", error);
        }
    }

    /**
     * 清理消息内容，移除敏感信息
     */
    private static sanitizeMessage(message: any): any {
        const sanitized = { ...message };

        // 移除可能包含大量内容或敏感信息的字段
        if (sanitized.content && typeof sanitized.content === "string") {
            if (sanitized.content.length > 200) {
                sanitized.content = sanitized.content.substring(0, 200) + "... [截断]";
            }
        }

        return sanitized;
    }

    /**
     * 启用或禁用日志记录
     */
    public static setEnabled(enabled: boolean): void {
        CommunicationLogger.isEnabled = enabled;
        console.log(`[通信日志] 日志记录已${enabled ? "启用" : "禁用"}`);
    }

    /**
     * 获取日志文件路径
     */
    public static getLogFilePath(): string {
        CommunicationLogger.initialize();
        return CommunicationLogger.logFilePath;
    }

    /**
     * 清空日志文件
     */
    public static clearLogs(): void {
        try {
            CommunicationLogger.initialize();
            if (fs.existsSync(CommunicationLogger.logFilePath)) {
                fs.writeFileSync(CommunicationLogger.logFilePath, "", "utf8");
                console.log("[通信日志] 日志文件已清空");
            }
        } catch (error) {
            console.warn("清空日志文件失败:", error);
        }
    }

    /**
     * 获取最近的日志条目
     */
    public static getRecentLogs(limit: number = 100): CommunicationLogEntry[] {
        try {
            CommunicationLogger.initialize();
            if (!fs.existsSync(CommunicationLogger.logFilePath)) {
                return [];
            }

            const content = fs.readFileSync(CommunicationLogger.logFilePath, "utf8");
            const lines = content.trim().split("\n").filter(line => line.trim());
            const logs: CommunicationLogEntry[] = [];

            for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
                try {
                    const logEntry = JSON.parse(lines[i]);
                    logs.push(logEntry);
                } catch (error) {
                    console.warn("解析日志条目失败:", error);
                }
            }

            return logs;
        } catch (error) {
            console.warn("读取日志文件失败:", error);
            return [];
        }
    }
} 