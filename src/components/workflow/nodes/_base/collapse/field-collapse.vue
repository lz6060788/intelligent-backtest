<script setup lang="ts">
import Collapse from './index.vue' // 引入上面的 Collapse 组件

const props = defineProps<{
  title: string
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'collapse', value: boolean): void
}>()

// 转发事件
const handleCollapse = (val: boolean) => {
  console.log('handleCollapse', val)
  emit('update:collapsed', val)
  emit('collapse', val)
}
</script>

<template>
  <div class="py-4">
    <Collapse
      :collapsed="collapsed"
      @collapse="handleCollapse"
    >
      <!-- 将 title 传入 trigger 插槽 -->
      <template #trigger>
        <div class="text-sm text-bold flex h-6 cursor-pointer items-center text-gray-200">
          {{ title }}
        </div>
      </template>

      <!-- 转发 operations 插槽 -->
      <template v-if="$slots.operations" #operations>
        <slot name="operations" />
      </template>

      <!-- 默认内容插槽，对应 React 的 children -->
      <template #default>
        <div class="px-4">
          <slot />
        </div>
      </template>
    </Collapse>
  </div>
</template>