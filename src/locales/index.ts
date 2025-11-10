import { createI18n } from 'vue-i18n'
import zh from './zh';
import en from './en';

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

console.log(zh)
export default i18n
