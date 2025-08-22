import { useMarkdownStore } from '../../store/markdown/store';
import { useFileStore } from '../../store/file/store';
import { ExtensionCommand, UpdateMarkdownMessage, VscodeEventSource } from '@supernode/shared';
import BlockSchemaParser from '../../pkg/utils/blockSchemParser';
import { testMarkdown } from '../../store/markdown/factory';

export class MessageReceiveHandler {
    init(): void {
        window.addEventListener("message", this.handleMessage);
    }

    destroy(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    private handleMessage = (event: MessageEvent): void => {
        const message = event.data;
        const { setCurrentFileName, setIsLoading, setSource, setBlocks } = useMarkdownStore.getState();
        const { setFiles, setIsLoading: setFileLoading } = useFileStore.getState();
        switch (message.command as ExtensionCommand) {
            case ExtensionCommand.updateMarkdownContent:
                const updateMessage = message as UpdateMarkdownMessage;
                // 设置事件来源为extension，防止store变化时往extension反向同步
                setSource(VscodeEventSource.MARKDOWNFILE);
                const blockSchemaParser = new BlockSchemaParser(updateMessage.content || testMarkdown);
                const blocks = blockSchemaParser.parse();
                setBlocks(blocks);
                if (updateMessage.fileName) {
                    setCurrentFileName(updateMessage.fileName);
                }
                setIsLoading(false);
                break;
            case ExtensionCommand.updateFileMetadata:
                console.log("收到文件元数据更新:", message.files);
                setFiles(message.files);
                setFileLoading(false);
                break;
            default:
                console.warn(`未处理的命令: ${message.command}`);
        }
    };
} 