import React, { useState, useEffect } from "react";
import { getDataType, getTypeIcon, renderInputComponentByValueType } from "./BlockFrontMatter";
import useMarkdownStore from "../../../store/markdown/store";
import matter from "gray-matter";

// Frontmatter 组件 - 根据数据类型展示
export const FrontmatterComponent: React.FC<{
    data: Record<string, any>;
    blockId: string;
}> = ({ data, blockId }) => {
    // 编辑状态管理
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Record<string, any>>(data);
    const store = useMarkdownStore();

    // 监听 editingData 的变化
    useEffect(() => {
        console.log('editingData 已更新:', editingData);

        // 使用 gray-matter 将 JSON 转换为 frontmatter 字符串
        const frontmatterString = matter.stringify('', editingData);
        console.log('生成的 frontmatter 字符串:', frontmatterString);

        // 按行分割 frontmatter 字符串
        const frontmatterLines = frontmatterString.split('\n');
        console.log('按行分割后的 frontmatter:', frontmatterLines);

        // 更新 store
        store.updateBlock(blockId, frontmatterLines);
    }, [editingData]);

    // 开始编辑
    const handleEditStart = (key: string) => {
        setEditingKey(key);
    };

    // 结束编辑
    const handleEditEnd = () => {
        setEditingKey(null);
    };

    // 处理值变化
    const handleValueChange = (key: string, newValue: any) => {
        setEditingData(prev => ({
            ...prev,
            [key]: newValue
        }));

        // 这里可以添加保存到后端的逻辑
        console.log(`更新 ${key}:`, newValue);
    };

    return (
        <div className="flex flex-col gap-2">
            {Object.entries(editingData).map(([key, value]) => {
                const dataType = getDataType(value);
                const isEditing = editingKey === key;
                return (
                    <div
                        key={key}
                        className="flex gap-20 hover:bg-[#252526] rounded-md px-2 cursor-pointer"
                    >
                        <div className="w-20 flex items-center gap-2 text-[#838383] font-semibold">
                            {/* 图标 */}
                            <div>
                                {getTypeIcon(dataType)}
                            </div>
                            {/* 显示键 */}
                            <div>
                                {key}
                            </div>
                        </div>
                        {/* 值展示/编辑区域 */}
                        {renderInputComponentByValueType(
                            value,
                            isEditing,
                            (newValue) => handleValueChange(key, newValue),
                            () => handleEditStart(key),
                            handleEditEnd
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default FrontmatterComponent;