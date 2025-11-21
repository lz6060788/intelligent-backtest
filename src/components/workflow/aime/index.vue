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

const aimeRef = ref<InstanceType<typeof Aime>>()

const { callExternalCapabilitiesTools, functionCallMap } = useFunctionCall()

const handleCallExternalCapabilities = (data: { functionCallAction: FunctionCallAction[] }) => {
  for (const action of data.functionCallAction) {
    try {
      const result = functionCallMap[action.function.tool_id as keyof typeof functionCallMap](action.function.arguments as any)
      aimeRef.value?.respFunctionCall(action.function.tool_id, true, {
        data: JSON.stringify(result)
      })
    } catch (error) {
      aimeRef.value?.respFunctionCall(action.function.tool_id, false, (error as Error).message)
    }
  }
}
</script>

<style scoped>
</style>