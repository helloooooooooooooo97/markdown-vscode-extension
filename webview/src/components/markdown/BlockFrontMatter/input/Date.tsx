import React from "react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
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
            onChange={(date) => {
                onValueChange(date ? date.format('YYYY-MM-DD') : '');
                onEditEnd();
            }}
            onBlur={onEditEnd}
            style={{ width: '100%' }}
            autoFocus
        />
    );
};


export default DateInput;