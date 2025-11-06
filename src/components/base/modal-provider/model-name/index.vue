<template>
  <div
    v-if="modelItem"
    :class="cn('system-sm-regular flex items-center gap-0.5 overflow-hidden truncate text-ellipsis text-components-input-text-filled', className)"
  >
    <div
      class="truncate"
      :title="modelLabel"
    >
      {{ modelLabel }}
    </div>
    <div class="flex items-center gap-0.5">
      <ModelBadge
        v-if="showModelType && modelItem.model_type"
        :className="modelTypeClassName"
      >
        {{ modelTypeFormat(modelItem.model_type) }}
      </ModelBadge>
      <ModelBadge
        v-if="modelItem.model_properties.mode && showMode"
        :className="modeClassName"
      >
        {{ (modelItem.model_properties.mode as string).toLocaleUpperCase() }}
      </ModelBadge>
      <template v-if="showFeatures">
        <FeatureIcon
          v-for="feature in modelItem.features"
          :key="feature"
          :feature="feature"
          :className="featuresClassName"
        />
      </template>
      <ModelBadge v-if="showContextSize && modelItem.model_properties.context_size">
        {{ sizeFormat(modelItem.model_properties.context_size as number) }}
      </ModelBadge>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { modelTypeFormat, sizeFormat } from '../utils'
import { useLanguage } from '../hooks'
import type { ModelItem } from '../declarations'
import ModelBadge from '../model-badge/index.vue'
import FeatureIcon from '../model-selector/feature-icon.vue'
import cn from '@/utils/classnames'

interface ModelNameProps {
  modelItem: ModelItem
  className?: string
  showModelType?: boolean
  modelTypeClassName?: string
  showMode?: boolean
  modeClassName?: string
  showFeatures?: boolean
  featuresClassName?: string
  showContextSize?: boolean
}

const props = withDefaults(defineProps<ModelNameProps>(), {
  showModelType: false,
  showMode: false,
  showFeatures: false,
  showContextSize: false,
})

const language = useLanguage()

const modelLabel = computed(() => {
  return props.modelItem.label[language] || props.modelItem.label.en_US
})

console.log(props.modelItem)
</script>

