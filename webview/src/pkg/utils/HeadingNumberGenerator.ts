/**
 * 标题序号生成器
 * 用于在解析阶段为标题生成序号
 */
export class HeadingNumberGenerator {
    private counters: number[] = [0, 0, 0, 0, 0, 0]; // 对应 h1-h6 的计数器

    /**
     * 重置所有计数器
     */
    reset(): void {
        this.counters = [0, 0, 0, 0, 0, 0];
    }

    /**
     * 为指定级别的标题生成序号
     * @param level 标题级别 (1-6)
     * @returns 序号字符串
     */
    generateNumber(level: number): string {
        if (level < 1 || level > 6) {
            return '';
        }

        // 当遇到更高级别的标题时，重置所有更低级别的计数器
        for (let i = level; i < 6; i++) {
            this.counters[i] = 0;
        }

        // 增加当前级别的计数器
        this.counters[level - 1]++;

        // 生成序号
        if (level === 1) {
            // 一级标题：一、二、三、四...
            return this.numberToChinese(this.counters[0]);
        } else if (level === 2) {
            // 二级标题：1.1、1.2、2.1、2.2...
            const parentNumber = this.counters[0];
            const currentNumber = this.counters[1];
            return `${parentNumber}.${currentNumber}`;
        } else {
            // 其他级别：1.1.1、1.1.2、1.2.1...
            const numbers = this.counters.slice(0, level);
            return numbers.join('.');
        }
    }

    /**
     * 将数字转换为中文数字
     * @param num 数字
     * @returns 中文数字字符串
     */
    private numberToChinese(num: number): string {
        const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

        if (num <= 10) {
            return chineseNumbers[num - 1];
        } else if (num <= 99) {
            if (num <= 19) {
                return `十${num > 10 ? chineseNumbers[num - 11] : ''}`;
            } else {
                const tens = Math.floor(num / 10);
                const ones = num % 10;
                return `${chineseNumbers[tens - 1]}十${ones > 0 ? chineseNumbers[ones - 1] : ''}`;
            }
        } else {
            // 超过99的数字直接返回阿拉伯数字
            return num.toString();
        }
    }
} 