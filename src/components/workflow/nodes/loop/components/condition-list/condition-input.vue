<template>
  <PromptEditor
    :key="controlPromptEditorRerenderKey"
    compact
    :value="value"
    :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
    :workflow-variable-block="workflowVariableBlock"
    @change="onChange"
    :editable="!disabled"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkflowStore } from '@/components/workflow/store'
import PromptEditor from '@/components/base/prompt-editor'
import { BlockEnum } from '@/types'
import type {
  Node,
} from '@/types/node'

/**
 * 条件输入组件的属性定义
 */
interface ConditionInputProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 值 */
  value: string
  /** 变化回调 */
  onChange: (value: string) => void
  /** 可用节点列表 */
  availableNodes: Node[]
}

const props = defineProps<ConditionInputProps>()

const { t } = useI18n()
const workflowStore = useWorkflowStore()

const controlPromptEditorRerenderKey = computed(() => workflowStore.controlPromptEditorRerenderKey)
const pipelineId = computed(() => workflowStore.pipelineId)

const workflowVariableBlock = computed(() => ({
  show: true,
  variables: [],
  workflowNodesMap: props.availableNodes.reduce((acc, node) => {
    acc[node.id] = {
      title: node.data!.title,
      type: node.data!.type,
    }
    if (node.data!.type === BlockEnum.Start) {
      acc.sys = {
        title: t('workflow.blocks.start'),
        type: BlockEnum.Start,
      }
    }
    return acc
  }, {} as any),
  showManageInputField: !!pipelineId.value,
  onManageInputField: () => workflowStore.setShowInputFieldPanel?.(true),
}))
</script>

