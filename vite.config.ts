import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'




export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb'],
build: {
    chunkSizeWarningLimit: 10000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }

})