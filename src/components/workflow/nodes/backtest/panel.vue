<template>
  <div class="mt-2">
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">{{ t(`${i18nPrefix}.ticker`) }}</div>
      </template>
      <div class="px-4">
          <el-input
            :disabled="readOnly"
            :model-value="payload.ticker"
            :placeholder="t(`${i18nPrefix}.tickerPlaceholder`)"
            @input="updateTicker"
          />
      </div>
    </Field>
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">{{ t(`${i18nPrefix}.start_date`) }}</div>
      </template>
      <div class="px-4 flex items-center">
          <el-date-picker
            :disabled="readOnly"
            :model-value="payload.start_date"
            type="date"
            :placeholder="t(`${i18nPrefix}.start_datePlaceholder`)"
            value-format="YYYYMMDD"
            @update:model-value="updateStartDate"
          />
          <span class="mx-2">~</span>
          <el-date-picker
            :disabled="readOnly"
            :model-value="payload.end_date"
            type="date"
            :placeholder="t(`${i18nPrefix}.end_datePlaceholder`)"
            value-format="YYYYMMDD"
            @update:model-value="updateEndDate"
          />
      </div>
    </Field>
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">{{ t(`${i18nPrefix}.price_type`) }}</div>
      </template>
      <div class="px-4">
        <el-select :disabled="readOnly" :model-value="payload.price_type" :placeholder="t(`${i18nPrefix}.price_typePlaceholder`)" @update:model-value="updatePriceType">
          <el-option v-for="item in priceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </Field>
    <SignalForm
      v-if="!readOnly"
      :node-id="id"
      :payload="payload.execution_signals.open"
      :is-open="true"
      :read-only="readOnly"
      @change="(value) => updateExecutionSignals(PriceType.OPEN, value)"
    />
    <SignalForm
      v-if="!readOnly"
      :node-id="id"
      :payload="payload.execution_signals.close"
      :is-open="false"
      :read-only="readOnly"
      @change="(value) => updateExecutionSignals(PriceType.CLOSE, value)"
    />
    <RiskController
      v-if="!readOnly"
      :node-id="id"
      :risk_control="payload.risk_control"
      :read-only="readOnly"
      @updateRiskControl="updateRiskControl"
    />
    <Split />
    <OutputVars>
      <VarItem :name="`output`" :type="VarType.object" :description="t(`${i18nPrefix}.outputDescribe`)" />
    </OutputVars>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiAddLine, RiInformation2Fill } from '@remixicon/vue'
import Split from '@/components/base/split.vue'
import { PriceType, type BacktestNodeType } from './types'
import { VarType, type NodePanelProps } from '@/types'
import Field from '@/components/base/field.vue'
import SignalForm from './component/signal-form.vue'
import RiskController from './component/risk-controller.vue'
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import { computed } from 'vue'
import useConfig from './use-config.ts'

const i18nPrefix = 'workflow.nodes.backtest'

const props = defineProps<NodePanelProps<BacktestNodeType>>()

const payload = computed(() => props.data)

const { t } = useI18n()

const priceTypeOptions = [
  {
    label: t('common.priceType.open'),
    value: PriceType.OPEN,
  },
  {
    label: t('common.priceType.close'),
    value: PriceType.CLOSE,
  },
]

const {
  readOnly,
  updateTicker,
  updateStartDate,
  updateEndDate,
  updatePriceType,
  updateExecutionSignals,
  updateRiskControl,
} = useConfig(props.id, payload)
</script>

<style scoped>
</style>