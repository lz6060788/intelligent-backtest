<template>
  <el-popover
    v-model:visible="open"
    placement="bottom-end"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
  >
    <template #reference>
      <el-button
        :class="cn('shrink-0', !selectedOption && 'opacity-50', className)"
        size="small"
        :disabled="disabled"
        link
      >
        {{ selectedOption ? selectedOption.label : t(`${i18nPrefix}.select`) }}
        <i class="i-ri-arrow-down-s-line ml-1 h-3.5 w-3.5" />
      </el-button>
    </template>
    <div class="z-10 rounded-xl border-[0.5px] popper-default p-1 shadow-dark shadow-sm">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex h-7 cursor-pointer items-center rounded-lg px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:bg-gray-600"
        @click="() => {
          emit('select', option.value as ComparisonOperator)
          open = false
        }"
      >
        {{ option.label }}
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOperators, isComparisonOperatorNeedTranslate } from '../../utils'
import type { ComparisonOperator } from '../../types'
import type { VarType } from '@/types'
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
}

const emit = defineEmits<{
  (e: 'select', value: ComparisonOperator): void
}>()

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

