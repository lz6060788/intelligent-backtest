<template>
  <Field
    class="group"
  >
    <template #title>
      <template v-if="groupEnabled">
        <div class="flex items-center">
          <div class="flex items-center !normal-case">
            <Folder class="mr-0.5 h-3.5 w-3.5" />
            <template v-if="!isEditGroupName">
              <div
                class="system-sm-semibold flex h-6 cursor-text items-center rounded-lg px-1 text-text-secondary hover:bg-gray-600"
                @click="setEditGroupName"
              >
                {{ payload.group_name }}
              </div>
            </template>
            <template v-else>
              <el-input
                ref="inputRef"
                :model-value="payload.group_name"
                @input="(val: string) => handleGroupNameChange(val)"
                @blur="setNotEditGroupName"
                size="small"
              />
            </template>
          </div>
          <div
            v-if="canRemove"
            class="ml-0.5 h-6 hidden cursor-pointer rounded-md p-1 text-text-tertiary hover:bg-red-500 hover:text-white group-hover:block"
            @click="onRemove"
          >
            <RiDeleteBinLine class="h-4 w-4" />
          </div>
        </div>
      </template>
      <template v-else>
        {{ t(`${i18nPrefix}.title`) }}
      </template>
    </template>
    <template #operations>
      <div class="flex h-6 items-center space-x-2">
        <div
          v-if="payload.variables.length > 0"
          class="text-xs flex h-[18px] items-center rounded-[5px] border-[0.5px] border-solid border-gray-600 px-2 text-text-tertiary uppercase"
        >
          {{ payload.output_type }}
        </div>
        <VarReferencePicker
          v-if="!readOnly"
          :is-add-btn-trigger="true"
          :readonly="false"
          :node-id="nodeId"
          :is-show-node-name="true"
          :value="[]"
          @change="handleAddVariable"
          :default-var-kind-type="VarKindType.variable!"
          :filter-var="filterVar"
          :available-vars="availableVars"
        />
      </div>
    </template>
    <VarList
      :readonly="readOnly"
      :node-id="nodeId"
      :list="payload.variables"
      @change="handleListChange"
      :filter-var="filterVar"
    />
  </Field>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { produce } from 'immer'
import { RiDeleteBinLine } from '@remixicon/vue'
import type { VarGroupItem as VarGroupItemType } from '../types'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import VarList from './var-list/index.vue'
import Field from '@/components/base/field.vue'
import { VarType } from '@/types'
import type { NodeOutPutVar, ValueSelector, Var } from '@/types'
import { VarType as VarKindType } from '../../tool/types'
import { Folder } from '@/components/base/icons/src/vender/line/files'
import { checkKeys, replaceSpaceWithUnderscoreForValue } from '@/utils/var'
import { ElNotification } from 'element-plus'

const i18nPrefix = 'workflow.nodes.variableAssigner'

type Payload = VarGroupItemType & {
  group_name?: string
}

interface Props {
  readOnly: boolean
  nodeId: string
  payload: Payload
  groupEnabled: boolean
  canRemove?: boolean
  availableVars: NodeOutPutVar[]
}

const emit = defineEmits<{
  (e: 'change', newPayload: Payload): void
  (e: 'groupNameChange', value: string): void
  (e: 'remove'): void
}>()

const props = defineProps<Props>()

const { t } = useI18n()
const inputRef = ref<HTMLInputElement | null>(null)
const isEditGroupName = ref(false)

const setEditGroupName = () => {
  isEditGroupName.value = true
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const setNotEditGroupName = () => {
  isEditGroupName.value = false
}

const handleAddVariable = (value: ValueSelector | string, _varKindType: VarKindType, varInfo?: Var) => {
  const chosenVariables = props.payload.variables
  if (chosenVariables.some(item => item.join('.') === (value as ValueSelector).join('.')))
    return

  const newPayload = produce(props.payload, (draft: Payload) => {
    draft.variables.push(value as ValueSelector)
    if (varInfo && varInfo.type !== VarType.any)
      draft.output_type = varInfo.type
  })
  emit('change', newPayload)
}

const handleListChange = (newList: ValueSelector[], changedItem?: ValueSelector) => {
  if (changedItem) {
    const chosenVariables = props.payload.variables
    if (chosenVariables.some(item => item.join('.') === (changedItem as ValueSelector).join('.')))
      return
  }

  const newPayload = produce(props.payload, (draft) => {
    draft.variables = newList
    if (newList.length === 0)
      draft.output_type = VarType.any
  })
  emit('change', newPayload)
}

const filterVar = (varPayload: Var) => {
  if (props.payload.output_type === VarType.any)
    return true
  return varPayload.type === props.payload.output_type
}

const handleGroupNameChange = (_value: string) => {
  console.log(_value)
  const value = replaceSpaceWithUnderscoreForValue(_value)
  const { isValid, errorKey, errorMessageKey } = checkKeys([value], false)
  if (!isValid) {
    ElNotification.error(t(`appDebug.varKeyError.${errorMessageKey}`, { key: errorKey }))
    return
  }
  console.log(_value)
  emit('groupNameChange', value)
}

// Auto-focus input when editing starts
nextTick(() => {
  if (isEditGroupName.value && inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

