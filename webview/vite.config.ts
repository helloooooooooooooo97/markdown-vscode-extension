import { defineConfig } from "vite";

export default defineConfig({
  logLevel: 'error', // 只显示错误信息，抑制警告
  build: {
    outDir: "dist",
    watch: {
      // 监听文件变化并自动重新构建
      include: "src/**",
      exclude: "node_modules/**",
    },
    rollupOptions: {
      input: "index.html",
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
      onwarn(warning, warn) {
        // 忽略 "use client" 相关的警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.indexOf('"use client"') !== -1) {
          return;
        }
        // 忽略其他常见的无害警告
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        // 对于其他警告，仍然显示
        warn(warning);
      }
    },
  },
  plugins: [
    {
      name: 'build-progress',
      configResolved(config) {
        console.log('🚀 Starting build process...');
      },
      buildStart() {
        console.log('📦 Building...');
      },
      transform(code, id) {
        // 显示文件转换进度
        if (id.indexOf('src/') !== -1) {
          console.log(`🔄 Transforming: ${id.split('/').pop()}`);
        }
        return null;
      },
      generateBundle(options, bundle) {
        console.log('📋 Generating bundle...');
        Object.keys(bundle).forEach(fileName => {
          console.log(`📄 Generated: ${fileName}`);
        });
      },
      writeBundle(options, bundle) {
        console.log('💾 Writing files to disk...');
      },
      closeBundle() {
        console.log('✅ Build completed successfully!');
      }
    }
  ],
  server: {
    port: 3000,
  },
});
