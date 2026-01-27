import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'document/image.png'], // Adicione outros assets se tiver
      manifest: {
        name: 'Financeiro Pessoal',
        short_name: 'Financeiro',
        description: 'Gestão financeira simples e eficiente.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Isso tira a barra do navegador!
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Vamos gerar isso no passo 3
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Vamos gerar isso no passo 3
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Importante para Android novos
          }
        ]
      }
    })
  ],
});