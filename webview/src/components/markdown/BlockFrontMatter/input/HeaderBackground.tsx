import React from 'react';
import { Radio } from 'antd';
import {
    BarChartOutlined,
    NodeIndexOutlined,
    BranchesOutlined,
} from '@ant-design/icons';

export enum HeaderBackgroundType {
    STATISTICS = 'statistics',
    EXCALIDRAW = 'excalidraw',
    DAG = 'dag',
    COMBINED = 'combined'
}

interface HeaderBackgroundInputProps {
    value?: HeaderBackgroundType;
    isEditing: boolean;
    onValueChange: (newValue: any) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}

// 选项配置
const OPTIONS = [
    { label: <span><BarChartOutlined className="mr-1" />statistics</span>, value: HeaderBackgroundType.STATISTICS },
    { label: <span><BranchesOutlined className="mr-1" />excalidraw</span>, value: HeaderBackgroundType.EXCALIDRAW },
    { label: <span><NodeIndexOutlined className="mr-1" />dag</span>, value: HeaderBackgroundType.DAG },
    { label: <span><NodeIndexOutlined className="mr-1" />combined</span>, value: HeaderBackgroundType.COMBINED }
];

const HeaderBackgroundInput: React.FC<HeaderBackgroundInputProps> = ({
    value = HeaderBackgroundType.EXCALIDRAW,
    onValueChange,
}) => {
    const handleChange = (e: any) => {
        onValueChange(e.target.value);
    };

    return (
        <div className="py-2 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 w-20">背景类型:</span>
            <Radio.Group
                value={value}
                onChange={handleChange}
                options={OPTIONS}
                optionType="button"
                buttonStyle="solid"
            />
        </div>
    );
};

export default HeaderBackgroundInput; 