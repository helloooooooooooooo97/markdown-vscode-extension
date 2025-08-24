import React, { useState } from 'react';
import { Modal } from 'antd';
import {
    BgColorsOutlined,
    PictureOutlined,
    NodeIndexOutlined,
    BranchesOutlined
} from '@ant-design/icons';
import HeaderBackground from '../../../common/HeaderBackground';

interface HeaderBackgroundInputProps {
    value?: {
        type: 'color' | 'dag' | 'graph' | 'image';
        value: string;
        opacity?: number;
    };
    isEditing: boolean;
    onValueChange: (newValue: any) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}

const HeaderBackgroundInput: React.FC<HeaderBackgroundInputProps> = ({
    value = { type: 'color', value: '#1e1e1e', opacity: 0.8 },
    onValueChange,
    onEditEnd
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [originalValue, setOriginalValue] = useState(value);

    const getBackgroundIcon = () => {
        switch (value.type) {
            case 'color':
                return <BgColorsOutlined />;
            case 'image':
                return <PictureOutlined />;
            case 'dag':
                return <NodeIndexOutlined />;
            case 'graph':
                return <BranchesOutlined />;
            default:
                return <BgColorsOutlined />;
        }
    };

    const getPreviewStyle = () => {
        if (value.type === 'color') {
            return {
                background: value.value,
                opacity: value.opacity || 0.8
            };
        } else if (value.type === 'image') {
            return {
                backgroundImage: `url(${value.value})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: value.opacity || 0.8
            };
        } else {
            // 对于DAG/Graph背景，显示一个简单的预览
            return {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: value.opacity || 0.8
            };
        }
    };

    const handleModalOpen = () => {
        setOriginalValue(value);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        // 确认修改，保持当前值
        setIsModalVisible(false);
        onEditEnd();
    };

    const handleModalCancel = () => {
        // 取消修改，恢复到原始值
        onValueChange(originalValue);
        setIsModalVisible(false);
        onEditEnd();
    };

    const handleRealTimeChange = (newValue: any) => {
        // 实时修改背景
        onValueChange(newValue);
    };

    return (
        <>
            <div
                className="cursor-pointer hover:bg-[#1e1e1e] rounded px-2 py-1 flex items-center gap-2"
                onClick={handleModalOpen}
            >
                {getBackgroundIcon()}
                <div
                    className="w-6 h-6 rounded border border-gray-300 bg-cover bg-center"
                    style={getPreviewStyle()}
                />
            </div>

            <Modal
                title="Header背景设置"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
                okText="确定"
                cancelText="取消"
                destroyOnClose
            >
                <div className="py-4">
                    <HeaderBackground
                        value={value}
                        onChange={handleRealTimeChange}
                    />
                </div>
            </Modal>
        </>
    );
};

export default HeaderBackgroundInput; 