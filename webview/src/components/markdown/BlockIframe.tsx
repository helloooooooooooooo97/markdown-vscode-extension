
// iframe 组件
export const IframeComponent: React.FC<{
    src: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
    sandbox?: string;
    allowfullscreen?: boolean;
}> = ({
    src,
    width = "100%",
    height = "400px",
    style = {},
    sandbox = "allow-scripts allow-popups allow-forms allow-modals allow-same-origin",
    allowfullscreen = true
}) => {
        const defaultStyle = {
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "6px",
            margin: "16px 0",
            ...style,
        };

        return (
            <iframe
                src={src}
                width={width}
                height={height}
                style={defaultStyle}
                sandbox={sandbox}
                allowFullScreen={allowfullscreen}
                title="Embedded content"
            />
        );
    };

export default IframeComponent;
