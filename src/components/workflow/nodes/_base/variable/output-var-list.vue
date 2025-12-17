<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center space-x-1"
    >
      <el-input
        :ref="(el: InputInstance | null) => setInputRef(index, el)"
        :model-value="item.variable"
        :readonly="readonly"
        :class="['grow']"
        @input="(value: string) => handleVarNameInput(index, value)"
      />
      <VarTypePicker
        :readonly="readonly"
        :value="item.variable_type || ''"
        @change="(value: string) => handleVarTypeChange(index, value)"
      />
      <RemoveButton
        @click="handleVarRemove(index)"
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
import type { OutputVar } from '@/components/workflow/nodes/code/types'
import RemoveButton from '@/components/base/remove-button/index.vue'
import VarTypePicker from '@/components/workflow/nodes/_base/variable/var-type-picker.vue'
import type { VarType } from '@/types'
import { checkKeys, replaceSpaceWithUnderscoreInVarNameInput } from '@/utils/var'

/**
 * 输出变量列表组件的属性定义
 */
interface Props {
  /** 是否只读 */
  readonly: boolean
  /** 输出变量对象 */
  outputs: OutputVar
  /** 输出键的顺序数组 */
  outputKeyOrders: string[]
}

const emit = defineEmits<{
  (e: 'change', payload: OutputVar, changedIndex?: number, newKey?: string): void
  (e: 'remove', index: number): void
}>()

const props = defineProps<Props>()

const { t } = useI18n()

const inputRefs = ref<Record<number, InputInstance>>({})

const setInputRef = (index: number, el: InputInstance | null) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const list = computed(() => {
  return props.outputKeyOrders.map((key) => {
    return {
      variable: key,
      variable_type: props.outputs[key]?.type,
    }
  })
})

const validateVarInput = debounce((existingVariables: typeof list.value, newKey: string) => {
  const { isValid, errorKey, errorMessageKey } = checkKeys([newKey], true)
  if (!isValid) {
    ElNotification({
      type: 'error',
      message: t(`appDebug.varKeyError.${errorMessageKey}`, { key: errorKey }),
    })
    return
  }
  if (existingVariables.some(key => key.variable?.trim() === newKey.trim())) {
    ElNotification({
      type: 'error',
      message: t('appDebug.varKeyError.keyAlreadyExists', { key: newKey }),
    })
  }
}, 500)

const handleVarNameInput = (index: number, value: string) => {
  const inputInstance = inputRefs.value[index]
  if (inputInstance) {
    const inputElement = inputInstance.$el?.querySelector('input') as HTMLInputElement
    if (inputElement) {
      replaceSpaceWithUnderscoreInVarNameInput(inputElement)
      const oldKey = list.value[index]!.variable
      const newKey = inputElement.value
      validateVarInput(cloneDeep(list.value).splice(index, 1), newKey)
      const newOutputs = cloneDeep(props.outputs)
      emit('change', newOutputs, index, newKey)
      newOutputs[newKey] = newOutputs[oldKey]!
      delete newOutputs[oldKey]
    }
  }
}

const handleVarTypeChange = (index: number, value: string) => {
  const key = list.value[index]!.variable
  const newOutputs = cloneDeep(props.outputs)
  newOutputs[key]!.type = value as VarType
  emit('change', newOutputs)
}

const handleVarRemove = (index: number) => {
  emit('remove', index)
}
</script>

