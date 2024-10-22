import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { alphaTab } from "@coderline/alphatab/vite";
import path from 'path'
import { fileURLToPath } from 'url';

console.log('###', fileURLToPath(new URL('./src', import.meta.url)))

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    alphaTab({
      alphaTabSourceDir: path.resolve('./node_modules/@coderline/alphatab/dist'),
      assetOutputDir: path.resolve('./node_modules/.vite/deps/')
    })
  ],
})
