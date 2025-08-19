import React, { useEffect, useState } from "react";
import {
    Table,
    Card,
    Input,
    Select,
    Button,
    Space,
    Tag,
    Tooltip,
    Switch,
    Row,
    Col,
    Statistic,
    DatePicker,
    message
} from "antd";
import {
    TableOutlined,
    AppstoreOutlined,
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    FileTextOutlined,
    CodeOutlined,
    PictureOutlined,
    TableOutlined as TableIcon,
    FunctionOutlined,
    ClockCircleOutlined,
    FileOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { useFileStore } from "../../store/file/store";
import { FileInfo, WebviewCommand } from "@supernode/shared";
import { VSCodeAPI } from "../../communication/send/manual_vscode";
import dayjs from "dayjs";

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
        getUniqueComplexities
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
                        command: WebviewCommand.getFileMetadata
                    });
                    console.log("已发送获取文件元数据请求");
                } else {
                    console.error("VSCode API 未初始化");
                    message.error("VSCode API 未初始化");
                }
            } catch (error) {
                console.error("加载文件元数据失败:", error);
                message.error("加载文件元数据失败");
            } finally {
                // 注意：这里不设置setIsLoading(false)，因为数据加载是异步的
                // 真正的loading状态会在收到extension响应后由MessageReceiveHandler处理
            }
        };

        loadFiles();
    }, []);

    // 表格列定义
    const columns = [
        {
            title: '文件名',
            dataIndex: 'fileName',
            key: 'fileName',
            sorter: true,
            render: (text: string, record: FileInfo) => (
                <div>
                    <div className="font-medium">{text}</div>
                    <div className="text-xs text-gray-500">{record.relativePath}</div>
                </div>
            ),
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            sorter: true,
            render: (size: number) => (
                <span>{(size / 1024).toFixed(1)} KB</span>
            ),
        },
        {
            title: '修改时间',
            dataIndex: 'lastModified',
            key: 'lastModified',
            sorter: true,
            render: (date: Date) => (
                <span>{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>
            ),
        },
        {
            title: '语言',
            dataIndex: 'languageId',
            key: 'languageId',
            render: (language: string) => (
                <Tag color="blue">{language}</Tag>
            ),
        },
        {
            title: '复杂度',
            dataIndex: ['contentAnalysis', 'complexity'],
            key: 'complexity',
            render: (complexity: string) => {
                const colors = {
                    simple: 'green',
                    medium: 'orange',
                    complex: 'red'
                };
                return <Tag color={colors[complexity as keyof typeof colors]}>{complexity}</Tag>;
            },
        },
        {
            title: '特性',
            key: 'features',
            render: (record: FileInfo) => (
                <Space size="small">
                    {record.contentAnalysis.hasCodeBlocks && <Tooltip title="包含代码块"><CodeOutlined /></Tooltip>}
                    {record.contentAnalysis.hasImages && <Tooltip title="包含图片"><PictureOutlined /></Tooltip>}
                    {record.contentAnalysis.hasTables && <Tooltip title="包含表格"><TableIcon /></Tooltip>}
                    {record.contentAnalysis.hasMath && <Tooltip title="包含数学公式"><FunctionOutlined /></Tooltip>}
                </Space>
            ),
        },
        {
            title: '统计',
            key: 'stats',
            render: (record: FileInfo) => (
                <div className="text-xs">
                    <div>字数: {record.documentStats.wordCount}</div>
                    <div>阅读: {record.documentStats.readingTimeMinutes}分钟</div>
                </div>
            ),
        },
    ];

    // 处理表格排序
    const handleTableChange = (_: any, __: any, sorter: any) => {
        if (sorter.field) {
            setSort({
                field: sorter.field,
                order: sorter.order === 'ascend' ? 'ascend' : 'descend'
            });
        }
    };

    // 处理行选择
    const handleRowSelection = {
        selectedRowKeys: selectedFiles,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedFiles(selectedRowKeys as string[]);
        },
    };

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
                </Tooltip>
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
                            <span>{dayjs(file.lastModified).format('MM-DD HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag color={file.contentAnalysis.complexity === 'simple' ? 'green' : file.contentAnalysis.complexity === 'medium' ? 'orange' : 'red'}>
                                {file.contentAnalysis.complexity}
                            </Tag>
                            <Space size="small">
                                {file.contentAnalysis.hasCodeBlocks && <CodeOutlined className="text-blue-500" />}
                                {file.contentAnalysis.hasImages && <PictureOutlined className="text-green-500" />}
                                {file.contentAnalysis.hasTables && <TableIcon className="text-purple-500" />}
                                {file.contentAnalysis.hasMath && <FunctionOutlined className="text-red-500" />}
                            </Space>
                        </div>
                        <div className="text-xs text-gray-600">
                            {file.documentStats.wordCount} 字 · {file.documentStats.readingTimeMinutes} 分钟阅读
                        </div>
                    </div>
                }
            />
        </Card>
    );

    const totalStats = getTotalStats();
    const uniqueLanguages = getUniqueLanguages();
    const uniqueComplexities = getUniqueComplexities();

    return (
        <div className="p-6">
            {/* 标题和统计 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">文件元数据管理</h1>
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
                        type={viewMode === 'table' ? 'primary' : 'default'}
                        onClick={() => setViewMode('table')}
                    >
                    </Button>
                    <Button
                        icon={<AppstoreOutlined />}
                        type={viewMode === 'card' ? 'primary' : 'default'}
                        onClick={() => setViewMode('card')}
                    >
                    </Button>
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
                        type={showFilters ? 'primary' : 'default'}
                    >
                    </Button>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={clearFilter}
                    >
                    </Button>
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
                                style={{ width: '100%' }}
                            >
                                {uniqueLanguages.map(lang => (
                                    <Option key={lang} value={lang}>{lang}</Option>
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
                                style={{ width: '100%' }}
                            >
                                {uniqueComplexities.map(comp => (
                                    <Option key={comp} value={comp}>{comp}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <div className="mb-2">特性</div>
                            <div className="space-y-2">
                                <div>
                                    <Switch
                                        checked={filter.hasCodeBlocks === true}
                                        onChange={(checked) => setFilter({ hasCodeBlocks: checked ? true : null })}
                                    />
                                    <span className="ml-2">包含代码块</span>
                                </div>
                                <div>
                                    <Switch
                                        checked={filter.hasImages === true}
                                        onChange={(checked) => setFilter({ hasImages: checked ? true : null })}
                                    />
                                    <span className="ml-2">包含图片</span>
                                </div>
                                <div>
                                    <Switch
                                        checked={filter.hasTables === true}
                                        onChange={(checked) => setFilter({ hasTables: checked ? true : null })}
                                    />
                                    <span className="ml-2">包含表格</span>
                                </div>
                                <div>
                                    <Switch
                                        checked={filter.hasMath === true}
                                        onChange={(checked) => setFilter({ hasMath: checked ? true : null })}
                                    />
                                    <span className="ml-2">包含数学公式</span>
                                </div>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="mb-2">修改时间</div>
                            <RangePicker
                                value={filter.dateRange[0] && filter.dateRange[1] ? [dayjs(filter.dateRange[0]), dayjs(filter.dateRange[1])] : null}
                                onChange={(dates) => {
                                    if (dates) {
                                        setFilter({
                                            dateRange: [dates[0]?.toDate() || null, dates[1]?.toDate() || null]
                                        });
                                    } else {
                                        setFilter({ dateRange: [null, null] });
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                </Card>
            )}

            {/* 内容区域 */}
            {viewMode === 'table' ? (
                <Table
                    columns={columns}
                    dataSource={filteredFiles}
                    rowKey="filePath"
                    loading={isLoading}
                    onChange={handleTableChange}
                    rowSelection={handleRowSelection}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                    }}
                />
            ) : (
                <Row gutter={16}>
                    {filteredFiles.map(file => (
                        <Col key={file.filePath} xs={24} sm={12} md={8} lg={6}>
                            {renderCard(file)}
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default FileMetadataView;