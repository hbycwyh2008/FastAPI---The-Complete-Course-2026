import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Dev: proxy /books → FastAPI (uvicorn Books:app --reload)
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/books': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
