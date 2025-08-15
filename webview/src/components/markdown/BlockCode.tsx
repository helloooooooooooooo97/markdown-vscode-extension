import React, { useCallback } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from "@codemirror/theme-one-dark";
import { useMarkdownStore } from '../../store/markdown/store';

interface CodeBlockProps {
    code: string;
    language?: string;
    blockId: string;
}

const getLanguageExtension = (language?: string) => {
    if (!language) return javascript();

    const langMap: { [key: string]: any } = {
        'javascript': javascript(),
        'js': javascript(),
        'typescript': javascript(),
        'ts': javascript(),
        'python': python(),
        'py': python(),
        'java': java(),
        'cpp': cpp(),
        'c++': cpp(),
        'c': cpp(),
        'rust': rust(),
        'rs': rust(),
        'go': go(),
        'php': php(),
        'sql': sql(),
        'html': html(),
        'css': css(),
        'json': json(),
        'markdown': markdown(),
        'md': markdown(),
        'xml': xml(),
        'yaml': yaml(),
        'yml': yaml(),
    };

    return langMap[language.toLowerCase()] || javascript();
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, blockId }) => {
    const { updateBlock } = useMarkdownStore();
    const handleChange = useCallback((value: string) => {
        const newCode = `\`\`\`${language}\n${value}\n\`\`\``;
        const newLines = newCode.split('\n');
        updateBlock(blockId, newLines);
    }, [blockId, updateBlock]);
    return (
        <div className="border rounded-lg overflow-hidden my-4 border-gray-300">
            <CodeMirror
                value={code}
                onChange={handleChange}
                theme={oneDark}
                extensions={[getLanguageExtension(language)]}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                    foldGutter: true,
                    highlightActiveLineGutter: true,
                }}
                style={{
                    fontSize: '14px',
                }}
            />
        </div>
    );
};

export default CodeBlock;