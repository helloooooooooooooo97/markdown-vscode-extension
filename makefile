# VSCode 插件开发 Makefile

.PHONY: help install build clean dev debug test watch auto

# 默认目标
help:
	@echo "VSCode 插件开发命令:"
	@echo "  install    - 安装所有依赖"
	@echo "  build      - 构建所有包"
	@echo "  clean      - 清理构建文件"
	@echo "  dev        - 启动开发模式（监听文件变化）"
	@echo "  debug      - 快速构建并准备调试"
	@echo "  test       - 运行测试"
	@echo "  watch      - 监听模式构建"
	@echo "  auto       - 自动构建模式（推荐）"

# 安装依赖
install:
	@echo "安装所有依赖..."
	npm run install:all

# 构建所有包
build:
	@echo "构建所有包..."
	npm run build

# 清理构建文件
clean:
	@echo "清理构建文件..."
	npm run clean

# 开发模式
dev:
	@echo "启动开发模式..."
	npm run dev

# 快速调试构建
debug: build
	@echo "✅ 构建完成，可以按 F5 启动调试"
	@echo "📝 调试步骤:"
	@echo "  1. 在 VSCode 中按 F5"
	@echo "  2. 在新窗口中打开 test.md"
	@echo "  3. 使用命令面板运行 'Supernode: 打开 Markdown 预览'"

# 监听模式构建
watch:
	@echo "启动监听模式..."
	@echo "监听 extension 变化..."
	cd extension && npm run watch &
	@echo "监听 webview 变化..."
	cd webview && npm run build:watch &
	@echo "✅ 监听模式已启动，按 Ctrl+C 停止"

# 自动构建模式（推荐）
auto:
	@echo "启动自动构建模式..."
	@echo "📝 此模式会："
	@echo "  - 监听所有文件变化"
	@echo "  - 自动重新构建"
	@echo "  - 自动更新扩展"
	@echo "  - 按 Ctrl+C 停止"
	npm run dev

# 快速重启（清理并重新构建）
restart: clean build
	@echo "✅ 重启完成"

# 检查构建状态
status:
	@echo "检查构建状态..."
	@echo "📁 Extension 构建文件:"
	@ls -la extension/dist/ 2>/dev/null || echo "  ❌ 未构建"
	@echo "📁 Webview 构建文件:"
	@ls -la webview/dist/ 2>/dev/null || echo "  ❌ 未构建"
	@echo "📁 Shared 构建文件:"
	@ls -la shared/dist/ 2>/dev/null || echo "  ❌ 未构建"

# 一键启动（安装依赖 + 构建 + 调试准备）
start: install build debug
