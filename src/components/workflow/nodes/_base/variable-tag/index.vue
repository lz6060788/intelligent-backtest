<template>
  <VariableLabelInSelect
    :variables="valueSelector"
    :node-type="node?.data?.type"
    :node-title="node?.data?.title"
    :variable-type="!isShort ? varType : undefined"
    :error-msg="!isValid ? t('workflow.errorMsg.invalidVariable') : undefined"
    :is-exception-variable="isException"
    @click="handleVariableClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVueFlow } from '@vue-flow/core'
import type {
  CommonNodeType,
  Node,
  ValueSelector,
  VarType,
} from '@/types'
import { BlockEnum } from '@/types'
import {
  getNodeInfoById,
  isConversationVar,
  isENV,
  isRagVariableVar,
  isSystemVar
} from '@/components/workflow/nodes/_base/variable/utils'
import { isExceptionVariable } from '@/components/workflow/utils'
import {
  VariableLabelInSelect,
} from '@/components/workflow/nodes/_base/variable/variable-label'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

/**
 * 变量标签组件的属性定义
 */
interface VariableTagProps {
  /** 值选择器 */
  valueSelector: ValueSelector
  /** 变量类型 */
  varType: VarType
  /** 是否简短显示 */
  isShort?: boolean
  /** 可用节点列表 */
  availableNodes?: Node[]
}

const props = withDefaults(defineProps<VariableTagProps>(), {
  isShort: false,
})

const { instanceId } = useWorkflowInstance()
const vueFlowStore = useVueFlow(instanceId)
const { nodes: vueFlowNodes, viewport, setViewport } = vueFlowStore
const { t } = useI18n()

const isRagVar = computed(() => isRagVariableVar(props.valueSelector))

const node = computed(() => {
  if (isSystemVar(props.valueSelector)) {
    const startNode = props.availableNodes?.find(n => n.data!.type === BlockEnum.Start || n.data!.type === BlockEnum.CalculatorStart)
    if (startNode)
      return startNode
  }
  return getNodeInfoById(
    props.availableNodes || vueFlowNodes.value, 
    // isRagVar.value ? props.valueSelector[1] : props.valueSelector[0]
    props.valueSelector[0] ?? ''
  )
})

// 计算是否为环境变量
const isEnv = computed(() => isENV(props.valueSelector))

// 计算是否为对话变量
const isChatVar = computed(() => isConversationVar(props.valueSelector))

// 计算是否有效
const isValid = computed(() => {
  return Boolean(node.value) || isEnv.value || isChatVar.value || isRagVar.value
})

// 计算变量名称
const variableName = computed(() =>
  isSystemVar(props.valueSelector)
    ? props.valueSelector.slice(0).join('.')
    : props.valueSelector.slice(1).join('.')
)

// 计算是否为异常变量
const isException = computed(() => 
  isExceptionVariable(variableName.value, node.value?.data?.type)
)

// 处理变量跳转
const handleVariableJump = () => {
  if (!node.value) return

  const workflowContainer = document.getElementById('workflow-container')
  if (!workflowContainer) return

  const { clientWidth, clientHeight } = workflowContainer
  const zoom = viewport.value.zoom
  const position = node.value.position
  const nodeWidth = node.value.dimensions?.width || node.value.width || 0
  const nodeHeight = node.value.dimensions?.height || node.value.height || 0

  setViewport({
    x: (clientWidth - 400 - nodeWidth * zoom) / 2 - position.x * zoom,
    y: (clientHeight - nodeHeight * zoom) / 2 - position.y * zoom,
    zoom: zoom,
  })
}

// 处理点击事件
const handleVariableClick = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey) {
    e.stopPropagation()
    handleVariableJump()
  }
}
</script>

