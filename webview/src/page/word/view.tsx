import React, { useMemo, useState, useEffect } from "react";
import { useMarkdownStore } from "../../store/markdown/store";
import { renderBlockView } from "../../components/markdown/BlockViewParser";
import { BlockType } from "../../store/markdown/type";
import { Input, Select, Space, Button, Tooltip } from "antd";
import { SearchOutlined, CloseOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import * as yaml from "js-yaml";

const MarkdownRenderer: React.FC = () => {
    const { filePath, blocks } = useMarkdownStore();
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState<string>("all");
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

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

    // 处理折叠逻辑
    const processCollapsedContent = (view: Array<{ block: any; element: React.ReactNode }>) => {
        const result: Array<{ block: any; element: React.ReactNode; isCollapsed?: boolean }> = [];
        let shouldSkip = false;
        let skipUntilLevel = 0;

        for (const item of view) {
            const block = item.block;

            // 检查是否是标题块（H1-H6）
            if (block.type === BlockType.Heading) {
                const headingText = block.lines?.join(' ') || '';
                const headingLevel = headingText.match(/^#{1,6}/)?.[0]?.length || 0;

                // 检查当前标题是否被折叠
                const isCollapsed = collapsedSections.has(headingText);

                if (isCollapsed) {
                    // 开始跳过内容，直到遇到同级或更高级的标题
                    shouldSkip = true;
                    skipUntilLevel = headingLevel;
                    result.push({ ...item, isCollapsed: true });
                } else if (shouldSkip && headingLevel <= skipUntilLevel) {
                    // 遇到同级或更高级的标题，停止跳过
                    shouldSkip = false;
                    result.push({ ...item, isCollapsed: false });
                } else if (shouldSkip) {
                    // 仍在跳过范围内，跳过这个标题
                    continue;
                } else {
                    // 正常显示
                    result.push({ ...item, isCollapsed: false });
                }
            } else {
                // 非标题块
                if (shouldSkip) {
                    // 跳过被折叠的内容
                    continue;
                } else {
                    result.push(item);
                }
            }
        }

        return result;
    };

    const filteredMarkdown = useMemo(() => {
        const filteredBlocks = blocks.filter(block => block.type !== BlockType.Divider);
        const view = filteredBlocks.map(block => ({ block, element: renderBlockView(block) }));

        let filteredView = view;
        if (!searchText && searchType === "all") {
            filteredView = view;
        } else {
            filteredView = view.filter(({ block }) => {
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
        }

        // 应用折叠逻辑
        return processCollapsedContent(filteredView);
    }, [blocks, searchText, searchType, collapsedSections]);

    // 处理折叠/展开
    const handleToggleCollapse = (sectionTitle: string) => {
        const newCollapsedSections = new Set(collapsedSections);
        if (newCollapsedSections.has(sectionTitle)) {
            newCollapsedSections.delete(sectionTitle);
        } else {
            newCollapsedSections.add(sectionTitle);
        }
        setCollapsedSections(newCollapsedSections);
    };

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
            <div className="p-6 pl-16 relative z-10">
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
                {filteredMarkdown.map(({ block, element }) => {
                    // 检查是否是标题块（H1-H6）
                    const isHeading = block.type === BlockType.Heading;

                    if (isHeading) {
                        const headingText = block.lines?.join(' ') || '';
                        const headingLevel = headingText.match(/^#{1,6}/)?.[0]?.length || 1;
                        const isCollapsedSection = collapsedSections.has(headingText);

                        // 根据标题级别调整按钮位置
                        const leftOffset = -40;
                        return (
                            <div key={block.id} className="relative">
                                {/* 悬浮折叠按钮 */}
                                <div
                                    className="absolute top-2 z-10"
                                    style={{ left: `${leftOffset}px` }}
                                >
                                    <Tooltip title={isCollapsedSection ? "展开" : "折叠"}>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={isCollapsedSection ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                            onClick={() => handleToggleCollapse(headingText)}
                                            className={
                                                isCollapsedSection
                                                    ? "opacity-100"
                                                    : "opacity-0 hover:opacity-100 transition-opacity duration-200"
                                            }
                                            style={{
                                                color: '#D4D4D4',
                                                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                                                border: '1px solid #404040',
                                                fontSize: Math.max(10, 14 - headingLevel) + 'px'
                                            }}
                                        />
                                    </Tooltip>
                                </div>
                                {element}
                            </div>
                        );
                    }

                    return (
                        <React.Fragment key={block.id}>
                            {element}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default MarkdownRenderer;