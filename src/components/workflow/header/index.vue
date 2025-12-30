<template>
  <div class="h-10 w-full flex items-center justify-center">
    <el-button type="primary" @click="exportToJson">导出为 JSON</el-button>
    <el-button type="primary" @click="importFromJson">从 JSON 导入</el-button>
    <el-button type="primary" @click="saveToLocal">保存到本地</el-button>
    <el-button type="primary" @click="loadFromLocal">从本地加载</el-button>
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
import { type GraphNode, type GraphEdge, type ViewportTransform, useVueFlow } from '@vue-flow/core'
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

const saveToLocal = () => {
  try {
  const isCalculator = workflowStore.workflowIsCalculator.value
  const workflowDraft = {
    nodes: transformGraphNodesToNodes(store.nodes.value),
    edges: transformGraphEdgesToEdges(store.edges.value),
    viewport: store.viewport.value
  }
  const hisWorkflowDraft = localStorage.getItem('workflowDraft')
  const newHisWorkflowDraft = {
    ...JSON.parse(hisWorkflowDraft || '{}'),
    [isCalculator ? 'calculator' : 'main']: workflowDraft
  }
    localStorage.setItem('workflowDraft', JSON.stringify(newHisWorkflowDraft))
    ElNotification({
      title: '保存成功',
      message: '保存到本地成功',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: '保存失败',
      message: '保存到本地失败',
      type: 'error'
    })
  }
}

const loadFromLocal = () => {
  try {
    const isCalculator = workflowStore.workflowIsCalculator.value
    const hisWorkflowDraft = localStorage.getItem('workflowDraft')
    if (hisWorkflowDraft) {
      const workflowDraftObj = JSON.parse(hisWorkflowDraft)
      const workflowDraft = workflowDraftObj[isCalculator ? 'calculator' : 'main']
      if (!workflowDraft) {
        ElNotification({
          title: '加载失败',
          message: '没有找到对应的流程草稿',
          type: 'error'
        })
        return
      }
      const { nodes, edges, viewport } = workflowDraft
      const {setNodes, setEdges, setViewport} = store
      setNodes(nodes)
      setEdges(edges)
      setViewport(viewport)
    }
    ElNotification({
      title: '加载成功',
      message: '加载本地成功',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: '加载失败',
      message: '加载本地失败',
      type: 'error'
    })
  }
}

const exportToJson = () => {
  try {
    const workflowDraft = {
      nodes: transformGraphNodesToNodes(store.nodes.value),
      edges: transformGraphEdgesToEdges(store.edges.value),
      viewport: store.viewport.value
    }
    const json = JSON.stringify(workflowDraft)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(url)
    ElNotification({
      title: '导出成功',
      message: '导出成功',
      type: 'success'
    })
  } catch (error) {
    ElNotification({
      title: '导出失败',
      message: '导出失败',
      type: 'error'
    })
  }
}

const importFromJson = () => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.click()
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = (e) => {
        try {
        const json = JSON.parse(e.target?.result as string) as { nodes: any[], edges: any[], viewport: any }
        const { nodes, edges, viewport } = json
        const { setNodes, setEdges, setViewport } = store
        if (!nodes || !edges || !viewport) {
          throw new Error('导入的流程草稿不合法')
        }
        if (!Array.isArray(nodes) || !Array.isArray(edges) || !viewport) {
          throw new Error('导入的流程草稿不合法')
        }
          setNodes(nodes as GraphNode<any, any, string>[])
          setEdges(edges as GraphEdge<any, any, string>[])
          setViewport(viewport as ViewportTransform)
        } catch (error) {
          ElNotification({
            title: '导入失败',
            message: '导入失败',
            type: 'error'
          })
        }
      }
      ElNotification({
        title: '导入成功',
        message: '导入成功',
        type: 'success'
      })
    }
  } catch (error) {
    ElNotification({
      title: '导入失败',
      message: '导入失败',
      type: 'error'
    })
  }
}
</script>

<style scoped>
</style>