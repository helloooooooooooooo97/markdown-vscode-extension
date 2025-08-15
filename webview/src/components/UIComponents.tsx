import React from 'react';
import { Button, Card, Space, Typography, Divider, Alert, Tag, Tooltip } from 'antd';
import {
    CopyOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// 信息块组件 - 使用Ant Design
export const InfoBlock: React.FC<{
    type: 'info' | 'warning' | 'error' | 'success' | 'tip';
    title?: string;
    children: React.ReactNode;
}> = ({ type, title, children }) => {
    const getIcon = () => {
        switch (type) {
            case 'info':
                return <InfoCircleOutlined />;
            case 'warning':
                return <WarningOutlined />;
            case 'error':
                return <CloseCircleOutlined />;
            case 'success':
                return <CheckCircleOutlined />;
            case 'tip':
                return <InfoCircleOutlined />;
            default:
                return <InfoCircleOutlined />;
        }
    };

    const getType = () => {
        switch (type) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            case 'success':
                return 'success';
            case 'tip':
                return 'info';
            default:
                return 'info';
        }
    };

    return (
        <Alert
            message={title || type.charAt(0).toUpperCase() + type.slice(1)}
            description={children}
            type={getType()}
            icon={getIcon()}
            showIcon
            className="mb-4"
        />
    );
};

// 代码块组件 - 使用Ant Design
export const CodeBlock: React.FC<{
    code: string;
    language?: string;
    title?: string;
}> = ({ code, language, title }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    return (
        <Card
            size="small"
            className="mb-4"
            title={title && (
                <Space>
                    <Text code>{language || 'text'}</Text>
                    {title}
                </Space>
            )}
            extra={
                <Tooltip title="复制代码">
                    <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                    />
                </Tooltip>
            }
        >
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
        </Card>
    );
};

// 表格组件 - 使用Ant Design
export const Table: React.FC<{
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
    title?: string;
}> = ({ headers, rows, title }) => {
    return (
        <Card size="small" className="mb-4" title={title}>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            {headers.map((header, index) => (
                                <th key={index} className="border border-gray-300 px-3 py-2 text-left font-semibold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// 链接组件 - 使用Ant Design
export const LinkComponent: React.FC<{
    href: string;
    children: React.ReactNode;
    external?: boolean;
}> = ({ href, children, external = false }) => {
    const isLocalFile = href.startsWith('./') ||
        href.startsWith('../') ||
        href.startsWith('/') ||
        href.startsWith('file://') ||
        (href.includes('.') && !href.startsWith('http'));

    if (isLocalFile) {
        const handleLocalLinkClick = (e: React.MouseEvent) => {
            e.preventDefault();
            if (window.vscode) {
                window.vscode.postMessage({
                    command: 'openLocalFile',
                    path: href
                });
            }
        };

        return (
            <Button
                type="link"
                onClick={handleLocalLinkClick}
                className="p-0 h-auto"
            >
                {children}
            </Button>
        );
    } else {
        return (
            <Button
                type="link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-0 h-auto"
            >
                {children}
                {external && <Text className="ml-1">↗</Text>}
            </Button>
        );
    }
};

// 标签组件 - 使用Ant Design
export const TagComponent: React.FC<{
    children: React.ReactNode;
    color?: string;
}> = ({ children, color = 'blue' }) => (
    <Tag color={color} className="mb-1">
        {children}
    </Tag>
);

// 分割线组件 - 使用Ant Design
export const DividerComponent: React.FC<{
    text?: string;
    orientation?: 'left' | 'right' | 'center';
}> = ({ text, orientation = 'center' }) => (
    <Divider orientation={orientation} className="my-6">
        {text}
    </Divider>
); 