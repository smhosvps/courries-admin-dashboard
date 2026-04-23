import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(), // Use only one React plugin
  ],
  optimizeDeps: {
    include: ['leaflet', 'leaflet-draw', 'react-leaflet-draw']
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optional: Split large chunks to stay under 2 MB without increasing limit
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'leaflet-vendor': ['leaflet', 'react-leaflet', 'react-leaflet-draw'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1 MB warning threshold
  },
});