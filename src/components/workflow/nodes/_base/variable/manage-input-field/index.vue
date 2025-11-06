<template>
  <div class="flex items-center border-t border-divider-subtle pt-1">
    <div
      class="flex h-8 grow cursor-pointer items-center px-3"
      @click="onManage"
    >
      <RiAddLine class="mr-1 h-4 w-4 text-text-tertiary" />
      <div
        class="system-xs-medium truncate text-text-tertiary"
        title="Create user input field"
      >
        {{ t('pipeline.inputField.create') }}
      </div>
    </div>
    <div class="mx-1 h-3 w-[1px] shrink-0 bg-divider-regular"></div>
    <div
      class="system-xs-medium flex h-8 shrink-0 cursor-pointer items-center justify-center px-3 text-text-tertiary"
      @click="onManage"
    >
      {{ t('pipeline.inputField.manage') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiAddLine } from '@remixicon/vue'

defineProps<{
  onManage: () => void
}>()

const { t } = useI18n()
</script>