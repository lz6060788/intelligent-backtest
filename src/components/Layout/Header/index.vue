<template>
  <div
    class="w-full h-[var(--height-header)] flex items-center justify-between bg-[var(--header-background)] border-0 border-solid border-b border-gray-800
    px-10 text-xl font-bold select-none"
  >
    <div class="flex items-center">
      <RiRobot2Fill class="w-5 h-5 mr-2" />
      {{ t(`${i18nPrefix}.title`) }}
    </div>
    <div class="flex items-center text-gray-400 ">
      <RiTranslate class="w-5 h-5 mr-4 cursor-pointer hover:text-teal" @click="switchLanguage" />
      <RiUserFill class="w-5 h-5 mr-2 cursor-pointer " />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiRobot2Fill, RiUserFill, RiTranslate } from '@remixicon/vue'

const { t, locale } = useI18n()

const i18nPrefix = 'layout.header'

// 切换语言
const switchLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
</script>
