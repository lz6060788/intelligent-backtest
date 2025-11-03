import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'
import presetWind from '@unocss/preset-wind'
import { cssVars } from './src/theme/index'

export default defineConfig({
  presets: [
    presetUno(), // 包含 Tailwind 兼容的工具类
    presetAttributify(), // 支持属性模式 (例如 <div text-red-500>)
    presetIcons(), // 支持图标
    presetWind() // 支持 Wind CSS
  ],
  theme: {},
  rules: [
    ['text-color-default', { 'color': 'var(--font-main)' }],
    ['text-color-default-60', { 'color': 'var(--font-secondary)' }],
    ['text-color-default-30', { 'color': 'var(--font-supplementry)' }],
    ['panel-background-default', { 'background-color': 'var(--panel-background)' }]
  ],
  shortcuts: {
    // 自定义快捷方式
  },
  preflights: [
    {
      getCSS: ({ theme }) => `
        :root {
          /* 映射尺寸变量 */
          --height-header: 40px;
          --width-sidemenu: 64px;
          ${cssVars}
        }
      `
    }
  ]
})
