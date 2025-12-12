<template>
  <div ref="editorContainer" class="editor-container" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as monaco from 'monaco-editor';

interface Props {
  modelValue: string;
  readonly?: boolean;
  language: string;
  theme?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:modelValue', 'change', 'mounted']);

const editorContainer = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;


// 暴露给父组件的方法
const getSelectedText = (): string => {
  if (!editor) return '';
  const selection = editor.getSelection();
  if (!selection) return '';
  return editor.getModel()?.getValueInRange(selection) || '';
};

const getEditor = () => editor;

// 暴露方法给父组件
defineExpose({
  getSelectedText,
  getEditor,
});

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: props.language || 'plaintext',
      theme: props.theme || 'vs-dark',
      readOnly: props.readonly || false,
      domReadOnly: true,
      quickSuggestions: false,
      lineNumbersMinChars: 1,
      minimap: {
        enabled: false
      },
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      unicodeHighlight: {
        ambiguousCharacters: false,
      },
    });

    editor.onDidChangeModelContent(() => {
      if (editor) {
        emit('update:modelValue', editor.getValue());
        emit('change', editor.getValue());
      }
    });

    emit('mounted', editor, monaco);
  }
});

watch(() => props.language, (val) => {
  if (!editor) {
    return;
  }

  const model = editor.getModel()
  if (!model) {
    return
  }
  monaco.editor.setModelLanguage(model, props.language)
});

watch(() => props.readonly, (val) => {
  if (!editor) {
    return;
  }
  editor.updateOptions({
    readOnly: val
  });
});

watch(() => props.modelValue, (val) => {
  if (editor && editor.getValue() !== val) {
    editor.setValue(val);
  }
});

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
});
</script>

<style scoped>
.monaco-editor-wrapper {
  width: 100%;
  min-height: 100px;
}
.editor-container {
  width: 100%;
  height: 100%;
}
</style>
