<template>
  <workflowProvider
    v-bind="props"
    @edit-calculator-detail="(id: string, title: string, graph: WorkflowGraph) => emit('edit-calculator-detail', id, title, graph)"
  ></workflowProvider>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { WorkflowProps, WorkflowGraph } from '@/types/workflow'
import workflowProvider from './provider.vue'

const props = withDefaults(defineProps<WorkflowProps>(), {});

// TODO 注入的形式可能导致某些深层hook在调用获取useWorkflowInstance时，通过inject报错，原因是inject不在setup顶层调用，
// 后续可能需要将id通过props的方式传递给各个子组件，目前各hook基本都以支持接收id参数
provide('workflowInstanceId', props.id);

const emit = defineEmits<{
  'edit-calculator-detail': [id: string, title: string, graph: WorkflowGraph]
}>()
</script>

