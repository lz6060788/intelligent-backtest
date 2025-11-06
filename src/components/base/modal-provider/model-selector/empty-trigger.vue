<template>
  <div
    :class="cn(
      'flex cursor-pointer items-center gap-0.5 rounded-lg bg-components-input-bg-normal p-1 hover:bg-components-input-bg-hover',
      open && 'bg-components-input-bg-hover',
      className,
    )"
  >
    <div class="flex grow items-center">
      <div class="mr-1.5 flex h-4 w-4 items-center justify-center rounded-[5px] border border-dashed border-divider-regular">
        <CubeOutline class="h-3 w-3 text-text-quaternary" />
      </div>
      <div
        class="truncate text-[13px] text-text-tertiary"
        title="Configure model"
      >
        {{ t('plugin.detailPanel.configureModel') }}
      </div>
    </div>
    <div class="flex h-4 w-4 shrink-0 items-center justify-center">
      <RiEqualizer2Line class="h-3.5 w-3.5 text-text-tertiary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiEqualizer2Line } from '@remixicon/vue'
import { CubeOutline } from '@/components/base/icons/src/vender/line/shapes'
import cn from '@/utils/classnames'
import { useI18n } from 'vue-i18n'

interface EmptyTriggerProps {
  open: boolean
  className?: string
}

const props = defineProps<EmptyTriggerProps>()

const { t } = useI18n()
</script>

