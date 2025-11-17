<template>
  <div :class="[props.isExpand && 'h-full']">
    <Editor
      v-bind="props"
      @mounted="onEditorMounted"
      :placeholder="t('workflow.common.jinjaEditorPlaceholder')"
    />
    <div
      v-if="isShowVarPicker"
      ref="popupRef"
      :class="['w-[228px] space-y-1 rounded-lg border border-components-panel-border bg-components-panel-bg p-1 shadow-lg']"
      :style="{
        position: 'fixed',
        top: popupPosition.y,
        left: popupPosition.x,
        zIndex: 100
      }"
    >
      <VarReferenceVars
        :hideSearch="true"
        :vars="availableVars"
        @change="handleSelectVar"
        :isSupportFileVar="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import type { NodeOutPutVar, Variable } from '@/types';
import Editor from '.';
import type { Props as EditorProps } from '.'
import { useI18n } from 'vue-i18n';
import VarReferenceVars from '@/components/workflow/nodes/_base/variable/var-reference-vars/index.vue';

type EditorType = typeof Editor;

const props = defineProps<{
  availableVars: NodeOutPutVar[];
  varList: Variable[];
  onAddVar?: (payload: Variable) => void;
} & EditorProps>();

const { t } = useI18n();

const isLeftBraceRef = ref(false);
const editorRef = ref<EditorType>();
const monacoRef = ref(null);
const popupRef = ref<HTMLDivElement>();
const isShowVarPicker = ref(false);
const popupPosition = ref({ x: 0, y: 0 });

const TO_WINDOW_OFFSET = 8;

// Listen for cursor position changes
const handleCursorPositionChange = (event: any) => {
  const editor = editorRef.value!;
  const { position } = event;
  const text = editor.getModel().getLineContent(position.lineNumber);
  const charBefore = text[position.column - 2];
  if (['/', '{'].includes(charBefore)) {
    isLeftBraceRef.value = charBefore === '{';
    const editorRect = editor.getDomNode().getBoundingClientRect();
    const cursorCoords = editor.getScrolledVisiblePosition(position);

    const popupX = editorRect.left + cursorCoords.left;
    const popupY = editorRect.top + cursorCoords.top + 20;

    popupPosition.value = { x: popupX, y: popupY };
    isShowVarPicker.value = true;
  } else {
    isShowVarPicker.value = false;
  }
};

watch(isShowVarPicker, () => {
  if (isShowVarPicker.value && popupRef.value) {
    const windowWidth = window.innerWidth;
    const { width, height } = popupRef.value.getBoundingClientRect();
    const newPopupPosition = { ...popupPosition.value };
    if (popupPosition.value.x + width > windowWidth - TO_WINDOW_OFFSET)
      newPopupPosition.x = windowWidth - width - TO_WINDOW_OFFSET;

    if (popupPosition.value.y + height > window.innerHeight - TO_WINDOW_OFFSET)
      newPopupPosition.y = window.innerHeight - height - TO_WINDOW_OFFSET;

    if (newPopupPosition.x!== popupPosition.value.x || newPopupPosition.y!== popupPosition.value.y)
      popupPosition.value = newPopupPosition;
  }
});

const onEditorMounted = (editor: any, monaco: any) => {
  editorRef.value = editor;
  monacoRef.value = monaco;
  editor.onDidChangeCursorPosition(handleCursorPositionChange);
};

const getUniqVarName = (varName: string) => {
  if (props.varList.find(v => v.variable === varName)) {
    const match = varName.match(/_(\d+)$/);

    const index = (() => {
      if (match)
        return parseInt(match[1]!) + 1;

      return 1;
    })();
    return getUniqVarName(`${varName.replace(/_(\d+)$/, '')}_${index}`);
  }
  return varName;
};

const getVarName = (varValue: string[]) => {
  const existVar = props.varList.find(v => Array.isArray(v.value_selector) && v.value_selector.join('@@@') === varValue.join('@@@'));
  if (existVar) {
    return {
      name: existVar.variable,
      isExist: true
    };
  }
  const varName = varValue.slice(-1)[0];
  return {
    name: getUniqVarName(varName ?? ''),
    isExist: false
  };
};

const handleSelectVar = (varValue: string[]) => {
  const { name, isExist } = getVarName(varValue);
  if (!isExist) {
    const newVar: Variable = {
      variable: name,
      value_selector: varValue
    };

    props.onAddVar?.(newVar);
  }
  const editor = editorRef.value;
  const monaco = monacoRef.value;
  const position = editor?.getPosition();

  // Insert the content at the cursor position
  editor?.executeEdits('', [
    {
      range: new monaco!.Range(position.lineNumber, position.column - 1, position.lineNumber, position.column),
      text: `{{ ${name} }${!isLeftBraceRef.value? '}' : ''}`
    }
  ]);

  isShowVarPicker.value = false;
};
</script>

<style scoped>
/* 这里可以添加组件内的样式 */
</style>