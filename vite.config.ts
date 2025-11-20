import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Map "@" to your ./src folder so imports like "@/foo/bar" work
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    host: '127.0.0.1',   // keep dev server local only
    port: 5173,
    strictPort: true,
    cors: false,
    fs: { strict: true }
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    cors: false
  }
})
