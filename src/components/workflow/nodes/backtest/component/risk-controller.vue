<template>
  <Field class-name="mb-2">
    <template #title>
      <div class="pl-3">{{ t(`${i18nPrefix}.title`) }}</div>
    </template>
    <div class="px-4 text-text-secondary text-xs">
      <div
        v-for="(item, index) in riskControlItemEntries"
        :key="item[0]"
        class="flex gap-2 mb-2 last-of-type:mb-0 rounded-md px-2 py-1"
        :class="{ 'bg-[#4b1515]': deleteIndex === index }"
      >
        <div class="flex-1">
          <div class="grid grid-cols-3 gap-2 mb-2">
            <p class="w-28 mr-1 col-span-1 leading-8">{{ t(`${i18nPrefix}.${item[0]}`) }}</p>
            <el-select
              :disabled="readOnly"
              :model-value="item[1].type"
              class="col-span-2"
              @update:model-value="handleTypeChange(item[0] as RiskControlItemEnum, $event)"
            >
              <el-option
                v-for="item in riskControlItemTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-1"></div>
            <div class="col-span-2">
              <VarReferencePicker
                  v-if="item[1].type === RiskControlItemTypeEnum.variable"
                  class="w-full"
                  :readonly="readOnly"
                  :node-id="nodeId"
                  :is-show-node-name="true"
                  :value="item[1].value"
                  @change="handleRiskVariableValueChange(item[0] as RiskControlItemEnum, $event)"
                  :filter-var="filterVar"
                  :placeholder="t(`${i18nPrefix}.variablePlaceholder`)"
                ></VarReferencePicker>
                <el-input
                  v-else
                  :disabled="readOnly"
                  type="number"
                  class="w-full"
                  :model-value="item[1].value"
                  :placeholder="t(`${i18nPrefix}.${item[0]}Placeholder`)"
                  @input="(v: number) => handleRiskConstantValueChange(item[0] as RiskControlItemEnum, v)"
                />
            </div>
          </div>
        </div>
        <remove-button
          class="shrink-0"
          @click="removeRiskControlItem(item[0] as RiskControlItemEnum)"
          @mouseenter="deleteIndex = index"
          @mouseleave="deleteIndex = -1"
        ></remove-button>
      </div>
      <el-dropdown
        :disabled="readOnly"
        trigger="click"
        :show-arrow="false"
        class="w-full"
        :offset="0"
        :popper-class="cn('z-[1000]', 'min-w-[368px] max-w-[400px]')"
      >
        <el-button v-show="leftRiskControlItemOptions.length > 0" class="w-full">
          <RiAddLine class="mr-1 h-4 w-4" />
          {{ t(`${i18nPrefix}.addRiskControlItem`) }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in leftRiskControlItemOptions" :key="item.value" @click="addRiskControlItem(item)">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { type RiskControl, RiskControlItemEnum, RiskControlItemTypeEnum } from '../types';
import { computed, ref } from 'vue';
import cn from '@/utils/classnames'
import { RiAddLine } from '@remixicon/vue'
import { ElNotification } from 'element-plus';
import { VarType, type ValueSelector, type Var } from '@/types';
import { cloneDeep } from 'lodash-es';

const { t } = useI18n()

const i18nPrefix = 'workflow.nodes.backtest.risk_control'

const props = defineProps<{
  nodeId: string
  risk_control: RiskControl
  readOnly: boolean
}>()

const emit = defineEmits<{
  (e: 'updateRiskControl', value: RiskControl): void
}>()


const riskControlItemEntries = computed(() => {
  return Object.entries(props.risk_control)
})

const riskControlItemOptions = [
  {
    label: t(`${i18nPrefix}.stop_loss`),
    value: RiskControlItemEnum.stop_loss,
  },
  {
    label: t(`${i18nPrefix}.take_profit`),
    value: RiskControlItemEnum.take_profit,
  },
  {
    label: t(`${i18nPrefix}.max_hold_days`),
    value: RiskControlItemEnum.max_hold_days,
  },
  {
    label: t(`${i18nPrefix}.max_drawdown`),
    value: RiskControlItemEnum.max_drawdown,
  },
]

const leftRiskControlItemOptions = computed(() => {
  return riskControlItemOptions.filter(item => !Object.keys(props.risk_control).includes(item.value))
})

const addRiskControlItem = (item: { label: string, value: RiskControlItemEnum }) => {
  emit('updateRiskControl', {
    ...props.risk_control,
    [item.value]: {
      type: RiskControlItemTypeEnum.constant,
      value: 0,
    },
  })
}

const riskControlItemTypeOptions = [
  {
    label: t(`${i18nPrefix}.constant`),
    value: RiskControlItemTypeEnum.constant,
  },
  {
    label: t(`${i18nPrefix}.variable`),
    value: RiskControlItemTypeEnum.variable,
  },
]

const handleTypeChange = (key: RiskControlItemEnum, value: RiskControlItemTypeEnum) => {
  emit('updateRiskControl', {
    ...props.risk_control,
    [key]: {
      ...props.risk_control[key],
      type: value,
      value: value === RiskControlItemTypeEnum.constant ? 0 : [],
    },
  })
}

const handleRiskConstantValueChange = (key: RiskControlItemEnum, value: number) => {
  if (Number.isNaN(+value)) {
    ElNotification.error(t(`${i18nPrefix}.notNumber`, { field: t(`${i18nPrefix}.${key}`) }))
    return
  }
  emit('updateRiskControl', {
    ...props.risk_control,
    [key]: {
      ...props.risk_control[key],
      value: +value,
    },
  })
}

const handleRiskVariableValueChange = (key: RiskControlItemEnum, value: ValueSelector) => {
  emit('updateRiskControl', {
    ...props.risk_control,
    [key]: {
      ...props.risk_control[key],
      value: value,
    },
  })
}

const filterVar = (variable: Var) => {
  return [VarType.number, VarType.integer].includes(variable.type)
}

const removeRiskControlItem = (key: RiskControlItemEnum) => {
  const new_risk_control = cloneDeep(props.risk_control)
  delete new_risk_control[key]
  emit('updateRiskControl', new_risk_control)
}

// 悬浮样式
const deleteIndex = ref(-1)
</script>

<style scoped>
</style>