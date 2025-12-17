<template>
  <BaseNode v-bind="props"
    @edit-operator-detail="emit('edit-operator-detail', props.id, props.data.title, props.data)"
  >
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
import OperatorNode from './operator/index.vue';
import OperatorStartNode from './operator-start/index.vue';
import OperatorEndNode from './operator-end/index.vue';
import OperatorOverviewNode from './operator-overview/index.vue';
import BacktestNode from './backtest/index.vue';
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
  [BlockEnum.Operator]: OperatorNode,
  [BlockEnum.OperatorStart]: OperatorStartNode,
  [BlockEnum.OperatorEnd]: OperatorEndNode,
  [BlockEnum.OperatorOverview]: OperatorOverviewNode,
  [BlockEnum.Backtest]: BacktestNode
} as const

// 声明组件接收的 props
const props = defineProps<NodeProps>()

// 根据节点类型计算出对应的组件
const NodeComponent = computed(() => {
  return NodeComponentMap[props.data.type as keyof typeof NodeComponentMap]
})

const emit = defineEmits<{
  'edit-operator-detail': [id: string, title: string, data: any]
}>()
</script>