import { ref, computed, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  Credential,
  CustomConfigurationModelFixedFields,
  CustomModel,
  DefaultModel,
  DefaultModelResponse,
  Model,
  ModelModalModeEnum,
  ModelProvider,
  ModelTypeEnum,
} from './declarations'
import {
  ConfigurationMethodEnum,
  CustomConfigurationStatusEnum,
  ModelStatusEnum,
} from './declarations'
import { useModelStore } from '@/store/useModelStore'

type UseDefaultModelAndModelList = (
  defaultModel: DefaultModelResponse | undefined,
  modelList: Model[],
) => [Ref<DefaultModel | undefined>, (model: DefaultModel) => void]

export const useSystemDefaultModelAndModelList: UseDefaultModelAndModelList = (
  defaultModel,
  modelList,
) => {
  const currentDefaultModel = computed(() => {
    const currentProvider = modelList.find(provider => provider.provider === defaultModel?.provider.provider)
    const currentModel = currentProvider?.models.find(model => model.model === defaultModel?.model)
    const currentDefaultModel = currentProvider && currentModel && {
      model: currentModel.model,
      provider: currentProvider.provider,
    }

    return currentDefaultModel
  })
  const defaultModelState = ref<DefaultModel | undefined>(currentDefaultModel.value)
  const handleDefaultModelChange = (model: DefaultModel) => {
    defaultModelState.value = model
  }
  watch(currentDefaultModel, (newValue) => {
    defaultModelState.value = newValue
  })

  return [defaultModelState, handleDefaultModelChange]
}

export const useLanguage = () => {
  const { locale } = useI18n()
  return locale.value.replace('-', '_')
}

export const useCurrentProviderAndModel = (modelList: Model[], defaultModel?: DefaultModel) => {
  const currentProvider = computed(() => modelList.find(provider => provider.provider === defaultModel?.provider))
  const currentModel = computed(() => currentProvider.value?.models.find(model => model.model === defaultModel?.model))

  return {
    currentProvider,
    currentModel,
  }
}

export const useTextGenerationCurrentProviderAndModelAndModelList = (defaultModel?: DefaultModel) => {
  const { textGenerationModelList } = useModelStore()
  const activeTextGenerationModelList = computed(() => textGenerationModelList.filter(model => model.status === ModelStatusEnum.active))
  const {
    currentProvider,
    currentModel,
  } = useCurrentProviderAndModel(textGenerationModelList, defaultModel)

  return {
    currentProvider,
    currentModel,
    textGenerationModelList,
    activeTextGenerationModelList,
  }
}


