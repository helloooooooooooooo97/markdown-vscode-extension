// 行内代码组件
export const InlineCode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="bg-[#252525] rounded px-1 py-1 text-[#BC4A47]">
    {children}
  </span>
);

export default InlineCode;
