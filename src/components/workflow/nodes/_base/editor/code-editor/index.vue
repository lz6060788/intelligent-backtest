<template>
  <div :class="cn([isExpand && 'h-full', className])">
    <template v-if="noWrapper">
      <div class="no-wrapper relative" :style="{
          height: isExpand ? '100%' : (editorContentHeight / 2 + CODE_EDITOR_LINE_HEIGHT),
          minHeight: CODE_EDITOR_LINE_HEIGHT
      }">
          <MonacoEditor
            :model-value="outPutValue"
            :readonly="readOnly"
            :language="languageMap[props.language] || 'javascript'"
            @change="handleEditorChange"
            @mounted="handleEditorDidMount"
          ></MonacoEditor>
          <template v-if="placeholder && !isFocus">
            <div class="pointer-events-none absolute left-[36px] top-0 text-[13px] font-normal leading-[18px] text-gray-300">
              {{ placeholder }}
            </div>
          </template>
      </div>
    </template>
    <template v-else>
      <Base
        :node-id="nodeId"
        :class="cn(['relative'])"
        :title="title"
        :value="outPutValue"
        :is-focus="isFocus &&!readOnly"
        :min-height="minHeight"
        :is-in-node="isInNode"
        :code-languages="language"
        :footer="footer"
      >
        <template #title>
          <slot name="title"></slot>
        </template>
        <template #headerRight>
          <slot name="headerRight"></slot>
        </template>
        <template #tip>
          <slot name="tip"></slot>
        </template>
        <template #footer>
          <slot name="footer"></slot>
        </template>
        <MonacoEditor
          :model-value="outPutValue"
          :readonly="readOnly"
          :language="languageMap[props.language] || 'javascript'"
          @change="handleEditorChange"
          @mounted="handleEditorDidMount"
        ></MonacoEditor>
        <template v-if="placeholder && !isFocus">
          <div class="pointer-events-none absolute left-[36px] top-0 text-[13px] font-normal leading-[18px] text-gray-300">
            {{ placeholder }}
          </div>
        </template>
      </Base>
    </template>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type Component, type VNode, onUnmounted } from 'vue';
import { ElCard } from 'element-plus';
import cn from '@/utils/classnames';
import { CodeLanguage } from '@/components/workflow/nodes/code/types';
//   import { Theme } from '@/types';
//   import useTheme from '@/hooks/use-theme';
import { debounce, noop } from 'lodash-es';
import MonacoEditor from '@/components/base/monaco/index.vue';
import Base from '../base.vue';
// import MonacoEditor from '@monaco-editor/vue3';

const CODE_EDITOR_LINE_HEIGHT = 18;

interface Props {
  nodeId?: string;
  value?: string | object;
  placeholder?: string;
  title?: string;
  language: CodeLanguage;
  readOnly?: boolean;
  isJSONStringifyBeauty?: boolean;
  height?: number;
  isInNode?: boolean;
  noWrapper?: boolean;
  isExpand?: boolean;
  showFileList?: boolean;
  showCodeGenerator?: boolean;
  className?: string;
  footer?: any;
}

defineSlots<{
    placeholder?: () => VNode;
    title?: () => VNode;
    headerRight?: () => VNode;
    tip?: () => VNode;
    footer?: () => VNode;
}>();

const emit = defineEmits<{
    (e: 'change', value: string): void;
    (e: 'mount', editor: any, monaco: any): void;
    (e: 'generated', value: string): void;
}>();

const props = withDefaults(defineProps<Props>(), {});

const isFocus = ref(false);
const isMounted = ref(false);
const minHeight = computed(() => props.height || 200);
const editorContentHeight = ref(56);
const valueRef = ref(props.value);

watch(() => props.value, (newValue) => {
  valueRef.value = newValue;
});


const editorRef = ref<any>(null);
const resizeEditorToContent = () => {
if (editorRef.value) {
    const contentHeight = editorRef.value.getContentHeight();
    editorContentHeight.value = contentHeight;
}
};

const handleEditorChange = (value: string | undefined) => {
  emit('change', value || '');
  setTimeout(() => {
    resizeEditorToContent();
  }, 10);
};

const handleEditorDidMount = (editor: any, monaco: any) => {
  console.log('handleEditorDidMount', editor, monaco)
  editorRef.value = editor;
  resizeEditorToContent();

  editor.onDidFocusEditorText(() => {
      isFocus.value = true;
  });
  editor.onDidBlurEditorText(() => {
      isFocus.value = false;
  });

  emit('mount', editor, monaco);
  isMounted.value = true;
};

const outPutValue = computed(() => {
  if (!props.isJSONStringifyBeauty)
      return props.value as string;
  try {
      return JSON.stringify(props.value as object, null, 2);
  } catch {
      return props.value as string;
  }
});


const languageMap = {
  [CodeLanguage.javascript]: 'javascript',
  [CodeLanguage.python3]: 'python',
  [CodeLanguage.json]: 'json'
};
</script>
