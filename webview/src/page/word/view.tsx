import React, { useMemo, useState, useEffect } from "react";
import { useMarkdownStore } from "../../store/markdown/store";
import { renderBlockView } from "../../components/markdown/BlockViewParser";
import { BlockType } from "../../store/markdown/type";
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import * as yaml from "js-yaml";

const MarkdownRenderer: React.FC = () => {
    const { filePath, blocks } = useMarkdownStore();
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState<string>("all");

    // 获取header背景设置
    const headerBackground = useMemo(() => {
        const frontmatterBlock = blocks.find(block => block.type === BlockType.FrontMatter);
        if (frontmatterBlock && frontmatterBlock.lines) {
            try {
                // 提取 frontmatter 内容（去掉开头的 --- 和结尾的 ---）
                const lines = frontmatterBlock.lines;
                if (lines.length >= 3 && lines[0].trim() === "---" && lines[lines.length - 1].trim() === "---") {
                    const yamlContent = lines.slice(1, -1).join("\n");
                    const parsedData = yaml.load(yamlContent) as Record<string, any>;
                    return parsedData?.headerBackground || { type: 'color', value: '#1e1e1e', opacity: 0.8 };
                }
            } catch (error) {
                console.error("解析header背景设置失败:", error);
            }
        }
        return { type: 'color', value: '#1e1e1e', opacity: 0.8 };
    }, [blocks]);

    // 生成header背景样式
    const getHeaderBackgroundStyle = () => {
        if (headerBackground.type === 'color') {
            return {
                background: headerBackground.value,
                opacity: headerBackground.opacity || 0.8
            };
        } else if (headerBackground.type === 'image') {
            return {
                backgroundImage: `url(${headerBackground.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: headerBackground.opacity || 0.8
            };
        } else if (headerBackground.type === 'dag' || headerBackground.type === 'graph') {
            // 对于DAG/Graph背景，这里可以生成特定的背景样式
            // 这里暂时使用渐变背景作为示例
            return {
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                opacity: headerBackground.opacity || 0.8,
                position: 'relative' as const
            };
        }
        return {};
    };

    const filteredMarkdown = useMemo(() => {
        const filteredBlocks = blocks.filter(block => block.type !== BlockType.Divider);
        const view = filteredBlocks.map(block => ({ block, element: renderBlockView(block) }));
        if (!searchText && searchType === "all") {
            return view;
        }
        return view.filter(({ block }) => {
            // 按类型筛选
            if (searchType !== "all" && block.type !== searchType) {
                return false;
            }
            // 按文本筛选
            if (searchText) {
                // 从 block 的 lines 中搜索文本
                const blockLines = block.lines || [];
                const blockText = blockLines.join(' ').toLowerCase();
                return blockText.includes(searchText.toLowerCase());
            }
            return true;
        });
    }, [blocks, searchText, searchType]);

    // 键盘事件处理
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // 支持 Mac (Cmd+F) 和 Windows/Linux (Ctrl+F)
            if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                setShowSearch(true);
                return false;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            // 支持 Mac (Cmd+F) 和 Windows/Linux (Ctrl+F)
            if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }
            if (event.key === 'Escape') {
                setShowSearch(false);
            }
        };

        // 禁用浏览器默认的 Ctrl+F 行为
        const originalOnKeyDown = document.onkeydown;
        const originalOnKeyUp = document.onkeyup;

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keyup', handleKeyUp, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('keyup', handleKeyUp, true);
            document.onkeydown = originalOnKeyDown;
            document.onkeyup = originalOnKeyUp;
        };
    }, []);

    return (
        <div>
            {/* Header背景栏 */}
            <div
                className="w-full h-[260px] mb-6"
                style={getHeaderBackgroundStyle()}
            />
            <div className="p-6 relative z-10">
                {/* 搜索框 */}
                {showSearch && (
                    <div className="fixed top-4 right-4 z-10 bg-[#0E2A35] rounded-lg shadow-lg px-3 py-2">
                        <Space>
                            <Select
                                value={searchType}
                                onChange={setSearchType}
                                style={{ width: 120 }}
                                options={[
                                    { value: "all", label: "全部类型" },
                                    { value: BlockType.Paragraph, label: "段落" },
                                    { value: BlockType.Heading, label: "标题" },
                                    { value: BlockType.List, label: "列表" },
                                    { value: BlockType.Code, label: "代码" },
                                    { value: BlockType.Table, label: "表格" },
                                    { value: BlockType.Todo, label: "待办事项" },
                                    { value: BlockType.Latex, label: "LaTeX" },
                                    { value: BlockType.Excalidraw, label: "Excalidraw" },
                                    { value: BlockType.Iframe, label: "Iframe" },
                                    { value: BlockType.FrontMatter, label: "Front Matter" },
                                    { value: BlockType.Alert, label: "警告" },
                                    { value: BlockType.Divider, label: "分隔符" }
                                ]}
                            />
                            <Input
                                placeholder="搜索文本..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                prefix={<SearchOutlined />}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={() => setShowSearch(false)}
                                style={{ color: 'white' }}
                            />
                        </Space>
                    </div>
                )}

                <div className="text-4xl font-semibold pb-4 text-[#D4D4D4]">
                    {filePath ? filePath.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, "") : "欢迎使用SUPERNODE"}
                </div>
                {filteredMarkdown.map(({ block, element }) => (
                    <React.Fragment key={block.id}>
                        {element}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MarkdownRenderer;