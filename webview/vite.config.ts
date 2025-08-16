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
        // 忽略 "use client" 指令的警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && String(warning.message).indexOf('"use client"') !== -1) {
          return;
        }
        // 显示其他重要警告
        warn(warning);
      },
    },
  },
  server: {
    port: 3000,
  },
});
