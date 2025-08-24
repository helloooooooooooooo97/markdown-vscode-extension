import React, { useState } from 'react';
import { Modal, Input, Button, Space, Tooltip } from 'antd';

interface IconSelectorProps {
    value?: string;
    onChange?: (icon: string) => void;
    placeholder?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({
    value = '',
    onChange,
    placeholder = '选择图标'
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [customIcon, setCustomIcon] = useState(value);

    // 预设的图标选项
    const iconOptions = [
        '📌', '🔍', '📊', '📋', '🕸️', '🔗', '📄', '📁', '📂', '🎯',
        '⭐', '💡', '🔥', '💎', '🎨', '🚀', '⚡', '🎪', '🎭', '🎪',
        '📝', '✏️', '📚', '📖', '📗', '📘', '📙', '📕', '📓', '📔',
        '🔧', '⚙️', '🔨', '🛠️', '🔩', '🔪', '🗡️', '⚔️', '🛡️', '🏹',
        '🎯', '🎲', '🎮', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧',
        // 人物类 emoji
        '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍🔬', '👩‍🔬', '🧑‍🔬',
        '👨‍🎨', '👩‍🎨', '🧑‍🎨', '👨‍🚀', '👩‍🚀', '🧑‍🚀', '👨‍🚒', '👩‍🚒', '🧑‍🚒',
        '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍🔧', '👨‍🔧', '👩‍🔧',
        '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️'
    ];

    const handleIconSelect = (icon: string) => {
        onChange?.(icon);
        setIsModalVisible(false);
    };

    const handleCustomIcon = () => {
        if (customIcon.trim()) {
            onChange?.(customIcon.trim());
            setIsModalVisible(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsModalVisible(true)}
                style={{ width: '100%', textAlign: 'left' }}
            >
                {value ? (
                    <span style={{ fontSize: '16px' }}>{value}</span>
                ) : (
                    <span style={{ color: '#999' }}>{placeholder}</span>
                )}
            </Button>

            <Modal
                title="选择图标"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <div className="mb-4">
                    <div className="mb-2 text-sm font-medium">自定义图标</div>
                    <Space>
                        <Input
                            value={customIcon}
                            onChange={(e) => setCustomIcon(e.target.value)}
                            placeholder="输入emoji或图标"
                            style={{ width: 200 }}
                        />
                        <Button onClick={handleCustomIcon}>确定</Button>
                    </Space>
                </div>

                <div className="mb-4">
                    <div className="mb-2 text-sm font-medium">预设图标</div>
                    <div className="icon-selector-grid">
                        {iconOptions.map((icon, index) => (
                            <Tooltip key={index} title={`点击选择 ${icon}`}>
                                <Button
                                    size="small"
                                    onClick={() => handleIconSelect(icon)}
                                    className="icon-selector-button"
                                >
                                    {icon}
                                </Button>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default IconSelector; 