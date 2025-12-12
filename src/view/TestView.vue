<template>
  <div class="h-full w-full">
    <!-- <monaco :model-value="''" language="json"></monaco> -->
     <codeEditor
        :node-id="'6546546'"
        :is-in-node="true"
        :readonly="false"
        :language="CodeLanguage.python3"
        :value="value"
        @change="change"
        @generated="handleGeneratedCode"
        :show-code-generator="true"
      ></codeEditor>
  </div>
</template>

<script setup lang="ts">
import monaco from '@/components/base/monaco/index.vue'
import codeEditor from '@/components/workflow/nodes/_base/editor/code-editor/index.vue'
import { CodeLanguage } from '@/components/workflow/nodes/code/types';
import { ref } from 'vue';

const value = ref('')

const change = (value: string) => {
  console.log(value)
}

const handleGeneratedCode = (value: string) => {
  console.log(value)
}
</script>
