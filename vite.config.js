import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import WindiCSS from "vite-plugin-windicss";
import compression from "vite-plugin-compression"; // 压缩
import { visualizer } from "rollup-plugin-visualizer"; // 打包分析

import path from "path";

const pathSrc = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://ceshi13.dishait.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [
    vue(),
    WindiCSS(),
    AutoImport({
      imports: ["vue"],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
      dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),

    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, "components.d.ts"),
    }),

    Icons({
      autoInstall: true,
    }),

    compression({
      ext: "gz",
      algorithm: "gzip",
      deleteOriginFile: false,
    }),

    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  base: '/Neverland/' // github仓库名称
});
