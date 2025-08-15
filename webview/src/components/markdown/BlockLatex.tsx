export const BlockLatex = ({
    html,
    index,
}: {
    html: string;
    index: number | string;
}) => (
    <div
        key={`latex-block-${index}`}
        className="katex-display"
        dangerouslySetInnerHTML={{ __html: html }}
    />
);


export const BlockLatexError = ({
    latex,
    index,
}: {
    latex: string;
    index: number | string;
}) => <pre key={`latex-block-${index}`}>{latex}</pre>;
