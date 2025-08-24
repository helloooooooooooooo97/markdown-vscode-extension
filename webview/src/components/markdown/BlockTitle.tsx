import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface BlockTitleProps {
    fileName: string;
    blockId: string;
}

const BlockTitle: React.FC<BlockTitleProps> = ({ fileName }) => {
    return (
        <div className="mb-6">
            <Title level={1} className="!text-[2rem] !font-bold">
                {fileName}
            </Title>
        </div>
    );
};

export default BlockTitle; 