<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ArrowDownRoundFill } from '@/components/base/icons/src/vender/solid/general'
import cn from '@/utils/classnames'

const props = defineProps<{
  disabled?: boolean
  collapsed?: boolean // 外部控制状态
  hideCollapseIcon?: boolean
  defaultCollapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'collapse', value: boolean): void
}>()

const localCollapsed = ref(props.defaultCollapsed ?? true)

const isControlled = computed(() => props.collapsed !== undefined)
const collapsedMerged = computed(() => isControlled.value ? props.collapsed : localCollapsed.value)

watch(() => props.collapsed, (val) => {
  if (val !== undefined) {
    localCollapsed.value = val
  }
})

const handleToggle = () => {
  if (props.disabled) return

  const newState = !collapsedMerged.value

  if (!isControlled.value) {
    localCollapsed.value = newState
  }

  emit('update:collapsed', newState)
  emit('collapse', newState)
}
</script>

<template>
  <div class="group/collapse flex items-center">
    <!-- Trigger 区域 -->
    <div
      class="ml-4 flex grow items-center"
      @click="handleToggle"
    >
      <!-- Trigger 插槽 (对应 React 的 trigger prop) -->
      <slot name="trigger" :collapsed="collapsedMerged">
        <!-- 默认内容为空，等待父组件填充 -->
      </slot>

      <!-- 折叠图标 -->
      <div v-if="!hideCollapseIcon" class="h-4 w-4 shrink-0">
        <ArrowDownRoundFill
          v-if="!disabled"
          :class="cn(
            'h-4 w-4 cursor-pointer text-text-quaternary group-hover/collapse:text-text-secondary transition-transform duration-200',
            collapsedMerged && 'rotate-[270deg]'
          )"
        />
      </div>
    </div>

    <!-- Operations 插槽 (对应 React 的 operations prop) -->
    <div v-if="$slots.operations">
      <slot name="operations" />
    </div>
  </div>

  <!-- 内容区域 -->
  <div v-show="!collapsedMerged">
    <slot />
  </div>
</template>