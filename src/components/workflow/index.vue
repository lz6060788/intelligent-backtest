<template>
  <workflowProvider v-bind="props"></workflowProvider>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { WorkflowProps } from '@/types/workflow'
import workflowProvider from './provider.vue'


const props = withDefaults(defineProps<WorkflowProps>(), {});

provide('workflowInstanceId', props.id);
</script>

