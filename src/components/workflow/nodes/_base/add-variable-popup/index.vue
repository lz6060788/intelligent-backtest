<template>
  <div class="w-[240px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg">
    <div class="flex h-[34px] items-center border-b-[0.5px] border-b-divider-regular px-4 text-[13px] font-semibold text-text-secondary">
      {{ t('workflow.nodes.variableAssigner.setAssignVariable') }}
    </div>
    <div class="p-1">
      <VarReferenceVars
        :hideSearch="true"
        :vars="availableVars"
        @change="onSelect"
        :isSupportFileVar="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'

// 定义组件属性类型
interface AddVariablePopupProps {
  availableVars: NodeOutPutVar[]
  onSelect: (value: ValueSelector, item: Var) => void
}

// 声明组件接收的属性
const props = defineProps<AddVariablePopupProps>()

// 引入国际化
const { t } = useI18n()
</script>