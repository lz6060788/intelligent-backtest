<template>
  <div class="space-y-2">
    <div
      v-for="(variable, index) in list"
      :key="index"
      class="group relative flex items-center space-x-1 max-w-full"
    >
      <el-input
        :ref="(el: InputInstance | null) => setInputRef(index, el)"
        :model-value="variable.variable"
        :disabled="readonly"
        :placeholder="t('workflow.common.variableNamePlaceholder') || ''"
        class="w-[120px] shrink-0"
        @input="handleVarNameChange(index, $event)"
      />
      <VarReferencePicker
        :node-id="nodeId"
        :readonly="readonly"
        :is-show-node-name="true"
        class="grow overflow-hidden"
        :value="variable.variable_type === VarKindType.constant ? (variable.value || '') : (variable.value_selector || [])"
        :is-support-constant-value="isSupportConstantValue"
        :default-var-kind-type="variable.variable_type"
        :only-leaf-node-var="onlyLeafNodeVar"
        :filter-var="filterVar"
        :is-support-file-var="isSupportFileVar"
        @change="(value: ValueSelector | string | number, varKindType: VarKindType, varInfo?: Var) => handleVarReferenceChange(index)(value, varKindType, varInfo)"
      />
      <RemoveButton
        v-if="!readonly"
        @click="handleVarRemove(index)"
        class="shrink-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import type { InputInstance } from 'element-plus'
import { cloneDeep, debounce } from 'lodash-es'
import RemoveButton from '@/components/base/remove-button/index.vue'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import type { ValueSelector, Var, Variable } from '@/types'
import { VarType as VarKindType } from '@/components/workflow/nodes/tool/types'
import { checkKeys, replaceSpaceWithUnderscoreInVarNameInput } from '@/utils/var'

/**
 * 变量列表组件的属性定义
 */
interface Props {
  /** 节点ID */
  nodeId: string
  /** 是否只读 */
  readonly: boolean
  /** 变量列表 */
  list: Variable[]
  /** 是否支持常量值 */
  isSupportConstantValue?: boolean
  /** 是否只显示叶子节点变量 */
  onlyLeafNodeVar?: boolean
  /** 变量过滤函数 */
  filterVar?: (payload: Var, valueSelector: ValueSelector) => boolean
  /** 是否支持文件变量 */
  isSupportFileVar?: boolean
}

const emit = defineEmits<{
  (e: 'change', list: Variable[]): void
  (e: 'var-name-change', oldName: string, newName: string): void
}>()
const props = withDefaults(defineProps<Props>(), {
  isSupportFileVar: true,
})

const { t } = useI18n()

const inputRefs = ref<Record<number, InputInstance>>({})

const setInputRef = (index: number, el: InputInstance | null) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const validateVarInput = debounce((list: Variable[], newKey: string) => {
  const { isValid, errorKey, errorMessageKey } = checkKeys([newKey], true)
  if (!isValid) {
    ElNotification({
      type: 'error',
      message: t(`appDebug.varKeyError.${errorMessageKey}`, { key: errorKey }),
    })
    return
  }
  if (list.some(item => item.variable?.trim() === newKey.trim())) {
    ElNotification({
      type: 'error',
      message: t('appDebug.varKeyError.keyAlreadyExists', { key: newKey }),
    })
  }
}, 500)

const handleVarNameChange = (index: number, value: string) => {
  const inputInstance = inputRefs.value[index]
  if (inputInstance) {
    const inputElement = inputInstance.$el?.querySelector('input') as HTMLInputElement
    if (inputElement) {
      replaceSpaceWithUnderscoreInVarNameInput(inputElement)
      const newKey = inputElement.value

      validateVarInput(cloneDeep(props.list).splice(index, 1), newKey)

      emit('var-name-change', props.list[index]!.variable, newKey)
      const newList = cloneDeep(props.list)
      newList[index]!.variable = newKey
      emit('change', newList)
    }
  }
}

const handleVarReferenceChange = (index: number) => {
  return (value: ValueSelector | string | number, varKindType: VarKindType, varInfo?: Var) => {
    const draft = cloneDeep(props.list)
    if (!props.isSupportConstantValue || varKindType === VarKindType.variable) {
      draft[index]!.value_selector = value as ValueSelector
      draft[index]!.value_type = varInfo?.type
      if (props.isSupportConstantValue)
        draft[index]!.variable_type = VarKindType.variable

      if (!draft[index]!.variable) {
        const variables = draft.map(v => v.variable)
        let newVarName = (value as ValueSelector)[(value as ValueSelector).length - 1]
        let count = 1
        while (variables.includes(newVarName!)) {
          newVarName = `${(value as ValueSelector)[(value as ValueSelector).length - 1]}_${count}`
          count++
        }
        draft[index]!.variable = newVarName!
      }
    }
    else {
      draft[index]!.variable_type = VarKindType.constant
      draft[index]!.value_selector = value as ValueSelector
      draft[index]!.value = value as string
    }
    emit('change', draft)
  }
}

const handleVarRemove = (index: number) => {
  const newList = cloneDeep(props.list)
  newList.splice(index, 1)
  emit('change', newList)
}
</script>

