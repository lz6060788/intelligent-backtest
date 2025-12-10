<template>
  <div v-if="hasSetModel" class="mb-1 py-1 relative">
    <!-- <ModelSelector
      :default-model="{ provider, model: modelId }"
      :model-list="modelList"
      trigger-class-name="!rounded-md"
      :readonly="true"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LLMNodeType } from './types'
import type { NodeProps } from '@/types'

// 定义组件接收的props
const props = defineProps<{
  data: NodeProps<LLMNodeType>['data']
}>()

// 解构获取模型相关数据
const { provider, name: modelId } = props.data.model || {}

// 计算是否已设置模型
const hasSetModel = computed(() => !!provider && !!modelId)
</script>