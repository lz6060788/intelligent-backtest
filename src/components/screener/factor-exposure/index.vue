<template>
  <div class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
      <span class="text-xs text-gray-500">{{ t(`${i18nPrefix}.sort`) }}</span>
    </div>
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-300">{{ t(`${i18nPrefix}.momentum`) }}</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-24 bg-green-400 rounded-full"></div>
          <span class="text-white font-semibold">0.82</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-300">{{ t(`${i18nPrefix}.quality`) }}</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-16 bg-blue-400 rounded-full"></div>
          <span class="text-white font-semibold">0.64</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-300">{{ t(`${i18nPrefix}.lowVolatility`) }}</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-14 bg-emerald-400 rounded-full"></div>
          <span class="text-white font-semibold">0.58</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-300">{{ t(`${i18nPrefix}.value`) }}</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-10 bg-amber-400 rounded-full"></div>
          <span class="text-white font-semibold">0.42</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'screener.detail.factorExposure'
</script>

<style scoped></style>
