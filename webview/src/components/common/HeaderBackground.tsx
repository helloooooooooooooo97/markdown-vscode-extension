import React, { useState } from 'react';
import { Select, Input, Slider, Space, Button } from 'antd';
import {
    BgColorsOutlined,
    NodeIndexOutlined,
    BranchesOutlined,
    PictureOutlined,
} from '@ant-design/icons';

interface HeaderBackgroundProps {
    value?: {
        type: 'color' | 'dag' | 'graph' | 'image';
        value: string;
        opacity?: number;
    };
    onChange?: (value: {
        type: 'color' | 'dag' | 'graph' | 'image';
        value: string;
        opacity?: number;
    }) => void;
}

// 预定义的颜色选项
const COLOR_OPTIONS = [
    { label: '深色主题', value: '#1e1e1e' },
    { label: '蓝色渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: '绿色渐变', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { label: '紫色渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { label: '橙色渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { label: '青色渐变', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { label: '自定义', value: 'custom' }
];

// 预定义的DAG/Graph背景选项
const GRAPH_OPTIONS = [
    { label: '默认DAG', value: 'default-dag' },
    { label: '网络图', value: 'network-graph' },
    { label: '树形图', value: 'tree-graph' },
    { label: '流程图', value: 'flow-graph' },
    { label: '自定义', value: 'custom-graph' }
];

// 预定义的图片背景选项
const IMAGE_OPTIONS = [
    { label: '火箭发射', value: '/images/rocket1.jpg' },
    { label: '太空星系', value: '/images/space1.jpg' },
    { label: '海洋风景', value: '/images/ocean1.jpg' },
    { label: '森林自然', value: '/images/forest1.jpg' },
    { label: '日落美景', value: '/images/sunset1.jpg' },
    { label: '抽象艺术', value: '/images/abstract1.jpg' },
    { label: '山脉风景', value: '/images/mountain1.jpg' },
    { label: '自然风光', value: '/images/nature1.jpg' }
];

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({
    value = { type: 'color', value: '#1e1e1e', opacity: 0.8 },
    onChange
}) => {
    const [customColor, setCustomColor] = useState('#1e1e1e');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleTypeChange = (type: 'color' | 'dag' | 'graph' | 'image') => {
        const newValue = {
            ...value,
            type,
            value: type === 'color' ? '#1e1e1e' : type === 'image' ? '/images/rockets/rocket1.jpg' : 'default-dag'
        };
        onChange?.(newValue);
    };

    const handleValueChange = (newValue: string) => {
        if (newValue === 'custom') {
            setShowColorPicker(true);
            return;
        }

        const updatedValue = {
            ...value,
            value: newValue
        };
        onChange?.(updatedValue);
    };

    const handleOpacityChange = (opacity: number) => {
        const updatedValue = {
            ...value,
            opacity: opacity / 100
        };
        onChange?.(updatedValue);
    };

    const handleCustomColorChange = (color: string) => {
        setCustomColor(color);
        const updatedValue = {
            ...value,
            value: color
        };
        onChange?.(updatedValue);
    };

    const renderColorPreview = () => (
        <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ background: value.type === 'color' ? value.value : 'transparent' }}
        />
    );

    const renderGraphPreview = () => (
        <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center">
            {value.type === 'dag' ? <NodeIndexOutlined /> : <BranchesOutlined />}
        </div>
    );

    const renderImagePreview = () => (
        <div
            className="w-6 h-6 rounded border border-gray-300 bg-cover bg-center"
            style={{ backgroundImage: `url(${value.value})` }}
        />
    );

    return (
        <div className="header-background-selector">
            <Space direction="vertical" size="middle" className="w-full">
                {/* 背景类型选择 */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-20">背景类型:</span>
                    <Select
                        value={value.type}
                        onChange={handleTypeChange}
                        style={{ width: 140 }}
                        options={[
                            { label: '颜色背景', value: 'color', icon: <BgColorsOutlined /> },
                            { label: '图片背景', value: 'image', icon: <PictureOutlined /> },
                            { label: 'DAG背景', value: 'dag', icon: <NodeIndexOutlined /> },
                            { label: 'Graph背景', value: 'graph', icon: <BranchesOutlined /> }
                        ]}
                    />
                </div>

                {/* 背景值选择 */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-20">背景样式:</span>
                    <Select
                        value={value.value}
                        onChange={handleValueChange}
                        style={{ width: 200 }}
                        options={
                            value.type === 'color'
                                ? COLOR_OPTIONS
                                : value.type === 'image'
                                    ? IMAGE_OPTIONS
                                    : GRAPH_OPTIONS
                        }
                    />
                    {value.type === 'color' ? renderColorPreview() :
                        value.type === 'image' ? renderImagePreview() :
                            renderGraphPreview()}
                </div>

                {/* 自定义颜色选择器 */}
                {value.type === 'color' && showColorPicker && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-20">自定义颜色:</span>
                        <Input
                            type="color"
                            value={customColor}
                            onChange={(e) => handleCustomColorChange(e.target.value)}
                            style={{ width: 60 }}
                        />
                        <Button
                            size="small"
                            onClick={() => setShowColorPicker(false)}
                        >
                            确定
                        </Button>
                    </div>
                )}

                {/* 透明度调节 */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-20">透明度:</span>
                    <Slider
                        min={10}
                        max={100}
                        value={(value.opacity || 0.8) * 100}
                        onChange={handleOpacityChange}
                        style={{ width: 200 }}
                    />
                    <span className="text-sm text-gray-500 min-w-[40px]">
                        {Math.round((value.opacity || 0.8) * 100)}%
                    </span>
                </div>
            </Space>
        </div>
    );
};

export default HeaderBackground; 