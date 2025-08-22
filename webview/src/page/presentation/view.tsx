import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Tooltip, Modal } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { useMarkdownStore } from '../../store/markdown/store';
import { testMarkdown } from '../../store/markdown/factory';
import { renderBlockView } from '../../pkg/utils/blockViewParser';
import BlockSchemaParser from '../../pkg/utils/blockSchemParser';
import { Block, BlockType } from '../../store/markdown/type';

// Slide 结构
interface SlideBlock {
    id: string;
    blocks: Block[];
}
interface SlidesData {
    slides: SlideBlock[];
    blockMap: Map<string, any>;
}

const PresentationView: React.FC = () => {
    const { filePath, isLoading, blocks } = useMarkdownStore();
    const [fullscreenSlide, setFullscreenSlide] = useState<number | null>(null);

    // 解析内容并分割成幻灯片
    const slidesData: SlidesData = useMemo(() => {
        let markdownContent = blocks.map(block => block.lines.join('\n')).join('\n');
        if (isLoading) {
            markdownContent = testMarkdown;
        }
        if (!markdownContent) {
            return { slides: [], blockMap: new Map() };
        }

        // 解析所有块
        const blockSchemaParser = new BlockSchemaParser(markdownContent);
        const allBlocks = blockSchemaParser.parse();

        // 按 --- 分割为幻灯片
        const slides: SlideBlock[] = [];
        let slideIndex = 0;

        // 如果第一个块存在，将其作为独立的幻灯片
        if (allBlocks.length > 0) {
            slides.push({
                id: `slide-${slideIndex}`,
                blocks: [allBlocks[0]],
            });
            slideIndex++;
        }

        // 处理剩余的块，按分隔符分割
        let currentBlocks: any[] = [];
        for (let i = 1; i < allBlocks.length; i++) {
            const block = allBlocks[i];
            // Divider 作为分隔符
            if (block.type === BlockType.Divider) {
                if (currentBlocks.length > 0) {
                    slides.push({
                        id: `slide-${slideIndex}`,
                        blocks: currentBlocks,
                    });
                    slideIndex++;
                }
                currentBlocks = [];
            } else {
                currentBlocks.push(block);
            }
        }
        // 最后一页
        if (currentBlocks.length > 0) {
            slides.push({
                id: `slide-${slideIndex}`,
                blocks: currentBlocks,
            });
        }

        // 构建块id到block的映射
        const blockMap = new Map<string, any>();
        allBlocks.forEach(block => {
            blockMap.set(block.id, block);
        });

        return { slides, blockMap };
    }, [blocks, filePath, isLoading]);

    // 键盘事件处理
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    setFullscreenSlide(prev => prev !== null ? Math.max(0, prev - 1) : null);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    setFullscreenSlide(prev => prev !== null ? Math.min(slidesData.slides.length - 1, prev + 1) : null);
                    break;
                case 'Escape':
                    setFullscreenSlide(null);
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [slidesData.slides.length]);

    // 主渲染
    return (
        <div className="w-full h-full">
            <div className="flex h-screen">
                {/* 主内容区 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {slidesData.slides.map((slide, index) => (
                        <div key={slide.id}>
                            <Card
                                key={slide.id}
                                title={`幻灯片 ${index + 1}`}
                                className="mb-4"
                                extra={
                                    <Tooltip title="全屏显示">
                                        <Button
                                            type="text"
                                            icon={<FullscreenOutlined />}
                                            onClick={() => setFullscreenSlide(index)}
                                        />
                                    </Tooltip>
                                }
                            >
                                {slide.blocks.map((block) => (
                                    <div key={block.id}>
                                        {renderBlockView(block)}
                                    </div>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* 全屏模态框 */}
            <Modal
                open={fullscreenSlide !== null}
                onCancel={() => setFullscreenSlide(null)}
                footer={null}
                width="90vw"
                centered
                closable={false}
            >
                {fullscreenSlide !== null && slidesData.slides[fullscreenSlide] && (
                    <Card
                        key={slidesData.slides[fullscreenSlide].id}
                        title={`幻灯片 ${fullscreenSlide + 1}`}
                        className="mb-4"
                    >
                        {slidesData.slides[fullscreenSlide].blocks.map((block) => (
                            <div key={block.id}>
                                {renderBlockView(block)}
                            </div>
                        ))}
                    </Card>
                )}
            </Modal>
        </div>
    );
};

export default PresentationView;