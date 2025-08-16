import React from "react";
import { Tag, Input } from "antd";
const { TextArea } = Input;

// 数组类型输入组件
const ArrayInput: React.FC<{
    value: any[];
    isEditing: boolean;
    onValueChange: (newValue: any[]) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    if (isEditing) {
        return (
            <TextArea
                value={Array.isArray(value) ? value.join(', ') : ''}
                onChange={(e) => {
                    const newValue = e.target.value.split(',').map((item: string) => item.trim()).filter((item: string) => item);
                    onValueChange(newValue);
                }}
                onBlur={onEditEnd}
                onPressEnter={onEditEnd}
                placeholder="输入数组项，用逗号分隔"
                autoSize={{ minRows: 2, maxRows: 4 }}
                autoFocus
            />
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