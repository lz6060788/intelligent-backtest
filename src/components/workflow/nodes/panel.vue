<template>
  <BasePanel v-bind="props">
    <NodeComponent v-bind="props" :key="props.id" />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StartPanel from './start/panel.vue';
import CodePanel from './code/panel.vue';
// import EndNode from './end/index.vue';
import IfElsePanel from './if-else/panel.vue';
import HttpPanel from './http/panel.vue';
import LoopPanel from './loop/panel.vue';
import LLMPanel from './llm/panel.vue';
import VariableAssignerPanel from './variable-assigner/panel.vue';
import CalculatorPanel from './calculator/panel.vue';
import { BlockEnum, type NodeProps } from '@/types/node';
import BasePanel from './_base/workflow-panel/index.vue'

// 定义节点组件映射关系
const NodeComponentMap = {
  [BlockEnum.Start]: StartPanel,
  [BlockEnum.End]: StartPanel,
  [BlockEnum.IfElse]: IfElsePanel,
  [BlockEnum.Code]: CodePanel,
  [BlockEnum.HttpRequest]: HttpPanel,
  [BlockEnum.Loop]: LoopPanel,
  [BlockEnum.LLM]: LLMPanel,
  [BlockEnum.VariableAggregator]: VariableAssignerPanel,
  [BlockEnum.Calculator]: CalculatorPanel,
} as const

// 声明组件接收的 props
const props = defineProps<NodeProps>()

// 根据节点类型计算出对应的组件
const NodeComponent = computed(() => {
  return NodeComponentMap[props.data.type as keyof typeof NodeComponentMap]
})
</script>