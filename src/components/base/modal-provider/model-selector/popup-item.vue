<template>
  <div class="mb-1">
    <div class="flex h-[22px] items-center px-3 text-xs font-medium text-text-tertiary">
      {{ providerLabel }}
    </div>
    <template
      v-for="modelItem in model.models"
      :key="modelItem.model"
    >
      <el-tooltip
        placement="right"
        :popper-class="'p-3 !w-[206px] bg-components-panel-bg-blur backdrop-blur-sm border-[0.5px] border-components-panel-border rounded-xl'"
      >
        <template #content>
          <div class="flex flex-col gap-1">
            <div class="flex flex-col items-start gap-2">
              <ModelIcon
                :class="cn('h-5 w-5 shrink-0')"
                :provider="model"
                :modelName="modelItem.model"
              />
              <div class="system-md-medium text-wrap break-words text-text-primary">
                {{ modelItem.label[language] || modelItem.label.en_US }}
              </div>
            </div>
            <div class="flex flex-wrap gap-1">
              <ModelBadge v-if="modelItem.model_type">
                {{ modelTypeFormat(modelItem.model_type) }}
              </ModelBadge>
              <ModelBadge v-if="modelItem.model_properties.mode">
                {{ (modelItem.model_properties.mode as string).toLocaleUpperCase() }}
              </ModelBadge>
              <ModelBadge v-if="modelItem.model_properties.context_size">
                {{ sizeFormat(modelItem.model_properties.context_size as number) }}
              </ModelBadge>
            </div>
            <div
              v-if="modelItem.model_type === ModelTypeEnum.textGeneration && modelItem.features?.some(feature => [ModelFeatureEnum.vision, ModelFeatureEnum.audio, ModelFeatureEnum.video, ModelFeatureEnum.document].includes(feature))"
              class="pt-2"
            >
              <div class="system-2xs-medium-uppercase mb-1 text-text-tertiary">
                {{ t('common.model.capabilities') }}
              </div>
              <div class="flex flex-wrap gap-1">
                <ModelBadge v-if="modelItem.features?.includes(ModelFeatureEnum.vision)">
                  <RiImageCircleAiLine class="mr-0.5 h-3.5 w-3.5" />
                  <span>{{ ModelFeatureTextEnum.vision }}</span>
                </ModelBadge>
                <ModelBadge v-if="modelItem.features?.includes(ModelFeatureEnum.audio)">
                  <RiVoiceAiFill class="mr-0.5 h-3.5 w-3.5" />
                  <span>{{ ModelFeatureTextEnum.audio }}</span>
                </ModelBadge>
                <ModelBadge v-if="modelItem.features?.includes(ModelFeatureEnum.video)">
                  <RiFilmAiLine class="mr-0.5 h-3.5 w-3.5" />
                  <span>{{ ModelFeatureTextEnum.video }}</span>
                </ModelBadge>
                <ModelBadge v-if="modelItem.features?.includes(ModelFeatureEnum.document)">
                  <RiFileTextLine class="mr-0.5 h-3.5 w-3.5" />
                  <span>{{ ModelFeatureTextEnum.document }}</span>
                </ModelBadge>
              </div>
            </div>
          </div>
        </template>
        <div
          :class="cn(
            'group relative flex h-8 items-center gap-1 rounded-lg px-3 py-1.5',
            modelItem.status === ModelStatusEnum.active ? 'cursor-pointer hover:bg-state-base-hover' : 'cursor-not-allowed hover:bg-state-base-hover-alt'
          )"
          @click="handleSelect(model.provider, modelItem)"
        >
          <div class="flex items-center gap-2">
            <ModelIcon
              :class="cn('h-5 w-5 shrink-0')"
              :provider="model"
              :modelName="modelItem.model"
            />
            <ModelName
              :class="cn('system-sm-medium text-text-secondary', modelItem.status !== ModelStatusEnum.active && 'opacity-60')"
              :modelItem="modelItem"
            />
          </div>
          <Check
            v-if="defaultModel?.model === modelItem.model && defaultModel.provider === currentProvider.provider"
            class="h-4 w-4 shrink-0 text-text-accent"
          />
          <div
            v-if="modelItem.status === ModelStatusEnum.noConfigure"
            class="hidden cursor-pointer text-xs font-medium text-text-accent group-hover:block"
            @click.stop="handleOpenModelModal"
          >
            {{ t('common.operation.add').toLocaleUpperCase() }}
          </div>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  RiFileTextLine,
  RiFilmAiLine,
  RiImageCircleAiLine,
  RiVoiceAiFill,
} from '@remixicon/vue'
import type { DefaultModel, Model, ModelItem, ModelProvider } from '../declarations'
import {
  ModelFeatureEnum,
  ModelFeatureTextEnum,
  ModelTypeEnum,
} from '../declarations'
import {
  modelTypeFormat,
  sizeFormat,
} from '../utils'
import {
  useLanguage,
} from '../hooks'
import ModelIcon from '../model-icon/index.vue'
import ModelName from '../model-name/index.vue'
import ModelBadge from '../model-badge/index.vue'
import {
  ModelStatusEnum,
} from '../declarations'
import { Check } from '@/components/base/icons/src/vender/line/general'
import { useModelStore } from '@/store/useModelStore'
import cn from '@/utils/classnames'
import { storeToRefs } from 'pinia'

interface PopupItemProps {
  defaultModel?: DefaultModel
  model: Model
  onSelect: (provider: string, model: ModelItem) => void
}

const props = defineProps<PopupItemProps>()

const { t } = useI18n()
const language = useLanguage()
// const { setShowModelModal } = useModalContext()
const modelStore = useModelStore()
const { modelProviders } = storeToRefs(modelStore)
// const updateModelList = useUpdateModelList()
// const updateModelProviders = useUpdateModelProviders()

const currentProvider = computed(() => {
  return modelProviders.value.find((provider: ModelProvider) => provider.provider === props.model.provider)!
})

const providerLabel = computed(() => {
  return props.model.label[language] || props.model.label.en_US
})

const handleSelect = (provider: string, modelItem: ModelItem) => {
  if (modelItem.status !== ModelStatusEnum.active)
    return

  props.onSelect(provider, modelItem)
}

const handleOpenModelModal = () => {
  // setShowModelModal({
  //   payload: {
  //     currentProvider: currentProvider.value,
  //     currentConfigurationMethod: ConfigurationMethodEnum.predefinedModel,
  //   },
  //   onSaveCallback: () => {
  //     updateModelProviders()

  //     const modelType = props.model.models[0].model_type

  //     if (modelType)
  //       updateModelList(modelType)
  //   },
  // })
}
</script>

