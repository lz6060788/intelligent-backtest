<template>
  <div class="w-full h-full" :class="wrapperClassName">
    <!-- 编辑器区域 -->
    <div class="h-full w-full" :class="className">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, watch } from 'vue'
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import CharacterCount from '@tiptap/extension-character-count'

import suggestion from './suggestion.js'
import VariableNode from './VariableNode.js'
import type { NodeOutPutVar } from '@/types/var.js'
import { type Node } from '@/types'

type Props = {
  limit?: number;
  vars?: NodeOutPutVar[];
  instanceId?: string
  compact?: boolean
  wrapperClassName?: string
  className?: string
  placeholder?: string
  placeholderClassName?: string
  value?: string
  editable?: boolean
  availableNodes?: Node[]
}

const props = withDefaults(defineProps<Props>(), {
  limit: 1024,
  vars: () => [],
  value: '',
  editable: true,
})

provide('availableNodes', props.availableNodes ?? [])

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'blur', content: { json: Record<string, any>, text: string, html: string }): void
  (e: 'change', content: { json: Record<string, any>, text: string, html: string }): void
  (e: 'created', editor: Editor): void
  (e: 'destroyed'): void
}>()

// --- 初始化编辑器 ---
const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    VariableNode,
    CharacterCount.configure({
      limit: props.limit,
    }),
    Mention.configure({
      deleteTriggerWithBackspace: true,

      suggestion: suggestion({ vars: props.vars, triggerChar: '{' }),
    }),
    Mention.configure({
      deleteTriggerWithBackspace: true,

      suggestion: suggestion({ vars: props.vars, triggerChar: '/' }),
    }),
  ],
  content: props.value,
  editable: props.editable,
  onBlur: () => {
    emit('blur', getContent())
  },
  onFocus: () => {
    emit('focus')
  },
  onUpdate: () => {
    emit('change', getContent())
  },
  onCreate: () => {
    emit('created', editor.value!)
  },
  onDestroy: () => {
    emit('destroyed')
  },
})

const getContent = () => {
  if (editor.value) {
    return {
      json: editor.value.getJSON(),
      text: editor.value.getText(),
      html: editor.value.getHTML(),
    }
  }
  return {
    json: {},
    text: '',
    html: '',
  }
}

// 只读切换
watch(() => props.editable, () => {
  editor.value?.setEditable(props.editable)
})

const clear = () => {
  editor.value?.commands.clearContent()
}

const setContent = (value: string) => {
  editor.value?.commands.setContent(value)
}

defineExpose({
  getContent,
  clear,
  setContent,
})
</script>

<style>
.ProseMirror:focus {
  outline: none;
}

.ProseMirror {
  min-height: 24px;
}

/* 占位符样式 (如果需要的话) */
.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>