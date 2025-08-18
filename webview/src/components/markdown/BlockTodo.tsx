import React, { useState } from "react";
import { Checkbox } from "antd";
import { useMarkdownStore } from "../../store/markdown/store";

/**
 * BlockTodo 组件，使用 antd 的 Checkbox 实现 todo 块
 * 目前仅做静态展示，后续可根据需要添加交互逻辑
 */
const BlockTodo: React.FC<{
  blockId: string;
  data: {
    checked: boolean;
    text: string;
  };
}> = ({ data, blockId }) => {
  const [checked, setChecked] = useState(data.checked);
  const { updateBlock } = useMarkdownStore();
  const handleChange = (checked: boolean) => {
    setChecked(checked);
    const newLine = `[${checked ? "✓" : " "}] ${data.text}`;
    updateBlock(blockId, [newLine]);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      <Checkbox
        checked={checked}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
      >
        {data.text}
      </Checkbox>
    </div>
  );
};

export default BlockTodo;
