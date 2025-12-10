<template>
  <div
    :class="[
      'flex items-center justify-center border-[0.5px] border-white/2 text-white',
      sizeClass,
      showDefaultIcon ? bgColor : '',
      toolIcon ? '!shadow-none' : '',
      className
    ]"
  >
    <template v-if="showDefaultIcon">
      <component
        :is="getIconComponent"
        :class="iconSizeClass"
      />
    </template>

    <template v-if="isToolOrDataSource && toolIcon">
      <template v-if="typeof toolIcon === 'string'">
        <div
          class="h-full w-full shrink-0 rounded-md bg-cover bg-center"
          :style="{ backgroundImage: `url(${toolIcon})` }"
        />
      </template>
      <template v-else>
        <div class="!h-full !w-full shrink-0 bg-red-2"></div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BlockEnum } from '@/types/node'
import {
  Agent,
  Code,
  Datasource,
  End,
  Home,
  Http,
  IfElse,
  Llm,
  Loop,
  LoopEnd,
  VariableX,
} from '@/components/base/icons/src/vender/workflow/index'
// import AppIcon from '@/app/components/base/app-icon'

type BlockIconProps = {
  type: BlockEnum
  size?: string
  className?: string
  toolIcon?: string | { content: string; background: string }
}

const props = withDefaults(defineProps<BlockIconProps>(), {
  size: 'sm'
})

const ICON_CONTAINER_CLASSNAME_SIZE_MAP: Record<string, string> = {
  xs: 'w-4 h-4 rounded-[5px] shadow-xs',
  sm: 'w-5 h-5 rounded-md shadow-xs',
  md: 'w-6 h-6 rounded-lg shadow-md',
}

const ICON_CONTAINER_BG_COLOR_MAP: Record<string, string> = {
  [BlockEnum.Start]: 'bg-blue-4',
  [BlockEnum.LLM]: 'bg-blue-4',
  [BlockEnum.Code]: 'bg-blue-4',
  [BlockEnum.End]: 'bg-blue-4',
  [BlockEnum.IfElse]: 'bg-blue-4',
  [BlockEnum.Loop]: 'bg-blue-4',
  [BlockEnum.LoopEnd]: 'bg-blue-4',
  [BlockEnum.HttpRequest]: 'bg-blue-4',
  [BlockEnum.Agent]: 'bg-blue-4',
  [BlockEnum.DataSource]: 'bg-blue-4',
  [BlockEnum.VariableAggregator]: 'bg-blue-4',
  [BlockEnum.Calculator]: 'bg-blue-4',
  [BlockEnum.CalculatorStart]: 'bg-blue-4',
  [BlockEnum.CalculatorBacktest]: 'bg-blue-4',
  [BlockEnum.CalculatorOverview]: 'bg-blue-4',
}

const iconComponentMap = {
  [BlockEnum.Start]: Home,
  [BlockEnum.LLM]: Llm,
  [BlockEnum.Code]: Code,
  [BlockEnum.End]: End,
  [BlockEnum.IfElse]: IfElse,
  [BlockEnum.HttpRequest]: Http,
  [BlockEnum.Loop]: Loop,
  [BlockEnum.LoopEnd]: LoopEnd,
  [BlockEnum.DataSource]: Datasource,
  [BlockEnum.Agent]: Agent,
  [BlockEnum.VariableAggregator]: VariableX,
  [BlockEnum.Calculator]: VariableX,
  [BlockEnum.CalculatorStart]: Home,
  [BlockEnum.CalculatorBacktest]: End,
  [BlockEnum.CalculatorOverview]: VariableX,
}

// 计算属性
const isToolOrDataSource = computed(() => 
  props.type === BlockEnum.DataSource
)

const showDefaultIcon = computed(() => 
  !isToolOrDataSource.value || !props.toolIcon
)

const sizeClass = computed(() => 
  ICON_CONTAINER_CLASSNAME_SIZE_MAP[props.size] || ICON_CONTAINER_CLASSNAME_SIZE_MAP.sm
)

const bgColor = computed(() => 
  ICON_CONTAINER_BG_COLOR_MAP[props.type] || ''
)

const getIconComponent = computed(() => 
  iconComponentMap[props.type as keyof typeof iconComponentMap] || 'div'
)

const iconSizeClass = computed(() => 
  props.size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'
)
</script>