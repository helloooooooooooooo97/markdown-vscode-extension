import React, { useState } from "react";
import { Tag, Select } from "antd";

// 数组类型输入组件
const ArrayInput: React.FC<{
    value: any[];
    isEditing: boolean;
    onValueChange: (newValue: any[]) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    const [inputValue, setInputValue] = useState<string>('');

    if (isEditing) {
        return (
            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="输入或选择数组项"
                value={Array.isArray(value) ? value : []}
                onChange={(newValue) => {
                    onValueChange(newValue);
                }}
                onBlur={onEditEnd}
                onDropdownVisibleChange={(open) => {
                    if (!open) {
                        onEditEnd();
                    }
                }}
                autoFocus
                allowClear
                showSearch
                filterOption={(input, option) => {
                    return String(option?.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onInputKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                        e.preventDefault();
                        const newArray = [...(Array.isArray(value) ? value : []), inputValue.trim()];
                        onValueChange(newArray);
                        setInputValue('');
                    }
                }}
                popupRender={(menu) => (
                    <div>
                        {menu}
                        <div style={{ padding: '8px', borderTop: '1px solid #d9d9d9' }}>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                按 Enter 键添加新项
                            </div>
                        </div>
                    </div>
                )}
            >
            </Select>
        );
    }

    return (
        <div
            className="flex flex-wrap cursor-pointer hover:bg-[#1e1e1e] rounded px-1 py-1"
            onClick={onEditStart}
        >
            {Array.isArray(value) && value.map((item: any, index: number) => (
                <Tag key={index} color="purple">
                    {String(item)}
                </Tag>
            ))}
        </div>
    );
};

export default ArrayInput;