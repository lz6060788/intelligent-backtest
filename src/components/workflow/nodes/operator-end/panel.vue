<template>
  <div class="w-full pt-2">
    <OutputVars :defaultCollapsed="false" v-if="outputVars.length > 0">
      <VarItem
        v-for="item in outputVars"
        :key="item.alias"
        :name='item.alias'
        :type="item.type || 'unknown'"
        description=""
      />
    </OutputVars>
    <div v-else class="text-text-secondary text-sm">
      {{ t(`${i18nPrefix}.noOutputVars`) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodePanelProps } from '@/types';
import type { OperatorEndNodeType } from './types';
import { computed } from 'vue';
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import { getOutputVars } from './utils';
import { useWorkflowInstance } from '@/components/workflow/hooks/index'
import { useVueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'workflow.nodes.operatorEnd'

const { instanceId } = useWorkflowInstance()
const store = useVueFlow(instanceId)
const { nodes, edges } = store
const props = defineProps<NodePanelProps<OperatorEndNodeType>>()

const payload = computed(() => props.data)

const outputVars = computed(() => getOutputVars(nodes.value, edges.value))
</script>

<style scoped>
</style>