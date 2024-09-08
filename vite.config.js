import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Your Spring Boot backend URL
        changeOrigin: true,
        secure: false,
        // Remove /api prefix before forwarding request
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
