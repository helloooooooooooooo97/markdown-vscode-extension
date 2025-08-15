// 行内代码组件
export const InlineCode: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <code
        style={{
            background: "#f6f8fa",
            borderRadius: "4px",
            padding: "2px 4px",
            fontSize: "95%",
        }}
    >
        {children}
    </code>
);

export default InlineCode;