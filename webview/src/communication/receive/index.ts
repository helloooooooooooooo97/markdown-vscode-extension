import { joinPath, ExtensionCommand, FileType, ReadFileContentResponseMessage, UpdateFileMetadataMessage, UpdateMarkdownMessage, VscodeEventSource, LoadPinnedQueriesResponseMessage } from '@supernode/shared';
import { useMarkdownStore } from '../../store/markdown/store';
import { useFileStore } from '../../store/file/store';
import { usePinStore } from '../../store/pin/store';
import { PinUtil } from '../../store/pin/utils';
import BlockSchemaParser from '../../pkg/utils/blockSchemParser';
import { ExcalidrawUtil } from '../../components/markdown/BlockExcalidraw/Util';
import { BlockType } from '../../store/markdown/type';
import { isEqual } from 'lodash';

export class MessageReceiveHandler {
    init(): void {
        window.addEventListener("message", this.handleMessage);
    }

    destroy(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    private handleMessage = (event: MessageEvent): void => {
        const message = event.data;
        switch (message.command as ExtensionCommand) {
            case ExtensionCommand.updateMarkdownContent:
                console.log("updateMarkdownContent", message);
                this.handleUpdateMarkdownContent(message);
                break;
            case ExtensionCommand.updateFileMetadata:
                this.handleUpdateFileMetadata(message);
                break;
            case ExtensionCommand.readFileContentResponse:
                this.handleReadFileContentResponse(message);
                break;
            case ExtensionCommand.loadPinnedQueriesResponse:
                this.handleLoadPinnedQueriesResponse(message);
                break;
            default:
                console.warn(`未处理的命令: ${JSON.stringify(message)}`);
        }
    };

    private handleUpdateMarkdownContent = (message: UpdateMarkdownMessage) => {
        const { setCurrentFileName, setSource, setBlocks, blocks: latestBlocks } = useMarkdownStore.getState();
        const updateMessage = message as UpdateMarkdownMessage;
        setSource(VscodeEventSource.FILE);
        const blockSchemaParser = new BlockSchemaParser(updateMessage.content);
        const newBlocks = blockSchemaParser.parse();

        // 对于 Excalidraw，如果路径没变就保持原有的 storage
        const preservedBlocks = newBlocks.map(newBlock => {
            if (newBlock.type === BlockType.Excalidraw) {
                const newRefer = ExcalidrawUtil.extractReferFromLine(newBlock.lines[0] || "");
                // 查找现有的 Excalidraw block
                const existingBlock = latestBlocks.find(existing => {
                    if (existing.type !== BlockType.Excalidraw) return false;
                    const existingRefer = ExcalidrawUtil.extractReferFromLine(existing.lines[0] || "");
                    return newRefer === existingRefer;
                });

                if (existingBlock) {
                    // 保持原有的 storage 和 isLoading 状态
                    return {
                        ...newBlock,
                        storage: existingBlock.storage,
                        isLoading: existingBlock.isLoading
                    };
                }
            }
            return newBlock;
        });

        if (isEqual(preservedBlocks, latestBlocks)) {
            return;
        }
        setBlocks(preservedBlocks);
        if (updateMessage.fileName) {
            setCurrentFileName(updateMessage.fileName);
        }
    }

    private handleUpdateFileMetadata = (message: UpdateFileMetadataMessage) => {
        const { setFiles, setIsLoading } = useFileStore.getState();
        setFiles(message.files);
        setIsLoading(false);
    }


    private handleReadFileContentResponse = (message: ReadFileContentResponseMessage) => {
        const { updateBlockStorage, updateBlockIsLoading, filePath, blocks, setSource } = useMarkdownStore.getState();
        if (message.success && message.filePath) {
            if (message.fileType === FileType.Excalidraw) {
                const excalidrawData = ExcalidrawUtil.storage2View(message.content);
                const targetBlock = blocks.find(block => {
                    if (block.type !== BlockType.Excalidraw) return false;
                    const line = block.lines[0] || "";
                    const refer = ExcalidrawUtil.extractReferFromLine(line);
                    if (!refer) return false;
                    const blockFilePath = joinPath(filePath, refer);
                    return blockFilePath === message.filePath;
                });
                if (targetBlock) {
                    console.log("更新Excalidraw数据:", targetBlock.id);
                    updateBlockStorage(targetBlock.id, excalidrawData);
                    updateBlockIsLoading(targetBlock.id, false);
                }

                // 恢复source为WEBVIEW
                setTimeout(() => {
                    setSource(VscodeEventSource.WEBVIEW);
                }, 100);
            }
        }
    }

    private handleLoadPinnedQueriesResponse = (message: LoadPinnedQueriesResponseMessage) => {
        const { setPinnedQueries } = usePinStore.getState();
        if (message.success) {
            console.log("PIN数据加载成功:", message.queries);

            // 使用工具函数修复反序列化后的数据
            const fixedQueries = message.queries.map((query: any) => PinUtil.fixPinnedQuery(query));

            setPinnedQueries(fixedQueries);
        } else {
            console.error("PIN数据加载失败:", message.error);
        }
    }
}