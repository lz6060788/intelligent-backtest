<template>
  <div :class="[className, 'cursor-pointer select-none rounded-md p-1 hover:bg-gray-600']" @click="onClick">
    <el-icon><Plus /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { Plus } from '@element-plus/icons-vue'

type Props = {
  className?: string
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