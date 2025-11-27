<template>
  <BasePanel v-bind="props">
    <NodeComponent v-bind="props" />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StartPanel from './start/panel.vue';
import CodePanel from './code/panel.vue';
// import EndNode from './end/index.vue';
import IfElseNode from './if-else/panel.vue';
// import CodeNode from './code/index.vue';
import HttpNode from './http/panel.vue';
// import LoopNode from './loop/index.vue';
import LLMPanel from './llm/panel.vue';
import VariableAssignerNode from './variable-assigner/index.vue';
import { BlockEnum, type NodeProps } from '@/types/node';
import BasePanel from './_base/workflow-panel/index.vue'

// 定义节点组件映射关系
const NodeComponentMap = {
  [BlockEnum.Start]: StartPanel,
  [BlockEnum.End]: StartPanel,
  [BlockEnum.IfElse]: IfElseNode,
  [BlockEnum.Code]: CodePanel,
  [BlockEnum.HttpRequest]: HttpNode,
  [BlockEnum.Loop]: StartPanel,
  [BlockEnum.LLM]: LLMPanel,
  [BlockEnum.VariableAggregator]: VariableAssignerNode,
} as const

// 声明组件接收的 props
const props = defineProps<NodeProps>()

// 根据节点类型计算出对应的组件
const NodeComponent = computed(() => {
  return NodeComponentMap[props.data.type as keyof typeof NodeComponentMap]
})
</script>