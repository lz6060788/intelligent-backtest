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
                class="system-sm-semibold flex h-6 cursor-text items-center rounded-lg px-1 text-text-secondary hover:bg-gray-100"
                @click="setEditGroupName"
              >
                {{ payload.group_name }}
              </div>
            </template>
            <template v-else>
              <input
                ref="inputRef"
                type="text"
                class="h-6 rounded-lg border border-gray-300 bg-white px-1 focus:outline-none"
                :size="payload.group_name?.length"
                :value="payload.group_name"
                @input="handleGroupNameChange"
                @blur="setNotEditGroupName"
                maxlength="30"
              />
            </template>
          </div>
          <div
            v-if="canRemove"
            class="ml-0.5 hidden cursor-pointer rounded-md p-1 text-text-tertiary hover:bg-state-destructive-hover hover:text-text-destructive group-hover:block"
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
          class="system-2xs-medium-uppercase flex h-[18px] items-center rounded-[5px] border border-divider-deep px-1 text-text-tertiary"
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
          :on-change="handleAddVariable"
          :default-var-kind-type="VarKindType.variable"
          :filter-var="filterVar"
          :available-vars="availableVars"
        />
      </div>
    </template>
    <VarList
      :readonly="readOnly"
      :node-id="nodeId"
      :list="payload.variables"
      :on-change="handleListChange"
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
import VarReferencePicker from '../../_base/components/variable/var-reference-picker.vue'
import VarList from './var-list/index.vue'
import Field from '../_base/components/field.vue'
import { VarType } from '@/types'
import type { NodeOutPutVar, ValueSelector, Var } from '@/types'
import { VarType as VarKindType } from '../tool/types'
import { Folder } from '@/components/base/icons/src/vender/line/files'
import { checkKeys, replaceSpaceWithUnderscoreInVarNameInput } from '@/utils/var'
import Toast from '@/components/base/toast'

const i18nPrefix = 'workflow.nodes.variableAssigner'

type Payload = VarGroupItemType & {
  group_name?: string
}

interface Props {
  readOnly: boolean
  nodeId: string
  payload: Payload
  onChange: (newPayload: Payload) => void
  groupEnabled: boolean
  onGroupNameChange?: (value: string) => void
  canRemove?: boolean
  onRemove?: () => void
  availableVars: NodeOutPutVar[]
}

const props = defineProps<Props>()

const { t } = useI18n()
const inputRef = ref<HTMLInputElement | null>(null)
const isEditGroupName = ref(false)

const setEditGroupName = () => {
  isEditGroupName.value = true
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
  props.onChange(newPayload)
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
  props.onChange(newPayload)
}

const filterVar = (varPayload: Var) => {
  if (props.payload.output_type === VarType.any)
    return true
  return varPayload.type === props.payload.output_type
}

const handleGroupNameChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  replaceSpaceWithUnderscoreInVarNameInput(target)
  const value = target.value
  const { isValid, errorKey, errorMessageKey } = checkKeys([value], false)
  if (!isValid) {
    Toast.notify({
      type: 'error',
      message: t(`appDebug.varKeyError.${errorMessageKey}`, { key: errorKey }),
    })
    return
  }
  props.onGroupNameChange?.(value)
}

// Auto-focus input when editing starts
nextTick(() => {
  if (isEditGroupName.value && inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

