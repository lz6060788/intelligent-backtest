<template>
  <PortalToFollowElem
    :open="open"
    @update:open="onOpenChange"
    placement="bottom-end"
    :offset="{
      mainAxis: 4,
      crossAxis: 0,
    }"
  >
    <PortalToFollowElemTrigger @click="open = !open">
      <Button
        :class="cn('shrink-0', !selectedOption && 'opacity-50', className)"
        size="small"
        variant="ghost"
        :disabled="disabled"
      >
        {{ selectedOption ? selectedOption.label : t(`${i18nPrefix}.select`) }}
        <i class="i-ri-arrow-down-s-line ml-1 h-3.5 w-3.5" />
      </Button>
    </PortalToFollowElemTrigger>
    <PortalToFollowElemContent class="z-[11]">
      <div class="rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg">
        <div
          v-for="option in options"
          :key="option.value"
          class="flex h-7 cursor-pointer items-center rounded-lg px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-state-base-hover"
          @click="() => {
            onSelect(option.value)
            open = false
          }"
        >
          {{ option.label }}
        </div>
      </div>
    </PortalToFollowElemContent>
  </PortalToFollowElem>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOperators, isComparisonOperatorNeedTranslate } from '../../utils'
import type { ComparisonOperator } from '../../types'
import Button from '@/app/components/base/button'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import type { VarType } from '@/app/components/workflow/types'
import cn from '@/utils/classnames'

const i18nPrefix = 'workflow.nodes.ifElse'

/**
 * 条件操作符组件的属性定义
 */
interface ConditionOperatorProps {
  /** 自定义样式类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 变量类型 */
  varType: VarType
  /** 文件属性 */
  file?: { key: string }
  /** 当前值 */
  value?: string
  /** 选择回调 */
  onSelect: (value: ComparisonOperator) => void
}

const props = defineProps<ConditionOperatorProps>()

const { t } = useI18n()
const open = ref(false)

const options = computed(() => {
  return getOperators(props.varType, props.file).map((o) => {
    return {
      label: isComparisonOperatorNeedTranslate(o) ? t(`${i18nPrefix}.comparisonOperator.${o}`) : o,
      value: o,
    }
  })
})

const selectedOption = computed(() => 
  options.value.find(o => Array.isArray(props.value) ? o.value === props.value[0] : o.value === props.value)
)
</script>

