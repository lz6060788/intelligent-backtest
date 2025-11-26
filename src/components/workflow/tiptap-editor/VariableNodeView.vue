<template>
  <node-view-wrapper class="variable-node" as="span">
    <VariableTag :value-selector="node.attrs?.label?.split('.') ?? []" :var-type="VarType.string" :available-nodes="availableNodes" :is-short="true" />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import VariableTag from '@/components/workflow/nodes/_base/variable-tag/index.vue'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import { VarType } from '@/types'
import { inject } from 'vue';

const props = defineProps<NodeViewProps>()

const availableNodes = inject('availableNodes', [])

</script>

<style scoped>
.variable-node {
  display: inline-flex;
  align-items: center;
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