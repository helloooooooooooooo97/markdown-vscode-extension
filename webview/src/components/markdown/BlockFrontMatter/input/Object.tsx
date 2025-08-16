import React from 'react';
import { Typography, Input } from 'antd';
const { Text } = Typography;
const { TextArea } = Input;


// 对象类型输入组件
const ObjectInput: React.FC<{
    value: object;
    isEditing: boolean;
    onValueChange: (newValue: object) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, isEditing, onValueChange, onEditStart, onEditEnd }) => {
    if (isEditing) {
        return (
            <TextArea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                    try {
                        const parsed = JSON.parse(e.target.value);
                        onValueChange(parsed);
                    } catch {
                        // 如果解析失败，保持原值
                    }
                }}
                onBlur={onEditEnd}
                onPressEnter={onEditEnd}
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="输入有效的JSON格式"
                autoFocus
            />
        );
    }

    return (
        <Text
            code
            className="cursor-pointer hover:bg-[#1e1e1e] rounded px-1 py-1"
            onClick={onEditStart}
        >
            {JSON.stringify(value)}
        </Text>
    );
};


export default ObjectInput;