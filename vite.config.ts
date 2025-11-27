import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // host: 'dev.ainvest.com',
    // port: 443,
    // // 开启 HTTPS
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, './ssl/ainvest/localhost-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, './ssl/ainvest/localhost.pem'))
    // },
  }
})
