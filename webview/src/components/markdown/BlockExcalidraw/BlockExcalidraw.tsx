import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { Card } from 'antd';
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { debounce, isEqual } from 'lodash';
import { VSCodeAPI } from '../../../communication/send/api';
import { Excalidraw } from "@excalidraw/excalidraw";
import { joinPath } from '@supernode/shared';
import useMarkdownStore from '../../../store/markdown/store';
import ExcalidrawUtil, { ExcalidrawFiles, ExcalidrawAppState } from './Util';


interface BlockExcalidrawProps {
    refer: string;
    blockId: string;
}

const BlockExcalidraw: React.FC<BlockExcalidrawProps> = ({ refer, blockId }) => {
    const { filePath, blocks, updateBlockStorage } = useMarkdownStore();
    const absPath = useMemo(() => joinPath(filePath, refer), [refer, filePath]);
    const currentBlock = useMemo(() => blocks.find(block => block.id === blockId), [blocks, blockId]);
    const excalidrawData = useMemo(() => currentBlock?.storage || ExcalidrawUtil.emptyExcalidrawData, [currentBlock]);

    // 跟踪上一次的数据，避免重复更新
    const lastDataRef = useRef<any>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // 加载 Excalidraw 数据
        if (absPath && VSCodeAPI.getInstance()) {
            console.log("Loading Excalidraw data for:", absPath);
            VSCodeAPI.loadExcalidrawData(absPath);
        }
    }, [absPath]);

    // 防抖的 change 处理函数
    const handleChange = useCallback(
        debounce((elements: ExcalidrawElement[], appState: ExcalidrawAppState, files: ExcalidrawFiles) => {
            const newData = ExcalidrawUtil.View2Storage(elements, appState, files);
            if (!isEqual(lastDataRef.current, newData)) {
                console.log("Excalidraw data changed, updating storage");
                lastDataRef.current = newData;
                updateBlockStorage(blockId, newData);
            }
        }, 100),
        [blockId, updateBlockStorage]
    );

    // 同步外部数据更新
    useEffect(() => {
        if (excalidrawData && !isEqual(lastDataRef.current, excalidrawData)) {
            lastDataRef.current = excalidrawData;
        }
    }, [excalidrawData]);

    // 清理函数
    useEffect(() => {
        return () => {
            handleChange.cancel();
        };
    }, [handleChange]);

    const onChangeHandler = useCallback((elements: any, appState: any, files: any) => {
        // 跳过第一次渲染时的触发
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handleChange(elements as ExcalidrawElement[], appState, files);
    }, [handleChange]);

    return (
        <div className="min-h-[70vh] rounded-md overflow-hidden relative">
            <div style={{ height: '70vh' }}>
                {currentBlock?.isLoading ?
                    <Excalidraw
                        key={`excalidraw-loading-${blockId}`}
                        initialData={ExcalidrawUtil.emptyExcalidrawData}
                        onChange={onChangeHandler}
                    />
                    :
                    <Excalidraw
                        key={`excalidraw-${blockId}`}
                        initialData={{
                            elements: excalidrawData.elements || ExcalidrawUtil.emptyExcalidrawData.elements,
                            appState: excalidrawData.appState || ExcalidrawUtil.emptyExcalidrawData.appState,
                            files: excalidrawData.files || ExcalidrawUtil.emptyExcalidrawData.files,
                        }}
                        onChange={onChangeHandler}
                    />
                }
            </div>
        </div>
    );
};

export default BlockExcalidraw;