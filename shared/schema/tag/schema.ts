export enum TagLevel {
  docLevel = "docLevel",
  headingLevel = "headingLevel",
}

export interface TagMetadata {
  level: TagLevel; // 标签级别
  name: string; // 标签名
  rows: Tag[]; // 不同children的集合
  count: number;
}

export interface Tag {
  name: string;
  path: string; // path 链接，可以直接索引过去
  filePath: string; // 文件路径，用来索引文件
  content: string[]; // 标签的结构，用来渲染标签的一级节点的内容
  missing: string[]; // 标签的缺失内容,通过同级节点对比，来判断是否缺失，找到缺失的值
}

// 演示数据：标签元数据
export const demoTag: TagMetadata = {
  name: "/docs/we_algorithm/D1_题目/{PARAM}",
  count: 18,
  level: TagLevel.docLevel,
  rows: [
    {
      name: "132.分割回文串2",
      path: "/docs/we_algorithm/D1_题目/分割回文串2",
      content: [],
      missing: ["题目", "思路", "解法"],
      filePath: "/docs/we_algorithm/D1_题目/分割回文串2.md",
    },
    {
      name: "1510.石子游戏4",
      path: "/docs/we_algorithm/D1_题目/石子游戏4",
      content: [],
      missing: ["题目", "思路", "解法"],
      filePath: "/docs/we_algorithm/D1_题目/石子游戏4.md",
    },
    {
      name: "198.打家劫舍",
      path: "/docs/we_algorithm/D1_题目/打家劫舍",
      content: [],
      missing: ["题目", "思路", "解法"],
      filePath: "/docs/we_algorithm/D1_题目/打家劫舍.md",
    },
  ],
};
