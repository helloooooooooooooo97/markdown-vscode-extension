import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from 'antd';
import { VSCodeAPI } from '../../communication/send/manual_vscode';
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExtensionCommand, joinPath } from '@supernode/shared';
import useMarkdownStore from '../../store/markdown/store';

interface BlockExcalidrawProps {
    refer: string;
    blockId: string;
}

const BlockExcalidraw: React.FC<BlockExcalidrawProps> = ({ refer }) => {
    const [excalidrawData, setExcalidrawData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { filePath } = useMarkdownStore();

    const absPath = useMemo(() => {
        return joinPath(filePath, refer);
    }, [refer, filePath]);

    useEffect(() => {
        loadExcalidrawData(absPath);
    }, [absPath]);

    // 加载 Excalidraw 数据
    const loadExcalidrawData = async (filePath: string) => {
        const vscode = VSCodeAPI.getInstance();
        if (!vscode) {
            console.error('VSCode API 未初始化');
            setLoading(false);
            return;
        }
        let messageHandler: ((event: MessageEvent) => void) | null = null;

        try {
            // 发送读取文件内容的请求
            VSCodeAPI.readFileContent(filePath);

            // 监听文件内容响应
            messageHandler = (event: MessageEvent) => {
                if (event.data.command === ExtensionCommand.readFileContentResponse && event.data.filePath === absPath) {
                    // 清理事件监听器
                    if (messageHandler) {
                        window.removeEventListener('message', messageHandler);
                    }

                    if (!event.data.success) {
                        console.error('读取文件失败:', event.data.error);
                        setLoading(false);
                        return;
                    }

                    try {
                        const content = event.data.content;
                        const excalidrawData = parseExcalidrawContent(content);
                        setExcalidrawData(excalidrawData);
                        setLoading(false);
                    } catch (error) {
                        console.error('处理 Excalidraw 数据失败:', error);
                        setLoading(false);
                    }
                }
            };
            window.addEventListener('message', messageHandler);
        } catch (error) {
            console.error('加载 Excalidraw 数据失败:', error);
            setLoading(false);
        }
    };

    // 解析 Excalidraw 内容
    const parseExcalidrawContent = (content: string) => {
        try {
            const parsed = JSON.parse(content);
            // 确保只保留必要的属性
            return {
                type: parsed.type || "excalidraw",
                version: parsed.version || 2,
                source: parsed.source || "https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor",
                elements: parsed.elements || [],
                appState: {
                    viewBackgroundColor: parsed.appState?.viewBackgroundColor || "#ffffff",
                    gridSize: parsed.appState?.gridSize || 20,
                    gridStep: parsed.appState?.gridStep || 5,
                    gridModeEnabled: parsed.appState?.gridModeEnabled || true
                },
                files: parsed.files || {}
            };
        } catch (parseError) {
            console.warn('文件内容不是有效的 JSON 格式，尝试作为文本处理');
            return {
                type: "excalidraw",
                version: 2,
                source: "https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor",
                elements: [],
                appState: {
                    viewBackgroundColor: "#ffffff",
                    gridSize: 20,
                    gridStep: 5,
                    gridModeEnabled: true
                },
                files: {}
            };
        }
    };

    // 保存 Excalidraw 数据到文件
    const saveExcalidrawData = useCallback(async (data: any) => {
        if (saving || loading) return;

        setSaving(true);
        const vscode = VSCodeAPI.getInstance();
        if (!vscode) {
            console.error('VSCode API 未初始化');
            setSaving(false);
            return;
        }

        try {
            // 准备要保存的数据
            const saveData = {
                type: "excalidraw",
                version: 2,
                source: "https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor",
                elements: data.elements || [],
                appState: {
                    viewBackgroundColor: data.appState?.viewBackgroundColor || "#ffffff",
                    gridSize: data.appState?.gridSize || 20,
                    gridStep: data.appState?.gridStep || 5,
                    gridModeEnabled: data.appState?.gridModeEnabled || true
                },
                files: data.files || {}
            };

            // 发送写入文件内容的请求
            VSCodeAPI.writeFileContent(absPath, JSON.stringify(saveData, null, 2));

            // 监听写入响应
            const handleMessage = (event: MessageEvent) => {
                if (event.data.command === ExtensionCommand.writeFileContentResponse && event.data.filePath === absPath) {
                    window.removeEventListener('message', handleMessage);

                    if (event.data.success) {
                        console.log('Excalidraw 数据保存成功');
                        setExcalidrawData(saveData);
                    } else {
                        console.error('保存 Excalidraw 数据失败:', event.data.error);
                    }
                    setSaving(false);
                }
            };

            window.addEventListener('message', handleMessage);

            // 设置超时
            setTimeout(() => {
                window.removeEventListener('message', handleMessage);
                setSaving(false);
            }, 5000);

        } catch (error) {
            console.error('保存 Excalidraw 数据失败:', error);
            setSaving(false);
        }
    }, [absPath, saving, loading]);

    // 处理 Excalidraw 数据变化
    const handleExcalidrawChange = useCallback((elements: any[], appState: any, files: any) => {
        if (loading) return;

        const newData = {
            elements,
            appState,
            files
        };

        // 防抖保存，避免频繁写入
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveExcalidrawData(newData);
        }, 1000); // 1秒防抖
    }, [loading, saveExcalidrawData]);

    // 防抖定时器引用
    const saveTimeoutRef = useMemo(() => ({ current: null as number | null }), []);

    return (
        <Card
            size="small"
            className="mb-4"
            title={
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📊 Excalidraw 图表</span>
                    <span className="text-xs text-gray-500">({refer})</span>
                </div>
            }
        >
            <div className="min-h-[400px] border border-gray-200 rounded-md overflow-hidden relative">
                <div style={{ height: '600px' }}>
                    {loading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">正在加载...</div>}
                    {saving && <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">保存中...</div>}
                    {
                        loading ? (<div>正在加载中</div>
                        ) : (
                            <Excalidraw
                                key={`excalidraw-${absPath}`}
                                initialData={{
                                    elements: excalidrawData.elements as any,
                                    appState: excalidrawData.appState,
                                    files: excalidrawData.files
                                }}
                                onChange={(elements, appState, files) => {
                                    handleExcalidrawChange([...elements], appState, files);
                                }}
                            />
                        )
                    }
                </div>
            </div>
        </Card>
    );
};

export default BlockExcalidraw;