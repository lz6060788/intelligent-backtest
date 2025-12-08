<template>
  <div class="mb-4 flex last-of-type:mb-0">
    <div v-if="isFixed" class="text-text-secondary pr-2 w-14 truncate">{{ item.name }}</div>
    <div class="w-0 grow mr-1">
      <div class="mb-1 grid grid-cols-2 gap-1 grid-template-columns: repeat(2, 1fr);">
        <VariableTypeSelect
          :value="item.type"
          :template="argumentTemplate!"
          @change="handleUpdateItemVarType"
        />
        <InputModeSelect
          :value="item.isConst"
          :template="argumentTemplate!"
          @change="handleUpdateItemIsConst"
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
      v-if="!isFixed"
      @click="handleRemoveVariable(item.id)"
    ></RemoveButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InputModeSelect from './input-mode-selec.vue'
import VariableTypeSelect from './variable-type-select.vue'
import FormItem from './form-item.vue'
import RemoveButton from '@/components/base/remove-button/index.vue'
import { CalculatorArgumentValueTypeEnum } from '../../constant/enums'
import type {
  CalculatorVariable,
  CalculatorArgument,
} from '../../types'
import { computed } from 'vue'

/**
 * 项组件的属性定义
 */
interface ItemProps {
  nodeId: string;
  isFixed: boolean;
  /** 循环变量项 */
  item: CalculatorVariable
  argumentsTemplate: CalculatorArgument[];
}

const props = defineProps<ItemProps>()
const emit = defineEmits<{
  (e: 'remove-variable', id: string): void
  (e: 'update-variable', id: string, updateData: Partial<CalculatorVariable>): void
}>()

const handleRemoveVariable = (id: string) => {
  emit('remove-variable', id)
}

const handleUpdateVariable = (id: string, updateData: Partial<CalculatorVariable>) => {
  emit('update-variable', id, updateData)
}

const getDefaultValue = (varType: CalculatorArgumentValueTypeEnum, isConst: boolean) => {
  if (!isConst)
    return undefined
  switch (varType) {
    case CalculatorArgumentValueTypeEnum.BOOL:
      return false
    default:
      return undefined
  }
}

const handleUpdateItemVarType = (value: CalculatorArgumentValueTypeEnum) => {
  handleUpdateVariable(props.item.id, { type: value, value: getDefaultValue(value, props.item.isConst) })
}

const handleUpdateItemIsConst = (value: boolean) => {
  handleUpdateVariable(props.item.id, { isConst: value, value: getDefaultValue(props.item.type, value) })
}

const handleUpdateItemValue = (value: any) => {
  handleUpdateVariable(props.item.id, { value })
}

const argumentTemplate = computed(() => {
  if (props.isFixed) {
    return props.argumentsTemplate.find(item => item.name === props.item.name)
  }
  return props.argumentsTemplate[0]
})
</script>

