export const testMarkdown = `

---
title: 复杂文档示例
author: 张三
updatedAt: '2025-08-02T07:25:09.456Z'
createdAt: '2024-06-01T12:00:00.000Z'
tags: ["示例", "复杂", "多功能"]
categories:
  - 教程
  - 测试
metadata:
  version: 1.2.3
  draft: false
  contributors:
    - name: 李四
      email: li.si@example.com
    - name: 王五
      email: wang.wu@example.com
todo: false
---

# 复杂文档标题

## 二级标题

### 三级标题

正文内容，包含**加粗**、*斜体*、~~删除线~~、[链接](https://example.com)和图片：

![示例图片](https://placekitten.com/200/300)

> 这是一个引用块，支持多行。
> 第二行引用。

- 列表项一
- 列表项二
  - 嵌套项 2.1
  - 嵌套项 2.2

1. 有序列表一
2. 有序列表二

#### 表格

| 姓名 | 年龄 | 邮箱                |
|------|------|---------------------|
| 张三 | 28   | zhang.san@ex.com    |
| 李四 | 32   | li.si@ex.com        |



#### 代码块

\`\`\`python
import math

def area_of_circle(r):
    return math.pi * r ** 2

print("半径为 5 的圆面积：", area_of_circle(5))
\`\`\`

\`\`\`javascript
// 计算斐波那契数列
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
\`\`\`


#### HTML 示例

\`\`\`html
<div style="color: red;">这是红色文本</div>
\`\`\`

---

#### 复杂嵌套

- 列表
  1. 有序
     - 嵌套无序
        1. 更深层次
           - 继续嵌套
`
