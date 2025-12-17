<template>
  <div class='mb-1 py-1 w-60' v-if="operator">
    <div class='flex items-center justify-between rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded text-blue-500 px-1 text-xs font-semibold uppercase shrink-0'>
        <span>{{ operator?.name }}</span>
        <el-tooltip :content="operator?.description">
          <RiInformation2Fill class='h-4 w-4 text-gray-300 ml-1' />
        </el-tooltip>
      </div>
      <div
        v-if="data.alias"
        class='h-4 items-center rounded bg-gray-500 px-1 text-xs font-semibold text-text-secondary max-w-full truncate'
        :title="data.alias"
      >
        {{ data.alias }}
      </div>
    </div>
    <div class='flex justify-start rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.input`) }}</div>
      <div class='w-0 grow p-1 bg-gray-700 rounded-md'>
        <div v-for="variable in input" :key="variable.name" class="mb-1 last-of-type:mb-0">
          <div class='flex items-center justify-start rounded-md'>
            <div class='flex h-4 shrink-0 items-center rounded text-xs font-semibold uppercase text-text-secondary mr-1 w-4 truncate'>{{ variable.name || '...' }}</div>
            <div class='w-0 grow pl-1 items-center'>
              <ReadonlyInputWithSelectVar :value="formatVariableValue(variable.value)" :node-id="id" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='flex justify-start rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.output`) }}</div>
      <div class='w-0 grow rounded-md text-xs'>
        <span>{{ operator?.output.type }}</span>
      </div>
    </div>
  </div>
  <!-- <div v-else>
    <div class="py-1 w-60 text-text-secondary text-xs">
      {{ t('workflow.nodes.operator.noCalculator') }}
    </div>
  </div> -->
</template>

<script setup lang="ts">
import ReadonlyInputWithSelectVar from '@/components/workflow/nodes/_base/readonly-input-with-select-var/index.vue'
import type { NodeProps } from '@/types'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { OperatorNodeType } from './types'
import { operators } from './constant/operators'
import { RiInformation2Fill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { variableTransformer } from '../../utils/variable'
import { cloneDeep } from 'lodash-es'

const i18nPrefix = 'workflow.nodes.operator'

const { t } = useI18n()

const props = defineProps<NodeProps<OperatorNodeType>>();

const input = computed(() => props.data.variables)
const operator = computed(() => cloneDeep(operators.find((operator) => operator.name === props.data.operator)))

const formatVariableValue = (value: string | number | boolean | null | string[]) => {
  if (value === true) {
    return 'True'
  }
  if (value === false) {
    return 'False'
  }
  if (Array.isArray(value)) {
    return variableTransformer(value) as string
  }
  return value?.toString() ?? ''
}
</script>

<style scoped>
</style>