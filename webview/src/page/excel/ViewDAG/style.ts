// DAG 图表颜色定义
export const dagColors = {
    // 节点颜色
    node: {
        default: '#3b82f6', // blue-500
        primary: '#1d4ed8', // blue-700
        secondary: '#60a5fa', // blue-400
    },

    // 边框颜色
    border: {
        primary: '#1d4ed8', // blue-700
        secondary: '#3b82f6', // blue-500
        tertiary: '#93c5fd', // blue-300
        dark: '#1e40af', // blue-800
    },

    // 状态颜色
    status: {
        completed: '#10b981', // emerald-500
        running: '#f59e0b', // amber-500
        error: '#ef4444', // red-500
        pending: '#6b7280', // gray-500
        warning: '#f97316', // orange-500
    },

    // 背景颜色
    background: {
        primary: "#2A2A2A",
    },

    // 表面颜色
    surface: {
        primary: "#2a2a2a", // white
        secondary: '#f9fafb', // gray-50
    },

    // 边线颜色
    edge: {
        primary: '#3b82f6', // blue-500
        secondary: '#93c5fd', // blue-300
    },

    // 小地图颜色
    minimap: {
        background: "#2a2a2a", // gray-50
        border: '#e5e7eb', // gray-200
        node: '#3b82f6', // blue-500
    },
};

// 根据状态获取节点颜色
export const getDAGNodeColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'success':
            return dagColors.status.completed;
        case 'running':
        case 'processing':
            return dagColors.status.running;
        case 'error':
        case 'failed':
            return dagColors.status.error;
        case 'warning':
            return dagColors.status.warning;
        case 'pending':
        case 'waiting':
        default:
            return dagColors.status.pending;
    }
};