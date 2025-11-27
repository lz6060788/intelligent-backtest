<template>
  <div class="w-full h-full flex">
    <div
      id="workflow-container"
      class="h-full min-w-[800px] relative flex-1"
      ref="workflowContainerRef"
    >
      <VueFlow
        :id="props.id"
        :nodes="props.nodes"
        :edges="props.edges"
        @node-click="handleNodeClick"
        @node-drag-start="handleNodeDragStart"
        @node-drag="handleNodeDrag"
        @node-drag-stop="handleNodeDragStop"
        @node-mouse-enter="handleNodeMouseEnter"
        @node-mouse-leave="handleNodeMouseLeave"
        @node-context-menu="handleNodeContextMenu"
        @connect-start="handleNodeConnectStart"
        @connect="handleNodeConnect"
        @connect-end="handleNodeConnectEnd"
        @edge-mouse-enter="handleEdgeMouseEnter"
        @edge-mouse-leave="handleEdgeMouseLeave"
        @edges-change="handleEdgeChange"
        @selection-start="handleSelectionStart"
        @selectionEnd="selectionEnd"
        @selection-drag="handleSelectionDrag"
        @selection-context-menu="handleSelectionContextMenu"
        @pane-context-menu="() => null"
        :default-viewport="props.viewport"
        :multiSelectionKeyCode="null"
        :deleteKeyCode="null"
        :nodesDraggable="!nodesReadOnly"
        :nodesConnectable="!nodesReadOnly"
        :nodesFocusable="!nodesReadOnly"
        :edgesFocusable="!nodesReadOnly"
        :panOnScroll="false"
        :connect-on-click="false"
        :zoomOnPinch="true"
        :zoomOnScroll="true"
        :zoomOnDoubleClick="true"
        :pan-on-drag="controlMode === ControlMode.Hand"
        :selectNodesOnDrag="controlMode === ControlMode.Pointer && !workflowReadOnly"
        :selection-mode="SelectionMode.Partial"
        :selection-key-code="controlMode === ControlMode.Hand ? null : true"
        :min-zoom="0.25"
        class="w-full h-full"
      >
        <template #node-custom="customNodeProps">
          <customNode v-bind="customNodeProps" />
        </template>
        <template #node-custom-loop-start="customLoopStartNodeProps">
          <customLoopStartNode v-bind="customLoopStartNodeProps" />
        </template>
        <template #node-custom-simple="customSimpleNodeProps">
          <customSimpleNode v-bind="customSimpleNodeProps" />
        </template>
        <template #edge-custom="customEdgeProps">
          <customEdge v-bind="customEdgeProps"></customEdge>
        </template>
        <Background :size="1" pattern-color="#fff" :gap="8"></Background>
        <Operator />

        <div
          className='pointer-events-none absolute left-0 top-0 z-10 flex w-12 items-center justify-center p-1 pl-2'
          :style="{ height: controlHeight }"
        >
          <Controller />
        </div>
        <el-button class="absolute right-2 top-1 z-[9999]" @click="debugPrint" type="primary">print</el-button>
        <!-- <VueFlowControls /> -->
      </VueFlow>
      <Panel />
    </div>
    <Aime></Aime>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, toRefs, watch } from 'vue'
import { useVueFlow, VueFlow, SelectionMode } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
// import { Controls as VueFlowControls } from '@vue-flow/controls'
import Operator from './operator/index.vue'
import '@vue-flow/controls/dist/style.css'
import customNode from './nodes/index.vue';
import customEdge from './edge/index.vue';
import customLoopStartNode from './nodes/loop-start/index.vue'
import customSimpleNode from './simple-node/index.vue'
import Panel from './panel/index.vue'
import { useNodesInteractions, useEdgeInteractions, useSelectionInteractions, useWorkflowReadOnly,  useNodesReadOnly } from './hooks/index'
import type { WorkflowProps } from '@/types/workflow'
import Controller from './operator/controller.vue'
import hotkeys from 'hotkeys-js';
import { useWorkflowInstance } from './hooks/use-workflow-instance'
import { BlockEnum, ControlMode } from '@/types';
import Aime from './aime/index.vue'

const workflowContainerRef = ref<HTMLDivElement>();

const { instanceId,  instance: workflowStore } = useWorkflowInstance()
const store = useVueFlow(instanceId)

const props = withDefaults(defineProps<WorkflowProps>(), {
  nodes: () => [],
  edges: () => [],
  viewport: () => ({
    x: 0,
    y: 0,
    zoom: 0.25
  })
});

const {
  handleNodeClick,
  handleNodeDragStart,
  handleNodeDrag,
  handleNodeDragStop,
  handleNodeMouseEnter,
  handleNodeMouseLeave,
  handleNodeContextMenu,
  handleNodeConnectStart,
  handleNodeConnect,
  handleNodeConnectEnd,
  handleNodesCopy,
  handleNodesPaste,
  handleNodesDelete,
  handleIsolatedNodeAdd
} = useNodesInteractions();

const {
  handleEdgeMouseEnter,
  handleEdgeMouseLeave,
  handleEdgeChange,
  handleEdgeDelete
} = useEdgeInteractions();

const {
  handleSelectionStart,
  selectionEnd,
  handleSelectionDrag,
  handleSelectionContextMenu
} = useSelectionInteractions();


hotkeys('ctrl+c', function(event, handler){
  event.preventDefault()
  handleNodesCopy();
});

hotkeys('ctrl+v', function(event, handler){
  event.preventDefault()
  handleNodesPaste();
});

hotkeys('delete,backspace', function(event, handler){
  event.preventDefault()
  handleNodesDelete()
  handleEdgeDelete()
});

const controlMode = computed(() => workflowStore.controlMode.value)

const workflowCanvasHeight = computed(() => workflowStore.workflowCanvasHeight.value)
const bottomPanelHeight = computed(() => workflowStore.bottomPanelHeight.value)

const controlHeight = computed(() => {
  if (!workflowCanvasHeight.value)
    return '100%'
  return (workflowCanvasHeight.value as number) - (bottomPanelHeight.value as number)
})

const { workflowReadOnly } = useWorkflowReadOnly()
const { nodesReadOnly } = useNodesReadOnly()



onMounted(() => {
  workflowContainerRef.value?.addEventListener('mousemove', (e) => {
    const containerClientRect = workflowContainerRef.value?.getBoundingClientRect()

    if (containerClientRect) {
      workflowStore.setMousePosition({
        pageX: e.clientX,
        pageY: e.clientY,
        elementX: e.clientX - containerClientRect.left,
        elementY: e.clientY - containerClientRect.top,
      })
    }
  })

  // TODO 临时代码
  setTimeout(() => {
    handleIsolatedNodeAdd(BlockEnum.Start, { x: 200, y: 800 })
    setTimeout(() => {
      handleIsolatedNodeAdd(BlockEnum.End, { x: 2000, y: 800 })
    }, 500)
  }, 500)
})

const debugPrint = () => {
  console.log('nodes', store.nodes.value)
  console.log('edges', store.edges.value)
  console.log('userSelectionRect', store.userSelectionRect.value)
  console.log('workflowStore', workflowStore)
}
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>
