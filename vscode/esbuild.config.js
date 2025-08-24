const esbuild = require('esbuild');

// 基础配置
const baseConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: 'dist/index.js',
    external: [
        'vscode'
    ],
    sourcemap: true,
    minify: false,
    format: 'cjs',
    logLevel: 'info'
};

// 开发环境配置
const devConfig = {
    ...baseConfig,
    sourcemap: true,
    minify: false
};

// 生产环境配置
const prodConfig = {
    ...baseConfig,
    sourcemap: false,
    minify: true
};

// 监听模式配置
const watchConfig = {
    ...baseConfig,
    sourcemap: true,
    minify: false
};

// 根据命令行参数选择配置
const mode = process.argv[2] || 'dev';

let config;
switch (mode) {
    case 'prod':
        config = prodConfig;
        break;
    case 'watch':
        config = watchConfig;
        break;
    default:
        config = devConfig;
}

// 执行构建
if (mode === 'watch') {
    // 监听模式使用context
    esbuild.context(config).then(context => {
        context.watch();
        console.log('监听模式已启动，按 Ctrl+C 停止...');
    }).catch(() => process.exit(1));
} else {
    // 普通构建模式
    esbuild.build(config).catch(() => process.exit(1));
} 