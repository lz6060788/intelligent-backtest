<template>
  <node-view-wrapper class="variable-node" as="span">
    <span class="variable-type" :class="node.attrs.varType.toLowerCase()">
      {{ node.attrs.varType }}
    </span>
    <span class="variable-name">
        {{ node.attrs.label }}
    </span>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>

<style scoped>
.variable-node {
  display: inline-flex;
  align-items: center;
  background-color: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 2px 6px;
  margin: 0 2px;
  font-family: monospace;
  line-height: 1.2;
  user-select: none; /* 防止光标点进去 */
  cursor: default;
}

.variable-type {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  margin-right: 4px;
  color: white;
  background-color: #888;
}
.variable-type.string { background-color: #52c41a; }
.variable-type.number, .variable-type.int { background-color: #1890ff; }

.variable-path {
  color: #999;
  font-size: 12px;
  margin-right: 4px;
  white-space: nowrap;
}

.variable-name {
  font-weight: bold;
  color: #333;
}
</style>