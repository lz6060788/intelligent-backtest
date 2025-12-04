<template>
  <div class="flex cursor-pointer items-center grow">
    <el-popover
      v-model:visible="numberVarTypeVisible"
      placement="bottom-start"
      :offset="2"
      trigger="click"
      teleported
      :persistent="false"
      :show-arrow="false"
      popper-class="custom-popover"
    >
      <template #reference>
        <el-button
          class="shrink-0"
          size="small"
        >
          {{ capitalize(numberVarType) }}
          <RiArrowDownSLine class="ml-[1px] h-3.5 w-3.5" />
        </el-button>
      </template>
      <div class="z-[1000] w-[112px] rounded-xl popper-default p-1 shadow-lg">
        <div
          v-for="option in options"
          :key="option"
          :class="cn(
            'flex h-7 cursor-pointer items-center rounded-md px-1 mb-1 last:mb-0 hover:bg-gray-600',
            'text-[13px] font-medium text-text-secondary',
            numberVarType === option && 'bg-gray-600',
          )"
          @click="handleNumberVarTypeChange(option)"
        >
          {{ capitalize(option) }}
        </div>
      </div>
    </el-popover>
    <div class="mx-1 h-4 w-[1px] bg-divider-regular"></div>
    <div class="ml-0.5 grow w-0">
      <template v-if="numberVarType === NumberVarType.variable">
        <el-popover
          v-model:visible="variableSelectorVisible"
          placement="bottom-end"
          :offset="8"
          trigger="click"
          teleported
          :persistent="false"
          :show-arrow="false"
          popper-class="custom-popover"
          width="320px"
        >
          <template #reference>
            <div class="w-full cursor-pointer">
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
                <Variable02 class="mr-1 h-4 w-4 shrink-0" />
                <div class="w-0 grow truncate">{{ t('workflow.nodes.ifElse.selectVariable') }}</div>
              </div>
            </div>
          </template>
          <div :class="cn('z-[1000] w-[296px] popper-default p-1', isShort && 'w-[200px]')">
            <VarReferenceVars
              :vars="variables"
              @change="handleSelectVariable"
            />
          </div>
        </el-popover>
      </template>
      <template v-if="numberVarType === NumberVarType.constant">
        <div class="relative">
          <el-input-number
            :model-value="value"
            @input="(value: string) => emit('valueChange', value)"
            :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
            @focus="isFocus = true"
            @blur="isFocus = false"
            controls-position="right"
            size="small"
            class="w-full"
          >
            <template v-if="!isFocus && unit" #suffix>
              <span class="text-text-tertiary">
                {{ unit }}
              </span>
            </template>
          </el-input-number>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiArrowDownSLine } from '@remixicon/vue'
import { capitalize } from 'lodash-es'
import { VarType as NumberVarType } from '../../tool/types'
import VariableTag from '@/components/workflow/nodes/_base/variable-tag/index.vue'
import cn from '@/utils/classnames'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
} from '@/types'
import { VarType } from '@/types'
import { variableTransformer } from '@/components/workflow/utils'
import { Variable02 } from '@/components/base/icons/src/vender/solid/development'

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
  /** 值 */
  value: string
  /** 变量列表 */
  variables: NodeOutPutVar[]
  /** 是否短样式 */
  isShort?: boolean
  /** 单位 */
  unit?: string
}

const emit = defineEmits<{
  (e: 'numberVarTypeChange', v: NumberVarType): void
  (e: 'valueChange', v: string): void
}>()

const props = withDefaults(defineProps<ConditionNumberInputProps>(), {
  numberVarType: NumberVarType.constant,
})

const { t } = useI18n()
const numberVarTypeVisible = ref(false)
const variableSelectorVisible = ref(false)
const isFocus = ref(false)

const handleNumberVarTypeChange = (option: NumberVarType) => {
  emit('numberVarTypeChange', option)
  numberVarTypeVisible.value = false
}

const handleSelectVariable = (valueSelector: ValueSelector) => {
  emit('valueChange', variableTransformer(valueSelector) as string)
  variableSelectorVisible.value = false
}
</script>

