import React from "react";
import { Tag, Switch } from "antd";

// 布尔类型输入组件
const BooleanInput: React.FC<{
    value: boolean;
    isEditing: boolean;
    onValueChange: (newValue: boolean) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    if (isEditing) {
        return (
            <Switch
                checked={value}
                onChange={(checked) => {
                    onValueChange(checked);
                    onEditEnd();
                }}
                autoFocus
            />
        );
    }

    return (
        <div
            className="cursor-pointer hover:bg-[#1e1e1e] rounded px-1 py-1"
            onClick={onEditStart}
        >
            <Tag color={value ? 'green' : 'red'}>
                {value ? '是' : '否'}
            </Tag>
        </div>
    );
};

export default BooleanInput;