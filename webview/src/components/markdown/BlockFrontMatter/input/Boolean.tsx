import React from "react";
import { Checkbox } from "antd";

// 布尔类型输入组件（使用可勾选的方框）
const BooleanInput: React.FC<{
    value: boolean;
    isEditing: boolean;
    onValueChange: (newValue: boolean) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, onValueChange, onEditStart, onEditEnd }) => {
    return (
        <Checkbox
            checked={value}
            onClick={onEditStart}
            onChange={(e) => {
                onValueChange(e.target.checked);
                onEditEnd();
            }}
            className="cursor-pointer px-1 border-none outline-none bg-transparent resize-none"
            style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default BooleanInput;