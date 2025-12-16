<template>
  <div class="mt-2">
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">{{ t('workflow.nodes.operator.operator') }}</div>
      </template>
      <template #operations>
        <span class="text-text-tertiary text-xs inline-block truncate max-w-[180px] text-right h-5 pr-4" :title="currentCalculatorTemplate?.functionSignature">{{ currentCalculatorTemplate?.functionSignature }}</span>
      </template>
      <div class="px-4">
          <el-select
            :model-value="payload.operator"
            :placeholder="t('workflow.nodes.operator.noCalculator')"
            :offset="0"
            :show-arrow="false"
            @change="handleChangeCalculator($event)"
          >
              <el-option v-for="item in operators" :key="item.name" :label="item.name" :value="item.name">
                <div class="flex justify-between items-center">
                  <span>{{ item.name }}</span>
                  <span class="ml-2 text-text-tertiary text-xs inline-block truncate w-[180px] text-right h-5" :title="item.description">{{ item.description }}</span>
                </div>
              </el-option>
        </el-select>
      </div>
    </Field>
    <Field class-name="mb-2">
      <template #title>
        <div class="pl-3">{{ t('workflow.nodes.operator.alias') }}</div>
      </template>
      <div class="px-4">
        <el-input :model-value="payload.alias" @input="handleChangeAlias"></el-input>
      </div>
    </Field>
    <div v-if="currentCalculatorTemplate?.inputs?.fixedArguments && currentCalculatorTemplate.inputs.fixedArguments.length > 0">
      <Field class-name="mb-2">
        <template #title>
          <div class="pl-3">{{ t('workflow.nodes.operator.params') }}</div>
        </template>
        <div class="px-4">
          <variable
            :variables="fixedVariables"
            :node-id="id"
            is-fixed
            :arguments-template="currentCalculatorTemplate?.inputs?.fixedArguments"
            @update-variable="handleUpdateVariable"
          />
        </div>
      </Field>
    </div>
    <div v-if="currentCalculatorTemplate?.inputs?.restArguments && currentCalculatorTemplate.inputs.restArguments.length > 0">
      <Field>
        <template #title>
          <div class="pl-3">{{ t('workflow.nodes.operator.params') }}</div>
        </template>
        <template #operations>
          <div
            class="mr-4 flex h-5 w-5 cursor-pointer items-center justify-center text-text-tertiary hover:bg-blue-500 hover:text-white rounded-lg"
            @click="handleAddVariable"
          >
            <RiAddLine class="h-4 w-4" />
          </div>
        </template>
        <div class="px-4 mb-2">
          <variable
            :variables="restVariables"
            :node-id="id"
            :is-fixed="false"
            :arguments-template="currentCalculatorTemplate?.inputs?.restArguments"
            @remove-variable="handleRemoveVariable"
            @update-variable="handleUpdateVariable"
          />
        </div>
      </Field>
    </div>
    <Split class="mb-2" />
    <div className=''>
      <OutputVars>
        <VarItem
          name='result'
          :type="currentCalculatorTemplate?.output?.type || ''"
          :description="t(`${i18nPrefix}.outputVars.result`)"
        />
      </OutputVars>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiAddLine, RiInformation2Fill } from '@remixicon/vue'
import Split from '@/components/base/split.vue'
// import InputNumberWithSlider from '@/components/base/input-number-with-slider.vue'
import type { CalculatorNodeType } from './types'
import useConfig from './use-config'
import Variable from './component/variables/index.vue'
import type { NodePanelProps } from '@/types'
import Field from '@/components/base/field.vue'
import { operators } from './constant/operators'
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';

import { computed } from 'vue'

const i18nPrefix = 'workflow.nodes.operator'

const props = defineProps<NodePanelProps<CalculatorNodeType>>()

const payload = computed(() => props.data)

const { id, data } = props
const { t } = useI18n()

const {
  readOnly,
  currentCalculatorTemplate,
  handleChangeCalculator,
  handleChangeAlias,
  fixedVariables,
  restVariables,
  handleAddVariable,
  handleRemoveVariable,
  handleUpdateVariable,
} = useConfig(id, payload)
</script>

