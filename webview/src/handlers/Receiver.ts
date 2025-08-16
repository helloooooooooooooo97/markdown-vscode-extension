import { useMarkdownStore } from '../store/markdown/store';

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
            case "updateMarkdownContent":
                setContent(message.content || "");
                if (message.fileName) {
                    setCurrentFileName(message.fileName);
                }
                setIsLoading(false);
                break;
            case "showMessage":
                console.log("收到消息:", message.text);
                break;
            default:
                console.warn(`未处理的命令: ${message.command}`);
        }
    }
} 