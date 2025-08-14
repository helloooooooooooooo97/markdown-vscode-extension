"use strict";
exports.__esModule = true;
exports.EXTENSION_DISPLAY_NAME = exports.WEBVIEW_VIEW_TYPE = exports.MESSAGE_COMMANDS = exports.COMMANDS = void 0;
// VSCode 扩展命令常量
exports.COMMANDS = {
    OPEN_PREVIEW: "supernode.openPreview",
    UPDATE_CONTENT: "supernode.updateContent"
};
// Webview 消息命令常量
exports.MESSAGE_COMMANDS = {
    UPDATE_MARKDOWN: "updateMarkdownContent",
    BUTTON_CLICKED: "buttonClicked",
    SHOW_MESSAGE: "showMessage"
};
// Webview 视图类型
exports.WEBVIEW_VIEW_TYPE = "supernodeWebview";
// 扩展显示名称
exports.EXTENSION_DISPLAY_NAME = "Supernode Extension";
