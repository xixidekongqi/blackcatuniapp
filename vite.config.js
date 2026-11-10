import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 5173, // 固定端口，与原项目习惯保持一致
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
      // 如果你要展示商品图片，图片路径 /uploads 也需要代理
      '/uploads': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  }
})