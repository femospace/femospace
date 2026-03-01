import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/Favicon.png'],
      manifest: {
        name: 'Femo Space',
        short_name: 'Femo',
        description: 'Next-Gen Global Social Platform',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/logo_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/PWA_icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Allow up to 5MB
      }
    })
  ],
  resolve: {
    alias: {
      // Manual overrides can go here if needed, but not circular ones
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});



