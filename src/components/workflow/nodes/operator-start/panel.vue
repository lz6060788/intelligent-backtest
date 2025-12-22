<template>
  <div class="mt-2">

    <div class="space-y-4 px-4 pb-4">
      <Inputs
        :payload="payload.inputs"
        :node-id="id"
        :read-only="readOnly"
        @show-add-var-modal="showAddVarModal"
        @var-list-change="handleInputVarListChange"
      />
      <Variable
        :payload="payload"
        :node-id="id"
        :read-only="readOnly"
        :unused-variables="unusedVariables"
        @before-remove-var="beforeRemoveVar"
        @add-variable="addVariable"
      />
    </div>
    <Split />
    <div>
      <OutputVars :default-collapsed="false">
        <VarItem
          v-for="item in payload.variables"
          :name="item.variable"
          :type="item.type"
          :description="item.des || ''"
        />
      </OutputVars>
    </div>

    <RemoveEffectVarConfirm
      :is-show="isShowRemoveVarConfirm"
      @cancel="hideRemoveVarConfirm"
      @confirm="onRemoveVarConfirm"
    />

    <ConfigVarModal
      v-if="isShowAddVarModal"
      :is-create="true"
      :support-file="false"
      :is-show="isShowAddVarModal"
      :support-types="[InputVarType.textInput, InputVarType.number]"
      @close="hideAddVarModal"
      @confirm="handleAddVarConfirm"
      :var-keys="payload.inputs.map(v => v.variable)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RemoveEffectVarConfirm from '../_base/remove-effect-var-confrim/index.vue'
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import useConfig from './use-config'
import type { OperatorStartNodeType } from './types'
import Split from '@/components/base/split.vue'
import { InputVarType, type InputVar, type NodePanelProps } from '@/types'
import { computed } from 'vue'
import Variable from './components/variable.vue'
import Inputs from './components/inputs.vue'
import ConfigVarModal from '@/components/configuration/config-var/config-modal/index.vue'

const i18nPrefix = 'workflow.nodes.operatorStart'

const props = defineProps<NodePanelProps<OperatorStartNodeType>>()

const { t } = useI18n()

const payload = computed(() => props.data)
const {
  readOnly,
  unusedVariables,
  isShowRemoveVarConfirm,
  addVariable,
  beforeRemoveVar,
  hideRemoveVarConfirm,
  onRemoveVarConfirm,
  handleInputVarListChange,
  handleAddInputVariable,
  isShowAddVarModal,
  showAddVarModal,
  hideAddVarModal,
} = useConfig(props.id, payload)


const handleAddVarConfirm = (payload: InputVar) => {
  const isValid = handleAddInputVariable(payload)
  if (!isValid) return
  hideAddVarModal()
}
</script>