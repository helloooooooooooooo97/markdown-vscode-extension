export const testMarkdown = `---
title: "Markdown 演示文档"
author: "演示者"
date: "2024-12-19"
tags: ["演示", "PPT", "Markdown"]
---
[ ] 1
[ ] 2
[ ] 3

--- ppt1

> 这是一个引用块213221
> 可以包含多行内容
> 用于突出重要信息

# Markdown 功能演示

## 欢迎使用我们的 Markdown 编辑器

这是一个功能丰富的 Markdown 编辑器，支持多种格式和交互功能。

--- ppt2

## 基础文本格式

### 文本样式
- **粗体文本** - 用于强调重要内容
- *斜体文本* - 用于突出关键词
- ~~删除线~~ - 表示已废弃的内容
- \`行内代码\` - 用于技术术语

### 链接和图片
- [访问我们的网站](https://example.com)
- ![示例图片](https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=示例图片)

--- ppt3

## 列表和结构

### 无序列表
- 第一项
- 第二项
  - 嵌套项 2.1
  - 嵌套项 2.2
- 第三项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

--- ppt4

## 表格展示

| 功能 | 状态 | 描述 |
|------|------|------|
| 基础解析 | ✅ | 支持标题、段落、列表 |
| 表格 | ✅ | 支持复杂表格结构 |
| 代码块 | ✅ | 支持语法高亮 |
| 数学公式 | ✅ | 支持 LaTeX 渲染 |

--- ppt5

## 代码示例

### Python 代码
\`\`\`python
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 测试
print("斐波那契数列前10项:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

--- ppt6

## 数学公式

### 行内公式
这是一个行内公式：$E = mc^2$

### 块级公式
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

### 复杂公式
$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}
$$

--- ppt7

## 信息块

:::info
这是一个信息块，用于显示重要的提示信息。
:::

:::warning
这是一个警告块，用于提醒用户注意某些事项。
:::

:::error
这是一个错误块，用于显示错误或问题。
:::

--- ppt8

## 待办事项

[ ] 完成基础功能开发
[ ] 添加高级特性
[✓] 编写文档
[ ] 进行用户测试
[ ] 发布正式版本

--- ppt9
## 引用和注释

> 这是一个引用块
> 可以包含多行内容
> 用于突出重要信息

### 脚注示例
这里是一个脚注示例[^1]。

[^1]: 这是脚注的内容，会在页面底部显示。

--- ppt10

## 高级功能

### HTML 嵌入
<iframe src="https://www.google.com" width="100%" height="300" sandbox="allow-scripts"></iframe>

--- ppt11

--- ppt12
## 图表测试

<BlockExcalidraw refer="docs/test.excalidraw">

--- ppt13       

## 总结

### 主要特性
- ✅ 完整的 Markdown 语法支持
- ✅ 实时预览和编辑
- ✅ 多种主题和样式
- ✅ 导出多种格式
- ✅ 协作编辑功能

### 技术栈
- **前端**: React + TypeScript
- **样式**: Tailwind CSS
- **解析**: 自定义解析器
- **渲染**: KaTeX + Prism.js

--- ppt14

## 谢谢观看

### 联系方式
- 📧 Email: demo@example.com
- 🌐 Website: https://example.com
- 📱 Phone: +86 123-4567-8900

### 项目链接
- [GitHub 仓库](https://github.com/example/markdown-editor)
- [在线演示](https://demo.example.com)
- [文档中心](https://docs.example.com)

--- ppt15

## 演示结束，感谢您的关注!
`;
