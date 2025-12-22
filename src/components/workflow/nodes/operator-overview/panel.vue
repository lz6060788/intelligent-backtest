<template>
  <div class="w-full pt-2">
    <div class="space-y-4 px-4 pb-4">
      <Field :title="t(`${i18nPrefix}.inputVars`)">
        <div v-if="inputsConfig.length > 0" class="space-y-2">
          <div
            v-for="(variable, index) in inputsConfig"
            :key="index"
            class="group relative flex items-center space-x-1 max-w-full"
          >
            <p class="w-20 truncate">{{ variable.label }}</p>
            <VarReferencePicker
              :node-id="props.id"
              :readonly="readOnly"
              :is-show-node-name="true"
              class="grow overflow-hidden"
              :value="payload.inputs[variable.variable] || []"
              :is-support-constant-value="false"
              :default-var-kind-type="inputVarTypeToVarType(variable.type)"
              :only-leaf-node-var="false"
              :filter-var="(v: Var) => v.type === inputVarTypeToVarType(variable.type)"
              :is-support-file-var="false"
              @change="(value) => handhleInputChange(variable)(value as ValueSelector)"
            />
          </div>
        </div>
        <div v-else class="text-text-secondary text-sm p-4">
          {{ t(`${i18nPrefix}.noInputVars`) }}
        </div>
      </Field>
      <Field :title="t(`${i18nPrefix}.output`)">
        <OutputVars :defaultCollapsed="false" v-if="outputVars.length > 0">
          <VarItem
            v-for="item in outputVars"
            :key="item.alias"
            :name='item.alias'
            :type="item.type || 'unknown'"
            description=""
          />
        </OutputVars>
        <div v-else class="text-text-secondary text-sm p-4">
          {{ t(`${i18nPrefix}.noOutputVars`) }}
        </div>
      </Field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlockEnum, VarKindType, type NodePanelProps, type ValueSelector, type Var } from '@/types';
import type { OperatorOverviewNodeType } from './types';
import { computed } from 'vue';
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import { useI18n } from 'vue-i18n'
import useConfig from './use-config';
import { inputVarTypeToVarType } from '../_base/variable/utils';
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'

const { t } = useI18n()

const i18nPrefix = 'workflow.nodes.operatorOverview'

const props = defineProps<NodePanelProps<OperatorOverviewNodeType>>()

const payload = computed(() => props.data)


const {
  readOnly,
  outputVars,
  inputsConfig,
  handhleInputChange,
} = useConfig(props.id, payload)
</script>

<style scoped>
</style>