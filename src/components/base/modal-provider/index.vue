<template>
  <div class="relative -mt-2 pt-1">
    <div :class="cn('mb-2 flex items-center')">
      <div class="system-md-semibold grow text-text-primary">{{ t('common.modelProvider.models') }}</div>
      <div
        :class="cn(
          'relative flex shrink-0 items-center justify-end gap-2 rounded-lg border border-transparent p-px',
          defaultModelNotConfigured && 'border-components-panel-border bg-components-panel-bg-blur pl-2 shadow-xs',
        )"
      >
        <div
          v-if="defaultModelNotConfigured"
          class="absolute bottom-0 left-0 right-0 top-0 opacity-40"
          :style="{ background: 'linear-gradient(92deg, rgba(247, 144, 9, 0.25) 0%, rgba(255, 255, 255, 0.00) 100%)' }"
        />
        <div
          v-if="defaultModelNotConfigured"
          class="system-xs-medium flex items-center gap-1 text-text-primary"
        >
          <RiAlertFill class="h-4 w-4 text-text-warning-secondary" />
          <span
            class="max-w-[460px] truncate"
            :title="t('common.modelProvider.notConfigured')"
          >
            {{ t('common.modelProvider.notConfigured') }}
          </span>
        </div>
        <!-- TODO: Implement SystemModelSelector component -->
        <!-- <SystemModelSelector
          :notConfigured="defaultModelNotConfigured"
          :textGenerationDefaultModel="textGenerationDefaultModel"
          :embeddingsDefaultModel="embeddingsDefaultModel"
          :rerankDefaultModel="rerankDefaultModel"
          :speech2textDefaultModel="speech2textDefaultModel"
          :ttsDefaultModel="ttsDefaultModel"
        /> -->
      </div>
    </div>
    <div
      v-if="!filteredConfiguredProviders?.length"
      class="mb-2 rounded-[10px] bg-workflow-process-bg p-4"
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-[10px] border-[0.5px] border-components-card-border bg-components-card-bg shadow-lg backdrop-blur">
        <RiBrainLine class="h-5 w-5 text-text-primary" />
      </div>
      <div class="system-sm-medium mt-2 text-text-secondary">{{ t('common.modelProvider.emptyProviderTitle') }}</div>
      <div class="system-xs-regular mt-1 text-text-tertiary">{{ t('common.modelProvider.emptyProviderTip') }}</div>
    </div>
    <div
      v-if="filteredConfiguredProviders?.length"
      class="relative"
    >
      <!-- TODO: Implement ProviderAddedCard component -->
      <!-- <ProviderAddedCard
        v-for="provider in filteredConfiguredProviders"
        :key="provider.provider"
        :provider="provider"
      /> -->
    </div>
    <template v-if="filteredNotConfiguredProviders?.length">
      <div class="system-md-semibold mb-2 flex items-center pt-2 text-text-primary">{{ t('common.modelProvider.toBeConfigured') }}</div>
      <div class="relative">
        <!-- TODO: Implement ProviderAddedCard component -->
        <!-- <ProviderAddedCard
          v-for="provider in filteredNotConfiguredProviders"
          :key="provider.provider"
          notConfigured
          :provider="provider"
        /> -->
      </div>
    </template>
    <!-- TODO: Implement InstallFromMarketplace component -->
    <!-- <InstallFromMarketplace
      v-if="enable_marketplace"
      :providers="providers"
      :searchText="searchText"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import {
  RiAlertFill,
  RiBrainLine,
} from '@remixicon/react'
import type { ModelProvider } from './declarations'
import {
  CustomConfigurationStatusEnum,
  ModelTypeEnum,
} from './declarations'
import {
  useDefaultModel,
} from './hooks'
import { useProviderContext } from '@/context/provider-context'
import cn from '@/utils/classnames'
import { useGlobalPublicStore } from '@/context/global-public-context'

interface Props {
  searchText: string
}

const props = defineProps<Props>()

const FixedModelProvider = ['langgenius/openai/openai', 'langgenius/anthropic/anthropic']

const { t } = useI18n()

const debouncedSearchText = ref('')
const debouncedUpdate = useDebounceFn((value: string) => {
  debouncedSearchText.value = value
}, 500)

watch(() => props.searchText, (newValue) => {
  debouncedUpdate(newValue)
}, { immediate: true })

const { data: textGenerationDefaultModel } = useDefaultModel(ModelTypeEnum.textGeneration)
const { data: embeddingsDefaultModel } = useDefaultModel(ModelTypeEnum.textEmbedding)
const { data: rerankDefaultModel } = useDefaultModel(ModelTypeEnum.rerank)
const { data: speech2textDefaultModel } = useDefaultModel(ModelTypeEnum.speech2text)
const { data: ttsDefaultModel } = useDefaultModel(ModelTypeEnum.tts)
const { modelProviders: providers } = useProviderContext()
const { enable_marketplace } = useGlobalPublicStore(s => s.systemFeatures)

const defaultModelNotConfigured = computed(() => {
  return !textGenerationDefaultModel.value && !embeddingsDefaultModel.value && !speech2textDefaultModel.value && !rerankDefaultModel.value && !ttsDefaultModel.value
})

const [configuredProviders, notConfiguredProviders] = computed(() => {
  const configured: ModelProvider[] = []
  const notConfigured: ModelProvider[] = []

  providers.forEach((provider) => {
    if (
      provider.custom_configuration.status === CustomConfigurationStatusEnum.active
      || (
        provider.system_configuration.enabled === true
        && provider.system_configuration.quota_configurations.find(item => item.quota_type === provider.system_configuration.current_quota_type)
      )
    )
      configured.push(provider)
    else
      notConfigured.push(provider)
  })

  configured.sort((a, b) => {
    if (FixedModelProvider.includes(a.provider) && FixedModelProvider.includes(b.provider))
      return FixedModelProvider.indexOf(a.provider) - FixedModelProvider.indexOf(b.provider) > 0 ? 1 : -1
    else if (FixedModelProvider.includes(a.provider))
      return -1
    else if (FixedModelProvider.includes(b.provider))
      return 1
    return 0
  })

  return [configured, notConfigured]
})

const filteredConfiguredProviders = computed(() => {
  return configuredProviders.value.filter(
    provider => provider.provider.toLowerCase().includes(debouncedSearchText.value.toLowerCase())
      || Object.values(provider.label).some(text => text.toLowerCase().includes(debouncedSearchText.value.toLowerCase())),
  )
})

const filteredNotConfiguredProviders = computed(() => {
  return notConfiguredProviders.value.filter(
    provider => provider.provider.toLowerCase().includes(debouncedSearchText.value.toLowerCase())
      || Object.values(provider.label).some(text => text.toLowerCase().includes(debouncedSearchText.value.toLowerCase())),
  )
})
</script>

