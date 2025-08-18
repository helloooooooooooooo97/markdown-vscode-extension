import React, { useState } from 'react';
import { Typography, Input, Modal, Button } from 'antd';
const { Text } = Typography;
const { TextArea } = Input;

// 对象类型输入组件
const ObjectInput: React.FC<{
    value: object;
    isEditing: boolean;
    onValueChange: (newValue: object) => void;
    onEditStart: () => void;
    onEditEnd: () => void;
}> = ({ value, onValueChange, onEditStart, onEditEnd }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempValue, setTempValue] = useState(JSON.stringify(value, null, 2));
    const [isValid, setIsValid] = useState(true);

    const handleEditStart = () => {
        setTempValue(JSON.stringify(value, null, 2));
        setIsValid(true);
        setModalVisible(true);
        onEditStart();
    };

    const handleEditEnd = () => {
        setModalVisible(false);
        onEditEnd();
    };

    const handleSave = () => {
        try {
            const parsed = JSON.parse(tempValue);
            onValueChange(parsed);
            handleEditEnd();
        } catch (error) {
            setIsValid(false);
        }
    };

    const handleCancel = () => {
        setTempValue(JSON.stringify(value, null, 2));
        setIsValid(true);
        handleEditEnd();
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setTempValue(newValue);

        try {
            JSON.parse(newValue);
            setIsValid(true);
        } catch {
            setIsValid(false);
        }
    };

    return (
        <>
            <Text
                code
                className="cursor-pointer hover:bg-[#1e1e1e] rounded max-w-[300px] truncate block"
                onClick={handleEditStart}
                title={JSON.stringify(value)}
            >
                {JSON.stringify(value)}
            </Text>

            <Modal
                title="编辑JSON对象"
                open={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={handleSave}
                        disabled={!isValid}
                    >
                        保存
                    </Button>
                ]}
                width={600}
            >
                <div className="space-y-4">
                    <TextArea
                        value={tempValue}
                        onChange={handleTextChange}
                        autoSize={{ minRows: 10, maxRows: 20 }}
                        placeholder="输入有效的JSON格式"
                        status={isValid ? undefined : 'error'}
                        className="px-1 border-none outline-none bg-transparent resize-none"
                        style={{
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            backgroundColor: 'transparent'
                        }}
                    />
                    {!isValid && (
                        <Text type="danger" className="text-sm">
                            请输入有效的JSON格式
                        </Text>
                    )}

                </div>
            </Modal>
        </>
    );
};

export default ObjectInput;