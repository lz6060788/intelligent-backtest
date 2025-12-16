<template>
  <div class="flex items-center justify-between">
    <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
  </div>
  <div id="signals-full" class="space-y-3">
    <template v-if="data.length === 0">
      <Empty :text="t(`${i18nPrefix}.noSignals`)" />
    </template>
    <template v-else>
      <StrategySignalsItem v-for="signal in data.slice(0, 3)" :data="signal" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StrategySignalsItem from './item/index.vue'
import Empty from '@/components/base/empty.vue'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.signals'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped></style>
