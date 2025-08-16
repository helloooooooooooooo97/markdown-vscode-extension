
/**
 * 组件分离
 */
export const LinkComponent = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => {
    // 判断是否为本地文件链接（相对路径或文件协议）
    const isLocalFile = href.startsWith('./') ||
        href.startsWith('../') ||
        href.startsWith('/') ||
        href.startsWith('file://') ||
        (href.includes('.') && !href.startsWith('http'));

    if (isLocalFile) {
        // 本地文件链接，使用点击事件处理
        const handleLocalLinkClick = (e: React.MouseEvent) => {
            e.preventDefault();
            console.log("点击本地链接:", href);
            // 发送消息给扩展，请求打开本地文件
            if (window.vscode) {
                const message = {
                    command: 'openLocalFile',
                    path: href
                };
                console.log("发送消息给扩展:", message);
                window.vscode.postMessage(message);
            } else {
                console.error("window.vscode 未定义");
            }
        };

        return (
            <a
                href={href}
                onClick={handleLocalLinkClick}
                style={{
                    color: "#0366d6",
                    textDecoration: "none",
                    cursor: "pointer"
                }}
                title={`打开本地文件: ${href}`}
            >
                {children}
            </a>
        );
    } else {
        // 外部链接，在新标签页中打开
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0366d6", textDecoration: "none" }}
            >
                {children}
            </a>
        );
    }
};

export default LinkComponent;