export enum BlockType {
  Paragraph = "paragraph",
  Heading = "heading",
  List = "list",
  Table = "table",
  Code = "code",
  Alert = "alert",
  Iframe = "iframe",
  FrontMatter = "frontmatter",
  Latex = "latex",
  Divider = "divider",
  Todo = "todo",
}

export interface Block {
  id: string; // block的ID，随机分配，保证映射
  lines: string[]; // block的数据，存的是所有行的数据，可以进行反序列化
  type: BlockType; // block的类型
}

export interface Document {
  blocks: Block[];
}
