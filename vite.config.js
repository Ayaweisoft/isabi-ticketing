import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, /api/* is proxied to the real API server
      // so the browser never makes a cross-origin request (no CORS issue)
      '/api': {
        target: 'https://api.i-sabi.com.ng',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
