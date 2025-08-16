import { useMarkdownStore } from '../../store/markdown/store';
import { ExtensionCommand, UpdateMarkdownMessage } from '@supernode/shared';

export class MessageReceiveHandler {
    init(): void {
        window.addEventListener("message", this.handleMessage);
    }

    destroy(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    private handleMessage = (event: MessageEvent): void => {
        const message = event.data;
        const { setContent, setCurrentFileName, setIsLoading } = useMarkdownStore.getState();

        switch (message.command) {
            case ExtensionCommand.updateMarkdownContent:
                const updateMessage = message as UpdateMarkdownMessage;
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