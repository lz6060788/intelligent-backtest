<template>
  <el-dialog
    :model-value="true"
    :title="t('workflow.common.input')"
    width="600px"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <!-- 表单内容区域 -->
    <div class="px-4 pb-2 pt-3">
      <div
        v-for="(variable, index) in startVariables"
        :key="variable.variable"
        class="mb-2 last-of-type:mb-0"
      >
        <FormItem
          :auto-focus="index === 0"
          class="!block"
          :payload="variable"
          :value="initInputs[variable.variable]"
          @change="(v) => handleValueChange(variable.variable, v)"
        />
      </div>
    </div>

    <!-- 底部按钮区域 -->
    <template #footer>
      <div class="flex items-center justify-between px-4 py-2 w-full">
        <el-button
          type="primary"
          :disabled="(workflowRunningData?.result?.status === WorkflowRunningStatus.Running)"
          class="w-full"
          @click="doRun"
        >
          {{ t('workflow.singleRun.startRun') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElDialog, ElButton, ElNotification } from 'element-plus'
import FormItem from '../../nodes/_base/before-run-form/form-item.vue'
import {
  BlockEnum,
  WorkflowRunningStatus,
} from '@/types'
import { useWorkflowInstance, useWorkflowRun } from '../../hooks'
import type { StartNodeType } from '../../nodes/start/types'
import { useCheckInputsForms } from '@/components/workflow/hooks'
import { getProcessedInputs } from '../../utils/input-format'
import { useVueFlow } from '@vue-flow/core'
import { transformGraphEdgesToEdges, transformGraphNodesToNodes } from '../../utils'

const { instanceId,  instance: workflowStore } = useWorkflowInstance()
const store = useVueFlow(instanceId)
const workflowRunningData = computed(() => workflowStore.workflowRunningData.value)

const emit = defineEmits<{
  (e: 'run'): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const { nodes } = store
const startNode = computed(() => {
  return nodes.value.find(node => node.data.type === BlockEnum.Start)
})

const startVariables = computed(() => {
  return (startNode.value?.data as StartNodeType).variables
})

const { checkInputsForm } = useCheckInputsForms()

const initInputs = reactive<Record<string, unknown>>({})
if (startVariables.value) {
  startVariables.value.forEach((variable) => {
    if (variable.default && initInputs[variable.variable] === undefined) {
      initInputs[variable.variable] = variable.default
    }
  })
}

const handleValueChange = (variable: string, v: any) => {
  initInputs[variable] = v
}

const { handleRun } = useWorkflowRun()

const doRun = async () => {
  if (!checkInputsForm(initInputs, startVariables.value as any)) {
    return
  }
  emit('run')
  try {
    await handleRun({
      id: instanceId,
      inputs: getProcessedInputs(initInputs, startVariables.value as any),
      graph: {
        nodes: transformGraphNodesToNodes(store.nodes.value),
        edges: transformGraphEdgesToEdges(store.edges.value),
        viewport: store.viewport.value
      }
    })
  } catch (error) {
    ElNotification({
      title: 'Error',
      message: (error as Error).message,
      type: 'error'
    })
  }
}
</script>

<style scoped>
</style>