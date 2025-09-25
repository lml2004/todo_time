import { defineConfig } from 'electron-vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist-electron/main',
      rollupOptions: {
        external: ['electron'],
        input: {
          index: resolve(__dirname, 'main.ts')
        }
      }
    }
  },
  preload: {
    build: {
      outDir: 'dist-electron/preload',
      rollupOptions: {
        external: ['electron'],
        input: {
          index: resolve(__dirname, 'preload/index.ts')
        }
      }
    }
  },
  renderer: {
    root: resolve(__dirname, '..'),
    build: {
      outDir: 'dist-electron/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, '../index.html')
        }
      }
    },
    plugins: [
      vue(),
      vueDevTools()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../src')
      }
    }
  }
})