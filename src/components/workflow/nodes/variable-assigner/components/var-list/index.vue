<template>
  <ListNoDataPlaceholder v-if="list.length === 0">
    {{ t('workflow.nodes.variableAssigner.noVarTip') }}
  </ListNoDataPlaceholder>
  <div v-else class="space-y-2">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center space-x-1"
    >
      <VarReferencePicker
        :readonly="readonly"
        :node-id="nodeId"
        :is-show-node-name="true"
        class="grow"
        :value="item"
        :on-change="handleVarReferenceChange(index)"
        :on-open="handleOpen(index)"
        :filter-var="filterVar"
        :default-var-kind-type="VarKindType.variable"
      />
      <RemoveButton
        v-if="!readonly"
        :on-click="handleVarRemove(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { produce } from 'immer'
import { noop } from 'lodash-es'
import RemoveButton from '../../../_base/components/remove-button.vue'
import ListNoDataPlaceholder from '../../../_base/components/list-no-data-placeholder.vue'
import VarReferencePicker from '@/components/workflow/nodes/_base/components/variable/var-reference-picker.vue'
import type { ValueSelector, Var } from '@/types'
import { VarKindType } from '@/types'
import { useI18n } from 'vue-i18n'

interface Props {
  readonly: boolean
  nodeId: string
  list: ValueSelector[]
  onChange: (list: ValueSelector[], value?: ValueSelector) => void
  onOpen?: (index: number) => void
  filterVar?: (payload: Var, valueSelector: ValueSelector) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  onOpen: noop,
})

const { t } = useI18n()

const handleVarReferenceChange = (index: number) => {
  return (value: ValueSelector | string) => {
    const newList = produce(props.list, (draft) => {
      draft[index] = value as ValueSelector
    })
    props.onChange(newList, value as ValueSelector)
  }
}

const handleVarRemove = (index: number) => {
  return () => {
    const newList = produce(props.list, (draft) => {
      draft.splice(index, 1)
    })
    props.onChange(newList)
  }
}

const handleOpen = (index: number) => {
  return () => props.onOpen(index)
}
</script>

