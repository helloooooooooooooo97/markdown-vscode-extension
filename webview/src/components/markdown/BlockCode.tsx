import React from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { useMarkdownStore } from '../../store/markdown/store';
import { solarizedDark } from '@uiw/codemirror-theme-solarized';

// 导入语言扩展
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { go } from '@codemirror/lang-go';

// 主题参考文档：https://www.npmjs.com/package/@uiw/codemirror-themes

// 语言映射
const getLanguageExtension = (language?: string) => {
    if (!language) return javascript();

    const langMap: { [key: string]: any } = {
        'javascript': javascript,
        'js': javascript,
        'typescript': javascript, // TypeScript 使用 JavaScript 扩展
        'ts': javascript,
        'python': python,
        'py': python,
        'java': java,
        'cpp': cpp,
        'c++': cpp,
        'c': cpp,
        'rust': rust,
        'rs': rust,
        'go': go,
        'php': php,
        'sql': sql,
        'html': html,
        'css': css,
        'json': json,
        'markdown': markdown,
        'md': markdown,
        'xml': xml,
        'yaml': yaml,
        'yml': yaml,
    };

    const extension = langMap[language.toLowerCase()];
    return extension ? extension() : javascript();
};

interface CodeBlockProps {
    code: string;
    language?: string;
    blockId: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, blockId }) => {
    const { updateBlock } = useMarkdownStore();

    const handleChange = (value: string) => {
        const newCode = `\`\`\`${language}\n${value}\n\`\`\``;
        const newLines = newCode.split('\n');
        updateBlock(blockId, newLines);
    };

    return (
        <div className="py-2 rounded-md">
            <div className="text-sm text-gray-200 bg-[#002b36] px-2 py-2">{language}</div>
            <CodeMirror
                value={code}
                onChange={handleChange}
                height="auto"
                theme={solarizedDark}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                    highlightActiveLineGutter: true,
                }}
                extensions={[getLanguageExtension(language)]}
                onKeyDown={(event) => {
                    // 防止方向键、Tab、Enter 等按键冒泡
                    if (event.key === 'ArrowUp' ||
                        event.key === 'ArrowDown' ||
                        event.key === 'ArrowLeft' ||
                        event.key === 'ArrowRight' ||
                        event.key === 'Tab' ||
                        event.key === 'Enter' ||
                        event.key === 'Escape') {
                        event.stopPropagation();
                    }
                }}
            />
        </div>
    );
};

export default CodeBlock;