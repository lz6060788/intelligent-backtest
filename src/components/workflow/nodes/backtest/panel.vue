<template>
  <div class="mt-2">
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">标的类型</div>
      </template>
      <div class="px-4">
        <el-select :disabled="readOnly" :model-value="payload.ticker.pool_type" :placeholder="t(`${i18nPrefix}.price_typePlaceholder`)" @update:model-value="updatePoolType">
          <el-option v-for="item in tickerPoolTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </Field>
    <template v-if="payload.ticker.pool_type === PoolTypeEnum.preset">
      <Field class-name="mb-2">
        <template #title>
          <div class="pl-3">标的池选择</div>
        </template>
        <div class="px-4">
          <el-select
            :disabled="readOnly"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            :model-value="payload.ticker.preset_config.preset_code"
            :placeholder="t(`${i18nPrefix}.tickerPlaceholder`)"
            @update:model-value="updatePresetCode"
          >
            <el-option v-for="item in presetCodeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </Field>
    </template>
    <template v-else>
      <Field class-name="mb-2">
        <template #title>
          <div class="pl-3">标的来源</div>
        </template>
        <div class="px-4">
          <el-select :disabled="readOnly" :model-value="payload.ticker.custom_config.source_type" :placeholder="t(`${i18nPrefix}.tickerPlaceholder`)" @update:model-value="updateCustomPoolSourceType">
            <el-option v-for="item in tickerSourceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </Field>
      <Field class-name="mb-2" v-if="payload.ticker.custom_config.source_type === PoolSourceType.manual_list">
        <template #title>
          <div class="pl-3">{{ t(`${i18nPrefix}.ticker`) }}</div>
        </template>
        <div class="px-4">
          <el-input-tag
            v-model="payload.ticker.custom_config.tickers"
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            clearable
            :placeholder="t(`${i18nPrefix}.tickerPlaceholder`)"
            @update:model-value="updateCustomPoolTickers"
          />
        </div>
      </Field>
      <Field class-name="mb-2" v-else>
        <template #title>
          <div class="pl-3">{{ t(`${i18nPrefix}.ticker`) }}</div>
        </template>
        <div class="px-4">
          <div class="space-y-2">
            <VarReferencePicker
              :node-id="id"
              :readonly="readOnly"
              :is-show-node-name="true"
              class="grow overflow-hidden"
              :value="payload.ticker.custom_config.reference_path"
              :is-support-constant-value="false"
              :default-var-kind-type="VarKindType.variable"
              :only-leaf-node-var="false"
              :filter-var="filterVar"
              :is-support-file-var="false"
              @change="(value: ValueSelector) => updateCustomPoolReferencePath(value)"
            />
          </div>
        </div>
      </Field>
    </template>
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
      :node-id="id"
      :payload="payload.execution_signals.open"
      :is-open="true"
      :read-only="readOnly"
      @change="(value) => updateExecutionSignals(PriceType.OPEN, value)"
    />
    <SignalForm
      :node-id="id"
      :payload="payload.execution_signals.close"
      :is-open="false"
      :read-only="readOnly"
      @change="(value) => updateExecutionSignals(PriceType.CLOSE, value)"
    />
    <RiskController
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
import Split from '@/components/base/split.vue'
import { PoolSourceType, PoolTypeEnum, PriceType, type BacktestNodeType } from './types'
import { VarKindType, VarType, type NodePanelProps, type ValueSelector, type Var } from '@/types'
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

const tickerPoolTypeOptions = [
  {
    label: '预设标的池',
    value: PoolTypeEnum.preset,
  },
  {
    label: '固定标的池',
    value: PoolTypeEnum.custom,
  },
]

const tickerSourceOptions = [
  {
    label: '手动输入',
    value: PoolSourceType.manual_list,
  },
  {
    label: '变量引用',
    value: PoolSourceType.variable_ref,
  },
]

const presetCodeOptions = [
  {
    label: '全市场',
    value: 'entire_market',
  },
]

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

const filterVar = (varPayload: Var) => {
  return varPayload.type === VarType.arrayString
}

const {
  readOnly,
  updatePoolType,
  updateCustomPoolTickers,
  updateCustomPoolSourceType,
  updateCustomPoolReferencePath,
  updatePresetCode,
  updateStartDate,
  updateEndDate,
  updatePriceType,
  updateExecutionSignals,
  updateRiskControl,
} = useConfig(props.id, payload)
</script>

<style scoped>
</style>