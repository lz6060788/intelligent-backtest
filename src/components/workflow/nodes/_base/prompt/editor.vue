<template>
  <div :class="cn(className, wrapClassName)" :style="wrapStyle">
    <div
      ref="containerRef"
      :class="cn(
        isFocus
          ? gradientBorder &&
            'bg-gradient-to-r from-blue-800 to-blue-900'
          : 'bg-transparent',
        isExpand && 'h-full',
        '!rounded-[9px] p-0.5',
        containerBackgroundClassName
      )"
    >
      <div
        :class="cn(
          isFocus ? 'bg-gray-800' : 'bg-gray-700',
          isExpand && 'flex h-full flex-col',
          'rounded-lg',
          containerBackgroundClassName
        )"
      >
        <div :class="cn('flex items-center justify-between pl-3 pr-2 pt-1', headerClassName)">
          <div class="flex gap-2">
            <div v-if="!$slots.title" :class="cn('text-xs font-semibold uppercase leading-4 text-text-secondary', titleClassName)">
              {{ title }}
              <span v-if="required" class="text-red-500">*</span>
            </div>
            <slot v-else name="title">
              <div :class="cn('text-xs font-semibold uppercase leading-4 text-text-secondary', titleClassName)">
                {{ title }}
                <span v-if="required" class="text-red-500">*</span>
              </div>
            </slot>
            <el-tooltip v-if="titleTooltip" :content="titleTooltip" />
          </div>
          <div class="flex items-center">
            <div class="text-xs font-medium leading-[18px] text-gray-400">
              {{ value?.length || 0 }}
            </div>

            <div class="ml-2 mr-2 h-3 w-px bg-gray-600"></div>
            <!-- Operations -->
            <div class="flex items-center space-x-[2px]">
              <ActionButton v-if="showRemove" @click="emit('remove')">
                <RiDeleteBinLine class="h-4 w-4" />
              </ActionButton>
              <ActionButton v-if="!isCopied" @click="handleCopy">
                <Copy class="h-4 w-4" />
              </ActionButton>
              <ActionButton v-else>
                <CopyCheck class="h-4 w-4" />
              </ActionButton>
              <ToggleExpandBtn :is-expand="isExpand" @expand-change="setIsExpand" />
            </div>
          </div>
        </div>

        <!-- Min: 80 Max: 560. Header: 24 -->
        <div :class="cn('pb-2', isExpand && 'flex grow flex-col')">
          <div
            v-if="!(isSupportJinja && editionType === EditionType.jinja2)"
            :class="cn(
              isExpand ? 'grow' : 'max-h-[536px]',
              'relative min-h-[56px] overflow-y-auto px-3',
              editorContainerClassName
            )"
          >
            <tiptap
              :value="value"
              :placeholder="placeholder"
              :placeholder-class-name="placeholderClassName"
              :instance-id="instanceId"
              compact
              :class="cn('min-h-[56px] text-sm', inputClassName)"
              :style="isExpand ? { height: editorExpandHeight - 5 } : {}"
              @change="({ text }) => emit('change', text)"
              @blur="setBlur"
              @focus="setFocus"
              :editable="!readOnly"
              :is-support-file-var="isSupportFileVar"
              :vars="nodesOutputVars"
              :available-nodes="availableNodes"
            ></tiptap>
            <div v-if="readOnly" class="absolute inset-0 z-10"></div>
          </div>
          <div
            v-else
            :class="cn(
              isExpand ? 'grow' : 'max-h-[536px]',
              'relative min-h-[56px] overflow-y-auto px-3',
              editorContainerClassName
            )"
          >
            <CodeEditor
              :available-vars="nodesOutputVars || []"
              :var-list="varList"
              @add-var="emit('addVariable', $event)"
              is-in-node
              :read-only="readOnly"
              :language="CodeLanguage.python3"
              :value="value"
              @change="emit('change', $event)"
              no-wrapper
              :is-expand="isExpand"
              :class="inputClassName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElSwitch, ElTooltip } from 'element-plus'
import { RiDeleteBinLine } from '@remixicon/vue'
import copy from 'copy-to-clipboard'
import { BlockEnum, EditionType } from '@/types'
import type {
  ModelConfig,
  Node,
  NodeOutPutVar,
  Variable,
} from '@/types'
import { CodeLanguage } from '@/components/workflow/nodes/code/types'
import cn from '@/utils/classnames'
import ToggleExpandBtn from '../toggle-expand-btn/index.vue'
import tiptap from '@/components/workflow/tiptap-editor/tiptap.vue'
import {
  Copy,
  CopyCheck,
} from '@/components/base/icons/src/vender/line/files'
import ActionButton from '@/components/base/action-button/index.vue'
import CodeEditor from '@/components/workflow/nodes/_base/editor/code-editor/editor-support-vars.vue'

/**
 * 组件属性定义
 */
interface Props {
  className?: string
  headerClassName?: string
  instanceId?: string
  nodeId?: string
  editorId?: string
  title?: string
  value: string
  readOnly?: boolean
  showRemove?: boolean
  justVar?: boolean
  isChatModel?: boolean
  isChatApp?: boolean
  isShowContext?: boolean
  hasSetBlockStatus?: {
    context: boolean
    history: boolean
    query: boolean
  }
  nodesOutputVars?: NodeOutPutVar[]
  availableNodes?: Node[]
  isSupportFileVar?: boolean
  isSupportPromptGenerator?: boolean
  modelConfig?: ModelConfig
  // for jinja
  isSupportJinja?: boolean
  editionType?: EditionType
  varList?: Variable[]
  containerBackgroundClassName?: string
  gradientBorder?: boolean
  titleTooltip?: string
  inputClassName?: string
  editorContainerClassName?: string
  placeholder?: string
  placeholderClassName?: string
  titleClassName?: string
  required?: boolean
}

const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'remove'): void
  (e: 'copy'): void
  (e: 'expandChange', expand: boolean): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'addVariable', payload: any): void
  (e: 'removeVariable', payload: any): void
}>()

const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
  showRemove: false,
  justVar: false,
  isChatModel: false,
  isChatApp: false,
  isShowContext: false,
  availableNodes: () => [],
  isSupportFileVar: false,
  isSupportPromptGenerator: false,
  isSupportJinja: false,
  varList: () => [],
  gradientBorder: true,
  required: false,
})

const { t } = useI18n()

const containerRef = ref<HTMLDivElement | null>(null)
const isExpand = ref(false)
const wrapClassName = ref('')
const wrapStyle = ref<Record<string, any>>({})
const editorExpandHeight = ref(0)

// 简单的展开/收起逻辑，替代 useToggleExpend hook
const setIsExpand = (expand: boolean) => {
  isExpand.value = expand
  if (expand && containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    editorExpandHeight.value = window.innerHeight - rect.top - 100
    wrapStyle.value = { height: `${editorExpandHeight.value}px` }
    wrapClassName.value = 'fixed inset-0 z-50'
  } else {
    wrapStyle.value = {}
    wrapClassName.value = ''
  }
}

const isCopied = ref(false)
const handleCopy = () => {
  copy(props.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

const isFocus = ref(false)
const setFocus = () => {
  isFocus.value = true
}
const setBlur = () => {
  isFocus.value = false
}


const workflowNodesMapComputed = computed(() => {
  return props.availableNodes.reduce((acc, node) => {
    acc[node.id] = {
      title: node.data!.title,
      type: node.data!.type,
      width: node.width,
      height: node.height,
      position: node.position,
    }
    if (node.data!.type === BlockEnum.Start) {
      acc.sys = {
        title: t('workflow.blocks.start'),
        type: BlockEnum.Start,
      }
    }
    return acc
  }, {} as any)
})
</script>

