<template>
  <div :class="cn('w-4 h-4', className)">
    <!-- VarBlockIcon placeholder - 需要根据实际实现替换 -->
    <i :class="`i-ri-${getIconClass(type)}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import cn from '@/utils/classnames'
import type { BlockEnum } from '@/types/node'

interface VarBlockIconProps {
  type: BlockEnum
  className?: string
}

const props = defineProps<VarBlockIconProps>()

const getIconClass = (type: BlockEnum): string => {
  // 根据节点类型返回对应的图标类名
  const iconMap: Record<string, string> = {
    [BlockEnum.Start]: 'play-circle-line',
    [BlockEnum.End]: 'stop-circle-line',
    [BlockEnum.IfElse]: 'code-line',
    // 添加更多节点类型映射
  }
  return iconMap[type] || 'code-line'
}
</script>

