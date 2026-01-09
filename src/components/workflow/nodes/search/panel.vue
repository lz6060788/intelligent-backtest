<template>
  <div class="mt-2">
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">搜索参数</div>
      </template>
      <template #operations>
        <AddButton v-if="!readOnly" @click="handleSearchItemAdd" />
      </template>
      <div class="px-2">
        <Params
        :items="payload.retrieve_params.items"
        :node-id="id"
        :readonly="readOnly"
        @update-search-item="handleSearchItemChange"
        @remove-search-item="handleSearchItemRemove"
        />
      </div>
    </Field>
    <Split />
    <OutputVars>
      <VarItem :name="`output`" :type="VarType.arrayObject" :description="t(`${i18nPrefix}.outputDescribe`)" />
    </OutputVars>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Split from '@/components/base/split.vue'
import { type SearchNodeType } from './types'
import { VarKindType, VarType, type NodePanelProps, type ValueSelector, type Var } from '@/types'
import Params from './component/params/index.vue'
import Field from '@/components/base/field.vue'
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import { computed } from 'vue'
import useConfig from './use-config.ts'

const i18nPrefix = 'workflow.nodes.backtest'

const props = defineProps<NodePanelProps<SearchNodeType>>()

const payload = computed(() => props.data)

const { t } = useI18n()

const {
  readOnly,
  handleSearchItemChange,
  handleSearchItemRemove,
  handleSearchItemAdd
} = useConfig(props.id, payload)
</script>

<style scoped>
</style>