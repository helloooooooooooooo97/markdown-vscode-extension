export interface GraphMetaData {
  nodes: GraphNode[];
  links: GraphLink[];
  categories: GraphCategory[];
}

export interface GraphNode {
  id: string;
  name: string;
  path: string;
  size: number;
  symbolSize: number;
  category: number;
  label?: {
    show?: boolean;
  };
  itemStyle?: {
    color: string;
  };
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphCategory {
  name: string;
}
