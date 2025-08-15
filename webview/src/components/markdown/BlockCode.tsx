import React, { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeBlockProps {
    code: string;
    language?: string;
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

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (editorRef.current && !viewRef.current) {
            const state = EditorState.create({
                doc: code,
                extensions: [
                    basicSetup,
                    getLanguageExtension(language),
                    oneDark,
                    EditorView.updateListener.of((update: any) => {
                        // 禁用编辑
                        if (update.docChanged) {
                            // 可以在这里添加只读逻辑
                        }
                    }),
                ],
            });

            const view = new EditorView({
                state,
                parent: editorRef.current,
            });

            viewRef.current = view;
        }

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [code, language]);

    return (
        <div
            ref={editorRef}
            className="border rounded-lg overflow-hidden my-4"
            style={{ fontSize: '14px' }}
        />
    );
};

export default CodeBlock;