import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Tooltip, Modal } from 'antd';
import { CloseOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useMarkdownStore } from '../../store/markdown/store';
import { renderBlockView } from '../../components/markdown/BlockViewParser';
import { Block, BlockType } from '../../store/markdown/type';

interface SlideBlock {
    id: string;
    blocks: Block[];
}
interface SlidesData {
    slides: SlideBlock[];
    blockMap: Map<string, any>;
}

const PresentationView: React.FC = () => {
    const { filePath, blocks } = useMarkdownStore();
    const [fullscreenSlide, setFullscreenSlide] = useState<number | null>(null);
    const slidesData: SlidesData = useMemo(() => {
        const slides: SlideBlock[] = [];
        let slideIndex = 0;

        // 如果第一个块存在，将其作为独立的幻灯片，因为第一个块是标题
        if (blocks.length > 0) {
            slides.push({
                id: `slide-${slideIndex}`,
                blocks: [blocks[0]],
            });
            slideIndex++;
        }

        // 处理剩余的块，按分隔符分割
        let currentBlocks: any[] = [];
        for (let i = 1; i < blocks.length; i++) {
            const block = blocks[i];
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
        blocks.forEach(block => {
            blockMap.set(block.id, block);
        });

        return { slides, blockMap };
    }, [blocks, filePath]);

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
                width="100vw"
                centered
                closable={false}
            >
                {fullscreenSlide !== null && slidesData.slides[fullscreenSlide] && (
                    <Card
                        key={slidesData.slides[fullscreenSlide].id}
                        title={
                            <div className="flex items-center justify-between">
                                <span>幻灯片 {fullscreenSlide + 1}</span>
                                <Tooltip title="退出全屏">
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => setFullscreenSlide(null)}
                                    />
                                </Tooltip>
                            </div>
                        }
                        className="mb-4 h-[95vh] overflow-y-auto"
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