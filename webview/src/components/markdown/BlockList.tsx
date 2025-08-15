// 列表组件
export const List: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
    <ul style={{ margin: "8px 0 8px 24px" }}>
        {items.map((item, idx) => (
            <li key={idx}>{item}</li>
        ))}
    </ul>
);

export default List;