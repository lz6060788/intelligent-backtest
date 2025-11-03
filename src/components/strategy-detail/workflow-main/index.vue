<template>
  <div class="w-full h-full">
    <workflow id="main" :nodes="nodes" :edges="edges" :viewport="{ zoom: 1, x: 0, y: 0 }"></workflow>
  </div>
</template>

<script setup lang="ts">
import workflow from '@/components/workflow/index.vue';
import { BlockEnum, type Node, type Edge } from '@/types';

const nodes: Node[] = [
  { id: '1', position: { x: 200, y: 200 }, type: 'custom', data: { type: BlockEnum.Start, desc: '', title: '开始' } },
]
const edges: Edge[] = [
]


</script>

<style scoped>
</style>
