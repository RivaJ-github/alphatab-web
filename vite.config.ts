import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { alphaTab } from "@coderline/alphatab/vite";
import path from 'path'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    alphaTab({
      alphaTabSourceDir: path.resolve('./node_modules/@coderline/alphatab/dist'),
      assetOutputDir: command === 'serve'
      ? path.resolve('./node_modules/.vite/deps/') // 开发环境
      : path.resolve('./public/assets')
    })
  ]
}))
