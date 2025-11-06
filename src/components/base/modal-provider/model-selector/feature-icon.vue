<template>
  <ModelBadge :className="className" v-if="featureIcon">
    <component :is="featureIcon" class="mr-0.5 h-3.5 w-3.5" />
  </ModelBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ModelFeatureEnum } from '../declarations'
import ModelBadge from '../model-badge/index.vue'
import {
  RiFileTextLine,
  RiFilmAiLine,
  RiImageCircleAiLine,
  RiVoiceAiFill,
  RiToolsLine,
} from '@remixicon/vue'

interface FeatureIconProps {
  feature: ModelFeatureEnum
  className?: string
}

const props = defineProps<FeatureIconProps>()

const featureIcon = computed(() => {
  switch (props.feature) {
    case 'vision':
      return RiImageCircleAiLine
    case 'audio':
      return RiVoiceAiFill
    case 'video':
      return RiFilmAiLine
    case 'document':
      return RiFileTextLine
    case 'tool-call':
    case 'multi-tool-call':
      return RiToolsLine
    default:
      return null
  }
})
</script>

