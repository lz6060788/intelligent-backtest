<template>
  <div
    :class="cn('system-xs-medium truncate', varColorClassName, className)"
    :title="varName"
  >
    {{ varName }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVarName } from '../hooks'
import cn from '@/utils/classnames'

interface VariableNameProps {
  variables: string[]
  className?: string
  notShowFullPath?: boolean
}

const props = defineProps<VariableNameProps>()

const varName = useVarName(props.variables, props.notShowFullPath)
const varColorClassName = computed(() => '') // 颜色由父组件控制
</script>

