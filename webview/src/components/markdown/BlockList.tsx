// 列表组件（左侧带小圆点）
export const List: React.FC<{ items: React.ReactNode[]; blockId: string }> = ({ items }) => (
    <ul className="my-2 ml-6 list-disc">
        {items.map((item, idx) => (
            <li key={idx} className="my-2">{item}</li>
        ))}
    </ul>
);

export default List;