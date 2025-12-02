<template>
  <el-empty v-if="list.length === 0" :image-size="40" :description="t('workflow.nodes.variableAssigner.noVarTip')"></el-empty>
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
        @change="handleVarReferenceChange(index, $event)"
        @open="handleOpen(index)"
        :filter-var="filterVar"
        :default-var-kind-type="VarKindType.variable"
      />
      <RemoveButton
        v-if="!readonly"
        @click="handleVarRemove(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { produce } from 'immer'
import RemoveButton from '@/components/base/remove-button/index.vue'
// import ListNoDataPlaceholder from '../../../_base/components/list-no-data-placeholder.vue'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import type { ValueSelector, Var } from '@/types'
import { VarType as VarKindType } from '../../../tool/types'
import { useI18n } from 'vue-i18n'

interface Props {
  readonly: boolean
  nodeId: string
  list: ValueSelector[]
  filterVar?: (payload: Var, valueSelector: ValueSelector) => boolean
}

const emit = defineEmits<{
  (e: 'change', list: ValueSelector[], value?: ValueSelector): void
  (e: 'open', index: number): void
}>()

const props = withDefaults(defineProps<Props>(), {
})

const { t } = useI18n()

const handleVarReferenceChange = (index: number, value: ValueSelector | string) => {
  const newList = produce(props.list, (draft) => {
    draft[index] = value as ValueSelector
  })
  emit('change', newList, value as ValueSelector)
}

const handleVarRemove = (index: number) => {
  const newList = produce(props.list, (draft) => {
    draft.splice(index, 1)
  })
  emit('change', newList)
}

const handleOpen = (index: number) => {
  return () => emit('open', index)
}
</script>

