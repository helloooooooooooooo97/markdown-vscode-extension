// 行内代码组件
export const InlineCode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span className="bg-[#151111] rounded px-1 py-1 text-red-800">
    {children}
  </span>
);

export default InlineCode;
