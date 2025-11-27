<template>
  <div class="mt-2">
    <div class="space-y-4 px-4 pb-4">
      <ConfigPrompt
        :read-only="readOnly"
        :node-id="id"
        :filter-var="filterInputVar"
        :is-chat-model="isChatModel"
        :is-show-context="true"
        :payload="payload.prompt_template"
        @change="handlePromptChange"
        :has-set-block-status="hasSetBlockStatus"
        :var-list="[]"
        :model-config="model"
      />
    </div>
    <Split />
    <OutputVars
      :collapsed="outputVarsCollapsed"
      @collapse="outputVarsCollapsed = !outputVarsCollapsed"
    >
      <VarItem
        name="text"
        type="string"
        :description="t(`${i18nPrefix}.outputVars.output`)"
      />
      <VarItem
        name="reasoning_content"
        type="string"
        :description="t(`${i18nPrefix}.outputVars.reasoning_content`)"
      />
      <VarItem
        name="usage"
        type="object"
        :description="t(`${i18nPrefix}.outputVars.usage`)"
      />
    </OutputVars>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useConfig from './use-config'
import type { LLMNodeType } from './types'
import ConfigPrompt from './components/config-prompt.vue'
import Split from '@/components/base/split.vue'
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue'
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue'
import type { NodePanelProps } from '@/types'

const i18nPrefix = 'workflow.nodes.llm'

/**
 * 组件属性定义
 */
interface Props extends NodePanelProps<LLMNodeType> {}

const props = defineProps<Props>()

const { t } = useI18n()

const payload = computed(() => props.data)

const {
  readOnly,
  isChatModel,
  hasSetBlockStatus,
  filterInputVar,
  handlePromptChange,
  outputVarsCollapsed
} = useConfig(props.id, payload)

const model = computed(() => payload.value.model)
</script>

