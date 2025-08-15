// 段落组件
export const Paragraph: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => <p style={{ margin: "8px 0" }}>{children}</p>;

export default Paragraph;