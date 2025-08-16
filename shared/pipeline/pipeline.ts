import { FileMetadata } from "../schema";
import { TagExtractor } from "../schema/tag/factory";
import fs from "fs";
import path from "path";

export class DataPipeline {
    // 核心函数：处理内容并生成元数据文件
    static buildAnalysisPipeline(content: FileMetadata[], outputDir: string) {
        // 生成文件元数据
        fs.writeFileSync(
            path.join(outputDir, "file.json"),
            JSON.stringify(content, null, 2),
            "utf-8"
        );

        // 提取标签信息
        const tags = TagExtractor.extractTags(content);

        // 将Set转换为数组以便JSON序列化
        const tagsData = tags.map((tag) => ({
            name: tag.name,
            rows: Array.from(tag.rows),
            count: tag.count,
            level: tag.level,
        }));

        // 生成标签数据文件
        fs.writeFileSync(
            path.join(outputDir, "tags.json"),
            JSON.stringify(tagsData, null, 2),
            "utf-8"
        );

        return {
            tagData: tagsData,
        };
    }
}
