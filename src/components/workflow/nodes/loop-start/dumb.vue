<template>
  <div
      class="nodrag relative left-[17px] top-[21px] z-[11] flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-600 bg-blue-500"
  >
    <ElTooltip :content="t('workflow.blocks.loop-start')">
      <div class="flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-components-panel-border-subtle bg-util-colors-blue-brand-blue-brand-500">
        <RiHome5Fill class="h-3 w-3 text-text-primary-on-surface" />
      </div>
    </ElTooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiHome5Fill } from '@remixicon/vue'

const { t } = useI18n()
</script>