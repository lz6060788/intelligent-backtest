<template>
  <div class="pb-2 pt-2">
    <div class="space-y-4 px-4 pb-4">
      <Field
        :title="t(`${i18nPrefix}.input`)"
        :required="true"
      >
        <template #operations>
          <div class="text-xs uppercase flex h-[18px] items-center rounded-[5px] border border-solid border-gray-5 px-1 capitalize text-text-tertiary">Array</div>
        </template>
        <VarReferencePicker
          :readonly="readOnly"
          :node-id="id"
          :is-show-node-name="true"
          :value="inputs.iterator_selector || []"
          @change="handleInputChange"
          :filter-var="filterInputVar"
        />
      </Field>
    </div>
    <Split />
    <div class="mt-2 space-y-4 px-4 pb-4">
      <Field
        :title="t(`${i18nPrefix}.output`)"
        :required="true"
      >
        <template #operations>
          <div class="text-xs uppercase flex h-[18px] items-center rounded-[5px] border border-solid border-gray-5 px-1 capitalize text-text-tertiary">Array</div>
        </template>
        <VarReferencePicker
          :readonly="readOnly"
          :node-id="id"
          :is-show-node-name="true"
          :value="inputs.output_selector || []"
          @change="handleOutputVarChange"
          :available-nodes="iterationChildrenNodes"
          :available-vars="childrenNodeVars"
        />
      </Field>
    </div>
    <div class="px-4 pb-2">
      <Field :title="t(`${i18nPrefix}.parallelMode`)" :inline="true">
        <template #tooltip>
          <div class="w-[230px]">{{ t(`${i18nPrefix}.parallelPanelDesc`) }}</div>
        </template>
        <el-switch :model-value="inputs.is_parallel" @update:model-value="changeParallel" />
      </Field>
    </div>
    <div v-if="inputs.is_parallel" class="px-4 pb-2">
      <Field :title="t(`${i18nPrefix}.MaxParallelismTitle`)" :is-sub-title="true">
        <template #tooltip>
          <div class="w-[230px]">{{ t(`${i18nPrefix}.MaxParallelismDesc`) }}</div>
        </template>
        <div class="row flex px-1 overflow-hidden">
          <el-input-number
            :model-value="inputs.parallel_nums"
            :max="MAX_ITERATION_PARALLEL_NUM"
            :min="MIN_ITERATION_PARALLEL_NUM"
            @update:model-value="changeParallelNums"
            controls-position="right"
            size="small"
            class="w-18 mr-4"
          />
          <el-slider
            :model-value="inputs.parallel_nums"
            @update:model-value="changeParallelNums"
            :max="MAX_ITERATION_PARALLEL_NUM"
            :min="MIN_ITERATION_PARALLEL_NUM"
            size="small"
            class="flex-1 shrink-0 mr-2"
          />
        </div>
      </Field>
    </div>

    <!-- <div class="px-4 py-2">
      <Field :title="t(`${i18nPrefix}.errorResponseMethod`)">
        <el-select
          :model-value="inputs.error_handle_mode"
          @update:model-value="(value) => changeErrorResponseMode(value as ErrorHandleMode)"
          :filterable="false"
        >
          <el-option
            v-for="item in responseMethod"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </Field>
    </div>

    <Split />

    <div class="px-4 py-2">
      <Field
        :title="t(`${i18nPrefix}.flattenOutput`)"
        :inline="true"
      >
        <template #tooltip>
          <div class="w-[230px]">{{ t(`${i18nPrefix}.flattenOutputDesc`) }}</div>
        </template>
        <el-switch :model-value="inputs.flatten_output" @update:model-value="changeFlattenOutput" />
      </Field>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import Split from '@/components/base/split.vue'
import { MIN_ITERATION_PARALLEL_NUM, MAX_ITERATION_PARALLEL_NUM } from '@/components/workflow/constant'
import type { IterationNodeType, } from './types'
import useConfig from './use-config'
import { ErrorHandleMode, type NodePanelProps } from '@/types'
import Field from '@/components/base/field.vue'

const i18nPrefix = 'workflow.nodes.iteration'

const props = defineProps<NodePanelProps<IterationNodeType>>()

const { id, data } = props
const { t } = useI18n()

const responseMethod = computed(() => [
  {
    value: ErrorHandleMode.Terminated,
    name: t(`${i18nPrefix}.ErrorMethod.operationTerminated`),
  },
  {
    value: ErrorHandleMode.ContinueOnError,
    name: t(`${i18nPrefix}.ErrorMethod.continueOnError`),
  },
  {
    value: ErrorHandleMode.RemoveAbnormalOutput,
    name: t(`${i18nPrefix}.ErrorMethod.removeAbnormalOutput`),
  },
])

const payload = computed(() => props.data)

const {
  readOnly,
  inputs,
  filterInputVar,
  handleInputChange,
  childrenNodeVars,
  iterationChildrenNodes,
  handleOutputVarChange,
  changeParallel,
  changeErrorResponseMode,
  changeParallelNums,
  changeFlattenOutput,
} = useConfig(id, payload)
</script>

