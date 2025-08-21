import React from 'react';

interface PinIconProps {
    size?: number;
    color?: string;
    className?: string;
}

const PinIcon: React.FC<PinIconProps> = ({
    size = 16,
    color = 'currentColor',
    className = ''
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* 自定义的pin图标设计 */}
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 19V22" />
            <path d="M8 19H16" />
        </svg>
    );
};

export default PinIcon; 