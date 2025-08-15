// 表格组件
export const Table: React.FC<{
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
    blockId: string;
}> = ({ headers, rows }) => (
    <table style={{ borderCollapse: "collapse", width: "100%", margin: "8px 0" }}>
        <thead>
            <tr>
                {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <td
                            key={cellIndex}
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            {cell}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

export default Table;