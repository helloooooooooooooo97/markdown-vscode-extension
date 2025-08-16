

# 文件结构
- event：监听事件
  - command ： 监听vscode的command的用户输入事件
  - listener： 监听vscode的对文件的操作 
  - webview ： 监听vscode的webview传来的事件

- controller： 处理事件
  - webview： 处理webview传来的事件 
  - command： 处理vscode的command的用户输入事件
  - listener： 处理vscode的对文件的操作

- service： 服务 vscode调用的服务
  - configuration： 配置
  - file： 文件
  - markdown_file_analyzer： markdown文件分析
  - status_bar_manager： 状态栏管理
  - auto_preview： 自动预览