<template>
  <tiptap
    :value="value"
    @change="({ text }) => emit('change', text)"
    :placeholder="t('workflow.nodes.ifElse.enterValue') || ''"
    :editable="!disabled"
    :vars="[]"
    :class-name="cn('text-xs')"
    :available-nodes="props.availableNodes"
  >
  </tiptap>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import tiptap from '@/components/workflow/tiptap-editor/tiptap.vue'
import type {
  Node,
} from '@/types/node'
import cn from '@/utils/classnames'

/**
 * 条件输入组件的属性定义
 */
interface ConditionInputProps {
  /** 是否禁用 */
  disabled?: boolean
  /** 值 */
  value: string
  /** 可用节点列表 */
  availableNodes: Node[]
}

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
const props = defineProps<ConditionInputProps>()

const { t } = useI18n()
</script>

