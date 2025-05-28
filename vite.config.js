import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wanna-coffee-new/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
