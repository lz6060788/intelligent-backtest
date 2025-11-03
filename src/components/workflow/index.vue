<template>
  <div
    id="workflow-container"
    class="w-full h-full min-w-[960px] relative"
    ref="workflowContainerRef"
  >
    <VueFlow
      :nodes="props.nodes"
      :edges="props.edges"
      @node-click="handleNodeClick"
      @node-drag-start="handleNodeDragStart"
      @node-drag="handleNodeDrag"
      @node-dragstop="handleNodeDragStop"
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
      @selection-drag="handleSelectionDrag"
      @selection-context-menu="handleSelectionContextMenu"
      @pane-context-menu="() => null"
      :default-viewport="props.viewport"
      :connect-on-click="false"
      class="w-full h-full"
    >
      <template #node-custom="customNodeProps">
        <customNode v-bind="customNodeProps" />
      </template>
      <template #edge-custom="customEdgeProps">
        <customEdge v-bind="customEdgeProps"></customEdge>
      </template>
      <Background :size="1" pattern-color="#fff" :gap="8"></Background>
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import customNode from './nodes/index.vue';
import customEdge from './edge/index.vue';
import { BlockEnum, type Node } from '@/types/node'
import { useNodesInteractions, useEdgeInteractions, useSelectionInteractions } from './hooks/index'
import type { WorkflowProps } from '@/types/workflow'
import type { Edge } from '@/types/edge'
import hotkeys from 'hotkeys-js';
import { useWorkflowStore } from './store'

const workflowContainerRef = ref<HTMLDivElement>();


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
  handleNodesPaste
} = useNodesInteractions();

const {
  handleEdgeMouseEnter,
  handleEdgeMouseLeave,
  handleEdgeChange
} = useEdgeInteractions();

const {
  handleSelectionStart,
  handleSelectionDrag,
  handleSelectionContextMenu
} = useSelectionInteractions();



hotkeys('ctrl+c', function(event, handler){
  // Prevent the default refresh event under WINDOWS system
  event.preventDefault()
  handleNodesCopy();
});

hotkeys('ctrl+v', function(event, handler){
  // Prevent the default refresh event under WINDOWS system
  event.preventDefault()
  handleNodesPaste();
});

const workflowStore = useWorkflowStore();
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
})
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
</style>
