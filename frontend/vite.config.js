import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['motion'],
          'payment-vendor': ['braintree-web-drop-in'],
          'icons-vendor': ['@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
