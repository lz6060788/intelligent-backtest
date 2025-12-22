<template>
  <workflowProvider
    v-bind="props"
    @edit-operator-detail="(id: string, title: string, data: any) => emit('edit-operator-detail', id, title, data)"
    @nodes-change="(nodes: GraphNode[]) => emit('nodes-change', nodes)"
  ></workflowProvider>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { WorkflowProps } from '@/types/workflow'
import workflowProvider from './provider.vue'
import type { GraphNode } from '@/types'

const props = withDefaults(defineProps<WorkflowProps>(), {});

// TODO 注入的形式可能在使用时造成inject报错，原因是inject不在setup内调用，避免这个问题需要在vue或者hook内顶部引入各类hook，避免在函数（异步）内引入
// 后续可能需要将id通过props的方式传递给各个子组件，目前各hook基本都以支持接收id参数
provide('workflowInstanceId', props.id);

const emit = defineEmits<{
  'edit-operator-detail': [id: string, title: string, data: any]
  'nodes-change': [nodes: GraphNode[]]
}>()
</script>

