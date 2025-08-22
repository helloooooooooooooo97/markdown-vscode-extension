import React from 'react';
import { Position, Handle, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import JSONViewer from '../../../../components/common/JSONViewer';
import { Tooltip } from 'antd';
import { dagColors } from '../style';

// DAG节点类型（圆形节点，不显示文本，悬浮显示所有数据信息）
const NodeRoundView: React.FC<NodeProps> = ({ data }) => {
  const isHighlighted = data.isHighlighted;

  // 准备悬浮显示的内容
  const tooltipContent = (
    <div className="max-w-md max-h-96 overflow-auto">
      <JSONViewer
        data={data}
        height="100%"
        maxHeight="100%"
        readOnly={true}
      />
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      overlayClassName="dag-node-tooltip"
    >
      <div
        className={`
          relative cursor-pointer transition-all duration-200 ease-in-out
          ${isHighlighted ? 'z-10 scale-110' : 'z-1 scale-100'}
        `}
        onClick={() => {
          if (data.onClick) {
            data.onClick(data);
          }
        }}
      >
        {/* 圆形节点 */}
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center relative
            transition-all duration-180 ease-out
            ${isHighlighted ? 'brightness-110' : ''}
          `}
          style={{
            backgroundColor: data.color || dagColors.node.default,
            border: isHighlighted
              ? `3px solid ${dagColors.border.primary}`
              : `2px solid ${dagColors.status.completed}`,
            boxShadow: isHighlighted
              ? `0 0 8px 2px ${dagColors.border.primary}, 0 2px 8px ${dagColors.node.default}`
              : `0 1px 4px ${dagColors.node.default}`,
          }}
        >
          {/* 输入连接点 */}
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-gray-700 !border-2 !border-white"
            style={{ background: dagColors.border.dark }}
          />

          {/* 状态指示圆点 */}
          {data.status && (
            <div
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2"
              style={{
                backgroundColor: getDAGNodeColor(data.status),
                borderColor: dagColors.border.primary
              }}
            />
          )}

          {/* 输出连接点 */}
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-gray-700 !border-2 !border-white"
            style={{ background: dagColors.border.dark }}
          />
        </div>

        {/* 文本标签 - 使用绝对定位 */}
        {data.label && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-gray-300 text-center whitespace-nowrap font-normal leading-tight pointer-events-none">
            {data.label}
          </div>
        )}
      </div>
    </Tooltip>
  );
};

// 根据状态获取节点颜色
const getDAGNodeColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return dagColors.status.completed;
    case 'running':
    case 'processing':
      return dagColors.status.running;
    case 'error':
    case 'failed':
      return dagColors.status.error;
    case 'warning':
      return dagColors.status.warning;
    case 'pending':
    case 'waiting':
    default:
      return dagColors.status.pending;
  }
};

export default NodeRoundView;