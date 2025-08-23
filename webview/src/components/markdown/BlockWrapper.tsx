import React from "react";
import { Block } from "../../store/markdown/type";

interface BlockWrapperProps {
    block: Block;
    children: React.ReactNode;
    className?: string;
    onClick?: (block: Block) => void;
    onMouseEnter?: (block: Block) => void;
    onMouseLeave?: (block: Block) => void;
    isSelected?: boolean;
    isHovered?: boolean;
    customAttributes?: Record<string, any>;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
    block,
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    customAttributes = {}
}) => {

    const handleClick = () => {
        onClick?.(block);
    };

    const handleMouseEnter = () => {
        onMouseEnter?.(block);
    };

    const handleMouseLeave = () => {
        onMouseLeave?.(block);
    };

    return (
        <div
            className={""}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...customAttributes}
        >

            {/* 可以在这里添加统一的装饰元素 */}
            <div>
                {children}
            </div>

            {/* 可以添加统一的操作按钮或状态指示器 */}
            <div>
                {/* 这里可以放置复制、编辑、删除等操作按钮 */}
            </div>
        </div>
    );
};

export default BlockWrapper; 