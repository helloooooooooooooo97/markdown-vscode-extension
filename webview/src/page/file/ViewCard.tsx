import React from "react";
import { Card, Tag, Tooltip, Space, Row, Col } from "antd";
import {
  CodeOutlined,
  PictureOutlined,
  TableOutlined as TableIcon,
  FunctionOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { FileInfo } from "@supernode/shared";
import dayjs from "dayjs";

interface ViewCardProps {
  filteredFiles: FileInfo[];
}

const ViewCard: React.FC<ViewCardProps> = ({ filteredFiles }) => {
  // 卡片渲染
  const renderCard = (file: FileInfo) => (
    <Card
      key={file.filePath}
      size="small"
      className="mb-4"
      hoverable
      actions={[
        <Tooltip title="查看文件">
          <EyeOutlined />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title={
          <div className="flex items-center justify-between">
            <span className="font-medium">{file.fileName}</span>
            <Tag color="blue">{file.languageId}</Tag>
          </div>
        }
        description={
          <div className="space-y-2">
            <div className="text-xs text-gray-500">{file.relativePath}</div>
            <div className="flex items-center justify-between text-xs">
              <span>{(file.size / 1024).toFixed(1)} KB</span>
              <span>{dayjs(file.lastModified).format("MM-DD HH:mm")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag
                color={
                  file.contentAnalysis.complexity === "simple"
                    ? "green"
                    : file.contentAnalysis.complexity === "medium"
                    ? "orange"
                    : "red"
                }
              >
                {file.contentAnalysis.complexity}
              </Tag>
              <Space size="small">
                {file.contentAnalysis.hasCodeBlocks && (
                  <CodeOutlined className="text-blue-500" />
                )}
                {file.contentAnalysis.hasImages && (
                  <PictureOutlined className="text-green-500" />
                )}
                {file.contentAnalysis.hasTables && (
                  <TableIcon className="text-purple-500" />
                )}
                {file.contentAnalysis.hasMath && (
                  <FunctionOutlined className="text-red-500" />
                )}
              </Space>
            </div>
            <div className="text-xs text-gray-600">
              {file.documentStats.wordCount} 字 ·{" "}
              {file.documentStats.readingTimeMinutes} 分钟阅读
            </div>
          </div>
        }
      />
    </Card>
  );

  return (
    <Row gutter={16}>
      {filteredFiles.map((file) => (
        <Col key={file.filePath} xs={24} sm={12} md={8} lg={6}>
          {renderCard(file)}
        </Col>
      ))}
    </Row>
  );
};

export default ViewCard;
