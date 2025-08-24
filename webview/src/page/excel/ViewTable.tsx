import React from "react";
import { Table, Tag, Tooltip, Space } from "antd";
import {
  CodeOutlined,
  PictureOutlined,
  TableOutlined as TableIcon,
  FunctionOutlined,
} from "@ant-design/icons";
import { FileInfo } from "@supernode/shared";
import dayjs from "dayjs";

interface ViewTableProps {
  filteredFiles: FileInfo[];
  selectedFiles: string[];
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onRowSelectionChange: (selectedRowKeys: React.Key[]) => void;
}

const ViewTable: React.FC<ViewTableProps> = ({
  filteredFiles,
  selectedFiles,
  onTableChange,
  onRowSelectionChange,
}) => {
  // 表格列定义
  const columns = [
    {
      title: "欢迎使用SUPERNODE",
      dataIndex: "fileName",
      key: "fileName",
      sorter: true,
      render: (text: string, record: FileInfo) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.relativePath}</div>
        </div>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      sorter: true,
      render: (size: number) => <span>{(size / 1024).toFixed(1)} KB</span>,
    },
    {
      title: "修改时间",
      dataIndex: "lastModified",
      key: "lastModified",
      sorter: true,
      render: (date: Date) => (
        <span>{dayjs(date).format("YYYY-MM-DD HH:mm")}</span>
      ),
    },
    {
      title: "语言",
      dataIndex: "languageId",
      key: "languageId",
      render: (language: string) => <Tag color="blue">{language}</Tag>,
    },
    {
      title: "复杂度",
      dataIndex: ["contentAnalysis", "complexity"],
      key: "complexity",
      render: (complexity: string) => {
        const colors = {
          simple: "green",
          medium: "orange",
          complex: "red",
        };
        return (
          <Tag color={colors[complexity as keyof typeof colors]}>
            {complexity}
          </Tag>
        );
      },
    },
    {
      title: "特性",
      key: "features",
      render: (record: FileInfo) => (
        <Space size="small">
          {record.contentAnalysis.hasCodeBlocks && (
            <Tooltip title="包含代码块">
              <CodeOutlined />
            </Tooltip>
          )}
          {record.contentAnalysis.hasImages && (
            <Tooltip title="包含图片">
              <PictureOutlined />
            </Tooltip>
          )}
          {record.contentAnalysis.hasTables && (
            <Tooltip title="包含表格">
              <TableIcon />
            </Tooltip>
          )}
          {record.contentAnalysis.hasMath && (
            <Tooltip title="包含数学公式">
              <FunctionOutlined />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "统计",
      key: "stats",
      render: (record: FileInfo) => (
        <div className="text-xs">
          <div>字数: {record.documentStats.wordCount}</div>
          <div>阅读: {record.documentStats.readingTimeMinutes}分钟</div>
        </div>
      ),
    },
  ];

  // 处理行选择
  const handleRowSelection = {
    selectedRowKeys: selectedFiles,
    onChange: onRowSelectionChange,
  };

  return (
    <Table
      columns={columns}
      dataSource={filteredFiles}
      rowKey="filePath"
      onChange={onTableChange}
      rowSelection={handleRowSelection}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
      }}
    />
  );
};

export default ViewTable;
