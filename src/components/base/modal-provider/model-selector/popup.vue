<template>
  <div
    ref="scrollRef"
    class="max-h-[480px] overflow-y-auto rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg"
  >
    <div class="sticky top-0 z-10 bg-components-panel-bg pb-1 pt-3">
      <div
        :class="`
          flex items-center rounded-lg border pl-[9px] pr-[10px] width-full
          ${searchText ? 'border-components-input-border-active bg-components-input-bg-active shadow-xs' : 'border-transparent bg-components-input-bg-normal'}
        `"
      >
        <el-input
          class="block grow appearance-none bg-transparent text-text-primary outline-none"
          :placeholder="t('datasetSettings.form.searchModel') || ''"
          size="small"
          v-model="searchText"
          clearable
          :prefix-icon="Search"
          style="width: 100%;"
        />
      </div>
    </div>
    <div class="p-1">
      <PopupItem
        v-for="model in filteredModelList"
        :key="model.provider"
        :defaultModel="defaultModel"
        :model="model"
        @select="handleSelect"
      />
      <div
        v-if="!filteredModelList.length"
        class="break-all px-3 py-1.5 text-center text-xs leading-[18px] text-text-tertiary"
      >
        {{ `No model found for "${searchText}"` }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DefaultModel, Model, ModelItem } from '../declarations'
import { ModelFeatureEnum } from '../declarations'
import { useLanguage } from '../hooks'
import PopupItem from './popup-item.vue'
import { supportFunctionCall } from '@/utils/tool-call.ts'
import { Search } from '@element-plus/icons-vue'
// import { tooltipManager } from '@/components/base/tooltip/TooltipManager'

interface PopupProps {
  defaultModel?: DefaultModel
  modelList: Model[]
  onSelect: (provider: string, model: ModelItem) => void
  scopeFeatures?: ModelFeatureEnum[]
  onHide: () => void
}

const props = withDefaults(defineProps<PopupProps>(), {
  scopeFeatures: () => [],
})

const emit = defineEmits<{
  select: [provider: string, model: ModelItem]
}>()

const { t } = useI18n()
const language = useLanguage()
const searchText = ref('')
const scrollRef = ref<HTMLDivElement>()

// Close any open tooltips when the user scrolls to prevent them from appearing
// in incorrect positions or becoming detached from their trigger elements
// const handleTooltipCloseOnScroll = () => {
//   tooltipManager.closeActiveTooltip()
// }

// onMounted(() => {
//   const scrollContainer = scrollRef.value
//   if (scrollContainer) {
//     scrollContainer.addEventListener('scroll', handleTooltipCloseOnScroll, { passive: true })
//   }
// })

// onUnmounted(() => {
//   const scrollContainer = scrollRef.value
//   if (scrollContainer) {
//     scrollContainer.removeEventListener('scroll', handleTooltipCloseOnScroll)
//   }
// })

const filteredModelList = computed(() => {
  return props.modelList.map((model) => {
    const filteredModels = model.models
      .filter((modelItem) => {
        if (modelItem.label[language] !== undefined)
          return modelItem.label[language].toLowerCase().includes(searchText.value.toLowerCase())
        return Object.values(modelItem.label).some(label =>
          label.toLowerCase().includes(searchText.value.toLowerCase()),
        )
      })
      .filter((modelItem) => {
        if (props.scopeFeatures.length === 0)
          return true
        return props.scopeFeatures.every((feature) => {
          if (feature === ModelFeatureEnum.toolCall)
            return supportFunctionCall(modelItem.features)
          return modelItem.features?.includes(feature) ?? false
        })
      })
    return { ...model, models: filteredModels }
  }).filter(model => model.models.length > 0)
})

const handleSelect = (provider: string, model: ModelItem) => {
  props.onSelect(provider, model)
  emit('select', provider, model)
}
</script>

