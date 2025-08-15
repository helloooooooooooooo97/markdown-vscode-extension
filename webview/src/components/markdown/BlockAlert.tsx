// 信息块组件
export const AlertBlock: React.FC<{
    blockId: string;
    type: string;
    children: React.ReactNode;
}> = ({ type, children }) => {
    const getBlockStyle = (type: string) => {
        const baseStyle = {
            padding: "12px 16px",
            margin: "16px 0",
            borderRadius: "6px",
            borderLeft: "4px solid",
        };

        switch (type.toLowerCase()) {
            case "info":
                return {
                    ...baseStyle,
                    backgroundColor: "#e3f2fd",
                    borderLeftColor: "#2196f3",
                    color: "#0d47a1",
                };
            case "warning":
                return {
                    ...baseStyle,
                    backgroundColor: "#fff3e0",
                    borderLeftColor: "#ff9800",
                    color: "#e65100",
                };
            case "error":
                return {
                    ...baseStyle,
                    backgroundColor: "#ffebee",
                    borderLeftColor: "#f44336",
                    color: "#c62828",
                };
            case "success":
                return {
                    ...baseStyle,
                    backgroundColor: "#e8f5e8",
                    borderLeftColor: "#4caf50",
                    color: "#2e7d32",
                };
            case "tip":
                return {
                    ...baseStyle,
                    backgroundColor: "#f3e5f5",
                    borderLeftColor: "#9c27b0",
                    color: "#6a1b9a",
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: "#f5f5f5",
                    borderLeftColor: "#757575",
                    color: "#424242",
                };
        }
    };

    return (
        <div style={getBlockStyle(type)}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <div>{children}</div>
        </div>
    );
};

export default AlertBlock;