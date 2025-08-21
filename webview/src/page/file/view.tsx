import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Switch,
  Row,
  Col,
  Statistic,
  DatePicker,
  message,
} from "antd";
import {
  TableOutlined,
  AppstoreOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  FileOutlined,
  NodeIndexOutlined,
  RadarChartOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useFileStore } from "../../store/file/store";
import { WebviewCommand } from "@supernode/shared";
import { VSCodeAPI } from "../../communication/send/manual_vscode";
import { ViewMode } from "../../store/file/type";
import ViewTable from "./ViewTable";
import ViewCard from "./ViewCard";
import Graph from "./ViewGraph";
import ViewDAG from "./ViewDAG";

const { RangePicker } = DatePicker;
const { Option } = Select;

const FileMetadataView: React.FC = () => {
  const {
    filteredFiles,
    filter,
    viewMode,
    selectedFiles,
    isLoading,
    setFilter,
    setSort,
    setViewMode,
    setIsLoading,
    setSelectedFiles,
    clearFilter,
    getTotalStats,
    getUniqueLanguages,
    getUniqueComplexities,
  } = useFileStore();

  const [showFilters, setShowFilters] = useState(false);

  // 从extension获取数据
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        // 发送获取文件元数据的请求到extension
        const vscode = VSCodeAPI.getInstance();
        if (vscode) {
          vscode.postMessage({
            command: WebviewCommand.getFileMetadata,
          });
          console.log("已发送获取文件元数据请求");
        } else {
          console.error("VSCode API 未初始化");
          message.error("VSCode API 未初始化");
        }
      } catch (error) {
        console.error("加载文件元数据失败:", error);
        message.error("加载文件元数据失败");
      }
    };
    loadFiles();
  }, []);

  // 处理表格排序
  const handleTableChange = (_: any, __: any, sorter: any) => {
    if (sorter.field) {
      setSort({
        field: sorter.field,
        order: sorter.order === "ascend" ? "ascend" : "descend",
      });
    }
  };

  // 处理行选择
  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedFiles(selectedRowKeys as string[]);
  };

  const totalStats = getTotalStats();
  const uniqueLanguages = getUniqueLanguages();
  const uniqueComplexities = getUniqueComplexities();

  return (
    <div className="p-6">
      {/* 标题和统计 */}
      <div className="mb-6">
        <Card className="mb-4" bordered>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="总文件数"
                value={totalStats.totalFiles}
                prefix={<FileTextOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总大小"
                value={(totalStats.totalSize / 1024 / 1024).toFixed(2)}
                suffix="MB"
                prefix={<FileOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总字数"
                value={totalStats.totalWords}
                prefix={<FileTextOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总阅读时间"
                value={totalStats.totalReadingTime}
                suffix="分钟"
                prefix={<ClockCircleOutlined />}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Button
            icon={<TableOutlined />}
            type={viewMode === ViewMode.TABLE ? "primary" : "default"}
            onClick={() => setViewMode(ViewMode.TABLE)}
          ></Button>
          <Button
            icon={<AppstoreOutlined />}
            type={viewMode === ViewMode.CARD ? "primary" : "default"}
            onClick={() => setViewMode(ViewMode.CARD)}
          ></Button>
          <Button
            icon={<RadarChartOutlined />}
            type={viewMode === ViewMode.GRAPH ? "primary" : "default"}
            onClick={() => setViewMode(ViewMode.GRAPH)}
          ></Button>
          <Button
            icon={<NodeIndexOutlined />}
            type={viewMode === ViewMode.DAG ? "primary" : "default"}
            onClick={() => setViewMode(ViewMode.DAG)}
          ></Button>
        </Space>
        <Space>
          <Input
            placeholder="搜索文件名、路径或内容..."
            prefix={<SearchOutlined />}
            value={filter.searchText}
            onChange={(e) => setFilter({ searchText: e.target.value })}
            style={{ width: 300 }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
            type={showFilters ? "primary" : "default"}
          ></Button>
          <Button icon={<ClearOutlined />} onClick={clearFilter}></Button>
        </Space>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <Card className="mb-4">
          <Row gutter={16}>
            <Col span={6}>
              <div className="mb-2">语言</div>
              <Select
                mode="multiple"
                placeholder="选择语言"
                value={filter.languageFilter}
                onChange={(value) => setFilter({ languageFilter: value })}
                style={{ width: "100%" }}
              >
                {uniqueLanguages.map((lang) => (
                  <Option key={lang} value={lang}>
                    {lang}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2">复杂度</div>
              <Select
                mode="multiple"
                placeholder="选择复杂度"
                value={filter.complexityFilter}
                onChange={(value) => setFilter({ complexityFilter: value })}
                style={{ width: "100%" }}
              >
                {uniqueComplexities.map((comp) => (
                  <Option key={comp} value={comp}>
                    {comp}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2">特性</div>
              <div className="space-y-2">
                <div>
                  <Switch
                    checked={filter.hasCodeBlocks === true}
                    onChange={(checked) =>
                      setFilter({ hasCodeBlocks: checked ? true : null })
                    }
                  />
                  <span className="ml-2">包含代码块</span>
                </div>
                <div>
                  <Switch
                    checked={filter.hasImages === true}
                    onChange={(checked) =>
                      setFilter({ hasImages: checked ? true : null })
                    }
                  />
                  <span className="ml-2">包含图片</span>
                </div>
                <div>
                  <Switch
                    checked={filter.hasTables === true}
                    onChange={(checked) =>
                      setFilter({ hasTables: checked ? true : null })
                    }
                  />
                  <span className="ml-2">包含表格</span>
                </div>
                <div>
                  <Switch
                    checked={filter.hasMath === true}
                    onChange={(checked) =>
                      setFilter({ hasMath: checked ? true : null })
                    }
                  />
                  <span className="ml-2">包含数学公式</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="mb-2">修改时间</div>
              <RangePicker
                value={
                  filter.dateRange[0] && filter.dateRange[1]
                    ? [dayjs(filter.dateRange[0]), dayjs(filter.dateRange[1])]
                    : null
                }
                onChange={(dates) => {
                  if (dates) {
                    setFilter({
                      dateRange: [
                        dates[0]?.toDate() || null,
                        dates[1]?.toDate() || null,
                      ],
                    });
                  } else {
                    setFilter({ dateRange: [null, null] });
                  }
                }}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 内容区域 */}
      {viewMode === ViewMode.TABLE ? (
        <ViewTable
          filteredFiles={filteredFiles}
          selectedFiles={selectedFiles}
          onTableChange={handleTableChange}
          onRowSelectionChange={handleRowSelectionChange}
        />
      ) : viewMode === ViewMode.CARD ? (
        <ViewCard filteredFiles={filteredFiles} />
      ) : viewMode === ViewMode.GRAPH ? (
        <Graph
          filteredFiles={filteredFiles}
          onNodeClick={(filePath) => {
            console.log("点击了文件节点:", filePath);
            // 这里可以添加跳转到文件的逻辑
          }}
        />
      ) : viewMode === ViewMode.DAG ? (
        <ViewDAG
          filteredFiles={filteredFiles}
          onNodeClick={(filePath) => {
            console.log("点击了文件节点:", filePath);
          }}
        />
      ) : null}
    </div>
  );
};

export default FileMetadataView;
