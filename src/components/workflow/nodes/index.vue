<template>
  <BaseNode v-bind="props">
    <component
      :is="NodeComponent"
      v-bind="props"
    />
  </BaseNode>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StartNode from './start/index.vue';
import EndNode from './end/index.vue';
import IfElseNode from './if-else/index.vue';
import CodeNode from './code/index.vue';
import HttpNode from './http/index.vue';
import LoopNode from './loop/index.vue';
import LLMNode from './llm/index.vue';
import VariableAssignerNode from './variable-assigner/index.vue';
import { BlockEnum, type NodeProps } from '@/types/node';
import BaseNode from './_base/node/index.vue'

// 定义节点组件映射关系
const NodeComponentMap = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.End]: EndNode,
  [BlockEnum.IfElse]: IfElseNode,
  [BlockEnum.Code]: CodeNode,
  [BlockEnum.HttpRequest]: HttpNode,
  [BlockEnum.Loop]: LoopNode,
  [BlockEnum.LLM]: LLMNode,
  [BlockEnum.VariableAggregator]: VariableAssignerNode,
} as const

// 声明组件接收的 props
const props = defineProps<NodeProps>()

// 根据节点类型计算出对应的组件
const NodeComponent = computed(() => {
  return NodeComponentMap[props.data.type as keyof typeof NodeComponentMap]
})
</script>