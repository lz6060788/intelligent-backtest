<template>
  <Field
    :title="t(`${i18nPrefix}.inputs`)"
  >
    <template #operations>
      <AddButton v-if="!readOnly" @click="showAddVarModal" />
    </template>

    <VarList
      :readonly="readOnly"
      :list="payload || []"
      @change="handleVarListChange"
    />

  </Field>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { InputVar, NodeProps, Var, MoreInfo, ValueSelector } from '@/types';

const i18nPrefix = 'workflow.nodes.operatorStart'

const props = defineProps<{
payload: InputVar[],
nodeId: string,
readOnly: boolean,
}>()

const { t } = useI18n()

const emit = defineEmits(['var-list-change', 'show-add-var-modal'])

const handleVarListChange = (newList: InputVar[], moreInfo?: { index: number; payload: MoreInfo }) => {
  emit('var-list-change', newList, moreInfo)
}

const showAddVarModal = () => {
  emit('show-add-var-modal')
}
</script>

<style scoped>
</style>