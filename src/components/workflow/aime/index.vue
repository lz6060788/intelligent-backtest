<template>
  <div class="w-100 h-full overflow-hidden">
    <Aime ref="aimeRef" :callExternalCapabilitiesTools="callExternalCapabilitiesTools" @callExternalCapabilities="handleCallExternalCapabilities" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import Aime from '@/components/aime/index.vue'
import { useFunctionCall } from '../hooks/index'
import type { FunctionCallAction } from '@/components/aime/type'

const props = defineProps<{
  isOperator: boolean;
  workflowId: string;
}>()

const aimeRef = ref<InstanceType<typeof Aime>>()

const payload = computed(() => ({ isOperator: props.isOperator, workflowId: props.workflowId }))
const { callExternalCapabilitiesTools, functionCallMap, asyncFunctionCalls } = useFunctionCall(payload)

const handleCallExternalCapabilities = async (data: { functionCallAction: FunctionCallAction[] }) => {
  for (const action of data.functionCallAction) {
    try {
      const context = {
        aime: aimeRef.value,
        respFunction: (status: boolean, message: string) => {
          aimeRef.value?.respFunctionCall(action.uuid, status, {
            data: message
          })
        }
      }
      const result = await functionCallMap[action.function.name as keyof typeof functionCallMap](action.function.arguments as any, context)
      if (!asyncFunctionCalls.includes(action.function.name as keyof typeof functionCallMap)) {
        aimeRef.value?.respFunctionCall(action.uuid, true, {
          data: JSON.stringify(result)
        })
      }
    } catch (error) {
      console.log('aime调用外部能力报错：', error)
      aimeRef.value?.respFunctionCall(action.uuid, false, (error as Error).message)
    }
  }
}
</script>

<style scoped>
</style>