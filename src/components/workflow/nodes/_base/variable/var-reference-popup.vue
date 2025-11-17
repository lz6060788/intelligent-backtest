<template>
  <div
    class="space-y-1 rounded-lg border border-gray-500 border-solid bg-gray-800 p-1 shadow-lg"
    :style="{ width: `${itemWidth || 228}px` }"
  >
    <template v-if="(!vars || vars.length === 0) && popupFor">
      <div v-if="popupFor === 'toAssigned'" class="flex flex-col items-center justify-center py-8">
        <div class="system-sm-medium text-text-primary mb-2">
          {{ t('workflow.variableReference.noAvailableVars') }}
        </div>
        <div class="system-xs-regular text-text-tertiary">
          {{ t('workflow.variableReference.noVarsForOperation') }}
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-8">
        <div class="system-sm-medium text-text-primary mb-2">
          {{ t('workflow.variableReference.noAssignedVars') }}
        </div>
        <div class="system-xs-regular text-text-tertiary">
          {{ t('workflow.variableReference.assignedVarsDescription') }}
          <a
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-accent-secondary"
            :href="'#'"
          >
            {{ t('workflow.variableReference.conversationVars') }}
          </a>
        </div>
      </div>
    </template>
    <VarReferenceVars
      v-else
      search-box-class-name="mt-1"
      :vars="vars"
      :item-width="itemWidth"
      :is-support-file-var="isSupportFileVar"
      :z-index="zIndex"
      :prefer-schema-type="preferSchemaType"
      @change="changeHandle"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import VarReferenceVars from './var-reference-vars/index.vue'
import type { NodeOutPutVar, ValueSelector, Var } from '@/types'

/**
 * 变量引用弹出框组件的属性定义
 */
interface Props {
  /** 变量列表 */
  vars: NodeOutPutVar[]
  /** 弹出框用途 */
  popupFor?: 'assigned' | 'toAssigned'
  /** 项目宽度 */
  itemWidth?: number
  /** 是否支持文件变量 */
  isSupportFileVar?: boolean
  /** 层级 */
  zIndex?: number
  /** 是否优先使用Schema类型 */
  preferSchemaType?: boolean
}

const emit = defineEmits<{
  (e: 'change', value: ValueSelector, varDetail: Var): void
}>()

const changeHandle = (value: ValueSelector, varDetail: Var) => {
  emit('change', value, varDetail)
}
const props = withDefaults(defineProps<Props>(), {
  isSupportFileVar: true,
})

const { t, locale } = useI18n()
// const { instanceId, instance } = useWorkflowInstance()


// 获取 setShowInputFieldPanel 方法
// const setShowInputFieldPanel = instance.setShowInputFieldPanel


/**
 * 处理管理输入字段的回调
 */
// const handleManageInputField = () => {
//   setShowInputFieldPanel?.(true)
// }
</script>

