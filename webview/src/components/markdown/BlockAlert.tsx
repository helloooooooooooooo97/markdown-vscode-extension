import React from 'react';
import { Alert } from 'antd';

// 类型映射到 Ant Design Alert 的类型
const getAlertType = (type: string): 'info' | 'warning' | 'error' | 'success' => {
    const typeKey = type?.toLowerCase() || 'info';
    switch (typeKey) {
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        case 'success':
            return 'success';
        case 'tip':
            return 'info';
        case 'info':
        default:
            return 'info';
    }
};

// 获取标题
const getTitle = (type: string): string => {
    const typeKey = type?.toLowerCase() || 'info';
    switch (typeKey) {
        case 'warning':
            return '警告';
        case 'error':
            return '错误';
        case 'success':
            return '成功';
        case 'tip':
            return '提示';
        case 'info':
        default:
            return '信息';
    }
};

export const AlertBlock: React.FC<{
    blockId: string;
    type: string;
    children: React.ReactNode;
}> = ({ type, children }) => {
    const alertType = getAlertType(type);
    const title = getTitle(type);

    return (
        <div className="my-4">
            <Alert
                message={title}
                description={children}
                type={alertType}
                showIcon
                closable={false}
                className="border-0 shadow-sm"
            />
        </div>
    );
};

export default AlertBlock;