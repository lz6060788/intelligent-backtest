<template>
  <tiptap
    :value="value"
    @change="({ text }) => emit('change', text)"
    :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
    :workflow-variable-block="workflowVariableBlock"
    :editable="!disabled"
    :vars="nodesOutputVars"
    :class-name="cn('text-xs')"
    :available-nodes="availableNodes"
  >
  </tiptap>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkflowStore } from '@/components/workflow/store'
import { useWorkflowInstance } from '@/components/workflow/hooks'
import { BlockEnum } from '@/types'
import type {
  Node,
  NodeOutPutVar,
} from '@/types'
import tiptap from '@/components/workflow/tiptap-editor/tiptap.vue'
import cn from '@/utils/classnames'

/**
 * 条件输入组件的属性定义
 */
interface ConditionInputProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 值 */
  value: string
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
  /** 可用节点列表 */
  availableNodes: Node[]
}

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const props = defineProps<ConditionInputProps>()

const { t } = useI18n()
const workflowStore = useWorkflowStore()
const { instance: workflowInstance } = useWorkflowInstance()

// const controlPromptEditorRerenderKey = computed(() => workflowInstance.controlPromptEditorRerenderKey)

const workflowVariableBlock = computed(() => ({
  show: true,
  variables: props.nodesOutputVars || [],
  workflowNodesMap: props.availableNodes.reduce((acc, node) => {
    acc[node.id] = {
      title: node.data!.title,
      type: node.data!.type,
      width: node.width,
      height: node.height,
      position: node.position,
    }
    if (node.data!.type === BlockEnum.Start) {
      acc.sys = {
        title: t('workflow.blocks.start'),
        type: BlockEnum.Start,
      }
    }
    return acc
  }, {} as any),
  showManageInputField: false,
  onManageInputField: () => workflowStore.setShowInputFieldPanel?.(true),
}))
</script>

