<template>
  <div class="mt-2">
    <div class="px-4 pb-2">
      <el-dropdown
        :disabled="readOnly"
        trigger="click"
        :show-arrow="false"
        class="w-full"
        :offset="0"
        :popper-class="cn('z-[1000]', 'min-w-[368px] max-w-[400px]')"
      >
        <el-button class="w-full">
          {{ t(`${i18nPrefix}.setOutputVariable`) }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in unusedVariables" :key="item.variable" @click="addVariable(item)">
              {{ t(`${i18nPrefix}.outputVars.${item.variable}`) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="px-4">
      <div v-for="item in payload.variables" :key="item.variable" class="mb-2">
        <div class="flex items-center space-x-2">
          <div class="w-full bg-gray-700 rounded-md px-2 py-1 flex-1">
            <span>
              {{ t(`${i18nPrefix}.outputVars.${item.variable}`) }}
            </span>
            <span class="text-xs text-gray-400 ml-2">
              {{ item.type }}
            </span>
          </div>
          <RemoveButton @click="beforeRemoveVar(item)" />
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RemoveEffectVarConfirm from '../_base/remove-effect-var-confrim/index.vue'
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import useConfig from './use-config'
import type { CalculatorStartNodeType } from './types'
import Split from '@/components/base/split.vue'
import type { NodePanelProps } from '@/types'
import { computed } from 'vue'
import cn from '@/utils/classnames';
import RemoveButton from '@/components/base/remove-button/index.vue';

const i18nPrefix = 'workflow.nodes.calculatorStart'

const props = defineProps<NodePanelProps<CalculatorStartNodeType>>()

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
} = useConfig(props.id, payload)
</script>