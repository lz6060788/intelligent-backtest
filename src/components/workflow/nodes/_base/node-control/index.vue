<template>
  <div
    class="
      absolute -top-7 right-0 hidden h-7 pb-1 group-hover:flex
      [&.data-selected]:!flex
      [&.open]:!flex
    "
    :class="{
      '!flex': data!.selected || open
    }"
  >
    <div
      class="flex h-6 items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg px-0.5 text-text-tertiary shadow-md backdrop-blur-[5px]"
      @click.stop
    >
      <!-- 面板操作组件 -->
      <PanelOperator
        :id="id"
        :data="data"
        trigger-class-name="!w-5 !h-5"
        @edit-calculator-detail="emit('edit-calculator-detail')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Node } from '@/types'
import { canRunBySingle } from '../../../utils'
import PanelOperator from '../panel-operator/index.vue'

// 定义 Props
interface NodeControlProps {
  id: Node['id']
  data: Node['data']
}

const props = defineProps<NodeControlProps>()
const emit = defineEmits<{
  'edit-calculator-detail': []
}>()

// 响应式状态
const open = ref(false)

defineExpose({ canRunBySingle })
</script>

<style scoped>
/* 如需补充样式可在此处添加，原 React 样式通过 class 直接复用 */
</style>