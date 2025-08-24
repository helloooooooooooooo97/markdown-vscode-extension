import React from "react";
import { Button, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export const Heading: React.FC<{
    level: number;
    children: React.ReactNode;
    blockId: string;
    showNumber?: boolean; // 是否显示序号
    number?: string; // 标题序号
    isExpanded?: boolean; // 是否展开
    onToggleExpand?: () => void; // 切换展开状态的回调
}> = ({ level, children, showNumber = true, number, isExpanded = true, onToggleExpand }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    // 为不同级别的标题定义样式
    const getHeadingStyles = (level: number) => {
        switch (level) {
            case 1:
                return "text-[1.875em] font-bold mt-6 mb-4";
            case 2:
                return "text-[1.5em] font-bold mt-5 mb-3 ";
            case 3:
                return "text-[1.25em] font-semibold mt-4 mb-2 ";
            default:
                return "text-[1em] font-semibold mt-4 mb-2 ";
        }
    };

    // 生成序号
    const generateNumber = () => {
        if (!showNumber || !number) return null;
        return (
            <>
                {
                    level === 1 ?
                        <span className=" font-bold  select-none">
                            {number + "、"}
                        </span>
                        :
                        <span className=" font-bold mr-3 select-none">
                            {number}
                        </span>
                }
            </>
        );
    };

    return (
        <div className="relative group">
            {/* 折叠按钮 */}
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-10">
                <Tooltip title={isExpanded ? "折叠" : "展开"}>
                    <Button
                        type="text"
                        size="small"
                        icon={isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        onClick={onToggleExpand}
                        className={
                            isExpanded
                                ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                : "opacity-100"
                        }
                        style={{
                            color: '#D4D4D4',
                            backgroundColor: 'rgba(30, 30, 30, 0.8)',
                            border: '1px solid #404040',
                            fontSize: Math.max(10, 14 - level) + 'px'
                        }}
                    />
                </Tooltip>
            </div>

            <Tag className={getHeadingStyles(level)}>
                {generateNumber()}
                {children}
            </Tag>
        </div>
    );
};

export default Heading;