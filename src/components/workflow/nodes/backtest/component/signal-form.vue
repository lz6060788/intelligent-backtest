<template>
  <Field class-name="mb-2">
    <template #title>
      <div class="pl-3">{{ t(`${i18nPrefix}.${isOpen ? 'open' : 'close'}`) }}</div>
    </template>
    <div
      class="px-4 grid grid-cols-3 gap-2"
    >
      <el-select
        :disabled="readOnly"
        :model-value="payload.isManual"
        :placeholder="t(`${i18nPrefix}.${isOpen ? 'openPlaceholder' : 'closePlaceholder'}`)"
        class="col-span-1"
        @update:model-value="handleTypeChange"
      >
        <el-option
          v-for="item in signalVariableOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div v-if="payload.isManual" class="col-span-2">
        <el-date-picker
          :disabled="readOnly"
          :model-value="payload.value"
          type="dates"
          :placeholder="t(`${i18nPrefix}.${isOpen ? 'openPlaceholder' : 'closePlaceholder'}`)"
          format="YYYYMMDD"
          value-format="YYYYMMDD"
          style="width: 100%;"
          @update:model-value="handleValueChangeByManual"
        />
      </div>
      <VarReferencePicker
        v-else
        class="col-span-2"
        :readonly="readOnly"
        :node-id="nodeId"
        :is-show-node-name="true"
        :value="payload.value"
        @change="handleValueChange"
        :filter-var="filterVar"
        :placeholder="t(`${i18nPrefix}.signalVariablePlaceholder`)"
      ></VarReferencePicker>
    </div>
    <template v-if="payload.isManual">
      <div
        class="px-4 flex items-center gap-2 flex-wrap mt-3"
        v-if="payload.value?.length"
      >
        <span class="label text-xs text-text-secondary">已选日期：</span>
        <el-tag
          v-for="(date, index) in payload.value"
          :key="index"
          closable
          :disabled="readOnly"
          @close="handleValueChangeByManual(payload.value.filter((_, i) => i !== index))"
        >
          {{ date }}
        </el-tag>
      </div>
    </template>
  </Field>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SignalVariable } from '../types';
import { BlockEnum, type ValueSelector, type Var } from '@/types';
import { useWorkflowInstance } from '@/components/workflow/hooks';
import { useVueFlow } from '@vue-flow/core';
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import { computed } from 'vue';

const i18nPrefix = 'workflow.nodes.backtest.execution_signals'

const { t } = useI18n()

const { instanceId } = useWorkflowInstance()

const signalVariableOptions = [
  {
    label: t(`${i18nPrefix}.manual`),
    value: true,
  },
  {
    label: t(`${i18nPrefix}.auto`),
    value: false,
  },
]

const props = defineProps<{
  nodeId: string
  payload: SignalVariable
  isOpen: boolean
  readOnly: boolean
}>()

const { nodes } = useVueFlow(instanceId)

const filterVar = (_: Var, selector: ValueSelector) => {
  const nodeId = selector[0]
  const node = nodes.value.find(node => node.id === nodeId)
  if (!node) {
    return false
  }
  return node.data!.type === BlockEnum.OperatorOverview
}

const emit = defineEmits<{
  (e: 'change', value: SignalVariable): void
}>()

const handleTypeChange = (value: boolean) => {
  if (value === props.payload.isManual) {
    return
  }
  emit('change', {
    isManual: value,
    value: [],
  })
}

const handleValueChange = (value: ValueSelector | string) => {
  emit('change', {
    isManual: props.payload.isManual,
    value: value as ValueSelector,
  })
}

const handleValueChangeByManual = (value: string[]) => {
  emit('change', {
    isManual: props.payload.isManual,
    value: value,
  })
}
</script>

<style scoped></style>
