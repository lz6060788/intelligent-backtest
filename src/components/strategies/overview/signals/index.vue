<template>
  <div class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
        <span class="text-[11px] text-gray-500" id="signals-count-label"></span>
      </div>
    </div>
    <div id="signals-preview" class="space-y-3">
      <template v-if="data.length === 0">
        <Empty :text="t(`${i18nPrefix}.noSignals`)" />
      </template>
      <template v-else>
        <StrategySignalsItem v-for="signal in data" :data="signal" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StrategySignalsItem from '../../signals/item/index.vue'
import Empty from '@/components/base/empty.vue'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.overview.signals'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped></style>
