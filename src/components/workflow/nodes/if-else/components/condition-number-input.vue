<template>
  <div class="flex cursor-pointer items-center">
    <PortalToFollowElem
      :open="numberVarTypeVisible"
      @update:open="setNumberVarTypeVisible"
      placement="bottom-start"
      :offset="{ mainAxis: 2, crossAxis: 0 }"
    >
      <PortalToFollowElemTrigger @click="setNumberVarTypeVisible(!numberVarTypeVisible)">
        <Button
          class="shrink-0"
          variant="ghost"
          size="small"
        >
          {{ capitalize(numberVarType) }}
          <i class="i-ri-arrow-down-s-line ml-[1px] h-3.5 w-3.5" />
        </Button>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent class="z-[1000]">
        <div class="w-[112px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg">
          <div
            v-for="option in options"
            :key="option"
            :class="cn(
              'flex h-7 cursor-pointer items-center rounded-md px-3 hover:bg-state-base-hover',
              'text-[13px] font-medium text-text-secondary',
              numberVarType === option && 'bg-state-base-hover',
            )"
            @click="() => {
              onNumberVarTypeChange(option)
              setNumberVarTypeVisible(false)
            }"
          >
            {{ capitalize(option) }}
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
    <div class="mx-1 h-4 w-[1px] bg-divider-regular" />
    <div class="ml-0.5 w-0 grow">
      <template v-if="numberVarType === NumberVarType.variable">
        <PortalToFollowElem
          :open="variableSelectorVisible"
          @update:open="setVariableSelectorVisible"
          placement="bottom-start"
          :offset="{ mainAxis: 2, crossAxis: 0 }"
        >
          <PortalToFollowElemTrigger
            class="w-full"
            @click="setVariableSelectorVisible(!variableSelectorVisible)"
          >
            <VariableTag
              v-if="value"
              :value-selector="variableTransformer(value) as string[]"
              :var-type="VarType.number"
              :is-short="isShort"
            />
            <div
              v-else
              class="flex h-6 items-center p-1 text-[13px] text-components-input-text-placeholder"
            >
              <i class="i-ri-variable-line mr-1 h-4 w-4 shrink-0" />
              <div class="w-0 grow truncate">{{ t('workflow.nodes.ifElse.selectVariable') }}</div>
            </div>
          </PortalToFollowElemTrigger>
          <PortalToFollowElemContent class="z-[1000]">
            <div :class="cn('w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur pt-1 shadow-lg', isShort && 'w-[200px]')">
              <VarReferenceVars
                :vars="variables"
                @change="handleSelectVariable"
              />
            </div>
          </PortalToFollowElemContent>
        </PortalToFollowElem>
      </template>
      <template v-if="numberVarType === NumberVarType.constant">
        <div class="relative">
          <input
            :class="cn('block w-full appearance-none bg-transparent px-2 text-[13px] text-components-input-text-filled outline-none placeholder:text-components-input-text-placeholder', unit && 'pr-6')"
            type="number"
            :value="value"
            @input="(e) => onValueChange((e.target as HTMLInputElement).value)"
            :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
            @focus="isFocus = true"
            @blur="isFocus = false"
          >
          <div
            v-if="!isFocus && unit"
            class="system-sm-regular absolute right-2 top-[50%] translate-y-[-50%] text-text-tertiary"
          >
            {{ unit }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { capitalize } from 'lodash-es'
import { ValueType as NumberVarType } from '@/types'
import VariableTag from '@/app/components/workflow/nodes/_base/components/variable-tag'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import Button from '@/app/components/base/button'
import cn from '@/utils/classnames'
import VarReferenceVars from '@/app/components/workflow/nodes/_base/components/variable/var-reference-vars'
import type {
  NodeOutPutVar,
  ValueSelector,
} from '@/types'
import { VarType } from '@/types'
import { variableTransformer } from '@/components/workflow/utils'

const options = [
  NumberVarType.variable,
  NumberVarType.constant,
]

/**
 * 条件数字输入组件的属性定义
 */
interface ConditionNumberInputProps {
  /** 数字变量类型 */
  numberVarType?: NumberVarType
  /** 数字变量类型变化回调 */
  onNumberVarTypeChange: (v: NumberVarType) => void
  /** 值 */
  value: string
  /** 值变化回调 */
  onValueChange: (v: string) => void
  /** 变量列表 */
  variables: NodeOutPutVar[]
  /** 是否短样式 */
  isShort?: boolean
  /** 单位 */
  unit?: string
}

const props = withDefaults(defineProps<ConditionNumberInputProps>(), {
  numberVarType: NumberVarType.constant,
})

const { t } = useI18n()
const numberVarTypeVisible = ref(false)
const variableSelectorVisible = ref(false)
const isFocus = ref(false)

const setNumberVarTypeVisible = (value: boolean) => {
  numberVarTypeVisible.value = value
}

const setVariableSelectorVisible = (value: boolean) => {
  variableSelectorVisible.value = value
}

const handleSelectVariable = (valueSelector: ValueSelector) => {
  props.onValueChange(variableTransformer(valueSelector) as string)
  setVariableSelectorVisible(false)
}
</script>

