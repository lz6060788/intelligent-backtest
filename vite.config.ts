import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import monacoEditorPlugin from 'vite-plugin-monaco-editor-esm';

export default defineConfig({
  base:  '/ai-backtest/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    monacoEditorPlugin({
      customWorkers: [
        {
          label: 'editorWorkerService',
          entry: path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.worker.js')
        },
        {
          label: 'json',
          entry: path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs/language/json/json.worker.js')
        },
        {
          label: 'javascript',
          entry: path.resolve(__dirname, 'node_modules/monaco-editor/esm/vs/language/javascript/ts.worker.js')
        }
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
  }
})
