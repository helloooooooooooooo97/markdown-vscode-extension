// 段落组件
export const Paragraph: React.FC<{ children: React.ReactNode; blockId: string }> = ({
    children,
}) => <p className="my-2">{children}</p>;

export default Paragraph;