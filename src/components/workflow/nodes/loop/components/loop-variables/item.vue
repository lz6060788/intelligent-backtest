<template>
  <div class="mb-4 flex last-of-type:mb-0">
    <div class="w-0 grow mr-1">
      <div class="mb-1 grid grid-cols-3 gap-1 grid-template-columns: repeat(3, 1fr);">
        <el-input
          :model-value="item.label"
          @input="handleUpdateItemLabel"
          @blur="(e: any) => checkVariableName(e.target.value)"
          :auto-focus="!item.label"
          :placeholder="t('workflow.nodes.loop.variableName')"
          class="w-full"
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
    <RemoveButton
      @click="handleRemoveLoopVariable(item.id)"
    ></RemoveButton>
  </div>
</template>

<script setup lang="ts">
import { RiDeleteBinLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import InputModeSelect from './input-mode-selec.vue'
import VariableTypeSelect from './variable-type-select.vue'
import FormItem from './form-item.vue'
import ActionButton from '@/components/base/action-button/index.vue'
import RemoveButton from '@/components/base/remove-button/index.vue'
import type {
  LoopVariable,
  LoopVariablesComponentShape,
} from '@/components/workflow/nodes/loop/type'
import { checkKeys, replaceSpaceWithUnderscoreForValue } from '@/utils/var'
import { ValueType, VarType } from '@/types'
import { ElNotification } from 'element-plus'

/**
 * 项组件的属性定义
 */
interface ItemProps extends LoopVariablesComponentShape {
  /** 循环变量项 */
  item: LoopVariable
}

const props = defineProps<ItemProps>()
const emit = defineEmits<{
  (e: 'remove-loop-variable', id: string): void
  (e: 'update-loop-variable', id: string, updateData: Partial<LoopVariable>): void
}>()

const handleRemoveLoopVariable = (id: string) => {
  emit('remove-loop-variable', id)
}

const handleUpdateLoopVariable = (id: string, updateData: Partial<LoopVariable>) => {
  emit('update-loop-variable', id, updateData)
}

const { t } = useI18n()

const checkVariableName = (value: string) => {
  const { isValid, errorMessageKey } = checkKeys([value], false)
  if (!isValid) {
    ElNotification.error(t(`appDebug.varKeyError.${errorMessageKey}`, { key: t('workflow.env.modal.name') }))
    return false
  }
  return true
}

const handleUpdateItemLabel = (value: string) => {
  replaceSpaceWithUnderscoreForValue(value)
  if (!!value && !checkVariableName(value))
    return
  handleUpdateLoopVariable(props.item.id, { label: value })
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
  handleUpdateLoopVariable(props.item.id, { var_type: value, value: getDefaultValue(value, props.item.value_type) })
}

const handleUpdateItemValueType = (value: any) => {
  handleUpdateLoopVariable(props.item.id, { value_type: value, value: getDefaultValue(props.item.var_type, value) })
}

const handleUpdateItemValue = (value: any) => {
  handleUpdateLoopVariable(props.item.id, { value })
}
</script>

