import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { alphaTab } from "@coderline/alphatab/vite";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    alphaTab({
      alphaTabSourceDir: path.resolve('./node_modules/@coderline/alphatab/dist'),
    })
  ],
})
