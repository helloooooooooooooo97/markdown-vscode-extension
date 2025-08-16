export interface FileMetadata {
  filePath: string; // 文件路径
  frontmatter: FrontMatter; // 文件的 frontmatter 元数据
  references: Relation[]; // 文件引用了哪些其他文件
  markdownHeadings: MarkdownHeading[]; // markdown标题层级嵌套信息
  leafMarkdownHeadings: string[]; // 叶子节点，采集到markdown的标题层级信息
}

export interface FrontMatter {
  [key: string]: any;
  prev?: string[]; //存的是path或者[description](path)的格式，需要按照不同的格式进行处理
  next?: string[];
  starred?: boolean; // 是否收藏：存储关键的元数据信息，都存放在frontmatter 里
}

export interface MarkdownHeading {
  level: number; // 标题级别（如1表示#，2表示##）
  text: string; // 标题文本内容
  children?: MarkdownHeading[]; // 子标题，嵌套结构
}

export interface Relation {
  path: string; // 文件路径
  description: string; // 文件关系的描述，用来描述两个文件的递推关系
}

export const fileMetaDataDefault: FileMetadata = {
  filePath: "/docs/he_cs336/D1_公式/backward_propagation",
  frontmatter: {
    prev: [],
    next: [],
  },
  references: [
    {
      path: "/docs/he_cs336/D1_公式/forward_propagation",
      description: "< 前向传播",
    },
  ],
  markdownHeadings: [
    {
      level: 1,
      text: "back propagation",
      children: [
        {
          level: 2,
          text: "定义",
          children: [],
        },
        {
          level: 2,
          text: "公式",
          children: [
            {
              level: 3,
              text: "< 前向传播",
              children: [],
            },
            {
              level: 3,
              text: "反向传播",
              children: [],
            },
          ],
        },
        {
          level: 2,
          text: "例子",
          children: [],
        },
        {
          level: 2,
          text: "代码",
          children: [],
        },
      ],
    },
  ],
  leafMarkdownHeadings: [
    "#back propagation/##定义",
    "#back propagation/##公式/###< 前向传播",
    "#back propagation/##公式/###反向传播",
    "#back propagation/##例子",
    "#back propagation/##代码",
  ],
};