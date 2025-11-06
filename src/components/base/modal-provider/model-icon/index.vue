<template>
  <div
    v-if="isOpenaiSpecial && openaiIconComponent"
    class="flex items-center justify-center"
  >
    <component
      :is="openaiIconComponent"
      :class="cn('h-5 w-5', className)"
    />
  </div>
  <div
    v-else-if="provider?.icon_small"
    :class="cn('flex h-5 w-5 items-center justify-center', isDeprecated && 'opacity-50', className)"
  >
    <img
      alt="model-icon"
      :src="iconUrl"
      :class="iconClassName"
    />
  </div>
  <div
    v-else
    :class="cn(
      'flex h-5 w-5 items-center justify-center rounded-md border-[0.5px] border-components-panel-border-subtle bg-background-default-subtle',
      className,
    )"
  >
    <div :class="cn('flex h-5 w-5 items-center justify-center opacity-35', iconClassName)">
      <Group class="h-3 w-3 text-text-tertiary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Model, ModelProvider } from '../declarations'
import { useLanguage } from '../hooks'
import { Group } from '@/components/base/icons/src/vender/other'
import { OpenaiBlue, OpenaiTeal, OpenaiViolet, OpenaiYellow } from '@/components/base/icons/src/public/llm'
import cn from '@/utils/classnames'

interface ModelIconProps {
  provider?: Model | ModelProvider
  modelName?: string
  className?: string
  iconClassName?: string
  isDeprecated?: boolean
}

const props = withDefaults(defineProps<ModelIconProps>(), {
  isDeprecated: false,
})

const language = useLanguage()

const isOpenaiSpecial = computed(() => {
  if (!props.provider?.provider) return false
  const isOpenai = ['openai', 'langgenius/openai/openai'].includes(props.provider.provider)
  return isOpenai && props.modelName
})

const openaiIconComponent = computed(() => {
  if (!props.modelName) return null
  if (props.modelName.startsWith('o')) return OpenaiYellow
  if (props.modelName.includes('gpt-4.1')) return OpenaiTeal
  if (props.modelName.includes('gpt-4o')) return OpenaiBlue
  if (props.modelName.startsWith('gpt-4')) return OpenaiViolet
  return null
})

const iconUrl = computed(() => {
  if (!props.provider?.icon_small) return ''
  return props.provider?.icon_small?.zh_Hans || ''
})
</script>

