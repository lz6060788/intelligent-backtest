<template>
  <el-popover
    v-model:visible="isOpen"
    placement="bottom-start"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
  >
    <template #reference>
      <div class="w-full cursor-pointer">
        <VariableTag
          :value-selector="props.valueSelector"
          :var-type="props.varType"
          :available-nodes="props.availableNodes"
          :is-short="true"
        />
      </div>
    </template>
    <div class="z-[1000] popper-custom w-60 p-1">
      <VarReferenceVars
        :vars="props.nodesOutputVars"
        :is-support-file-var="true"
        @change="(valueSelector: ValueSelector, varItem: Var) => emit('change', valueSelector, varItem)"
      />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import VariableTag from '@/components/workflow/nodes/_base/variable-tag/index.vue'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type { Node, NodeOutPutVar, ValueSelector, Var, VarType } from '@/types'
import { computed } from 'vue'

/**
 * 条件变量选择器组件的属性定义
 */
interface ConditionVarSelectorProps {
  /** 是否打开 */
  open: boolean
  /** 值选择器 */
  valueSelector: ValueSelector
  /** 变量类型 */
  varType: VarType
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
}

const emit = defineEmits<{
  (e: 'change', valueSelector: ValueSelector, varItem: Var): void
  (e: 'update:open', open: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const props = defineProps<ConditionVarSelectorProps>()
</script>

