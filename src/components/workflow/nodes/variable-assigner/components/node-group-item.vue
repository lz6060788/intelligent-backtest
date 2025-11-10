<template>
  <div
    :class="cn(
      'relative rounded-lg border-[1.5px] border-transparent px-1.5 pb-1.5 pt-1',
      showSelectionBorder && '!border-dashed !border-blue-500 bg-blue-300',
      showSelectedBorder && '!border-blue-600 !bg-blue-400',
    )"
    @mouseenter="groupEnabled && handleGroupItemMouseEnter(item.targetHandleId)"
    @mouseleave="handleGroupItemMouseLeave"
  >
    <div class="flex h-4 items-center justify-between text-[10px] font-medium text-text-tertiary">
      <span
        :class="cn(
          'grow truncate uppercase',
          showSelectedBorder && 'text-text-accent',
        )"
        :title="item.title"
      >
        {{ item.title }}
      </span>
      <div class="flex items-center">
        <span class="ml-2 shrink-0">{{ item.type }}</span>
        <div class="ml-2 mr-1 h-2.5 w-[1px] bg-gray-700"></div>
        <AddVariable
          :available-vars="availableVars"
          :variable-assigner-node-id="item.variableAssignerNodeId"
          :variable-assigner-node-data="item.variableAssignerNodeData"
          :handle-id="item.targetHandleId"
        />
      </div>
    </div>
    <template v-if="!item.variables.length">
      <div
        :class="cn(
          'relative flex h-[22px] items-center justify-between space-x-1 rounded-md bg-gray-700 px-1 text-[10px] font-normal uppercase',
          (showSelectedBorder || showSelectionBorder) && '!bg-black/[0.02]',
        )"
      >
        {{ t(`${i18nPrefix}.varNotSet`) }}
      </div>
    </template>
    <template v-if="!!item.variables.length">
      <div class="space-y-0.5">
        <VariableLabelInNode
          v-for="(variable, index) in item.variables"
          :key="index"
          :variables="variable || []"
          :node-type="getNodeForVariable(variable)?.data.type"
          :node-title="getNodeForVariable(variable)?.data.title"
          :is-exception-variable="isExceptionVariable(variable)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import { BlockEnum } from '@/types'
import type {
  Node,
  ValueSelector,
  VarType,
} from '@/types'
import type { VariableAssignerNodeType } from '../types'
import {
  useGetAvailableVars,
  useVariableAssigner,
} from '../hooks'
import { filterVar } from '../utils'
import AddVariable from './add-variable/index.vue'
import { isSystemVar } from '@/components/workflow/nodes/_base/variable/utils'
import cn from '@/utils/classnames'
import { isExceptionVariable as checkIsExceptionVariable } from '@/components/workflow/utils'
import {
  VariableLabelInNode,
} from '@/components/workflow/nodes/_base/variable/variable-label'
import { useVueFlow } from '@vue-flow/core'
import { storeToRefs } from 'pinia'

const i18nPrefix = 'workflow.nodes.variableAssigner'

type GroupItem = {
  groupEnabled: boolean
  targetHandleId: string
  title: string
  type: string
  variables: ValueSelector[]
  variableAssignerNodeId: string
  variableAssignerNodeData: VariableAssignerNodeType
}

interface NodeGroupItemProps {
  item: GroupItem
}

const props = defineProps<NodeGroupItemProps>()

const { t } = useI18n()
const { instance: workflowStore, instanceId } = useWorkflowInstance()
const enteringNodePayload = computed(() => workflowStore.enteringNodePayload.value)
const hoveringAssignVariableGroupId = computed(() => workflowStore.hoveringAssignVariableGroupId.value)
const { nodes } = useVueFlow(instanceId)

const {
  handleGroupItemMouseEnter,
  handleGroupItemMouseLeave,
} = useVariableAssigner()
const getAvailableVars = useGetAvailableVars()

const groupEnabled = computed(() => props.item.groupEnabled)
const outputType = computed(() => {
  if (!groupEnabled.value)
    return props.item.variableAssignerNodeData.output_type

  const group = props.item.variableAssignerNodeData.advanced_settings?.groups.find(group => group.groupId === props.item.targetHandleId)
  return group?.output_type || ''
})

const availableVars = computed(() => getAvailableVars(props.item.variableAssignerNodeId, props.item.targetHandleId, filterVar(outputType.value as VarType), true))

const showSelectionBorder = computed(() => {
  if (groupEnabled.value && enteringNodePayload.value?.nodeId === props.item.variableAssignerNodeId) {
    if (hoveringAssignVariableGroupId.value)
      return hoveringAssignVariableGroupId.value !== props.item.targetHandleId
    else
      return enteringNodePayload.value?.nodeData.advanced_settings?.groups[0].groupId !== props.item.targetHandleId
  }

  return false
})

const showSelectedBorder = computed(() => {
  if (groupEnabled.value && enteringNodePayload.value?.nodeId === props.item.variableAssignerNodeId) {
    if (hoveringAssignVariableGroupId.value)
      return hoveringAssignVariableGroupId.value === props.item.targetHandleId
    else
      return enteringNodePayload.value?.nodeData.advanced_settings?.groups[0].groupId === props.item.targetHandleId
  }

  return false
})

const getNodeForVariable = (variable: ValueSelector) => {
  const isSystem = isSystemVar(variable)
  if (isSystem)
    return nodes.value.find(node => node.data.type === BlockEnum.Start)
  return nodes.value.find(node => node.id === variable[0])
}

const isExceptionVariable = (variable: ValueSelector) => {
  const isSystem = isSystemVar(variable)
  const node = isSystem ? nodes.value.find(node => node.data.type === BlockEnum.Start) : nodes.value.find(node => node.id === variable[0])
  const varName = isSystem ? `sys.${variable[variable.length - 1]}` : variable.slice(1).join('.')
  return checkIsExceptionVariable(varName, node?.data.type)
}
</script>

