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

provide('workflowInstanceId', props.id);

const emit = defineEmits<{
  'edit-calculator-detail': [id: string, title: string, graph: WorkflowGraph]
}>()
</script>

