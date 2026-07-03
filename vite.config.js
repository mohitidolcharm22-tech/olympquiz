import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@store': path.resolve(__dirname, './src/store'),
      '@data': path.resolve(__dirname, './src/data'),
      '@design-system': path.resolve(__dirname, './src/design-system'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — changes rarely, long-lived cache
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // MUI — large but stable; isolate so page chunks stay small
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // State management
          'vendor-store': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
})

