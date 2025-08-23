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
  DatePicker,
  message,
  Tooltip,
  Modal,
  Tag,
} from "antd";
import {
  TableOutlined,
  AppstoreOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useFileStore } from "../../store/file/store";
import { usePinStore } from "../../store/pin/store";
import { WebviewCommand } from "@supernode/shared";
import { VSCodeAPI } from "../../communication/send/api";
import { ViewMode } from "../../store/file/type";
import ViewTable from "./ViewTable";
import ViewCard from "./ViewCard";
import Graph from "./ViewGraph";
import ViewDAG from "./ViewDAG";
import IconSelector from "../../components/pin/IconSelector";

const { RangePicker } = DatePicker;
const { Option } = Select;

const FileMetadataView: React.FC = () => {
  const {
    filteredFiles,
    filter,
    sort,
    viewMode,
    selectedFiles,
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

  const { addPinnedQuery, pinnedQueries, setCurrentQuery, updateLastUsed, removePinnedQuery } = usePinStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinQueryName, setPinQueryName] = useState('');
  const [pinSidebarIcon, setPinSidebarIcon] = useState('📌');
  const [pinShowInSidebar, setPinShowInSidebar] = useState(true);

  // 快速保存当前查询
  const handleQuickPin = () => {
    setPinQueryName('');
    setPinSidebarIcon('📌');
    setPinShowInSidebar(true);
    setShowPinModal(true);
  };

  const handleSavePin = () => {
    if (!pinQueryName.trim()) {
      message.error('请输入查询名称');
      return;
    }

    const newQuery = {
      name: pinQueryName.trim(),
      viewMode,
      filter: { ...filter },
      sort: { ...sort },
      showInSidebar: pinShowInSidebar,
      sidebarIcon: pinSidebarIcon,
      sidebarOrder: 0,
    };

    addPinnedQuery(newQuery);
    setPinQueryName('');
    setShowPinModal(false);
    message.success(pinShowInSidebar ? '查询已保存到侧边栏' : '查询已保存');
  };

  // 处理视图点击
  const handleViewClick = (pinnedQuery: any) => {
    // 应用视图的筛选条件和排序
    setFilter(pinnedQuery.filter);
    setSort(pinnedQuery.sort);
    setViewMode(pinnedQuery.viewMode);
    setCurrentQuery(pinnedQuery);
    updateLastUsed(pinnedQuery.id);
    message.success(`已切换到视图: ${pinnedQuery.name}`);
  };

  // 处理删除视图
  const handleDeleteView = (e: React.MouseEvent | undefined, pinnedQuery: any) => {
    if (e) {
      e.stopPropagation(); // 阻止事件冒泡，避免触发视图切换
    }
    removePinnedQuery(pinnedQuery.id);
    message.success(`已删除视图: ${pinnedQuery.name}`);
  };

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
        }
      } catch (error) {
        console.error("加载文件元数据失败:", error);
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
      {/* 已保存的视图 */}
      {pinnedQueries.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-3 text-[#CCCCCC]">
            📌 所有视图 ({pinnedQueries.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {pinnedQueries.map((pinnedQuery) => (
              <Tag
                key={pinnedQuery.id}
                closable
                onClose={(e) => handleDeleteView(e, pinnedQuery)}
                onClick={() => handleViewClick(pinnedQuery)}
                style={{ cursor: 'pointer' }}
                className="flex items-center gap-1"
              >
                <span>{pinnedQuery.sidebarIcon}</span>
                <span>{pinnedQuery.name}</span>
              </Tag>
            ))}
          </div>
        </div>
      )}

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
          <Tooltip title="快速保存当前查询">
            <Button
              icon={<PushpinOutlined />}
              type="default"
              className="pin-button"
              onClick={handleQuickPin}
            />
          </Tooltip>
        </Space>
      </div>

      {/* 简化的统计信息（用Tag展示） */}
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Tag color="default">
          <span className="mr-2">📄</span>文件数 {totalStats.totalFiles} 个
        </Tag>
        <Tag color="blue">
          <span className="mr-2">📊</span>总大小 {(totalStats.totalSize / 1024 / 1024).toFixed(1)} MB
        </Tag>
        <Tag color="green">
          <span className="mr-2">📝</span>总字数 {totalStats.totalWords.toLocaleString()} 字
        </Tag>
        <Tag color="orange">
          <span className="mr-2">⏱️</span>阅读时长 {totalStats.totalReadingTime} 分钟
        </Tag>
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

      {/* Pin Modal */}
      <Modal
        title="视图"
        open={showPinModal}
        onOk={handleSavePin}
        onCancel={() => {
          setShowPinModal(false);
          setPinQueryName('');
        }}
        okText="保存"
        cancelText="取消"
      >
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium">名称</div>
          <Input
            value={pinQueryName}
            onChange={(e) => setPinQueryName(e.target.value)}
            placeholder="输入视图名称"
            onPressEnter={handleSavePin}
          />
        </div>

        <div className="mb-4">
          <div className="mb-2 text-sm font-medium">显示</div>
          <Switch
            checked={pinShowInSidebar}
            onChange={setPinShowInSidebar}
            checkedChildren="是"
            unCheckedChildren="否"
          />
        </div>

        {pinShowInSidebar && (
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium">查询</div>
            <IconSelector
              value={pinSidebarIcon}
              onChange={setPinSidebarIcon}
              placeholder="选择侧边栏图标"
            />
          </div>
        )}

        <div className="mb-4">
          <div className="text-base font-medium mb-2">条件</div>
          <Card size="small">
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <div className="flex justify-between">
                  <span className="text-[#666]">视图模式:</span>
                  <span className="font-medium">{viewMode}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex justify-between">
                  <span className="text-[#666]">搜索:</span>
                  <span className="font-medium">{filter.searchText || '无'}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex justify-between">
                  <span className="text-[#666]">语言筛选:</span>
                  <span className="font-medium">{filter.languageFilter.length > 0 ? filter.languageFilter.join(', ') : '无'}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex justify-between">
                  <span className="text-[#666]">复杂度筛选:</span>
                  <span className="font-medium">{filter.complexityFilter.length > 0 ? filter.complexityFilter.join(', ') : '无'}</span>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex justify-between">
                  <span className="text-[#666]">排序:</span>
                  <span className="font-medium">{sort.field} ({sort.order})</span>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default FileMetadataView;
