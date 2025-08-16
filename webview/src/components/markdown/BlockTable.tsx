import React, { useState, useMemo } from 'react';
import { Table as AntTable, Input, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
export const Table: React.FC<{
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
    blockId: string;
}> = ({ headers, rows }) => {
    const [searchText, setSearchText] = useState('');
    // 转换数据格式为 Ant Design Table 需要的格式
    const columns: ColumnsType<any> = headers.map((header, index) => ({
        title: header,
        dataIndex: `col${index}`,
        key: `col${index}`,
        render: (text: any) => text,
        sorter: (a: any, b: any) => {
            const aText = String(a[`col${index}`] || '').toLowerCase();
            const bText = String(b[`col${index}`] || '').toLowerCase();
            return aText.localeCompare(bText);
        },
        sortDirections: ['ascend', 'descend'],
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        // 自动聚焦搜索框
                        if (node) {
                            setTimeout(() => node.focus(), 100);
                        }
                    }}
                    placeholder={`搜索 ${header}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm({ closeDropdown: true })}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm({ closeDropdown: true })}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={{ width: 90 }}
                    >
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) => {
            const cellValue = String(record[`col${index}`] || '');
            return cellValue.toLowerCase().includes(String(value).toLowerCase());
        },
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => {
                    const searchInput = document.querySelector('.ant-table-filter-dropdown input') as HTMLInputElement;
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
        },
    }));

    const dataSource = useMemo(() => {
        return rows.map((row, rowIndex) => {
            const rowData: any = { key: rowIndex };
            row.forEach((cell, cellIndex) => {
                rowData[`col${cellIndex}`] = cell;
            });
            return rowData;
        });
    }, [rows]);

    // 全局搜索功能
    const filteredDataSource = useMemo(() => {
        if (!searchText) return dataSource;

        return dataSource.filter((record) => {
            return Object.keys(record).some((key) => {
                if (key === 'key') return false;
                const value = String(record[key] || '');
                return value.toLowerCase().includes(searchText.toLowerCase());
            });
        });
    }, [dataSource, searchText]);

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleReset = () => {
        setSearchText('');
    };

    return (
        <div style={{ margin: '16px 0' }}>
            {/* 全局搜索栏 */}
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Input
                        placeholder="全局搜索表格内容..."
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                    <Button
                        onClick={handleReset}
                        icon={<ReloadOutlined />}
                        size="small"
                    >
                        重置
                    </Button>
                </Space>
            </div>

            <AntTable
                columns={columns}
                dataSource={filteredDataSource}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
                size="small"
                bordered
                className="markdown-table"
                scroll={{ x: 'max-content' }}
                rowKey="key"
            />
        </div>
    );
};

export default Table;