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
        @click="open = !open"
      >
        <RiAddLine class="mr-1 h-3.5 w-3.5" />
        {{ t('workflow.nodes.ifElse.addCondition') }}
      </el-button>
    </template>
    <div class="z-[1000] w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg">
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
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types/node'

/**
 * 条件添加组件的属性定义
 */
interface ConditionAddProps {
  /** 类名 */
  className?: string
  /** 变量列表 */
  variables: NodeOutPutVar[]
  /** 选择变量回调 */
  onSelectVariable: HandleAddCondition
  /** 是否禁用 */
  disabled?: boolean
}

const props = defineProps<ConditionAddProps>()

const { t } = useI18n()
const open = ref(false)

const handleSelectVariable = (valueSelector: ValueSelector, varItem: Var) => {
  props.onSelectVariable(valueSelector, varItem)
  open.value = false
}
</script>

