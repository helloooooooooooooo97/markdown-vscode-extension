import React from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface JSONViewerProps {
    data: any;
    height?: string;
    maxHeight?: string;
    readOnly?: boolean;
}

const JSONViewer: React.FC<JSONViewerProps> = ({
    data,
    height = '200px',
    maxHeight = '400px',
    readOnly = true
}) => {
    const jsonString = JSON.stringify(data, null, 2);

    return (
        <div
            className="overflow-hidden rounded border border-[#44475a] bg-[#282a36]"
            style={{
                height,
                maxHeight,
            }}
        >
            <CodeMirror
                value={jsonString}
                height="100%"
                theme="dark"
                extensions={[json()]}
                readOnly={readOnly}
                basicSetup={{
                    lineNumbers: false,
                    highlightActiveLine: false,
                    foldGutter: false,
                    highlightActiveLineGutter: false,
                }}
                className="text-xs min-h-full bg-[#282a36] font-mono"
                style={{
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                }}
            />
        </div>
    );
};

export default JSONViewer; 