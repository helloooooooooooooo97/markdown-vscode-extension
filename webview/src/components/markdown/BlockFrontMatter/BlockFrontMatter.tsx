import {
    UnorderedListOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    FileTextOutlined,
    NumberOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ArrayInput, BooleanInput, DateInput, NumberInput, ObjectInput, StringInput } from './input';
import { Typography } from 'antd';
const { Text } = Typography;

// 数据类型枚举
enum DataType {
    ARRAY = 'array',
    BOOLEAN = 'boolean',
    DATE = 'date',
    STRING = 'string',
    NUMBER = 'number',
    OBJECT = 'object'
}

// 获取数据类型
export const getDataType = (value: any): DataType => {
    if (Array.isArray(value)) return DataType.ARRAY;
    if (typeof value === 'boolean') return DataType.BOOLEAN;
    if (typeof value === 'number') return DataType.NUMBER;
    if (typeof value === 'string') {
        // 检查是否为日期格式
        if (dayjs(value).isValid() && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            return DataType.DATE;
        }
        return DataType.STRING;
    }
    if (typeof value === 'object' && value !== null) return DataType.OBJECT;
    return DataType.STRING;
};

// 根据数据类型获取图标
export const getTypeIcon = (type: DataType) => {
    const iconMap = {
        [DataType.ARRAY]: <UnorderedListOutlined />,
        [DataType.BOOLEAN]: <CheckCircleOutlined />,
        [DataType.DATE]: <CalendarOutlined />,
        [DataType.STRING]: <FileTextOutlined />,
        [DataType.NUMBER]: <NumberOutlined />,
        [DataType.OBJECT]: <FileTextOutlined />
    };
    return iconMap[type];
};

// 渲染属性值 - 根据数据类型选择对应的输入组件
export const renderPropertyValue = (
    value: any,
    isEditing: boolean,
    onValueChange: (newValue: any) => void,
    onEditStart: () => void,
    onEditEnd: () => void
) => {
    const dataType = getDataType(value);

    switch (dataType) {
        case DataType.ARRAY:
            return (
                <ArrayInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        case DataType.BOOLEAN:
            return (
                <BooleanInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        case DataType.DATE:
            return (
                <DateInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        case DataType.NUMBER:
            return (
                <NumberInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        case DataType.STRING:
            return (
                <StringInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        case DataType.OBJECT:
            return (
                <ObjectInput
                    value={value}
                    isEditing={isEditing}
                    onValueChange={onValueChange}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                />
            );

        default:
            return (
                <Text
                    className="cursor-pointer hover:bg-[#1e1e1e] rounded px-1 py-1"
                    onClick={onEditStart}
                >
                    {String(value)}
                </Text>
            );
    }
};