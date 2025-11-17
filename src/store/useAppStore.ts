import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const appDetail = ref<any>()

  return {
    appDetail,
  }
})