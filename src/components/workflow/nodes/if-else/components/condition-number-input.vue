<template>
  <div class="flex cursor-pointer items-center">
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
          link
        >
          {{ capitalize(numberVarType) }}
          <RiArrowDownSLine class='ml-[1px] h-3.5 w-3.5' />
        </el-button>
      </template>
      <div class="z-[1000] w-[112px] rounded-xl border-[0.5px] popper-custom p-1 shadow-dark shadow-sm">
        <div
          v-for="option in options"
          :key="option"
          :class="cn(
            'flex h-7 cursor-pointer items-center rounded-md px-3 hover:bg-gray-600',
            'text-[13px] font-medium text-text-secondary mb-px',
            numberVarType === option && 'bg-gray-600',
          )"
          @click="() => {
            emit('numberVarTypeChange', option)
            setNumberVarTypeVisible(false)
          }"
        >
          {{ capitalize(option) }}
        </div>
      </div>
    </el-popover>
    <div class="mx-1 h-4 w-[1px] bg-divider-regular" />
    <div class="ml-0.5 w-0 grow">
      <template v-if="numberVarType === NumberVarType.variable">
        <el-popover
          v-model:visible="variableSelectorVisible"
          placement="bottom-start"
          :offset="2"
          trigger="click"
          teleported
          :persistent="false"
          :show-arrow="false"
          popper-class="custom-popover"
        >
          <template #reference>
            <VariableTag
              v-if="value"
              :value-selector="variableTransformer(value) as string[]"
              :var-type="VarType.number"
              :is-short="isShort"
            />
          </template>
          <div class="z-[1000] w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur pt-1 shadow-lg">
            <div :class="cn('w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur pt-1 shadow-lg', isShort && 'w-[200px]')">
              <VarReferenceVars
                :vars="variables"
                @change="handleSelectVariable"
              />
            </div>
          </div>
        </el-popover>
      </template>
      <template v-if="numberVarType === NumberVarType.constant">
        <div class="relative">
          <el-input-number
            :model-value="+value"
            size="small"
            style="width: 100%; text-align: left;"
            @change="(value: string) => emit('valueChange', value)"
            :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
            @focus="isFocus = true"
            @blur="isFocus = false"
          />
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
import { VarType as NumberVarType } from '../../tool/types'
import { VarType } from '@/types'
import VariableTag from '@/components/workflow/nodes/_base/variable-tag/index.vue'
import cn from '@/utils/classnames'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
} from '@/types'
import { variableTransformer } from '@/components/workflow/utils'
import { RiArrowDownSLine } from '@remixicon/vue'

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
  (e: 'numberVarTypeChange', value: NumberVarType): void
  (e: 'valueChange', value: string): void
}>()

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
  emit('valueChange', variableTransformer(valueSelector) as string)
  setVariableSelectorVisible(false)
}
</script>

