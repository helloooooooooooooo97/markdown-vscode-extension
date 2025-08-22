import React, { useMemo, useState, useEffect } from "react";
import { useMarkdownStore } from "../../store/markdown/store";
import { renderBlockView } from "../../components/markdown/BlockViewParser";
import { BlockType } from "../../store/markdown/type";
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const MarkdownRenderer: React.FC = () => {
    const { filePath, blocks } = useMarkdownStore();
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchType, setSearchType] = useState<string>("all");
    const filteredMarkdown = useMemo(() => {
        const filteredBlocks = blocks.filter(block => block.type !== BlockType.Divider);
        const view = filteredBlocks.map(block => renderBlockView(block));
        if (!searchText && searchType === "all") {
            return view;
        }
        return view.filter((_, index) => {
            const block = blocks[index];
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
        <div className="p-6">
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
                {filePath ? filePath.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, "") : "文件名"}
            </div>
            {filteredMarkdown}
        </div>
    );
};

export default MarkdownRenderer;