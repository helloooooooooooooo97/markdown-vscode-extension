import React, { useState, useEffect } from "react";
import { getDataType, getTypeIcon, renderInputComponentByValueType } from "./BlockFrontMatter";
import useMarkdownStore from "../../../store/markdown/store";
import matter from "gray-matter";
import { PlusOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Popover, Input, Button } from "antd";

// 支持的数据类型
const SUPPORTED_TYPES = [
    { value: 'string', label: '字符串', icon: '📝' },
    { value: 'number', label: '数字', icon: '🔢' },
    { value: 'boolean', label: '布尔值', icon: '✅' },
    { value: 'date', label: '日期', icon: '📅' },
    { value: 'array', label: '数组', icon: '📋' },
    { value: 'object', label: '对象', icon: '📦' },
];

// 根据类型创建默认值
const getDefaultValueByType = (type: string) => {
    switch (type) {
        case 'string':
            return '';
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'date':
            return new Date().toISOString().split('T')[0];
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return '';
    }
};

// Frontmatter 组件 - 根据数据类型展示
export const FrontmatterComponent: React.FC<{
    data: Record<string, any>;
    blockId: string;
}> = ({ data, blockId }) => {
    // 编辑状态管理
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<Record<string, any>>(data);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPropertyName, setNewPropertyName] = useState('');
    const [newPropertyType, setNewPropertyType] = useState('string');

    // 属性名称编辑状态
    const [editingPropertyName, setEditingPropertyName] = useState<string | null>(null);
    const [editingPropertyNameValue, setEditingPropertyNameValue] = useState('');
    const [isRenamePopoverVisible, setIsRenamePopoverVisible] = useState(false);

    const store = useMarkdownStore();

    // 监听 editingData 的变化
    useEffect(() => {

        // 使用 gray-matter 将 JSON 转换为 frontmatter 字符串
        const frontmatterString = matter.stringify('', editingData);

        // 按行分割 frontmatter 字符串
        const frontmatterLines = frontmatterString.split('\n');

        // 更新 store
        store.updateBlock(blockId, frontmatterLines);
    }, [editingData]);

    // 开始编辑
    const handleEditStart = (key: string) => {
        setEditingKey(key);
    };

    // 结束编辑
    const handleEditEnd = () => {
        setEditingKey(null);
    };

    // 处理值变化
    const handleValueChange = (key: string, newValue: any) => {
        setEditingData(prev => ({
            ...prev,
            [key]: newValue
        }));

        // 这里可以添加保存到后端的逻辑
        console.log(`更新 ${key}:`, newValue);
    };

    // 添加新属性
    const handleAddProperty = () => {
        if (newPropertyName.trim()) {
            const defaultValue = getDefaultValueByType(newPropertyType);
            setEditingData(prev => ({
                ...prev,
                [newPropertyName.trim()]: defaultValue
            }));

            // 重置表单
            setNewPropertyName('');
            setNewPropertyType('string');
            setShowAddForm(false);
        }
    };

    // 删除属性
    const handleDeleteProperty = (key: string) => {
        setEditingData(prev => {
            const newData = { ...prev };
            delete newData[key];
            return newData;
        });
    };

    // 开始编辑属性名称
    const handleStartEditPropertyName = (key: string) => {
        setEditingPropertyName(key);
        setEditingPropertyNameValue(key);
        setIsRenamePopoverVisible(true);
    };

    // 保存属性名称编辑
    const handleSavePropertyName = () => {
        if (editingPropertyName && editingPropertyNameValue.trim() && editingPropertyNameValue !== editingPropertyName) {
            const oldKey = editingPropertyName;
            const newKey = editingPropertyNameValue.trim();

            setEditingData(prev => {
                const newData = { ...prev };
                newData[newKey] = newData[oldKey];
                delete newData[oldKey];
                return newData;
            });
        }
        setEditingPropertyName(null);
        setEditingPropertyNameValue('');
        setIsRenamePopoverVisible(false);
    };

    // 取消属性名称编辑
    const handleCancelPropertyNameEdit = () => {
        setEditingPropertyName(null);
        setEditingPropertyNameValue('');
        setIsRenamePopoverVisible(false);
    };



    return (
        <div className="flex flex-col gap-2">
            {/* 现有属性列表 */}
            {Object.entries(editingData).map(([key, value]) => {
                const dataType = getDataType(value);
                const isEditing = editingKey === key;
                return (
                    <div
                        key={key}
                        className="flex gap-20 hover:bg-[#252526] rounded-md px-2 h-8 cursor-pointer group relative"
                    >
                        <div className="w-20 flex items-center gap-2 text-[#838383] font-semibold">
                            {/* 图标 */}
                            <div>
                                {getTypeIcon(dataType)}
                            </div>
                            {/* 属性名称 */}
                            <div className="flex items-center gap-2">
                                <Popover
                                    open={isRenamePopoverVisible && editingPropertyName === key}
                                    onOpenChange={(visible) => {
                                        if (visible) {
                                            handleStartEditPropertyName(key);
                                        } else {
                                            handleCancelPropertyNameEdit();
                                        }
                                    }}
                                    content={
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editingPropertyNameValue}
                                                onChange={(e) => setEditingPropertyNameValue(e.target.value)}
                                                placeholder="请输入新的属性名称"
                                                onPressEnter={handleSavePropertyName}
                                                autoFocus
                                                className="flex-1"
                                            />
                                            <div
                                                onClick={() => {
                                                    if (editingPropertyName) {
                                                        handleDeleteProperty(editingPropertyName);
                                                    }
                                                    handleCancelPropertyNameEdit();
                                                }}
                                            >
                                                <DeleteOutlined className="text-red-500 cursor-pointer" />
                                            </div>
                                            <div onClick={handleSavePropertyName}>
                                                <CheckOutlined className="text-green-500 cursor-pointer" />
                                            </div>
                                        </div>
                                    }
                                    trigger="click"
                                    placement="bottomLeft"
                                >
                                    <span
                                        className="hover:text-white transition-colors cursor-pointer"
                                    >
                                        {key}
                                    </span>
                                </Popover>
                            </div>
                        </div>
                        {/* 值展示/编辑区域 */}
                        <div className="flex-1 flex items-center">
                            {renderInputComponentByValueType(
                                value,
                                isEditing,
                                (newValue) => handleValueChange(key, newValue),
                                () => handleEditStart(key),
                                handleEditEnd
                            )}
                        </div>
                    </div>
                );
            })}

            {/* 添加新属性表单 */}
            {showAddForm && (
                <div className="border border-gray-600 rounded-md p-3 bg-[#1e1e1e]">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="属性名称"
                                value={newPropertyName}
                                onChange={(e) => setNewPropertyName(e.target.value)}
                                className="w-full px-2 py-1 bg-[#252526] border border-gray-600 rounded text-white"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddProperty();
                                    }
                                }}
                            />
                        </div>
                        <div className="w-32">
                            <select
                                value={newPropertyType}
                                onChange={(e) => setNewPropertyType(e.target.value)}
                                className="w-full px-2 py-1 bg-[#252526] border border-gray-600 rounded text-white"
                            >
                                {SUPPORTED_TYPES.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddProperty}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            >
                                添加
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 添加属性按钮 */}
            {!showAddForm && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-2 py-1 w-20 flex items-center gap-2 text-[#838383] font-semibold"
                >
                    <PlusOutlined />
                    <span>add</span>
                </button>
            )}


        </div>
    );
};

export default FrontmatterComponent;