import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import i18n from './locales'
import { createPinia } from 'pinia'
import 'uno.css';
import '@/assets/css/index.css';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
