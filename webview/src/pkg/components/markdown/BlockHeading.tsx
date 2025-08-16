// 标题组件
export const Heading: React.FC<{
    level: number;
    children: React.ReactNode;
    blockId: string;
}> = ({ level, children }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag style={{ margin: "16px 0 8px 0" }}>{children}</Tag>;
};

// 段落组件
export const Paragraph: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <p style={{ margin: "8px 0" }}>{children}</p>;



export default Heading;