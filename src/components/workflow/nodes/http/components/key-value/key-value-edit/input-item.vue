<template>
  <div :class="cn(props.className, 'hover:cursor-text hover:bg-state-base-hover', 'relative flex h-full')">
    <template v-if="!props.readOnly">
      <TiptapEditor
        :instance-id="props.instanceId"
        :class="cn(isFocus ? 'bg-components-input-bg-active' : 'bg-width', 'w-0 grow px-3 py-1')"
        :value="props.value"
        :vars="availableVars"
        :editable="!props.readOnly"
        :placeholder="t('workflow.nodes.http.insertVarPlaceholder')"
        :placeholder-class-name="'!leading-[21px]'"
        :wrapper-class-name="'h-full'"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </template>
    <template v-else>
      <div class="h-[18px] w-full pl-0.5 leading-[18px]">
        <div v-if="!hasValue" class="text-xs font-normal text-text-quaternary">
          {{ props.placeholder }}
        </div>
        <TiptapEditor
          v-if="hasValue"
          :instance-id="props.instanceId"
          :class="cn(isFocus ? 'border-components-input-border-active' : 'bg-components-input-bg-hover', 'w-0 grow rounded-lg border px-3 py-[6px]')"
          :value="props.value"
          :vars="availableVars"
          :editable="!props.readOnly"
          :placeholder="t('workflow.nodes.http.insertVarPlaceholder')"
          :placeholder-class-name="'!leading-[21px]'"
          :wrapper-class-name="'h-full'"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
          :available-nodes="availableNodesWithParent"
        />
      </div>
    </template>
    <RemoveButton
      v-if="props.hasRemove && !isFocus"
      class="absolute right-1 top-0.5 hidden group-hover:block"
      @click.stop="handleRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useAvailableVarList from '../../../../_base/hooks/use-available-var-list'
import cn from '@/utils/classnames'
import RemoveButton from '@/components/base/remove-button/index.vue'
import TiptapEditor from '@/components/workflow/tiptap-editor/tiptap.vue'
import type { Var } from '@/types'
import { VarType } from '@/types'

/**
 * 组件属性定义
 */
interface Props {
  /** 自定义类名 */
  className?: string
  /** 实例ID */
  instanceId?: string
  /** 节点ID */
  nodeId: string
  /** 当前值 */
  value: string
  /** 是否有移除按钮 */
  hasRemove: boolean
  /** 占位符 */
  placeholder?: string
  /** 是否只读 */
  readOnly?: boolean
  /** 是否支持文件 */
  isSupportFile?: boolean
  /** 插入变量提示位置 */
  insertVarTipToLeft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
  isSupportFile: false,
  insertVarTipToLeft: false,
})

const emit = defineEmits<{
  (e: 'change', newItem: string): void
  (e: 'remove'): void
}>()

const { t } = useI18n()

const hasValue = computed(() => !!props.value)

const isFocus = ref(false)

const { availableVars, availableNodesWithParent } = useAvailableVarList(props.nodeId, {
  onlyLeafNodeVar: false,
  filterVar: (varPayload: Var) => {
    const supportVarTypes = [VarType.string, VarType.number, VarType.secret]
    if (props.isSupportFile)
      supportVarTypes.push(VarType.file, VarType.arrayFile)

    return supportVarTypes.includes(varPayload.type)
  },
})

/**
 * 处理值变更
 */
const handleChange = (content: { json: Record<string, any>, text: string, html: string }) => {
  console.log(content.text)
  emit('change', content.text)
}

/**
 * 处理聚焦
 */
const handleFocus = () => {
  isFocus.value = true
}

/**
 * 处理失焦
 */
const handleBlur = () => {
  isFocus.value = false
}

/**
 * 处理移除
 */
const handleRemove = (e: MouseEvent) => {
  emit('remove')
}
</script>

