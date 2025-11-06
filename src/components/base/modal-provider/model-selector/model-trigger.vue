<template>
  <div
    :class="cn(
      'group flex h-8 items-center gap-0.5 rounded-lg bg-gray-600 p-1',
      !readonly && 'cursor-pointer hover:bg-components-input-bg-hover',
      open && 'bg-components-input-bg-hover',
      model.status !== ModelStatusEnum.active && 'bg-components-input-bg-disabled hover:bg-components-input-bg-disabled',
      className,
    )"
  >
    <ModelIcon
      className="p-0.5"
      :provider="provider"
      :modelName="model.model"
    />
    <div class="flex grow items-center gap-1 truncate px-1 py-[3px]">
      <ModelName
        className="grow"
        :modelItem="model"
        :showMode="true"
        :showFeatures="true"
      />
      <div
        v-if="!readonly"
        class="flex h-4 w-4 shrink-0 items-center justify-center"
      >
        <el-tooltip
          v-if="model.status !== ModelStatusEnum.active"
          :content="MODEL_STATUS_TEXT[model.status]![language]"
        >
          <AlertTriangle class="h-4 w-4 text-text-warning-secondary" />
        </el-tooltip>
        <RiArrowDownSLine
          v-else
          class="h-3.5 w-3.5 text-text-tertiary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RiArrowDownSLine } from '@remixicon/vue'
import type { Model, ModelItem } from '../declarations'
import { MODEL_STATUS_TEXT, ModelStatusEnum } from '../declarations'
import { useLanguage } from '../hooks'
import ModelIcon from '../model-icon/index.vue'
import ModelName from '../model-name/index.vue'
import { AlertTriangle } from '@/components/base/icons/src/vender/line/alertsAndFeedback'
import cn from '@/utils/classnames'

interface ModelTriggerProps {
  open: boolean
  provider: Model
  model: ModelItem
  className?: string
  readonly?: boolean
}

const props = defineProps<ModelTriggerProps>()

const language = useLanguage()
</script>

