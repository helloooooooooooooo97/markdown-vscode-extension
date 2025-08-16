import React from "react";
import { Input, Typography } from "antd";
const { Text } = Typography;
const { TextArea } = Input;

// 字符串类型输入组件
const StringInput: React.FC<{
    value: string;
    isEditing: boolean;
    onValueChange: (newValue: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    if (isEditing) {
        return (
            <TextArea
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onBlur={onEditEnd}
                onPressEnter={onEditEnd}
                autoSize={{ minRows: 1, maxRows: 3 }}
                className="px-1"
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

export default StringInput;