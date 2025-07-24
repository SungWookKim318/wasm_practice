import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from one level up to access WASM files
      allow: ['..']
    },
    headers: {
      // WASM 파일을 위한 MIME 타입 설정
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  optimizeDeps: {
    exclude: ['helper.js']
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    rollupOptions: {
      external: ['helper.js']
    }
  }
})
