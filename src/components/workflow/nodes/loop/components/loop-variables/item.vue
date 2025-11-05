<template>
  <div class="mb-4 flex last-of-type:mb-0">
    <div class="w-0 grow">
      <div class="mb-1 grid grid-cols-3 gap-1">
        <Input
          :value="item.label"
          @input="handleUpdateItemLabel"
          @blur="(e: any) => checkVariableName(e.target.value)"
          :auto-focus="!item.label"
          :placeholder="t('workflow.nodes.loop.variableName')"
        />
        <VariableTypeSelect
          :value="item.var_type"
          @change="handleUpdateItemVarType"
        />
        <InputModeSelect
          :value="item.value_type"
          @change="handleUpdateItemValueType"
        />
      </div>
      <div>
        <FormItem
          :node-id="nodeId"
          :item="item"
          @change="handleUpdateItemValue"
        />
      </div>
    </div>
    <ActionButton
      class="shrink-0"
      size="l"
      @click="handleRemoveLoopVariable(item.id)"
    >
      <RiDeleteBinLine class="h-4 w-4 text-text-tertiary" />
    </ActionButton>
  </div>
</template>

<script setup lang="ts">
import { RiDeleteBinLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import InputModeSelect from './input-mode-selec.vue'
import VariableTypeSelect from './variable-type-select.vue'
import FormItem from './form-item.vue'
import ActionButton from '@/components/base/action-button.vue'
import Input from '@/components/base/input/index.vue'
import type {
  LoopVariable,
  LoopVariablesComponentShape,
} from '@/components/workflow/nodes/loop/type'
import { checkKeys, replaceSpaceWithUnderscoreInVarNameInput } from '@/utils/var'
import Toast from '@/components/base/toast'
import { ValueType, VarType } from '@/types'

/**
 * 项组件的属性定义
 */
interface ItemProps {
  /** 循环变量项 */
  item: LoopVariable
} & LoopVariablesComponentShape

const props = defineProps<ItemProps>()

const { t } = useI18n()

const checkVariableName = (value: string) => {
  const { isValid, errorMessageKey } = checkKeys([value], false)
  if (!isValid) {
    Toast.notify({
      type: 'error',
      message: t(`appDebug.varKeyError.${errorMessageKey}`, { key: t('workflow.env.modal.name') }),
    })
    return false
  }
  return true
}

const handleUpdateItemLabel = (e: any) => {
  replaceSpaceWithUnderscoreInVarNameInput(e.target)
  if (!!e.target.value && !checkVariableName(e.target.value))
    return
  props.handleUpdateLoopVariable(props.item.id, { label: e.target.value })
}

const getDefaultValue = (varType: VarType, valueType: ValueType) => {
  if (valueType === ValueType.variable)
    return undefined
  switch (varType) {
    case VarType.boolean:
      return false
    case VarType.arrayBoolean:
      return [false]
    default:
      return undefined
  }
}

const handleUpdateItemVarType = (value: any) => {
  props.handleUpdateLoopVariable(props.item.id, { var_type: value, value: getDefaultValue(value, props.item.value_type) })
}

const handleUpdateItemValueType = (value: any) => {
  props.handleUpdateLoopVariable(props.item.id, { value_type: value, value: getDefaultValue(props.item.var_type, value) })
}

const handleUpdateItemValue = (value: any) => {
  props.handleUpdateLoopVariable(props.item.id, { value })
}
</script>

