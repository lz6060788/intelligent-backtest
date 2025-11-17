<template>
  <div
    :class="computedClasses"
    @click="handleSelect"
  >
    <el-tooltip
      v-if="tooltip"
      :content="tooltip"
      placement="top"
      effect="light"
      popper-style="width: 240px;"
    >
      <template #default>
        <span>{{ title }}</span>
      </template>
    </el-tooltip>
    <span v-else>{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import cn from '@/utils/classnames'
import { ElTooltip } from 'element-plus'
import 'element-plus/es/components/tooltip/style/css' // 确保引入样式

// 定义变体样式
const variants = cva([], {
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    align: 'center',
  },
})

// 定义组件属性
interface Props {
  className?: string
  title: string
  onSelect: () => void
  selected: boolean
  disabled?: boolean
  align?: 'left' | 'center' | 'right'
  tooltip?: string
}

const props = defineProps<Props>()

// 计算组合类名
const computedClasses = computed(() => {
  return cn(
    'system-sm-regular flex h-8 cursor-default items-center rounded-md border border-gray-5 px-2 border border-solid text-text-secondary bg-gray-7',
    (!props.selected && !props.disabled) && 'cursor-pointer hover:border-gray-4 hover:shadow-xs',
    props.selected && 'system-sm-medium border-[1.5px] border-blue-5 shadow-xs',
    props.disabled && 'text-text-disabled',
    variants({ align: props.align }),
    props.className
  )
})

// 选择处理函数
const handleSelect = () => {
  if (props.selected || props.disabled) return
  props.onSelect()
}
</script>