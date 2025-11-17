<template>
  <div class="flex h-0 grow flex-col items-center justify-center">
    <ClockPlay class="h-8 w-8 text-text-quaternary" />
    <div class="system-xs-regular my-2 text-text-tertiary">{{ t('workflow.debug.noData.description') }}</div>
    <el-button
      v-if="canSingleRun"
      class="flex"
      size="small"
      @click="onSingleRun"
    >
      <RiPlayLine class="mr-1 h-3.5 w-3.5" />
      <div>{{ t('workflow.debug.noData.runThisNode') }}</div>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ClockPlay } from '@/components/base/icons/src/vender/line/time'
import { RiPlayLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

/**
 * NoData 组件的属性定义
 */
interface Props {
  /** 是否可以单独运行 */
  canSingleRun: boolean
  /** 单独运行的回调函数 */
  onSingleRun: () => void
}

const props = defineProps<Props>()
const { t } = useI18n()
</script>

