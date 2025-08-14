import React from "react";

// 标题组件
export const Heading: React.FC<{
  level: number;
  children: React.ReactNode;
}> = ({ level, children }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag style={{ margin: "16px 0 8px 0" }}>2131{children}</Tag>;
};

// 段落组件
export const Paragraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p style={{ margin: "8px 0" }}>{children}</p>;

// 代码块组件
export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre
    style={{
      padding: "12px",
      borderRadius: "6px",
      overflowX: "auto",
      margin: "8px 0",
    }}
  >
    <code>{code}</code>
  </pre>
);

// 行内代码组件
export const InlineCode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <code
    style={{
      background: "#f6f8fa",
      borderRadius: "4px",
      padding: "2px 4px",
      fontSize: "95%",
    }}
  >
    {children}
  </code>
);

// 列表组件
export const List: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ margin: "8px 0 8px 24px" }}>
    {items.map((item, idx) => (
      <li key={idx}>{item}</li>
    ))}
  </ul>
);

// 粗体组件
export const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong>{children}</strong>
);

// 斜体组件
export const Italic: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <em>{children}</em>;

// 表格组件
export const Table: React.FC<{
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
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

/**
 * 组件分离
 */
export const LinkComponent = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#0366d6", textDecoration: "none" }}
  >
    {children}
  </a>
);

export const LatexInlineComponent = ({
  html,
  index,
}: {
  html: string;
  index: number | string;
}) => (
  <span
    key={`latex-inline-${index}`}
    style={{ display: "inline-block", verticalAlign: "middle" }}
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export const LatexBlockComponent = ({
  html,
  index,
}: {
  html: string;
  index: number | string;
}) => (
  <div
    key={`latex-block-${index}`}
    className="katex-display"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export const LatexErrorComponent = ({
  latex,
  index,
}: {
  latex: string;
  index: number | string;
}) => <span key={`latex-inline-${index}`}>{latex}</span>;

export const LatexBlockErrorComponent = ({
  latex,
  index,
}: {
  latex: string;
  index: number | string;
}) => <pre key={`latex-block-${index}`}>{latex}</pre>;
