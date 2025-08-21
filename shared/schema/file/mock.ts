import { MarkdownFileStats } from "./schema";

const demo = {
    "totalFiles": 30,
    "totalSize": 87198,
    "filesByExtension": {
        ".mdx": 29,
        ".md": 1
    },
    "files": [
        {
            "fileName": "absolute_position_embedding.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/absolute_position_embedding.mdx",
            "relativePath": "D1_公式/absolute_position_embedding.mdx",
            "size": 3083,
            "lastModified": "2025-08-18T03:45:09.365Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/absolute_position_embedding.mdx",
                "frontmatter": {
                    "updatedAt": "2025-08-02T07:25:09.456Z",
                    "createdAt": "2024-06-01T12:00:00.000Z"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "absolute position embedding",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#absolute position embedding/##定义",
                    "#absolute position embedding/##公式",
                    "#absolute position embedding/##例子",
                    "#absolute position embedding/##代码",
                    "#absolute position embedding/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 70,
                "contentLines": 65,
                "codeLines": 28,
                "commentLines": 0,
                "emptyLines": 5,
                "wordCount": 55,
                "characterCount": 841,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "absolute",
                    "position",
                    "embedding"
                ],
                "summary": "# absolute position embedding\n## 定义\n绝对位置嵌入（Absolute Position Embedding）是Transformer架构中用于表示序列中元素位置信息的一种方法。由于Transformer本身不具备处理序列顺序的能力，需要通过位置编码将位置信息注入到输入表示中。绝对位置嵌入为序列中的每个位置分配一个固定的嵌入向量，这些向量通常与词嵌入相加后作为模型的...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": false
            }
        },
        {
            "fileName": "adam.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/adam.mdx",
            "relativePath": "D1_公式/adam.mdx",
            "size": 2153,
            "lastModified": "2025-08-18T03:45:10.237Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/adam.mdx",
                "frontmatter": {
                    "prev": [
                        "./linear.mdx"
                    ],
                    "next": [
                        "./cross_entropy.mdx",
                        "./batch_norm.mdx"
                    ],
                    "updatedAt": "2025-08-02T07:25:09.456Z"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "adam",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "adam的梯度更新是什么？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#adam/##定义",
                    "#adam/##公式",
                    "#adam/##例子",
                    "#adam/##代码",
                    "#adam/##问题/###adam的梯度更新是什么？"
                ]
            },
            "documentStats": {
                "totalLines": 64,
                "contentLines": 62,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 2,
                "wordCount": 218,
                "characterCount": 1433,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "adam",
                    "adam的梯度更新是什么？"
                ],
                "summary": "# adam\n## 定义\nAdam（Adaptive Moment Estimation，自适应矩估计）是一种常用的自适应学习率优化算法，广泛应用于深度学习模型的训练。它结合了动量法（Momentum）和RMSProp的优点，通过对一阶矩（均值）和二阶矩（未中心化方差）进行估计，自适应地调整每个参数的学习率，从而加快收敛速度并提升训练稳定性。\n- **本质**：自适应地调整每个参数的学习率，兼顾梯...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "backward_propagation.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/backward_propagation.mdx",
            "relativePath": "D1_公式/backward_propagation.mdx",
            "size": 4117,
            "lastModified": "2025-08-15T03:12:27.659Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/backward_propagation.mdx",
                "frontmatter": {},
                "references": [
                    {
                        "path": "./forward_propagation.mdx",
                        "description": "< 前向传播"
                    }
                ],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "back propagation",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "< 前向传播",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "反向传播",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "1. 梯度消失/爆炸问题",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "2. 局部最优问题",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "3. 计算效率问题",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "4. 数值稳定性问题",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#back propagation/##定义",
                    "#back propagation/##公式/###< 前向传播",
                    "#back propagation/##公式/###反向传播",
                    "#back propagation/##例子",
                    "#back propagation/##代码",
                    "#back propagation/##问题/###1. 梯度消失/爆炸问题",
                    "#back propagation/##问题/###2. 局部最优问题",
                    "#back propagation/##问题/###3. 计算效率问题",
                    "#back propagation/##问题/###4. 数值稳定性问题"
                ]
            },
            "documentStats": {
                "totalLines": 102,
                "contentLines": 76,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 26,
                "wordCount": 264,
                "characterCount": 2753,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "back",
                    "propagation",
                    "前向传播](./forward_propagation.mdx)",
                    "反向传播",
                    "梯度消失/爆炸问题"
                ],
                "summary": "# back propagation\n\n## 定义\n\n反向传播（Back Propagation，简称BP）是一种用于神经网络训练的高效算法。它通过链式法则（链式求导），将损失函数对输出的梯度逐层反向传播到每一层参数，实现对神经网络参数的高效更新。反向传播是深度学习模型训练的核心步骤。\n\n- **本质**：利用链式法则高效计算神经网络中各参数的梯度。\n- **常见场景**：所有基于梯度优化的神经网...",
                "complexity": "medium",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "batch_norm.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/batch_norm.mdx",
            "relativePath": "D1_公式/batch_norm.mdx",
            "size": 2331,
            "lastModified": "2025-08-16T15:38:00.340Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/batch_norm.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "batch norm",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "手动实现",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "batch_norm和layer_norm的区别",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#batch norm/##定义",
                    "#batch norm/##公式",
                    "#batch norm/##例子",
                    "#batch norm/##代码/###手动实现",
                    "#batch norm/##问题/###batch_norm和layer_norm的区别"
                ]
            },
            "documentStats": {
                "totalLines": 54,
                "contentLines": 37,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 17,
                "wordCount": 133,
                "characterCount": 1527,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "batch",
                    "norm",
                    "手动实现",
                    "batch_norm和layer_norm的区别"
                ],
                "summary": "# batch norm\n\n## 定义\n\nBatchNorm（批归一化）是一种常用的神经网络归一化技术，主要用于加速深度神经网络的训练，提高模型的稳定性。其核心思想是在每一层对每个mini-batch的数据进行归一化处理，使其均值为0、方差为1，然后再进行线性变换（缩放和偏移）。BatchNorm可以缓解内部协变量偏移（Internal Covariate Shift）问题，允许更高的学习率，并有...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "cross_entropy.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/cross_entropy.mdx",
            "relativePath": "D1_公式/cross_entropy.mdx",
            "size": 2174,
            "lastModified": "2025-08-15T03:09:15.095Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/cross_entropy.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "cross entropy",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "交叉熵有什么特性可以用来做分类问题？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "交叉熵损失函数在训练过程中有什么优势？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "交叉熵损失函数在训练过程中有什么劣势？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#cross entropy/##定义",
                    "#cross entropy/##公式",
                    "#cross entropy/##例子",
                    "#cross entropy/##代码",
                    "#cross entropy/##问题/###交叉熵有什么特性可以用来做分类问题？",
                    "#cross entropy/##问题/###交叉熵损失函数在训练过程中有什么优势？",
                    "#cross entropy/##问题/###交叉熵损失函数在训练过程中有什么劣势？"
                ]
            },
            "documentStats": {
                "totalLines": 53,
                "contentLines": 33,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 20,
                "wordCount": 89,
                "characterCount": 1002,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "cross",
                    "entropy",
                    "交叉熵有什么特性可以用来做分类问题？",
                    "交叉熵损失函数在训练过程中有什么优势？",
                    "交叉熵损失函数在训练过程中有什么劣势？"
                ],
                "summary": "# cross entropy\n\n## 定义\n\n交叉熵（Cross Entropy）是一种常用的损失函数，广泛应用于分类问题（如多分类、二分类等）。它用于衡量两个概率分布之间的差异，通常用来评估模型输出的概率分布与真实标签分布之间的距离。交叉熵越小，说明模型预测越接近真实分布。\n\n- **本质**：衡量“真实分布”与“预测分布”之间的不一致性。\n- **常见场景**：softmax输出的多分类问题...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "embedding.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/embedding.mdx",
            "relativePath": "D1_公式/embedding.mdx",
            "size": 2115,
            "lastModified": "2025-08-19T07:09:13.507Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/embedding.mdx",
                "frontmatter": {
                    "prev": [],
                    "next": [
                        "icon"
                    ],
                    "tags": [
                        "标签"
                    ],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "embedding",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#embedding/##定义",
                    "#embedding/##公式",
                    "#embedding/##例子",
                    "#embedding/##代码",
                    "#embedding/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 58,
                "contentLines": 53,
                "codeLines": 11,
                "commentLines": 0,
                "emptyLines": 5,
                "wordCount": 129,
                "characterCount": 1111,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "embedding",
                    "使用Gensim训练Word2Vec",
                    "获取词向量",
                    "计算相似度"
                ],
                "summary": "# embedding\n## 定义\nEmbedding（嵌入）是将高维数据映射到低维连续向量空间的技术，常用于表示离散对象（如单词、图像、用户等）。其核心思想是通过学习将输入数据转换为稠密向量，使得相似的对象在嵌入空间中距离相近。常见的嵌入类型包括：\n- 词嵌入（Word2Vec, GloVe）\n- 图嵌入（Node2Vec）\n- 推荐系统嵌入（矩阵分解）\n- 图像嵌入（CNN特征提取）\n## 公...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "forward_propagation.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/forward_propagation.mdx",
            "relativePath": "D1_公式/forward_propagation.mdx",
            "size": 3595,
            "lastModified": "2025-08-18T07:30:57.845Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/forward_propagation.mdx",
                "frontmatter": {
                    "3213": "",
                    "prev": [
                        "./linear.mdx"
                    ],
                    "next": [
                        "./backward_propagation.mdx"
                    ],
                    "updatedAt": "2025-08-13T17:04:33.367Z"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "forward propagation",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#forward propagation/##定义",
                    "#forward propagation/##公式",
                    "#forward propagation/##例子",
                    "#forward propagation/##代码",
                    "#forward propagation/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 88,
                "contentLines": 83,
                "codeLines": 22,
                "commentLines": 0,
                "emptyLines": 5,
                "wordCount": 177,
                "characterCount": 1714,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "forward",
                    "propagation",
                    "定义网络结构",
                    "示例使用"
                ],
                "summary": "2342233123\n# forward propagation\n## 定义\n前向传播（Back Propagation，简称BP）是一种用于神经网络训练的高效算法。它通过链式法则（链式求导），将损失函数对输出的梯度逐层反向传播到每一层参数，实现对神经网络参数的高效更新。反向传播是深度学习模型训练的核心步骤。\n- **本质**：利用链式法则高效计算神经网络中各参数的梯度。\n- **常见场景**：所...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "gradient_cutting.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_cutting.mdx",
            "relativePath": "D1_公式/gradient_cutting.mdx",
            "size": 2408,
            "lastModified": "2025-08-16T06:02:51.925Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_cutting.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "gradient cutting",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "1. 梯度裁剪的阈值选择",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "2. 对优化过程的影响",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "3. 计算开销",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "4. 与批标准化的交互",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "5. 不同层的梯度差异",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "6. 梯度裁剪的替代方案",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "7. 调试困难",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#gradient cutting/##定义",
                    "#gradient cutting/##公式",
                    "#gradient cutting/##例子",
                    "#gradient cutting/##代码",
                    "#gradient cutting/##问题/###1. 梯度裁剪的阈值选择",
                    "#gradient cutting/##问题/###2. 对优化过程的影响",
                    "#gradient cutting/##问题/###3. 计算开销",
                    "#gradient cutting/##问题/###4. 与批标准化的交互",
                    "#gradient cutting/##问题/###5. 不同层的梯度差异",
                    "#gradient cutting/##问题/###6. 梯度裁剪的替代方案",
                    "#gradient cutting/##问题/###7. 调试困难"
                ]
            },
            "documentStats": {
                "totalLines": 52,
                "contentLines": 35,
                "codeLines": 8,
                "commentLines": 0,
                "emptyLines": 17,
                "wordCount": 54,
                "characterCount": 910,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "gradient",
                    "cutting",
                    "132231",
                    "梯度裁剪的阈值选择",
                    "对优化过程的影响"
                ],
                "summary": "# gradient cutting\n\n## 定义\n\n梯度裁剪是一种优化技术，用于防止梯度爆炸。在深度学习中，梯度爆炸是一个常见的问题，它会导致训练不稳定，甚至无法收敛。梯度裁剪通过将梯度限制在一定范围内，从而防止梯度爆炸。\n\n## 公式\n\n$$\ng^{(l)} = \\frac{\\partial L}{\\partial x^{(l)}} = \\prod_{k=l+1}^L W^{(k)} f'(x...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "gradient_descent.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_descent.mdx",
            "relativePath": "D1_公式/gradient_descent.mdx",
            "size": 3214,
            "lastModified": "2025-08-21T02:00:57.770Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_descent.mdx",
                "frontmatter": {
                    "prev": [],
                    "next": [
                        "[学习率优化](./lr_cosine_schedule.mdx)",
                        "[梯度优化](./adam.mdx)",
                        "312321",
                        "31231"
                    ],
                    "tags": [],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "gradient descent",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#gradient descent/##定义",
                    "#gradient descent/##公式",
                    "#gradient descent/##例子",
                    "#gradient descent/##代码",
                    "#gradient descent/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 75,
                "contentLines": 73,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 2,
                "wordCount": 181,
                "characterCount": 1718,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "gradient",
                    "descent"
                ],
                "summary": "# gradient descent\n## 定义\n梯度下降（Gradient Descent）是一种常用的优化算法，广泛应用于机器学习和深度学习模型的参数训练。其核心思想是：通过计算损失函数关于参数的梯度，沿着梯度的反方向对参数进行迭代更新，从而逐步减小损失函数的值，最终找到最优参数。\n- **本质**：利用一阶导数信息，寻找损失函数的极小值点。\n- **常见场景**：线性回归、逻辑回归、神经网络...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "gradient_explosion_and_vanishing.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_explosion_and_vanishing.mdx",
            "relativePath": "D1_公式/gradient_explosion_and_vanishing.mdx",
            "size": 4152,
            "lastModified": "2025-08-15T12:43:51.673Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/gradient_explosion_and_vanishing.mdx",
                "frontmatter": {
                    "updatedAt": "2025-08-13T17:04:58.568Z"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "gradient explosion and vanishing",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "梯度消失的数学表达",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "梯度爆炸的数学表达",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "梯度裁剪公式",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "梯度消失实例",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "梯度爆炸实例",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "梯度裁剪实现（PyTorch）",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "Xavier初始化的实现",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "常见误区",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "诊断方法",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "进阶挑战",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#gradient explosion and vanishing/##定义",
                    "#gradient explosion and vanishing/##公式/###梯度消失的数学表达",
                    "#gradient explosion and vanishing/##公式/###梯度爆炸的数学表达",
                    "#gradient explosion and vanishing/##公式/###梯度裁剪公式",
                    "#gradient explosion and vanishing/##例子/###梯度消失实例",
                    "#gradient explosion and vanishing/##例子/###梯度爆炸实例",
                    "#gradient explosion and vanishing/##代码/###梯度裁剪实现（PyTorch）",
                    "#gradient explosion and vanishing/##代码/###Xavier初始化的实现",
                    "#gradient explosion and vanishing/##问题/###常见误区",
                    "#gradient explosion and vanishing/##问题/###诊断方法",
                    "#gradient explosion and vanishing/##问题/###进阶挑战"
                ]
            },
            "documentStats": {
                "totalLines": 82,
                "contentLines": 79,
                "codeLines": 17,
                "commentLines": 0,
                "emptyLines": 3,
                "wordCount": 149,
                "characterCount": 1933,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "gradient",
                    "explosion",
                    "and",
                    "梯度消失的数学表达",
                    "梯度爆炸的数学表达"
                ],
                "summary": "# gradient explosion and vanishing\n梯度爆炸（Gradient Explosion）和梯度消失（Gradient Vanishing）是深度神经网络训练过程中常见的问题。\n**梯度消失**：在反向传播过程中，梯度在多层网络中不断相乘，如果每一层的梯度都小于1，最终靠近输入层的梯度会变得非常小，导致参数几乎不更新，网络难以学习到有效特征。常见于激活函数如sigmoi...",
                "complexity": "complex",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": true,
                "hasMath": true
            }
        },
        {
            "fileName": "index.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/C1_路线/index.mdx",
            "relativePath": "C1_路线/index.mdx",
            "size": 7068,
            "lastModified": "2025-08-15T14:12:23.947Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/C1_路线/index.mdx",
                "frontmatter": {},
                "references": [
                    {
                        "path": "../D1_公式/forward_propagation.mdx",
                        "description": "forward  propagation"
                    },
                    {
                        "path": "../D1_公式/linear.mdx",
                        "description": "linear"
                    },
                    {
                        "path": "../D1_公式/relu.mdx",
                        "description": "relu"
                    },
                    {
                        "path": "../D1_公式/softmax.mdx",
                        "description": "softmax"
                    },
                    {
                        "path": "../D1_公式/sigmoid.mdx",
                        "description": "sigmoid"
                    },
                    {
                        "path": "../D1_公式/cross_entropy.mdx",
                        "description": "cross entropy"
                    },
                    {
                        "path": "../D1_公式/gradient_descent.mdx",
                        "description": "gradient descent"
                    },
                    {
                        "path": "../D1_公式/backward_propagation.mdx",
                        "description": "backward propagation"
                    },
                    {
                        "path": "../D1_公式/adam.mdx",
                        "description": "adam"
                    },
                    {
                        "path": "../D1_公式/lr_cosine_schedule.mdx",
                        "description": "lr cosine schedule"
                    },
                    {
                        "path": "../D1_公式/precision.mdx",
                        "description": "precision"
                    },
                    {
                        "path": "../D1_公式/recall.mdx",
                        "description": "recall"
                    },
                    {
                        "path": "../D1_formula/f1_score.mdx",
                        "description": "f1 score"
                    },
                    {
                        "path": "../D1_公式/embedding.mdx",
                        "description": "embedding"
                    },
                    {
                        "path": "../D1_公式/silu.mdx",
                        "description": "silu"
                    },
                    {
                        "path": "../D1_公式/swiglu.mdx",
                        "description": "swiglu"
                    },
                    {
                        "path": "../D1_公式/scaled_dot_product_attention.mdx",
                        "description": "scaled dot product attention"
                    },
                    {
                        "path": "../D1_公式/multihead_self_attention.mdx",
                        "description": "multihead self attention"
                    },
                    {
                        "path": "../D1_公式/relative_position_embedding.mdx",
                        "description": "relative position embedding"
                    },
                    {
                        "path": "../D1_公式/absolute_position_embedding.mdx",
                        "description": "absolute position embedding"
                    },
                    {
                        "path": "../D1_公式/rope.mdx",
                        "description": "rope"
                    },
                    {
                        "path": "../D1_公式/layer_norm.mdx",
                        "description": "layer_norm"
                    },
                    {
                        "path": "../D1_公式/batch_norm.mdx",
                        "description": "batch norm"
                    },
                    {
                        "path": "../D1_公式/rms_norm.mdx",
                        "description": "rms norm"
                    }
                ],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "主题1：数据传输",
                        "children": [
                            {
                                "level": 2,
                                "text": "前向传播与特征表达",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "损失函数与梯度下降",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "损失函数与评估方式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "注意力机制",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#主题1：数据传输/##前向传播与特征表达",
                    "#主题1：数据传输/##损失函数与梯度下降",
                    "#主题1：数据传输/##损失函数与评估方式",
                    "#主题1：数据传输/##注意力机制"
                ]
            },
            "documentStats": {
                "totalLines": 58,
                "contentLines": 54,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 4,
                "wordCount": 605,
                "characterCount": 4968,
                "readingTimeMinutes": 4
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "主题1：数据传输",
                    "前向传播与特征表达",
                    "损失函数与梯度下降",
                    "损失函数与评估方式",
                    "注意力机制"
                ],
                "summary": "# 主题1：数据传输\n\n## 前向传播与特征表达\n:::info\n前向传播与特征表达是神经网络中信息流动的起点，主要包括输入数据经过线性层、非线性激活函数、输出层等一系列变换，最终得到模型的预测结果。\n:::\n| 状态 | 类型 | 链接 | 讲解 | 核心公式 |\n| :--: | -- | -- | -------- | ---- |\n| ✅ | 前向传播 | [forward  propag...",
                "complexity": "complex",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": true,
                "hasMath": true
            }
        },
        {
            "fileName": "index.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D2_作业/index.mdx",
            "relativePath": "D2_作业/index.mdx",
            "size": 18,
            "lastModified": "2025-08-15T03:16:13.770Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D2_作业/index.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "索引2：作业",
                        "children": []
                    }
                ],
                "leafMarkdownHeadings": [
                    "#索引2：作业"
                ]
            },
            "documentStats": {
                "totalLines": 1,
                "contentLines": 1,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 0,
                "wordCount": 2,
                "characterCount": 8,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "索引2：作业"
                ],
                "summary": "# 索引2：作业",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": false
            }
        },
        {
            "fileName": "index.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/index.mdx",
            "relativePath": "D1_公式/index.mdx",
            "size": 956,
            "lastModified": "2025-08-15T13:15:33.999Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/index.mdx",
                "frontmatter": {},
                "references": [
                    {
                        "path": "./softmax.mdx",
                        "description": "softmax"
                    }
                ],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "索引1：公式",
                        "children": [
                            {
                                "level": 2,
                                "text": "索引结构",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#索引1：公式/##索引结构"
                ]
            },
            "documentStats": {
                "totalLines": 16,
                "contentLines": 14,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 2,
                "wordCount": 48,
                "characterCount": 448,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "索引1：公式",
                    "索引结构"
                ],
                "summary": "# 索引1：公式\n\n:::info\n1. 内容：CS336课程中所涉及到的核心公式讲解\n2. 提示：按照索引结构的五大模块，参考[softmax](./softmax.mdx)的写法，完成索引节点中未完成的内容\n3. 内容：索引结构是索引的数据字段，索引节点是索引的内容，索引依赖是节点的学习顺序。\n:::\n\n## 索引结构\n| 字段 | AI Prompt |\n| ---- | ---------...",
                "complexity": "medium",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": true,
                "hasMath": false
            }
        },
        {
            "fileName": "index.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D3_专题/index.mdx",
            "relativePath": "D3_专题/index.mdx",
            "size": 20,
            "lastModified": "2025-08-01T09:10:14.430Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D3_专题/index.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "索引3：专题",
                        "children": []
                    }
                ],
                "leafMarkdownHeadings": [
                    "#索引3：专题"
                ]
            },
            "documentStats": {
                "totalLines": 3,
                "contentLines": 1,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 2,
                "wordCount": 2,
                "characterCount": 10,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "索引3：专题"
                ],
                "summary": "# 索引3：专题",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": false
            }
        },
        {
            "fileName": "index.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/A1_知识地图/index.mdx",
            "relativePath": "A1_知识地图/index.mdx",
            "size": 333,
            "lastModified": "2025-08-15T05:22:49.068Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/A1_知识地图/index.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "知识地图",
                        "children": []
                    }
                ],
                "leafMarkdownHeadings": [
                    "#知识地图"
                ]
            },
            "documentStats": {
                "totalLines": 12,
                "contentLines": 9,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 3,
                "wordCount": 22,
                "characterCount": 325,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "知识地图"
                ],
                "summary": "# 知识地图\n\n<iframe \n  style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}\n  sandbox=\"allow-scripts allow-popups allow-forms allow-modals allow-same-origin\"\n  width=\"100%\"\n  height=\"800px\"\n  src=\"https://b...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": false
            }
        },
        {
            "fileName": "layer_norm.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/layer_norm.mdx",
            "relativePath": "D1_公式/layer_norm.mdx",
            "size": 3313,
            "lastModified": "2025-08-16T16:51:30.543Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/layer_norm.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "layer norm",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "手动实现",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "pytorch实现",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#layer norm/##定义",
                    "#layer norm/##公式",
                    "#layer norm/##例子",
                    "#layer norm/##代码/###手动实现",
                    "#layer norm/##代码/###pytorch实现",
                    "#layer norm/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 93,
                "contentLines": 66,
                "codeLines": 16,
                "commentLines": 0,
                "emptyLines": 27,
                "wordCount": 153,
                "characterCount": 1697,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "layer",
                    "norm",
                    "手动实现",
                    "pytorch实现"
                ],
                "summary": "# layer norm\n\n## 定义\n\nLayerNorm（层归一化）是一种常用的归一化方法，广泛应用于Transformer等深度学习模型中。\n1. 主要作用：是对每个样本的特征维度进行归一化处理，从而加速模型收敛，提高训练稳定性，加速模型收敛。\n2. 概念讲解：通过归一化，将输入数据分布在更小的范围内，使得模型更容易学习到数据的真实分布。\n3. 概念区分：与BatchNorm不同，Layer...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "linear.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/linear.mdx",
            "relativePath": "D1_公式/linear.mdx",
            "size": 3006,
            "lastModified": "2025-08-16T06:31:03.277Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/linear.mdx",
                "frontmatter": {
                    "next": [
                        "[linear的简单应用之embedding](./embedding.mdx)",
                        "[batch norm](./batch_norm.mdx)"
                    ]
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "linear",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "Linear层在神经网络中的作用是什么？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "为什么Linear层通常与激活函数配合使用？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "Linear层的参数数量如何计算？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "Linear层与卷积层、循环层的区别？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#linear/##定义",
                    "#linear/##公式",
                    "#linear/##例子",
                    "#linear/##代码",
                    "#linear/##问题/###Linear层在神经网络中的作用是什么？",
                    "#linear/##问题/###为什么Linear层通常与激活函数配合使用？",
                    "#linear/##问题/###Linear层的参数数量如何计算？",
                    "#linear/##问题/###Linear层与卷积层、循环层的区别？"
                ]
            },
            "documentStats": {
                "totalLines": 66,
                "contentLines": 61,
                "codeLines": 21,
                "commentLines": 0,
                "emptyLines": 5,
                "wordCount": 203,
                "characterCount": 1425,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "linear",
                    "批量处理版本",
                    "示例：批量输入",
                    "Linear层在神经网络中的作用是什么？",
                    "为什么Linear层通常与激活函数配合使用？"
                ],
                "summary": "# linear\n## 定义\nLinear函数（线性变换）是神经网络中最基础的运算，也称为全连接层（Fully Connected Layer）或密集层（Dense Layer），用于将输入向量映射到输出向量。\n## 公式\n数学表达式如下：\n$$\ny = Wx + b\n$$\n其中：\n- $x \\in \\mathbb{R}^{n}$ 是输入向量\n- $W \\in \\mathbb{R}^{m \\tim...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "lr_cosine_schedule.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/lr_cosine_schedule.mdx",
            "relativePath": "D1_公式/lr_cosine_schedule.mdx",
            "size": 3512,
            "lastModified": "2025-08-19T08:15:49.070Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/lr_cosine_schedule.mdx",
                "frontmatter": {
                    "prev": [],
                    "next": [],
                    "tags": [],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "lr cosine schedule",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "1. 如何选择$\\eta_{max}$和$\\eta_{min}$？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "2. 为什么余弦退火比线性衰减更好？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "3. 如何与warmup结合？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "4. 实际训练中的常见问题",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "5. 与其他调度器的对比",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#lr cosine schedule/##定义",
                    "#lr cosine schedule/##公式",
                    "#lr cosine schedule/##例子",
                    "#lr cosine schedule/##代码",
                    "#lr cosine schedule/##问题/###1. 如何选择$\\eta_{max}$和$\\eta_{min}$？",
                    "#lr cosine schedule/##问题/###2. 为什么余弦退火比线性衰减更好？",
                    "#lr cosine schedule/##问题/###3. 如何与warmup结合？",
                    "#lr cosine schedule/##问题/###4. 实际训练中的常见问题",
                    "#lr cosine schedule/##问题/###5. 与其他调度器的对比"
                ]
            },
            "documentStats": {
                "totalLines": 63,
                "contentLines": 61,
                "codeLines": 4,
                "commentLines": 0,
                "emptyLines": 2,
                "wordCount": 167,
                "characterCount": 1994,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "cosine",
                    "schedule",
                    "如何选择$\\eta_{max}$和$\\eta_{min}$？",
                    "为什么余弦退火比线性衰减更好？",
                    "如何与warmup结合？"
                ],
                "summary": "**原始文档内容：**\n# lr cosine schedule\n## 定义\nCosine Annealing（余弦退火）学习率调度是一种常用的学习率调整策略，常用于深度学习训练过程中。其核心思想是：随着训练的进行，学习率按照余弦函数的方式逐渐减小，从初始学习率平滑地衰减到最低学习率，有助于模型更好地收敛，避免陷入局部最优。\n- **优点**：相比于线性衰减，余弦退火能让学习率在训练后期有更平滑的...",
                "complexity": "complex",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": true,
                "hasMath": true
            }
        },
        {
            "fileName": "multihead_self_attention.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/multihead_self_attention.mdx",
            "relativePath": "D1_公式/multihead_self_attention.mdx",
            "size": 3516,
            "lastModified": "2025-08-14T07:51:59.410Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/multihead_self_attention.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "multihead self attention",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#multihead self attention/##定义",
                    "#multihead self attention/##公式",
                    "#multihead self attention/##例子",
                    "#multihead self attention/##代码",
                    "#multihead self attention/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 72,
                "contentLines": 45,
                "codeLines": 0,
                "commentLines": 0,
                "emptyLines": 27,
                "wordCount": 150,
                "characterCount": 1742,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "markdown",
                "topics": [
                    "multihead",
                    "self",
                    "attention"
                ],
                "summary": "**完整文档内容：**\n\n# multihead self attention\n\n## 定义\n\n多头自注意力（Multi-Head Self-Attention）机制是Transformer模型的核心组件之一。它通过将输入向量分别送入多个不同的注意力头（head），使模型能够在不同的子空间中并行地捕捉序列中各位置之间的多样化关系，从而提升模型对复杂特征的表达能力。\n\n## 公式\n\n多头自注意力的数...",
                "complexity": "simple",
                "hasCodeBlocks": false,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "relative_position_embedding.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/relative_position_embedding.mdx",
            "relativePath": "D1_公式/relative_position_embedding.mdx",
            "size": 2910,
            "lastModified": "2025-08-15T12:22:43.151Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/relative_position_embedding.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "relative position embedding",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "基础形式",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "经典实现（Shaw et al. 2018）",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "文本序列处理",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "图像分块处理",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "常见挑战",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "效果验证",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#relative position embedding/##定义",
                    "#relative position embedding/##公式/###基础形式",
                    "#relative position embedding/##公式/###经典实现（Shaw et al. 2018）",
                    "#relative position embedding/##例子/###文本序列处理",
                    "#relative position embedding/##例子/###图像分块处理",
                    "#relative position embedding/##代码",
                    "#relative position embedding/##问题/###常见挑战",
                    "#relative position embedding/##问题/###效果验证"
                ]
            },
            "documentStats": {
                "totalLines": 77,
                "contentLines": 61,
                "codeLines": 11,
                "commentLines": 0,
                "emptyLines": 16,
                "wordCount": 117,
                "characterCount": 1216,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "relative",
                    "position",
                    "embedding",
                    "基础形式",
                    "经典实现（Shaw"
                ],
                "summary": "# relative position embedding\n\n## 定义\n相对位置编码（Relative Position Embedding）是Transformer架构中用于捕捉序列元素间相对位置关系的一种机制。与绝对位置编码不同，它通过建模元素之间的距离（如偏移量）来生成位置表示，能更好地处理长序列和局部依赖关系。典型应用场景包括：\n- 自注意力机制中的位置偏置\n- 跨序列对齐任务（如机器翻...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "relu.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/relu.mdx",
            "relativePath": "D1_公式/relu.mdx",
            "size": 3661,
            "lastModified": "2025-08-19T09:03:10.094Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/relu.mdx",
                "frontmatter": {
                    "prev": [],
                    "next": [
                        "321"
                    ],
                    "tags": [],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "relu",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "ReLU函数有什么优缺点？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "ReLU函数的导数是什么？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "什么是死亡ReLU问题？如何解决？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "什么时候使用ReLU？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#relu/##定义",
                    "#relu/##公式",
                    "#relu/##例子",
                    "#relu/##代码",
                    "#relu/##问题/###ReLU函数有什么优缺点？",
                    "#relu/##问题/###ReLU函数的导数是什么？",
                    "#relu/##问题/###什么是死亡ReLU问题？如何解决？",
                    "#relu/##问题/###什么时候使用ReLU？"
                ]
            },
            "documentStats": {
                "totalLines": 91,
                "contentLines": 85,
                "codeLines": 24,
                "commentLines": 0,
                "emptyLines": 6,
                "wordCount": 209,
                "characterCount": 1732,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "relu",
                    "向量化版本（适用于矩阵）",
                    "输出:",
                    "[[0",
                    "6]]"
                ],
                "summary": "# relu\n## 定义\nReLU（Rectified Linear Unit）函数是一种常用的非线性激活函数，也称为修正线性单元。它将输入值小于0的部分置为0，大于0的部分保持不变，是目前深度学习中最常用的激活函数之一。\n## 公式\n数学表达式如下：\n$$\n\\mathrm{ReLU}(x) = \\max(0, x) = \\begin{cases} \nx & \\text{if } x > 0 \\\\...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "rms_norm.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/rms_norm.mdx",
            "relativePath": "D1_公式/rms_norm.mdx",
            "size": 2739,
            "lastModified": "2025-08-19T07:05:29.651Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/rms_norm.mdx",
                "frontmatter": {
                    "prev": [],
                    "next": [],
                    "tags": [],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "rms norm",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "1. 为什么RMSNorm不减去均值？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "2. 如何选择$\\epsilon$的数值？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "3. 与LayerNorm相比有哪些优缺点？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "4. 实际应用中的注意事项",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#rms norm/##定义",
                    "#rms norm/##公式",
                    "#rms norm/##例子",
                    "#rms norm/##代码",
                    "#rms norm/##问题/###1. 为什么RMSNorm不减去均值？",
                    "#rms norm/##问题/###2. 如何选择$\\epsilon$的数值？",
                    "#rms norm/##问题/###3. 与LayerNorm相比有哪些优缺点？",
                    "#rms norm/##问题/###4. 实际应用中的注意事项"
                ]
            },
            "documentStats": {
                "totalLines": 67,
                "contentLines": 63,
                "codeLines": 8,
                "commentLines": 0,
                "emptyLines": 4,
                "wordCount": 163,
                "characterCount": 1483,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "rms",
                    "norm",
                    "为什么RMSNorm不减去均值？",
                    "如何选择$\\epsilon$的数值？",
                    "与LayerNorm相比有哪些优缺点？"
                ],
                "summary": "# rms norm\n## 定义\nRMSNorm（Root Mean Square Layer Normalization）是一种归一化方法，常用于深度学习模型中，尤其是在自然语言处理任务的Transformer结构里。它的主要作用是对输入向量进行归一化处理，从而加速模型的收敛，提高训练的稳定性。\n## 公式\n与常见的LayerNorm不同，RMSNorm只利用输入的均方根（Root Mean S...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "rope.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/rope.mdx",
            "relativePath": "D1_公式/rope.mdx",
            "size": 3284,
            "lastModified": "2025-08-19T07:54:10.710Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/rope.mdx",
                "frontmatter": {
                    "prev": [
                        "./absolute_position_embedding.mdx"
                    ],
                    "next": [
                        "./relative_position_embedding.mdx"
                    ],
                    "tags": [],
                    "image": ""
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "rope",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#rope/##定义",
                    "#rope/##公式",
                    "#rope/##例子",
                    "#rope/##代码",
                    "#rope/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 70,
                "contentLines": 64,
                "codeLines": 22,
                "commentLines": 0,
                "emptyLines": 6,
                "wordCount": 111,
                "characterCount": 1399,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "rope"
                ],
                "summary": "# rope\n## 定义\nRoPE（Rotary Position Embedding，旋转位置编码）是一种用于Transformer架构的位置编码方法。与传统的位置嵌入不同，RoPE通过旋转矩阵将位置信息融入注意力机制中，使得模型能够更好地捕捉序列中元素的相对位置关系。RoPE的主要优势在于其能够保持相对位置信息的线性特性，同时避免了绝对位置编码的一些局限性。\n## 公式\nRoPE的核心思想是通...",
                "complexity": "simple",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "scaled_dot_product_attention.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/scaled_dot_product_attention.mdx",
            "relativePath": "D1_公式/scaled_dot_product_attention.mdx",
            "size": 2811,
            "lastModified": "2025-08-14T08:08:49.078Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/scaled_dot_product_attention.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "scaled dot product attention",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": []
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#scaled dot product attention/##定义",
                    "#scaled dot product attention/##公式",
                    "#scaled dot product attention/##例子",
                    "#scaled dot product attention/##代码",
                    "#scaled dot product attention/##问题"
                ]
            },
            "documentStats": {
                "totalLines": 67,
                "contentLines": 52,
                "codeLines": 16,
                "commentLines": 0,
                "emptyLines": 15,
                "wordCount": 114,
                "characterCount": 1211,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "scaled",
                    "dot",
                    "product",
                    "示例使用"
                ],
                "summary": "# scaled dot product attention\n\n## 定义\n缩放点积注意力（Scaled Dot-Product Attention）是Transformer模型中的核心组件之一，由Vaswani等人在2017年的论文《Attention Is All You Need》中提出。它是一种通过计算查询（Query）、键（Key）和值（Value）之间的相似度来分配注意力的机制。与传统...",
                "complexity": "simple",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "sigmoid.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/sigmoid.mdx",
            "relativePath": "D1_公式/sigmoid.mdx",
            "size": 2275,
            "lastModified": "2025-08-16T05:49:44.359Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/sigmoid.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "sigmoid",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "Sigmoid函数有什么优缺点？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "Sigmoid函数的导数是什么？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "什么时候使用Sigmoid？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#sigmoid/##定义",
                    "#sigmoid/##公式",
                    "#sigmoid/##例子",
                    "#sigmoid/##代码",
                    "#sigmoid/##问题/###Sigmoid函数有什么优缺点？",
                    "#sigmoid/##问题/###Sigmoid函数的导数是什么？",
                    "#sigmoid/##问题/###什么时候使用Sigmoid？"
                ]
            },
            "documentStats": {
                "totalLines": 77,
                "contentLines": 53,
                "codeLines": 14,
                "commentLines": 0,
                "emptyLines": 24,
                "wordCount": 108,
                "characterCount": 1044,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "sigmoid",
                    "向量化版本",
                    "Sigmoid函数有什么优缺点？",
                    "Sigmoid函数的导数是什么？",
                    "什么时候使用Sigmoid？"
                ],
                "summary": "# sigmoid\n\n## 定义\n\nSigmoid函数是一种常用的激活函数，也称为逻辑函数（Logistic Function），可以将任意实数输入映射到 (0,1) 区间内，常用于二分类问题的输出层。\n\n## 公式\n数学表达式如下：\n\n$$\n\\mathrm{sigmoid}(x) = \\frac{1}{1 + e^{-x}}\n$$\n\n其中，$x$ 表示输入值。\n\n- **S型曲线**：Sigmo...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "silu.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/silu.mdx",
            "relativePath": "D1_公式/silu.mdx",
            "size": 3628,
            "lastModified": "2025-08-14T04:28:57.669Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/silu.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "silu",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "基础实现",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "数值稳定版本",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "PyTorch实现",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "如何计算SiLU的梯度？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "为什么SiLU比ReLU更好？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#silu/##定义",
                    "#silu/##公式",
                    "#silu/##例子",
                    "#silu/##代码/###基础实现",
                    "#silu/##代码/###数值稳定版本",
                    "#silu/##代码/###PyTorch实现",
                    "#silu/##问题/###如何计算SiLU的梯度？",
                    "#silu/##问题/###为什么SiLU比ReLU更好？"
                ]
            },
            "documentStats": {
                "totalLines": 139,
                "contentLines": 102,
                "codeLines": 52,
                "commentLines": 0,
                "emptyLines": 37,
                "wordCount": 176,
                "characterCount": 1602,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "silu",
                    "基础实现",
                    "向量化版本",
                    "输出:",
                    "[-0.23840584"
                ],
                "summary": "# silu\n\n## 定义\n\nSiLU（Sigmoid Linear Unit）函数，也称为Swish函数，是一种平滑的非线性激活函数。它将Sigmoid函数与线性函数相乘，结合了Sigmoid的平滑特性和线性函数的简单性，在深度学习中表现优异。\n\n**核心特性：**\n- **平滑性**：函数处处可导，梯度变化平滑\n- **自门控**：输出值在0到1之间，具有门控效果\n- **非单调**：在某些区...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "softmax.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/softmax.mdx",
            "relativePath": "D1_公式/softmax.mdx",
            "size": 5740,
            "lastModified": "2025-08-15T02:14:20.434Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/softmax.mdx",
                "frontmatter": {
                    "updatedAt": "2025-08-15T02:14:20.432Z"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "softmax",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "基础实现",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "数值稳定版本",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "PyTorch实现",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "如何计算softmax的梯度？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "说明softmax如何应用于图像和文本分类任务？",
                                        "children": [
                                            {
                                                "level": 4,
                                                "text": "图像分类",
                                                "children": []
                                            },
                                            {
                                                "level": 4,
                                                "text": "文本分类",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "level": 3,
                                        "text": "为什么要用指数函数处理？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "5. Softmax与Sigmoid的区别？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "什么时候使用Softmax？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#softmax/##定义",
                    "#softmax/##公式",
                    "#softmax/##例子",
                    "#softmax/##代码/###基础实现",
                    "#softmax/##代码/###数值稳定版本",
                    "#softmax/##代码/###PyTorch实现",
                    "#softmax/##问题/###如何计算softmax的梯度？",
                    "#softmax/##问题/###说明softmax如何应用于图像和文本分类任务？/####图像分类",
                    "#softmax/##问题/###说明softmax如何应用于图像和文本分类任务？/####文本分类",
                    "#softmax/##问题/###为什么要用指数函数处理？",
                    "#softmax/##问题/###5. Softmax与Sigmoid的区别？",
                    "#softmax/##问题/###什么时候使用Softmax？"
                ]
            },
            "documentStats": {
                "totalLines": 220,
                "contentLines": 163,
                "codeLines": 76,
                "commentLines": 0,
                "emptyLines": 57,
                "wordCount": 242,
                "characterCount": 2148,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "softmax",
                    "基础实现",
                    "数值稳定版本",
                    "测试数值稳定性",
                    "PyTorch实现"
                ],
                "summary": "# softmax\n\n## 定义\n\nSoftmax函数是一种常用于多分类模型输出层的激活函数，可以将一个包含任意实数的向量\"压缩\"为一个概率分布（所有元素非负且和为1）。\n\n**核心特性：**\n- **归一化**：输出向量所有元素之和为1\n- **非负性**：所有输出元素都大于等于0\n- **单调性**：输入越大，对应输出概率越大\n\n## 公式\n\n数学表达式如下：\n\n$$\n\\mathrm{soft...",
                "complexity": "complex",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": true,
                "hasMath": true
            }
        },
        {
            "fileName": "swiglu.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/swiglu.mdx",
            "relativePath": "D1_公式/swiglu.mdx",
            "size": 5218,
            "lastModified": "2025-07-24T05:41:42.606Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/swiglu.mdx",
                "frontmatter": {},
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "swiglu",
                        "children": [
                            {
                                "level": 2,
                                "text": "定义",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "公式",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "例子",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "基础实现",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "PyTorch实现",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "批量处理版本",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "问题",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "SwigLU相比传统激活函数有什么优势？",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "SwigLU中的门控机制是如何工作的？",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#swiglu/##定义",
                    "#swiglu/##公式",
                    "#swiglu/##例子",
                    "#swiglu/##代码/###基础实现",
                    "#swiglu/##代码/###PyTorch实现",
                    "#swiglu/##代码/###批量处理版本",
                    "#swiglu/##问题/###SwigLU相比传统激活函数有什么优势？",
                    "#swiglu/##问题/###SwigLU中的门控机制是如何工作的？"
                ]
            },
            "documentStats": {
                "totalLines": 182,
                "contentLines": 134,
                "codeLines": 88,
                "commentLines": 0,
                "emptyLines": 48,
                "wordCount": 223,
                "characterCount": 2002,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "swiglu",
                    "基础实现",
                    "PyTorch实现",
                    "使用示例",
                    "批量处理版本"
                ],
                "summary": "# swiglu\n\n## 定义\n\nSwish-Gated Linear Unit (SwigLU) 是一种门控激活函数，结合了Swish函数和门控机制的特点。它通过门控机制来控制信息流，提升模型的表达能力，在Transformer等模型中表现优异。\n\n**核心特性：**\n- **门控机制**：通过门控函数控制信息流\n- **非线性变换**：结合了线性变换和非线性激活\n- **参数效率**：相比传统...",
                "complexity": "medium",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "test.mdx",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/test.mdx",
            "relativePath": "D1_公式/test.mdx",
            "size": 887,
            "lastModified": "2025-08-18T11:55:13.820Z",
            "languageId": "mdx",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/D1_公式/test.mdx",
                "frontmatter": {
                    "321321": "",
                    "title": "加法交换律 213132321321",
                    "description": "加法交换律 321321321",
                    "tags": [
                        "加法交换律",
                        "加法交换律",
                        "你好",
                        "312321",
                        "321312"
                    ]
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "定义",
                        "children": []
                    }
                ],
                "leafMarkdownHeadings": [
                    "#定义"
                ]
            },
            "documentStats": {
                "totalLines": 59,
                "contentLines": 49,
                "codeLines": 20,
                "commentLines": 0,
                "emptyLines": 10,
                "wordCount": 70,
                "characterCount": 405,
                "readingTimeMinutes": 1
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [],
                "summary": "# 定义\n**定义**：加法交换律是指两个数相加时，交换加数的位置，结果不变。\n**公式**：  \n设 $a$ 和 $b$ 是实数，则有 $a + b = b + a$。\n**例子**：  \n例如，$2 + 3 = 3 + 2 = 5$。\n**代码**\n32131\n312321\n3131：  \n\n**问题**：\n1. 加法交换律适用于哪些数集？\n2. 减法是否满足交换律？\n$$\ng_t = \\na...",
                "complexity": "simple",
                "hasCodeBlocks": true,
                "hasImages": false,
                "hasTables": false,
                "hasMath": true
            }
        },
        {
            "fileName": "todo.md",
            "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/todo.md",
            "relativePath": "todo.md",
            "size": 2961,
            "lastModified": "2025-08-19T03:59:31.581Z",
            "languageId": "markdown",
            "metadata": {
                "filePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336/todo.md",
                "frontmatter": {
                    "prev": [],
                    "next": [],
                    "tags": [
                        "演示",
                        "PPT",
                        "Markdown"
                    ],
                    "image": "",
                    "title": "Markdown 演示文档",
                    "author": "演示者",
                    "date": "2024-12-19"
                },
                "references": [],
                "markdownHeadings": [
                    {
                        "level": 1,
                        "text": "Markdown 功能演示",
                        "children": [
                            {
                                "level": 2,
                                "text": "欢迎使用我们的 Markdown 编辑器",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "这是一个功能丰富的 Markdown 编辑器，支持多种格式和交互功能。",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "基础文本格式",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "文本样式",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "链接和图片",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "列表和结构",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "无序列表",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "有序列表",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "表格展示",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "| 功能 | 状态 | 描述 |\n|------|------|------|\n| 基础解析 | ✅ | 支持标题、段落、列表 |\n| 表格 | ✅ | 支持复杂表格结构 |\n| 代码块 | ✅ | 支持语法高亮 |\n| 数学公式 | ✅ | 支持 LaTeX 渲染 |",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "代码示例",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "Python 代码",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "数学公式",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "行内公式",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "块级公式",
                                        "children": []
                                    },
                                    {
                                        "level": 3,
                                        "text": "复杂公式",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "$$\n\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}\n$$",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "信息块",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": ":::info\n这是一个信息块，用于显示重要的提示信息。\n:::\n:::warning\n这是一个警告块，用于提醒用户注意某些事项。\n:::\n:::error\n这是一个错误块，用于显示错误或问题。\n:::",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "待办事项",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "[✓] 完成基础功能开发\n[✓] 编写文档\n[ ] 发布正式版本",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "引用和注释",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "脚注示例",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "level": 2,
                                "text": "这里是一个脚注示例[^1]。\n[^1]: 这是脚注的内容，会在页面底部显示。",
                                "children": []
                            },
                            {
                                "level": 2,
                                "text": "高级功能",
                                "children": [
                                    {
                                        "level": 3,
                                        "text": "HTML 嵌入",
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "leafMarkdownHeadings": [
                    "#Markdown 功能演示/##欢迎使用我们的 Markdown 编辑器",
                    "#Markdown 功能演示/##这是一个功能丰富的 Markdown 编辑器，支持多种格式和交互功能。",
                    "#Markdown 功能演示/##基础文本格式/###文本样式",
                    "#Markdown 功能演示/##基础文本格式/###链接和图片",
                    "#Markdown 功能演示/##列表和结构/###无序列表",
                    "#Markdown 功能演示/##列表和结构/###有序列表",
                    "#Markdown 功能演示/##表格展示",
                    "#Markdown 功能演示/##| 功能 | 状态 | 描述 |\n|------|------|------|\n| 基础解析 | ✅ | 支持标题、段落、列表 |\n| 表格 | ✅ | 支持复杂表格结构 |\n| 代码块 | ✅ | 支持语法高亮 |\n| 数学公式 | ✅ | 支持 LaTeX 渲染 |",
                    "#Markdown 功能演示/##代码示例/###Python 代码",
                    "#Markdown 功能演示/##数学公式/###行内公式",
                    "#Markdown 功能演示/##数学公式/###块级公式",
                    "#Markdown 功能演示/##数学公式/###复杂公式",
                    "#Markdown 功能演示/##$$\n\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}\n$$",
                    "#Markdown 功能演示/##信息块",
                    "#Markdown 功能演示/##:::info\n这是一个信息块，用于显示重要的提示信息。\n:::\n:::warning\n这是一个警告块，用于提醒用户注意某些事项。\n:::\n:::error\n这是一个错误块，用于显示错误或问题。\n:::",
                    "#Markdown 功能演示/##待办事项",
                    "#Markdown 功能演示/##[✓] 完成基础功能开发\n[✓] 编写文档\n[ ] 发布正式版本",
                    "#Markdown 功能演示/##引用和注释/###脚注示例",
                    "#Markdown 功能演示/##这里是一个脚注示例[^1]。\n[^1]: 这是脚注的内容，会在页面底部显示。",
                    "#Markdown 功能演示/##高级功能/###HTML 嵌入"
                ]
            },
            "documentStats": {
                "totalLines": 128,
                "contentLines": 125,
                "codeLines": 10,
                "commentLines": 0,
                "emptyLines": 3,
                "wordCount": 283,
                "characterCount": 1729,
                "readingTimeMinutes": 2
            },
            "contentAnalysis": {
                "language": "python",
                "topics": [
                    "Markdown",
                    "功能演示",
                    "欢迎使用我们的",
                    "编辑器",
                    "基础文本格式"
                ],
                "summary": "# Markdown 功能演示\n## 欢迎使用我们的 Markdown 编辑器\n这是一个功能丰富的 Markdown 编辑器，支持多种格式和交互功能。\n---\n## 基础文本格式\n### 文本样式\n- **粗体文本** - 用于强调重要内容\n- *斜体文本* - 用于突出关键词\n- ~~删除线~~ - 表示已废弃的内容\n- \\`行内代码\\` - 用于技术术语\n### 链接和图片\n- [访问我们的网...",
                "complexity": "complex",
                "hasCodeBlocks": true,
                "hasImages": true,
                "hasTables": true,
                "hasMath": true
            }
        }
    ],
    "scanTime": "2025-08-21T02:03:31.073Z",
    "workspacePath": "/Users/apple1/Desktop/supernode/web/docs/he_cs336"
}

export const filesMock: MarkdownFileStats = JSON.parse(JSON.stringify(demo));