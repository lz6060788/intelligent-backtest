<template>
  <PortalToFollowElem
    :open="open"
    @update:open="setOpen"
    placement="bottom-start"
    :offset="{
      mainAxis: 4,
      crossAxis: 0,
    }"
  >
    <PortalToFollowElemTrigger @click="setOpen(!open)">
      <Button
        size="small"
        :class="className"
        :disabled="disabled"
      >
        <i class="i-ri-add-line mr-1 h-3.5 w-3.5" />
        {{ t('workflow.nodes.ifElse.addCondition') }}
      </Button>
    </PortalToFollowElemTrigger>
    <PortalToFollowElemContent class="z-[1000]">
      <div class="w-[296px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg">
        <VarReferenceVars
          :vars="variables"
          :is-support-file-var="true"
          @change="handleSelectVariable"
        />
      </div>
    </PortalToFollowElemContent>
  </PortalToFollowElem>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HandleAddCondition } from '../types'
import Button from '@/app/components/base/button'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import VarReferenceVars from '@/app/components/workflow/nodes/_base/components/variable/var-reference-vars'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'

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
  /** 选择变量时的回调函数 */
  onSelectVariable: HandleAddCondition
  /** 是否禁用 */
  disabled?: boolean
}

const props = defineProps<ConditionAddProps>()

const { t } = useI18n()
const open = ref(false)

const setOpen = (value: boolean) => {
  open.value = value
}

const handleSelectVariable = (valueSelector: ValueSelector, varItem: Var) => {
  props.onSelectVariable(props.caseId, valueSelector, varItem)
  setOpen(false)
}
</script>

