import React from 'react';
import { Tag, Typography, Space, Input, DatePicker, Switch } from 'antd';
import {
    UnorderedListOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    FileTextOutlined,
    NumberOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;
const { TextArea } = Input;

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
const getDataType = (value: any): DataType => {
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
const getTypeIcon = (type: DataType) => {
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

// 渲染属性值
const renderPropertyValue = (
    _key: string,
    value: any,
    isEditing: boolean,
    onValueChange: (newValue: any) => void
) => {
    const dataType = getDataType(value);

    if (isEditing) {
        switch (dataType) {
            case DataType.ARRAY:
                return (
                    <TextArea
                        value={Array.isArray(value) ? value.join(', ') : ''}
                        onChange={(e) => {
                            const newValue = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                            onValueChange(newValue);
                        }}
                        placeholder="输入数组项，用逗号分隔"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                );

            case DataType.BOOLEAN:
                return (
                    <Switch
                        checked={value}
                        onChange={onValueChange}
                    />
                );

            case DataType.DATE:
                return (
                    <DatePicker
                        value={dayjs(value)}
                        onChange={(date) => onValueChange(date ? date.format('YYYY-MM-DD') : '')}
                        style={{ width: '100%' }}
                    />
                );

            case DataType.NUMBER:
                return (
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => onValueChange(Number(e.target.value))}
                    />
                );

            case DataType.STRING:
                return (
                    <TextArea
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        autoSize={{ minRows: 1, maxRows: 3 }}
                    />
                );

            case DataType.OBJECT:
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
                        autoSize={{ minRows: 3, maxRows: 6 }}
                        placeholder="输入有效的JSON格式"
                    />
                );

            default:
                return <Text>{String(value)}</Text>;
        }
    } else {
        // 非编辑状态
        switch (dataType) {
            case DataType.ARRAY:
                return (
                    <Space wrap>
                        {Array.isArray(value) && value.map((item, index) => (
                            <Tag key={index} color="blue">
                                {String(item)}
                            </Tag>
                        ))}
                    </Space>
                );

            case DataType.BOOLEAN:
                return (
                    <Tag color={value ? 'green' : 'red'}>
                        {value ? '是' : '否'}
                    </Tag>
                );

            case DataType.DATE:
                return <Text type="secondary">{value}</Text>;

            case DataType.NUMBER:
                return <Text>{value}</Text>;

            case DataType.STRING:
                return <Text>{value}</Text>;

            case DataType.OBJECT:
                return <Text code>{JSON.stringify(value)}</Text>;

            default:
                return <Text>{String(value)}</Text>;
        }
    }
};

// Frontmatter 组件 - 根据数据类型展示
export const FrontmatterComponent: React.FC<{
    data: Record<string, any>;
    blockId: string;
}> = ({ data }) => {

    return (
        <div className="bg-zinc-900 rounded-md p-4 border border-zinc-700">
            {Object.entries(data).map(([key, value]) => {
                const dataType = getDataType(value);

                return (
                    <div
                        key={key}
                        className="flex items-center gap-3 last:mb-0"
                    >
                        {/* 图标 */}
                        <div className="text-zinc-400 text-base min-w-[20px] mt-[2px]">
                            {getTypeIcon(dataType)}
                        </div>
                        {/* 值展示/编辑区域 */}
                        {renderPropertyValue(key, value, false, () => { })}
                    </div>
                );
            })}
        </div>
    );
};

export default FrontmatterComponent;