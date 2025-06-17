import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Ensure we're building for browser
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    alias: {
      // Prevent database modules from being bundled for browser
      './database': false,
      '../database': false,
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude Node.js modules and database modules from browser bundle
        return id.includes('better-sqlite3') || 
               id.includes('fs') || 
               id.includes('path') || 
               id.includes('url') ||
               id.includes('/database/') ||
               id.includes('\\database\\');
      },
    },
  },
});
