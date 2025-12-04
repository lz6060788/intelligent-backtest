<template>
  <el-popover
    v-model:visible="open"
    placement="bottom-start"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
  >
    <template #reference>
      <el-button
        size="small"
        :class="className"
        :disabled="disabled"
      >
        <RiAddLine class="mr-1 h-3.5 w-3.5" />
        {{ t('workflow.nodes.ifElse.addCondition') }}
      </el-button>
    </template>
    <div class="z-[1000] w-[296px] rounded-lg border-[0.5px] popper-default p-1 shadow-lg">
      <VarReferenceVars
        :vars="variables"
        :is-support-file-var="true"
        @change="handleSelectVariable"
      />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HandleAddCondition } from '../types'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'
import { RiAddLine } from '@remixicon/vue'

/**
 * 条件添加组件的属性定义
 */
interface ConditionAddProps {
  /** 自定义样式类名 */
  className?: string
  /** 案例ID */
  caseId: string
  /** 变量列表 */
  variables: NodeOutPutVar[]
  /** 是否禁用 */
  disabled?: boolean
}

const emit = defineEmits<{
  (e: 'selectVariable', caseId: string, valueSelector: ValueSelector, varItem: Var): void
}>()

const props = defineProps<ConditionAddProps>()

const { t } = useI18n()
const open = ref(false)

const handleSelectVariable = (valueSelector: ValueSelector, varItem: Var) => {
  emit('selectVariable', props.caseId, valueSelector, varItem)
  open.value = false
}
</script>

