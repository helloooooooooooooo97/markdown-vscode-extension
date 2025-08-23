import * as vscode from 'vscode';

export class MarkdownCompletionProvider implements vscode.CompletionItemProvider {
    private static instance: MarkdownCompletionProvider;

    public static getInstance(): MarkdownCompletionProvider {
        if (!MarkdownCompletionProvider.instance) {
            MarkdownCompletionProvider.instance = new MarkdownCompletionProvider();
        }
        return MarkdownCompletionProvider.instance;
    }

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        console.log('CompletionProvider called for:', document.fileName);
        const items: vscode.CompletionItem[] = [];

        // 检查是否在 Markdown 或 MDX 文件中
        if (!this.isMarkdownFile(document)) {
            console.log('Not a markdown file, returning empty items');
            return items;
        }

        // 获取当前行的文本
        const lineText = document.lineAt(position.line).text;
        const linePrefix = lineText.substring(0, position.character);
        console.log('Line prefix:', linePrefix);

        // 检查是否包含 /
        console.log('Checking if line contains /, linePrefix:', JSON.stringify(linePrefix));
        if (!linePrefix.includes('/')) {
            console.log('Line does not contain /, returning empty items');
            return items;
        }
        console.log('Line contains /, proceeding with completions');

        // 找到 / 的位置，并计算正确的替换范围
        const slashIndex = linePrefix.lastIndexOf('/');
        console.log('Slash index:', slashIndex, 'Position character:', position.character);
        console.log('Line text:', JSON.stringify(lineText));
        console.log('Line prefix:', JSON.stringify(linePrefix));

        const range = new vscode.Range(
            new vscode.Position(position.line, slashIndex),
            position
        );
        console.log('Replacement range:', range.start.character, 'to', range.end.character);

        // 添加各种 Markdown 和自定义组件的快速输入选项
        items.push(...this.getMarkdownCompletions(range));
        items.push(...this.getCustomComponentCompletions(range));

        console.log('Returning', items.length, 'completion items');
        return items;
    }

    private isMarkdownFile(document: vscode.TextDocument): boolean {
        const fileName = document.fileName.toLowerCase();
        return fileName.endsWith('.md') || fileName.endsWith('.mdx');
    }

    private getMarkdownCompletions(range: vscode.Range): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        // 标题
        items.push(this.createCompletionItem('/h1', '一级标题', 'h1', '一级标题', '## ', range));
        items.push(this.createCompletionItem('/h2', '二级标题', 'h2', '二级标题', '### ', range));
        items.push(this.createCompletionItem('/h3', '三级标题', 'h3', '三级标题', '#### ', range));
        items.push(this.createCompletionItem('/h4', '四级标题', 'h4', '四级标题', '##### ', range));
        items.push(this.createCompletionItem('/h5', '五级标题', 'h5', '五级标题', '###### ', range));
        items.push(this.createCompletionItem('/h6', '六级标题', 'h6', '六级标题', '####### ', range));

        // 列表
        items.push(this.createCompletionItem('/ul', '无序列表', 'ul', '无序列表', '- ', range));
        items.push(this.createCompletionItem('/ol', '有序列表', 'ol', '有序列表', '1. ', range));
        items.push(this.createCompletionItem('/li', '列表项', 'li', '列表项', '- ', range));

        // 代码
        items.push(this.createCompletionItem('/codeblock', '代码块', 'codeblock', '代码块', '```\n\n```', range));
        items.push(this.createCompletionItem('/js', 'JavaScript 代码块', 'js', 'JavaScript 代码块', '```javascript\n\n```', range));
        items.push(this.createCompletionItem('/go', 'Go 代码块', 'go', 'Go 代码块', '```go\n\n```', range));
        items.push(this.createCompletionItem('/ts', 'TypeScript 代码块', 'ts', 'TypeScript 代码块', '```typescript\n\n```', range));
        items.push(this.createCompletionItem('/py', 'Python 代码块', 'py', 'Python 代码块', '```python\n\n```', range));
        items.push(this.createCompletionItem('/java', 'Java 代码块', 'java', 'Java 代码块', '```java\n\n```', range));
        items.push(this.createCompletionItem('/cpp', 'C++ 代码块', 'cpp', 'C++ 代码块', '```cpp\n\n```', range));
        items.push(this.createCompletionItem('/c', 'C 代码块', 'c', 'C 代码块', '```c\n\n```', range));
        items.push(this.createCompletionItem('/json', 'JSON 代码块', 'json', 'JSON 代码块', '```json\n\n```', range));

        // 链接和图片
        items.push(this.createCompletionItem('/link', '链接', 'link', '链接', '[链接文本](url)', range));
        items.push(this.createCompletionItem('/img', '图片', 'img', '图片', '![alt文本](图片url)', range));
        items.push(this.createCompletionItem('/ref', '引用链接', 'ref', '引用链接', '[链接文本][引用名]\n\n[引用名]: url', range));

        // 表格
        items.push(this.createCompletionItem('/table', '表格', 'table', '表格', '| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |', range));

        // 引用
        items.push(this.createCompletionItem('/quote', '引用', 'quote', '引用', '> ', range));

        // 分隔线
        items.push(this.createCompletionItem('/hr', '分隔线', 'hr', '分隔线', '---', range));

        // 任务列表
        items.push(this.createCompletionItem('/todo', '待办事项', 'todo', '待办事项', '- [ ] 待办任务', range));
        items.push(this.createCompletionItem('/done', '已完成', 'done', '已完成', '- [x] 已完成任务', range));

        // 数学公式
        items.push(this.createCompletionItem('/math', '行内数学公式', 'math', '行内数学公式', '$公式$', range));
        items.push(this.createCompletionItem('/mathblock', '块级数学公式', 'mathblock', '块级数学公式', '$$\n公式\n$$', range));

        return items;
    }

    private getCustomComponentCompletions(range: vscode.Range): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];

        // Excalidraw 图表
        // 生成一个随机文件名，避免覆盖
        const randomExcalidrawFileName = `ref_${Math.random().toString(36).substring(2, 10)}.excalidraw`;
        items.push(this.createCompletionItem(
            '/excalidraw',
            'Excalidraw 图表',
            'excalidraw',
            'Excalidraw 图表',
            `<BlockExcalidraw refer="./excalidraw/${randomExcalidrawFileName}"/>`,
            range
        ));

        // 警告框
        items.push(this.createCompletionItem('/alert', '警告框', 'alert', '警告框', ':::warning\n警告内容\n:::', range));
        items.push(this.createCompletionItem('/info', '信息框', 'info', '信息框', ':::info\n信息内容\n:::', range));
        items.push(this.createCompletionItem('/success', '成功框', 'success', '成功框', ':::success\n成功内容\n:::', range));
        items.push(this.createCompletionItem('/error', '错误框', 'error', '错误框', ':::error\n错误内容\n:::end', range));

        // 内嵌框架
        items.push(this.createCompletionItem('/iframe', '内嵌框架', 'iframe', '内嵌框架', '<BlockIframe src="https://example.com" width="100%" height="400px">', range));

        // 分隔符
        items.push(this.createCompletionItem('/divider', '分隔符', 'divider', '分隔符', '<BlockDivider />', range));

        // Front Matter
        items.push(this.createCompletionItem('/frontmatter', 'Front Matter', 'frontmatter', 'Front Matter', '---\ntitle: 标题\ndate: 2024-01-01\ntags: [标签1, 标签2]\n---', range));

        return items;
    }

    private createCompletionItem(
        trigger: string,
        label: string,
        detail: string,
        description: string,
        insertText: string,
        range: vscode.Range
    ): vscode.CompletionItem {
        const item = new vscode.CompletionItem(trigger, vscode.CompletionItemKind.Text);
        item.detail = detail;
        item.documentation = description;
        item.insertText = insertText;
        item.sortText = trigger;
        item.range = range;

        // 使用 additionalTextEdits 来明确删除 / 字符
        item.additionalTextEdits = [
            vscode.TextEdit.delete(range)
        ];

        console.log(`Created completion item: ${trigger} -> "${insertText}"`);
        console.log(`Range to delete: `, range.start.character, 'to', range.end.character);

        // 设置图标
        switch (detail) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                item.kind = vscode.CompletionItemKind.Class;
                break;
            case 'code':
            case 'codeblock':
            case 'js':
            case 'ts':
            case 'py':
            case 'java':
            case 'cpp':
            case 'c':
            case 'html':
            case 'css':
            case 'json':
                item.kind = vscode.CompletionItemKind.Snippet;
                break;
            case 'excalidraw':
                item.kind = vscode.CompletionItemKind.File;
                break;
            case 'alert':
            case 'info':
            case 'success':
            case 'error':
                item.kind = vscode.CompletionItemKind.Constant;
                break;
            case 'iframe':
                item.kind = vscode.CompletionItemKind.Interface;
                break;
            default:
                item.kind = vscode.CompletionItemKind.Text;
        }

        return item;
    }
} 