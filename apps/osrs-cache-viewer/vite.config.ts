import { URL, fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { nitro } from 'nitro/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  ssr: {
    noExternal: ['@uiw/react-json-view'],
  },
  // @ts-ignore - Vitest types are not picked up by Vite's defineConfig
  test: {
    globals: true,
    environment: 'jsdom',
    resolveSnapshotPath: (path: string, extension: string) => path + extension,
    server: {
      deps: {
        inline: ['@kurza/ui-components'],
      },
    },
  },
})
