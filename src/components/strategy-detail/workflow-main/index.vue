<template>
  <div class="w-full h-full">
    <workflow id="main" :nodes="nodes" :edges="edges" :viewport="{ zoom: 1, x: 0, y: 0 }"></workflow>
  </div>
</template>

<script setup lang="ts">
import workflow from '@/components/workflow/index.vue';
import { BlockEnum, type Node, type Edge } from '@/types';
import ifElseDefault from '@/components/workflow/nodes/if-else/default'

const nodes: Node[] = [
  { id: '1', position: { x: 200, y: 200 }, type: 'custom', data: { type: BlockEnum.Start, desc: '', title: '开始' } },
  { id: '2', position: { x: 600, y: 200 }, type: 'custom', data: { type: BlockEnum.End, desc: '', title: '结束' } },
  { id: '3', position: { x: 400, y: 200 }, type: 'custom', data: { type: BlockEnum.IfElse, desc: '', title: '条件节点', ...ifElseDefault.defaultValue } }
]
const edges: Edge[] = [
  { id: '1to3', source: '1', target: '3', type: 'custom' }
]


</script>

<style scoped>
</style>
