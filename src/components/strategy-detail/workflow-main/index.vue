<template>
  <div class="w-full h-full">
    <workflowApp :app-id="appId"></workflowApp>
  </div>
</template>

<script setup lang="ts">
import workflowApp from '@/components/workflow-app/components/index.vue';
import { ref } from 'vue';

const appId = ref('test');
</script>

<style scoped>
</style>
