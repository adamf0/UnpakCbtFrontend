import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://seb.unpak.ac.id',
        changeOrigin: true,
        secure: false, // Jika API menggunakan HTTPS self-signed
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
      },
    },
  },
})
