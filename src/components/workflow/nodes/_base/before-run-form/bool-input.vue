<template>
  <div class="flex h-6 items-center gap-2">
    <el-checkbox
      :model-value="!!value"
      class="!h-4 !w-4"
      @change="handleChange"
    />
    <div class="text-sm flex items-center gap-1 text-text-secondary">
      {{ name }}
      <span
        v-if="!required"
        class="text-xs text-text-tertiary"
      >
        {{ t('workflow.panel.optional') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  name: string
  value: boolean
  required?: boolean
}

const emit = defineEmits<{
  change: [value: boolean]
}>()

const props = defineProps<Props>()

const { t } = useI18n()

const handleChange = (val: boolean) => {
  emit('change', val)
}
</script>

