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
import { produce } from 'immer'
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
  /** 变化回调 */
  onChange: (payload: OutputVar, changedIndex?: number, newKey?: string) => void
  /** 删除回调 */
  onRemove: (index: number) => void
}

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
      console.log('oldKey', oldKey)
      console.log('newKey', newKey)
      console.log('list', list.value)
      validateVarInput(cloneDeep(list.value).splice(index, 1), newKey)
      console.log('props.outputs', props.outputs)
      const newOutputs = produce(props.outputs, (draft) => {
        draft[newKey] = draft[oldKey]!
        delete draft[oldKey]
      })
      props.onChange(newOutputs, index, newKey)
    }
  }
}

const handleVarTypeChange = (index: number, value: string) => {
  console.log('handleVarTypeChange', index, value)
  const key = list.value[index]!.variable
  const newOutputs = produce(props.outputs, (draft) => {
    draft[key]!.type = value as VarType
  })
  props.onChange(newOutputs)
}

const handleVarRemove = (index: number) => {
  props.onRemove(index)
}
</script>

