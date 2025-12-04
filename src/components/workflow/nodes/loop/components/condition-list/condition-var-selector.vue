<template>
  <el-popover
    v-model:visible="open"
    placement="bottom-start"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    width="320px"
  >
    <template #reference>
      <div class="cursor-pointer">
        <VariableTag
          :value-selector="valueSelector"
          :var-type="varType"
          :available-nodes="availableNodes"
          :is-short="true"
        />
      </div>
    </template>
    <div class="z-[1000] w-[296px] popper-default shadow-lg">
      <VarReferenceVars
        :vars="nodesOutputVars"
        :is-support-file-var="true"
        @change="handleChange"
      />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Node, NodeOutPutVar, ValueSelector, Var, VarType } from '@/types'
import VariableTag from '@/components/workflow/nodes/_base/variable-tag/index.vue'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'

/**
 * 条件变量选择器组件的属性定义
 */
interface ConditionVarSelectorProps {
  /** 值选择器 */
  valueSelector: ValueSelector
  /** 变量类型 */
  varType: VarType
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
}

const open = ref(false)

const emit = defineEmits<{
  (e: 'change', valueSelector: ValueSelector, varItem: Var): void
}>()

const props = defineProps<ConditionVarSelectorProps>()

const handleChange = (valueSelector: ValueSelector, varItem: Var) => {
  emit('change', valueSelector, varItem)
  open.value = false
}
</script>

