import React from "react";

interface BlockReferenceProps {
    blockId: string;
    children?: React.ReactNode;
}

const BlockReference: React.FC<BlockReferenceProps> = ({ children }) => {
    return (
        <blockquote className="px-4 py-2 border-l-[3px] border-l-[#e5e7eb]">
            {children}
        </blockquote>
    );
};

export default BlockReference;