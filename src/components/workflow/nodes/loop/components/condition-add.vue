<template>
  <el-popover
    v-model:visible="open"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    width="320px"
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
    <div class="z-[1000] w-[296px] popper-default shadow-lg">
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
import { RiAddLine } from '@remixicon/vue'
import type { HandleAddCondition } from '../type'
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'

/**
 * 条件添加组件的属性定义
 */
interface ConditionAddProps {
  /** 类名 */
  className?: string
  /** 变量列表 */
  variables: NodeOutPutVar[]
  /** 是否禁用 */
  disabled?: boolean
}

const emit = defineEmits<{
  (e: 'select-variable', valueSelector: ValueSelector, varItem: Var): void
}>()

const props = defineProps<ConditionAddProps>()

const { t } = useI18n()
const open = ref(false)

const handleSelectVariable = (valueSelector: ValueSelector, varItem: Var) => {
  console.log('condition-add', valueSelector, varItem)
  emit('select-variable', valueSelector, varItem)
  open.value = false
}
</script>

