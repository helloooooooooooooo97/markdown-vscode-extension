import React, { useState } from "react";
import { getDataType, getTypeIcon, renderPropertyValue } from "./BlockFrontMatter";

// Frontmatter 组件 - 根据数据类型展示
export const FrontmatterComponent: React.FC<{
    data: Record<string, any>;
    blockId: string;
}> = ({ data }) => {
    // 编辑状态管理
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Record<string, any>>(data);

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
                        {renderPropertyValue(
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