<template>
  <Field :title="t(`${i18nPrefix}.outputs`)">
    <div class="pb-2">
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
            <el-dropdown-item v-for="item in unusedVariables" :key="item.variable" @click="emit('addVariable', item)">
              {{ t(`${i18nPrefix}.outputVars.${item.variable}`) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="">
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
          <RemoveButton @click="emit('beforeRemoveVar', item)" />
        </div>
      </div>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { OperatorStartNodeType } from '../types';
import type { NodeProps, Var } from '@/types';
import cn from '@/utils/classnames';
import RemoveButton from '@/components/base/remove-button/index.vue';
import Field from '@/components/base/field.vue'

const i18nPrefix = 'workflow.nodes.operatorStart'

const props = defineProps<{
payload: OperatorStartNodeType,
unusedVariables: Var[],
nodeId: string,
readOnly: boolean,
}>()

const { t } = useI18n()

const emit = defineEmits<{
(e: 'beforeRemoveVar', variable: Var): void
(e: 'addVariable', variable: Var): void
}>()
</script>
