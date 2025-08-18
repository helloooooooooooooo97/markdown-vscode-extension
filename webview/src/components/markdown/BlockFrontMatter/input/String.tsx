import React from "react";
import { Input } from "antd";
const { TextArea } = Input;

// 字符串类型输入组件
const StringInput: React.FC<{
    value: string;
    isEditing: boolean;
    onValueChange: (newValue: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, onValueChange, onEditEnd }) => {
    return (
        <TextArea
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onBlur={onEditEnd}
            onPressEnter={onEditEnd}
            autoSize={{ minRows: 1, maxRows: 1 }}
            className="px-1 border-none outline-none bg-transparent resize-none"
            style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default StringInput;