<template>
  <div :class="cn(wrapClassName)" :style="wrapStyle">
    <div
      ref="containerRef"
      :class="cn(
        className,
        isExpand && 'h-full',
        'rounded-lg border border-solid',
        !isFocus
          ? 'border-transparent bg-[#1e1e1e]'
          : 'overflow-hidden border-blue-500 bg-[#1e1e1e]'
      )"
    >
      <div class="flex h-7 items-center justify-between pl-3 pr-2 pt-1">
        <div class="system-xs-semibold-uppercase text-text-secondary">
          <template v-if="$slots.title">
            <slot name="title" />
          </template>
          <template v-else>
            {{ title }}
          </template>
        </div>
        <div
          class="flex items-center"
          @click.stop
        >
          <slot name="headerRight" />
          <action-button @click="handleCopy" size='l' custom-class='group shrink-0'>
            <template v-if="isCopied">
              <copy-check></copy-check>
            </template>
            <template v-else>
              <copy></copy>
            </template>
          </action-button>
          <action-button @click="toggleExpand" size='l' custom-class='group shrink-0 ml-1'>
            <template v-if="isExpand">
              <ArrowUp class="w-4 h-4"></ArrowUp>
            </template>
            <template v-else>
              <ArrowDown class="w-4 h-4"></ArrowDown>
            </template>
          </action-button>
        </div>
      </div>
      <div v-if="tip || $slots.tip" class="px-1 py-0.5">
        {{ tip }}
      </div>
      <div
        class="relative"
      >
        <div
          :class="cn('overflow-y-auto')"
          :style="{
            height: `${isExpand ? editorExpandHeight : editorContentHeight}px`,
          }"
        >
          <div class="h-full pb-2 pl-2">
            <slot />
          </div>
        </div>
        <div
          v-if="!isExpand"
          class="absolute bottom-0 left-0 flex h-2 w-full cursor-row-resize justify-center"
          @mousedown="handleStartResize"
        >
          <div class="h-[3px] w-5 rounded-sm bg-gray-300" />
        </div>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton } from 'element-plus'
import {
  Copy,
  CopyCheck,
} from '@/components/base/icons/src/vender/line/files'
import { ArrowUp, ArrowDown, Document } from '@element-plus/icons-vue'
import cn from '@/utils/classnames'
import type { CodeLanguage } from '../../code/types'
import type { Node, NodeOutPutVar } from '@/types'
import ActionButton from '@/components/base/action-button/index.vue'


interface Props {
  nodeId?: string
  className?: string
  title?: string
  minHeight?: number
  value: string
  isFocus: boolean
  isInNode?: boolean
  codeLanguages?: CodeLanguage
//   showCodeGenerator?: boolean
  tip?: string
  nodesOutputVars?: NodeOutPutVar[]
  availableNodes?: Node[]
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 120,
  fileList: () => [],
  showFileList: false,
  showCodeGenerator: false,
})

const emit = defineEmits<{
  generated: [prompt: string]
}>()

const containerRef = ref<HTMLDivElement | null>(null)

// useToggleExpend hook 的逻辑实现
const isExpand = ref(false)
const editorExpandHeight = ref(600) // 默认展开高度

const wrapClassName = computed(() => {
  return props.isInNode ? '' : 'relative'
})

const wrapStyle = computed(() => {
  return {}
})

const toggleExpand = () => {
  isExpand.value = !isExpand.value
}

const editorContentMinHeight = computed(() => props.minHeight - 28)
const editorContentHeight = ref(editorContentMinHeight.value)

// 复制功能
const isCopied = ref(false)
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = props.value
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
    document.body.removeChild(textArea)
  }
}

// // 代码生成功能
// const handleCodeGenerate = () => {
//   emit('generated', props.value)
// }

// 高度调整功能（PromptEditorHeightResizeWrap 的逻辑）
const isResizing = ref(false)
const resizeStartY = ref(0)
const resizeStartHeight = ref(0)

const handleStartResize = (e: MouseEvent) => {
  isResizing.value = true
  resizeStartY.value = e.clientY
  resizeStartHeight.value = editorContentHeight.value
  document.body.style.userSelect = 'none'
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return
    const offset = e.clientY - resizeStartY.value
    let newHeight = resizeStartHeight.value + offset
    if (newHeight < editorContentMinHeight.value) {
      newHeight = editorContentMinHeight.value
    }
    editorContentHeight.value = newHeight
  }
  
  const handleMouseUp = () => {
    isResizing.value = false
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

