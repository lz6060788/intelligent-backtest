<template>
  <div class="h-10 w-full flex items-center justify-center">
    <el-button type="primary" @click="debugPrint">Print Workflow Draft</el-button>
    <el-button type="primary" @click="runWorkflow">{{ t('workflow.singleRun.startRun') }}</el-button>
  </div>
  <inputsModal v-if="showInputsPanel" @close="setShowInputsPanel(false)"></inputsModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { useWorkflowStartRun } from '../hooks/use-workflow-start-run'
import { transformGraphNodesToNodes, transformGraphEdgesToEdges } from '@/components/workflow/utils'
import { useWorkflowInstance } from '../hooks/use-workflow-instance'
import { useVueFlow } from '@vue-flow/core'
import inputsModal from '../modal/inputs/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { instanceId,  instance: workflowStore } = useWorkflowInstance()
const showInputsPanel = computed(() => workflowStore.showInputsPanel.value)
const { setShowInputsPanel } = workflowStore

const store = useVueFlow(instanceId)

const debugPrint = () => {
  console.log('nodes', store.nodes.value)
  console.log('edges', store.edges.value)
  console.log('userSelectionRect', store.userSelectionRect.value)
  console.log('workflowStore', workflowStore)
}

const { handleWorkflowStartRun } = useWorkflowStartRun()
const runWorkflow = async () => {
  try {
    await handleWorkflowStartRun({
      id: instanceId,
      inputs: {},
      graph: {
        nodes: transformGraphNodesToNodes(store.nodes.value),
        edges: transformGraphEdgesToEdges(store.edges.value),
        viewport: store.viewport.value
      }
    })
  } catch (error) {
    ElNotification({
      title: '运行失败',
      message: (error as Error).message,
      type: 'error'
    })
  }
}
</script>

<style scoped>
</style>