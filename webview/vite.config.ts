import { defineConfig } from "vite";

export default defineConfig({
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
    },
  },
  server: {
    port: 3000,
  },
});
