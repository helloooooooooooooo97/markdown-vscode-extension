import React from "react";
import { Checkbox } from "antd";

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
}> = ({ data }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
      <Checkbox
        checked={data.checked}
        onChange={(e) => {
          console.log(e.target.checked);
        }}
      >
        {data.text}
      </Checkbox>
    </div>
  );
};

export default BlockTodo;
