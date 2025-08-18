import { useMarkdownStore } from '../../store/markdown/store';
import { ExtensionCommand, UpdateMarkdownMessage, VscodeEventSource } from '@supernode/shared';

export class MessageReceiveHandler {
    init(): void {
        window.addEventListener("message", this.handleMessage);
    }

    destroy(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    private handleMessage = (event: MessageEvent): void => {
        const message = event.data;
        const { setContent, setCurrentFileName, setIsLoading, setSource } = useMarkdownStore.getState();

        switch (message.command) {
            case ExtensionCommand.updateMarkdownContent:
                const updateMessage = message as UpdateMarkdownMessage;
                // 设置事件来源为extension，防止store变化时往extension反向同步
                setSource(VscodeEventSource.MARKDOWNFILE);
                setContent(updateMessage.content || "");
                if (updateMessage.fileName) {
                    setCurrentFileName(updateMessage.fileName);
                }
                setIsLoading(false);
                break;

            default:
                console.warn(`未处理的命令: ${message.command}`);
        }
    };
} 