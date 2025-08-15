// 代码块组件
export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <pre
        style={{
            padding: "12px",
            borderRadius: "6px",
            overflowX: "auto",
            margin: "8px 0",
        }}
    >
        <code>{code}</code>
    </pre>
);

export default CodeBlock;