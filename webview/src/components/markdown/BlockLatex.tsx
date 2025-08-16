import { useState } from 'react';
import { Modal } from 'antd';

export const BlockLatex = ({
    html,
    index,
}: {
    html: string;
    index: number | string;
    blockId: string;
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <div
                key={`latex-block-${index}`}
                className="katex-display cursor-pointer hover:opacity-80 transition-opacity"
                dangerouslySetInnerHTML={{ __html: html }}
                onClick={showModal}
                title="点击放大"
            />
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={1200}
                centered
            >
                <div className="flex justify-center">
                    <div
                        className="katex-display text-6xl"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            </Modal>
        </>
    );
};

export const BlockLatexError = ({
    latex,
    index,
}: {
    latex: string;
    index: number | string;
    blockId: string;
}) => <pre key={`latex-block-${index}`}>{latex}</pre>;
