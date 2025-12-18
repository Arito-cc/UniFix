import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- ADD THIS 'server' SECTION ---
  server: {
    proxy: {
      // This proxies all requests starting with '/api'
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If you're not using https
      },
    },
  },
  // --- END OF NEW SECTION ---
});