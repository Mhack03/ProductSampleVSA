import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

export default defineConfig({
   plugins: [
    /**
     * tanstackRouter MUST come before react().
     * It watches your src/routes/ folder and auto-generates
     * src/routeTree.gen.ts every time you add/rename a route file.
     *
     * target: 'react'         — tells the plugin we're using React (not Solid)
     * autoCodeSplitting: true — each route is lazy-loaded automatically,
     *                           so your initial bundle stays small
     */
    tanstackRouter({
      target: 'react',
      // enable automatic route code-splitting so route modules are lazy-loaded
      // and the initial bundle stays smaller
      autoCodeSplitting: true,
    }),

    /**
     * react() enables JSX/TSX transformation and React Fast Refresh
     * (hot reloading that preserves component state during development).
     */
    react(),

    /**
     * tailwindcss() processes your Tailwind utility classes.
     * In Tailwind v4, this Vite plugin replaces the old PostCSS setup.
     */
    tailwindcss(),
  ],

  resolve: {
    alias: {
      /**
       * This alias lets you write:
       *   import { Button } from '@/components/ui/button'
       * instead of:
       *   import { Button } from '../../components/ui/button'
       *
       * Much cleaner, and it never breaks when you move files.
       */
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // increase the warning threshold slightly and let Rollup split vendor packages
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // create separate vendor chunks per package to avoid a single huge chunk
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            // handle scoped packages like @org/pkg
            const pkg = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
            return `vendor_${pkg}`;
          }
        },
      },
    },
  },
})