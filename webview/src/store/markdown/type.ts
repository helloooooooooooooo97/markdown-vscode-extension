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
  Excalidraw = "excalidraw",
  Reference = "reference",
}

export interface Block {
  id: string; // block的ID，随机分配，保证映射
  lines: string[]; // block的数据，存的是所有行的数据，可以进行反序列化
  type: BlockType; // block的类型
  filePath?: string; // block的文件路径
  storage?: any; // block的存储数据，比如excalidraw的data
  isLoading?: boolean; // block的加载状态，比如excalidraw的加载状态
  startIndex: number; // block的开始索引
  endIndex: number; // block的结束索引
  attrs?: Record<string, any>; // 块的属性，比如标题的level和number，是否展开
}

export interface Document {
  blocks: Block[];
}
