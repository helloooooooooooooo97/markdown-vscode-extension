// VSCode 扩展命令常量
export const COMMANDS = {
  OPEN_PREVIEW: "supernode.openPreview",
  UPDATE_CONTENT: "supernode.updateContent",
} as const;

// Webview 消息命令常量
export const MESSAGE_COMMANDS = {
  UPDATE_MARKDOWN: "updateMarkdownContent",
  BUTTON_CLICKED: "buttonClicked",
  SHOW_MESSAGE: "showMessage",
} as const;

// Webview 视图类型
export const WEBVIEW_VIEW_TYPE = "supernodeWebview";

// 扩展显示名称
export const EXTENSION_DISPLAY_NAME = "Supernode Extension";
