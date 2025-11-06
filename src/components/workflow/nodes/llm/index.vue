<template>
  <div v-if="hasSetModel" class="mb-1 py-1 relative">
    <ModelSelector
      :default-model="{ provider, model: modelId }"
      :model-list="modelList"
      trigger-class-name="!rounded-md"
      :readonly="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LLMNodeType } from './types'
import {
  useModelStore
} from '@/store/useModelStore'
import ModelSelector from '@/components/base/modal-provider/model-selector/index.vue'
import type { NodeProps } from '@/types'
import { storeToRefs } from 'pinia'

// 定义组件接收的props
const props = defineProps<{
  data: NodeProps<LLMNodeType>['data']
}>()

// 解构获取模型相关数据
const { provider, name: modelId } = props.data.model || {}

// 调用自定义hook
const modelStore = useModelStore()
const { textGenerationModelList: modelList } = storeToRefs(modelStore)

// 计算是否已设置模型
const hasSetModel = computed(() => !!provider && !!modelId)
</script>