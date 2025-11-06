<template>
  <el-popover
    :visible="open"
    :teleported="false"
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    :popper-style="{
      width: '100%',
    }"
    placement="bottom-start"
    :offset="4"
    :disabled="readonly"
    trigger="click"
    @update:visible="handleOpenChange"
  >
    <template #reference>
      <div :class="cn('relative')">
        <div class="block">
          <ModelTrigger
            v-if="currentProvider && currentModel"
            :open="open"
            :provider="currentProvider"
            :model="currentModel"
            :className="triggerClassName"
            :readonly="readonly"
          />
          <EmptyTrigger
            v-if="!defaultModel"
            :open="open"
            :className="triggerClassName"
          />
        </div>
      </div>
    </template>
    <Popup
      :defaultModel="defaultModel"
      :modelList="modelList"
      @select="handleSelect"
      :scopeFeatures="scopeFeatures"
      @hide="handleHide"
      :class="popupClassName"
    />
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DefaultModel, Model, ModelItem } from '../declarations'
import type { ModelFeatureEnum } from '../declarations'
import { useCurrentProviderAndModel } from '../hooks'
import ModelTrigger from './model-trigger.vue'
import EmptyTrigger from './empty-trigger.vue'
import Popup from './popup.vue'
import cn from '@/utils/classnames'

interface ModelSelectorProps {
  defaultModel?: DefaultModel
  modelList: Model[]
  triggerClassName?: string
  popupClassName?: string
  onSelect?: (model: DefaultModel) => void
  readonly?: boolean
  scopeFeatures?: ModelFeatureEnum[]
  deprecatedClassName?: string
  showDeprecatedWarnIcon?: boolean
}

const props = withDefaults(defineProps<ModelSelectorProps>(), {
  readonly: false,
  scopeFeatures: () => [],
  showDeprecatedWarnIcon: false,
})

const open = ref(false)

const {
  currentProvider,
  currentModel,
} = useCurrentProviderAndModel(
  props.modelList,
  props.defaultModel,
)

const handleSelect = (provider: string, model: ModelItem) => {
  open.value = false

  if (props.onSelect) {
    props.onSelect({ provider, model: model.model })
  }
}

const handleOpenChange = (visible: boolean) => {
  open.value = visible
}

const handleHide = () => {
  open.value = false
}
</script>

