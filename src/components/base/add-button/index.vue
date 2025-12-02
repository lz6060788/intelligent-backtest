<template>
  <div :class="[className, 'cursor-pointer select-none rounded-md p-1 text-gray-4 hover:text-white hover:bg-gray-600 flex items-center justify-center']" @click="onClick">
    <el-icon><Plus /></el-icon>
    <div v-if="text" class="ml-1 text-sm">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Plus } from '@element-plus/icons-vue'

type Props = {
  className?: string
  text?: string
}

const emit = defineEmits<{
  (e: 'click'): void
}>()

const onClick = () => {
  emit('click')
}

defineProps<Props>()
</script>

<style scoped lang="css">
</style>