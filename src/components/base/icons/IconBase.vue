<!-- IconBase.vue -->
<template>
    <component
      :is="generatedNode"
      :class="computedClass"
      v-bind="mergedProps"
      @click="handleClick"
    />
  </template>
  
  <script setup lang="ts">
  import { generate } from './utils'
  import type { AbstractNode } from './utils'
  import { computed, mergeProps } from 'vue'
  
  type IconData = {
    name: string
    icon: AbstractNode
  }
  
  interface IconBaseProps {
    data: IconData
    className?: string
    onClick?: (e: MouseEvent) => void
    style?: React.CSSProperties // 保持与原类型兼容，Vue 也支持类似的样式对象
  }
  
  const props = defineProps<IconBaseProps & { ref?: any }>()
  const emit = defineEmits(['click'])
  
  const generatedNode = generate(
    props.data.icon,
    `svg-${props.data.name}`,
    {}
  )
  
  const computedClass = computed(() => [
    `svg-${props.data.name}`,
    props.className
  ])
  
  const mergedProps = mergeProps(
    {
      'data-icon': props.data.name,
      'aria-hidden': 'true',
      style: props.style,
      ref: props.ref
    },
    props
  )
  
  const handleClick = (e: MouseEvent) => {
    if (props.onClick) {
      props.onClick(e)
    }
    emit('click', e)
  }
  </script>