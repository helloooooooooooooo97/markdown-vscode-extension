export const LatexInlineComponent = ({
    html,
    index,
}: {
    html: string;
    index: number | string;
}) => (
    <span
        key={`latex-inline-${index}`}
        style={{ display: "inline-block", verticalAlign: "middle" }}
        dangerouslySetInnerHTML={{ __html: html }}
    />
);

export const LatexInlineErrorComponent = ({
    latex,
    index,
}: {
    latex: string;
    index: number | string;
}) => <span key={`latex-inline-${index}`}>{latex}</span>;


