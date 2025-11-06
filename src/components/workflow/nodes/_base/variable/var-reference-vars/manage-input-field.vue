<template>
  <div class="border-t border-divider-subtle px-2 py-1.5">
    <div
      class="flex cursor-pointer items-center rounded-md px-2 py-1 hover:bg-state-base-hover"
      @click="handleManage"
    >
      <div class="text-xs font-medium text-text-primary">
        {{ t('workflow.panel.userInputField') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  onManage?: () => void
}

const props = defineProps<Props>()

const { t } = useI18n()

const handleManage = () => {
  props.onManage?.()
}
</script>

