<template>
  <PortalToFollowElem
    :open="props.open"
    @update:open="props.onOpenChange"
    placement="bottom-start"
    :offset="{
      mainAxis: 4,
      crossAxis: 0,
    }"
  >
    <PortalToFollowElemTrigger as-child @click="props.onOpenChange(!props.open)">
      <div class="w-full cursor-pointer">
        <VariableTag
          :value-selector="props.valueSelector"
          :var-type="props.varType"
          :available-nodes="props.availableNodes"
          :is-short="true"
        />
      </div>
    </PortalToFollowElemTrigger>
    <PortalToFollowElemContent class="z-[1000]">
      <div class="w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg">
        <VarReferenceVars
          :vars="props.nodesOutputVars"
          :is-support-file-var="true"
          @change="props.onChange"
        />
      </div>
    </PortalToFollowElemContent>
  </PortalToFollowElem>
</template>

<script setup lang="ts">
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/components/base/portal-to-follow-elem'
import VariableTag from '@/components/workflow/nodes/_base/variable/variable-tag'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars'
import type { Node, NodeOutPutVar, ValueSelector, Var, VarType } from '@/types'

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
</script>

