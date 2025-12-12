<template>
  <div className='mt-2'>
    <div className='space-y-4 px-4 pb-4'>

      <Field
        :title="t(`${i18nPrefix}.output.variable`)"
      >
        <template v-if="!readOnly">
          <AddButton @click="handleAddVariable" class="mb-2" />
        </template>
        <VarList
          :node-id="props.id"
          :readonly="readOnly"
          :list="outputs"
          @change="handleVarListChange"
        />
      </Field>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodePanelProps } from '@/types';
import { computed } from 'vue'
import useConfig from './use-config.ts'
import type { EndNodeType } from './types';
import { useI18n } from 'vue-i18n';
import VarList from '@/components/workflow/nodes/_base/variable/var-list.vue'
import Field from '@/components/base/field.vue'
import AddButton from '@/components/base/add-button/index.vue'

const i18nPrefix = 'workflow.nodes.end'

// Props
const props = defineProps<NodePanelProps<EndNodeType>>()

const { t } = useI18n()

const payload = computed(() => props.data)
const {
  readOnly,
  handleVarListChange,
  handleAddVariable,
} = useConfig(props.id, payload)

const outputs = computed(() => payload.value.outputs)
</script>

<style scoped>
</style>