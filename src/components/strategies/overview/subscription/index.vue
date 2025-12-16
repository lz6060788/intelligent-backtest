<template>
  <div
    class="bg-gray-950 border-solidborder border-gray-800 rounded-xl p-5 space-y-3"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-white font-semibold flex items-center gap-2">
        <RiLink class="w-4 h-4 text-teal" /> {{ t(`${i18nPrefix}.title`) }}
      </h3>
      <button class="text-xs text-gray-500 hover:text-white">
        <RiShareBoxFill class="w-4 h-4" />
      </button>
    </div>
    <p class="text-gray-500 text-sm">
      {{ t(`${i18nPrefix}.desc`) }}
    </p>
    <button
      class="w-full px-4 py-3 bg-teal text-gray-950 font-bold rounded-lg hover:bg-teal-hover transition flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(0,219,195,0.35)]"
    >
      <RiPlugLine class="w-4 h-4" /> {{ t(`${i18nPrefix}.button`) }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiPlugLine, RiShareBoxFill, RiLink } from '@remixicon/vue'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.overview.subscription'
</script>

<style scoped>
</style>