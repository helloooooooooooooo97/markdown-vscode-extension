import React, { useState } from 'react';
import { Tag, Typography, Space, Card, Input, DatePicker, Switch } from 'antd';
import {
    UnorderedListOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    FileTextOutlined,
    NumberOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useMarkdownStore from '../../store/markdown/store';

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
    blockId: string;
    data: Record<string, any>;
}> = ({ blockId, data }) => {
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Record<string, any>>({});
    const { updateBlock } = useMarkdownStore();

    // 更新编辑中的值
    const updateEditingValue = (key: string, value: any) => {
        setEditingData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card
            size="small"
        >
            <div className='border-b bg-blue-200 pb-2'>  21312</div>
            {Object.entries(data).map(([key, value]) => {
                const dataType = getDataType(value);
                const isEditing = editingKey === key;

                return (
                    <div key={key} style={{
                        display: 'flex',
                        alignItems: 'flex-between',
                        gap: '12px',
                    }}>
                        {/* 图标 */}
                        <div style={{
                            color: '#8c8c8c',
                            fontSize: '16px',
                            minWidth: '20px',
                            marginTop: '2px'
                        }}>
                            {getTypeIcon(dataType)}
                        </div>
                        {/* 值展示/编辑区域 */}
                        {renderPropertyValue(key, value, isEditing, (newValue) =>
                            updateEditingValue(key, newValue)
                        )}
                    </div>
                );
            })}
        </Card>
    );
};

export default FrontmatterComponent;