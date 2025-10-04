import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@milk-tea': path.resolve(__dirname, 'src/milk-tea'),
    },
  },
  
  server: {
    host: true,        // tương đương 0.0.0.0 (cho phép truy cập từ host)
    port: 5173,
    strictPort: true,  // fail sớm nếu cổng bận
    // HMR qua container cho chắc (đặc biệt khi dùng Docker/WSL)
    hmr: {
      host: 'localhost', // host mà trình duyệt trên máy bạn truy cập
      port: 5173,
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
})
