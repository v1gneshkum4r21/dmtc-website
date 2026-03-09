import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    // Target modern browsers for smaller, faster output
    target: 'es2020',
    // Increase chunk size warning threshold (our vendor bundle is expected to be large)
    chunkSizeWarningLimit: 600,
    // Enable CSS code splitting per chunk
    cssCodeSplit: true,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // Remove all console.logs in production
        drop_debugger: true,
        passes: 2             // Two passes for better dead-code elimination
      },
      format: {
        comments: false       // Strip all comments
      }
    },
    rollupOptions: {
      output: {
        // Smart manual chunk splitting
        manualChunks(id) {
          // Core Vue runtime — own chunk, cached forever
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
            return 'vue-core'
          }
          // Axios — small, but separate so it can be cached independently
          if (id.includes('node_modules/axios')) {
            return 'axios'
          }
          // WebAuthn (only used on admin settings, keep out of main bundle)
          if (id.includes('@simplewebauthn')) {
            return 'webauthn'
          }
          // Admin panel — split into own chunk, never loaded by public users
          if (id.includes('/src/views/admin')) {
            return 'admin'
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        // Deterministic file naming with content hash for long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'assets/img/[name]-[hash][extname]'
          }
          if (/woff2?|ttf|eot/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
