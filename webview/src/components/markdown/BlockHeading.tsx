export const Heading: React.FC<{
    level: number;
    children: React.ReactNode;
    blockId: string;
}> = ({ level, children }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    // 为不同级别的标题定义样式
    const getHeadingStyles = (level: number) => {
        switch (level) {
            case 1:
                return "text-4xl font-bold mt-6 mb-4";
            case 2:
                return "text-3xl font-bold mt-5 mb-3 ";
            case 3:
                return "text-2xl font-semibold mt-4 mb-2 ";
            case 4:
                return "text-xl font-semibold mt-4 mb-2 ";
            case 5:
                return "text-lg font-medium mt-3 mb-2 ";
            case 6:
                return "text-base font-medium mt-3 mb-2 ";
            default:
                return "text-2xl font-semibold mt-4 mb-2 ";
        }
    };

    return (
        <Tag className={getHeadingStyles(level)}>
            {children}
        </Tag>
    );
};
export default Heading;