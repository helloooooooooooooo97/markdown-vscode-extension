import { TagMetadata, Tag, TagLevel } from "./schema";
import { FileMetadata, MarkdownHeading } from "../file/schema";

export class TagExtractor {
  static extract(fileMetaDatas: FileMetadata[]): TagMetadata[] {
    const tags = this.extractTagsOfHeadingLevel(fileMetaDatas);
    const docTags = this.extractTagsOfDocumentLevel(fileMetaDatas);
    // 按照 filePath 排序
    const allTags = [...tags, ...docTags];
    allTags.sort((a, b) => a.rows[0].filePath.localeCompare(b.rows[0].filePath));
    return allTags;
  }

  static extractTagsOfHeadingLevel(
    allFileMetadata: FileMetadata[],
    threshold: number = 16
  ): TagMetadata[] {
    // Map: text -> {childrenSet, count}
    const tagMap: Map<string, { childrenSet: Set<Tag>; count: number }> =
      new Map();

    // 增加level参数，跳过level为1的heading（即h1标题），默认不是标签
    function traverse(
      docPath: string,
      headings: MarkdownHeading[],
      level: number = 1,
      filePath: string
    ) {
      for (const heading of headings) {
        if (level != 1) {
          if (!tagMap.has(heading.text)) {
            tagMap.set(heading.text, {
              childrenSet: new Set(),
              count: 0,
            });
          }
          const tag = tagMap.get(heading.text)!;
          for (let childHeading of heading.children || []) {
            tag.childrenSet.add({
              content: childHeading.children?.map((h) => h.text) || [],
              missing: [],
              filePath: filePath,
            });
          }
          tag.count += heading.children?.length || 0;
        }

        if (heading.children && heading.children.length > 0) {
          traverse(docPath, heading.children, level + 1, filePath);
        }
      }
    }

    for (const fileMetadata of allFileMetadata) {
      traverse(
        fileMetadata.filePath,
        fileMetadata.markdownHeadings,
        1,
        fileMetadata.filePath
      );
    }

    // 过滤出children种类大于等于阈值的text
    const tags: TagMetadata[] = [];
    for (const [text, tag] of tagMap.entries()) {
      if (tag.childrenSet.size >= threshold) {
        tags.push({
          name: text,
          rows: Array.from(tag.childrenSet),
          count: tag.count,
          level: TagLevel.headingLevel,
        });
      }
    }
    return tags;
  }

  static extractTagsOfDocumentLevel(
    allFileMetadata: FileMetadata[],
    threshold: number = 16
  ): TagMetadata[] {
    // Map<目录路径, { childrenSet: Set<Tag> }>
    const tagMap: Map<string, { childrenSet: Set<Tag> }> = new Map();

    for (const fileMetadata of allFileMetadata) {
      // 获取文件路径
      const filePath = fileMetadata.filePath;
      // 获取目录部分（去掉文件名）
      const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
      if (!tagMap.has(dirPath)) {
        tagMap.set(dirPath, {
          childrenSet: new Set(),
        });
      }
      const tag = tagMap.get(dirPath)!;
      // 剔除掉index.mdx文件
      if (fileMetadata.filePath.endsWith("index.mdx")) {
        continue;
      }
      // 将文件名作为子标签
      tag.childrenSet.add({
        filePath: fileMetadata.filePath,
        content:
          fileMetadata.markdownHeadings[0]?.children?.map((h) => h.text) || [],
        missing: [],
      });
    }

    // 过滤出子文件数量大于等于阈值的目录
    const result: TagMetadata[] = [];
    for (const [dir, tag] of tagMap.entries()) {
      if (tag.childrenSet.size >= threshold) {
        result.push({
          name: dir + "/{PARAM}",
          rows: Array.from(tag.childrenSet),
          count: tag.childrenSet.size,
          level: TagLevel.docLevel,
        });
      }
    }

    // TODO: missing算法可能需要继续优化，避免一种情况，如取高频字段
    // 计算每个tag的missing,missing用同级最大节点的content来对比，来判断是否缺失，找到缺失的值
    for (const tag of result) {
      // 找到同级节点中content数量最多的节点，作为“最大节点”
      let maxContentRow = tag.rows[0];
      for (const row of tag.rows) {
        if (row.content.length > (maxContentRow?.content.length ?? 0)) {
          maxContentRow = row;
        }
      }
      const maxContentSet = new Set(maxContentRow?.content ?? []);
      // 对每个row，找出maxContentSet中它没有的内容
      for (const row of tag.rows) {
        row.missing = Array.from(maxContentSet)
          .filter((c) => !row.content.includes(c))
          .map((c) => c.replace(/^#/, ""));
      }
    }
    return result;
  }
}

