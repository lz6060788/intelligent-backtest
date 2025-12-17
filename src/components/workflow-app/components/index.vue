<template>
  <div class="w-full h-full flex">
    <div class="flex h-full grow flex-col overflow-hidden">
      <div class="relative flex items-end overflow-x-auto pl-1 pt-1 border-0 border-b border-solid border-gray-600">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'relative mr-0.5 flex h-8 max-w-[200px] cursor-pointer items-center rounded-t-md px-3 transition-all text-sm font-medium',
            activeWorkflowId === tab.id
              ? 'cursor-default bg-gray-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          ]"
          @click="changeActiveWorkflowId(tab.id)"
        >
          <span class="flex-1 truncate text-sm font-medium">{{ tab.name }}</span>
          <remove-button
            class="shrink-0 ml-1"
            v-if="tab.id !== MAIN_WORKFLOW_APP_ID && activeWorkflowId === tab.id" @click.stop="removeWorkflow(tab.id)"
            iconClass="!h-4 !w-4"
            size="m"
          ></remove-button>
        </div>
      </div>

      <div class="relative flex-1 overflow-hidden">
        <transition name="fade">
          <workflow
            :key="activeWorkflow!.id"
            :id="activeWorkflow!.id"
            :is-operator="activeWorkflow!.isOperator"
            :nodes="activeWorkflow!.graph.nodes"
            :edges="activeWorkflow!.graph.edges"
            :viewport="activeWorkflow!.graph.viewport || { x: 0, y: 0, zoom: 1 }"
            @edit-operator-detail="openNewWorkflow"
          />
        </transition>
      </div>
    </div>
    <aime v-if="isProd" class="shrink-0" :is-operator="activeWorkflow!.isOperator" :workflow-id="activeWorkflow!.id"></aime>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowAppStore } from '../store'
import { MAIN_WORKFLOW_APP_ID } from '../constant'
import workflow from '@/components/workflow/index.vue'
import type { WorkflowGraph } from '@/types/workflow'
import { storeToRefs } from 'pinia'
import RemoveButton from '@/components/base/remove-button/index.vue'
import aime from '@/components/workflow/aime/index.vue';

interface TabItem {
  /** Tab的唯一标识 */
  id: string
  /** Tab显示的名称 */
  name: string
  /** 是否可关闭 */
  closable: boolean
  /** 流程图数据 */
  graph: WorkflowGraph
}

interface Props {
  appId: string
}

const workflowStore = useWorkflowAppStore()

const { workflowList: tabs, activeWorkflowId, activeWorkflow } = storeToRefs(workflowStore)
const {
  changeActiveWorkflowId,
  removeWorkflow,
  openNewWorkflow,
} = workflowStore

const isProd = import.meta.env.PROD;
</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

/* 可选：防止离开动画时组件占位 */
.fade-leave-active {
  position: absolute;
}
</style>
