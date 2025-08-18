import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, proxy /api -> Flask without stripping '/api'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5002',
        changeOrigin: true,
        secure: false,
        // ❌ remove rewrite — we WANT to keep '/api'
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

