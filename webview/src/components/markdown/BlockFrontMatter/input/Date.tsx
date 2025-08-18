import React from "react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

// 不要有清除（叉）按钮
const DateInput: React.FC<{
    value: string;
    isEditing: boolean;
    onValueChange: (newValue: string) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, onValueChange, onEditEnd }) => {
    return (
        <DatePicker
            value={dayjs(value)}
            allowClear={false}
            onChange={(date) => {
                onValueChange(date ? date.format('YYYY-MM-DD') : '');
                onEditEnd();
            }}
            onBlur={onEditEnd}
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

export default DateInput;