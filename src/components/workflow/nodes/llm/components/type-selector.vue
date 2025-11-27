<template>
  <el-popover
    v-model:visible="open"
    placement="bottom-start"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
  >
    <template #reference>
      <div
        :class="cn(
          'flex items-center rounded-[5px] p-0.5 pl-1 hover:bg-state-base-hover cursor-pointer',
          open && 'bg-state-base-hover',
          triggerClassName
        )"
        @click="open = !open"
      >
        <span :class="cn('text-xs font-semibold text-text-secondary uppercase', triggerClassName)">
          {{ currentLabel }}
        </span>
      </div>
    </template>
    <div class="w-40 rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg p-1 shadow-lg shadow-shadow-shadow-5">
      <div
        v-for="option in options"
        :key="option.value"
        :class="cn(
          'flex items-center gap-x-1 rounded-lg px-2 py-1 hover:bg-state-base-hover cursor-pointer',
          option.value === value && 'bg-state-base-hover'
        )"
        @click="handleSelect(option)"
      >
        <span :class="cn('text-[13px] font-medium text-text-secondary', itemClassName)">
          {{ option.label }}
        </span>
        <RiCheckLine v-if="option.value === value" class="h-4 w-4 text-text-accent" />
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RiCheckLine } from '@remixicon/vue'
import cn from '@/utils/classnames'

/**
 * 选项项类型定义
 */
interface OptionItem {
  /** 标签 */
  label: string
  /** 值 */
  value: string
}

/**
 * 组件属性定义
 */
interface Props {
  /** 当前选中的值 */
  value: string
  /** 所有选项列表 */
  allOptions: OptionItem[]
  /** 可用的选项列表 */
  options: OptionItem[]
  /** 触发器样式类名 */
  triggerClassName?: string
  /** 选项项样式类名 */
  itemClassName?: string
}

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const props = defineProps<Props>()

const open = ref(false)

/**
 * 当前选中项的标签
 */
const currentLabel = computed(() => {
  const option = props.allOptions.find(item => item.value === props.value)
  return option?.label || props.value
})

/**
 * 处理选项选择
 */
const handleSelect = (option: OptionItem) => {
  emit('change', option.value)
  open.value = false
}
</script>

