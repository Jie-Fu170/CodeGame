import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser-vendor': ['phaser'],
          'react-vendor': ['react', 'react-dom', 'zustand'],
          'lucide-icons': ['lucide-react']
        }
      }
    }
  }
})

