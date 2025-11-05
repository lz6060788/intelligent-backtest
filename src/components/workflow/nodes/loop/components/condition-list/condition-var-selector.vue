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
  >
    <template #reference>
      <div class="cursor-pointer" @click="open = !open">
        <VariableTag
          :value-selector="valueSelector"
          :var-type="varType"
          :available-nodes="availableNodes"
          :is-short="true"
        />
      </div>
    </template>
    <div class="z-[1000] w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg">
      <VarReferenceVars
        :vars="nodesOutputVars"
        :is-support-file-var="true"
        @change="onChange"
      />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Node, NodeOutPutVar, ValueSelector, Var, VarType } from '@/types/node'
import VariableTag from '@/components/workflow/nodes/_base/variable/variable-tag'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars'

/**
 * 条件变量选择器组件的属性定义
 */
interface ConditionVarSelectorProps {
  /** 是否打开 */
  open: boolean
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void
  /** 值选择器 */
  valueSelector: ValueSelector
  /** 变量类型 */
  varType: VarType
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
  /** 变化回调 */
  onChange: (valueSelector: ValueSelector, varItem: Var) => void
}

const props = defineProps<ConditionVarSelectorProps>()

const open = computed({
  get: () => props.open,
  set: (value) => props.onOpenChange(value),
})
</script>

