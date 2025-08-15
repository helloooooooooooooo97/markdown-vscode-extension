// Frontmatter 组件
export const FrontmatterComponent: React.FC<{
    data: Record<string, any>;
}> = ({ data }) => {
    return (
        <div style={{
            background: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "6px",
            padding: "12px",
            margin: "16px 0",
            fontSize: "14px",
            fontFamily: "monospace"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#495057" }}>
                Frontmatter
            </div>
            <div>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#6c757d" }}>{key}:</span>{' '}
                        <span style={{ color: "#212529" }}>
                            {typeof value === 'string' ? `'${value}'` : JSON.stringify(value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default FrontmatterComponent;