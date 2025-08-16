import React from "react";
import { Input, Typography } from "antd";
const { Text } = Typography;

// 数字类型输入组件
const NumberInput: React.FC<{
    value: number;
    isEditing: boolean;
    onValueChange: (newValue: number) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    if (isEditing) {
        return (
            <Input
                type="number"
                value={value}
                onChange={(e) => onValueChange(Number(e.target.value))}
                onBlur={onEditEnd}
                onPressEnter={onEditEnd}
                autoFocus
            />
        );
    }

    return (
        <Text
            className="cursor-pointer hover:bg-[#1e1e1e] rounded px-1 py-1"
            onClick={onEditStart}
        >
            {value}
        </Text>
    );
};

export default NumberInput;