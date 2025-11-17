<template>
  <input
    :class="['absolute inset-0 block w-full cursor-pointer text-[0] opacity-0', fileConfig.number_limits && files.length >= fileConfig.number_limits? 'disabled:cursor-not-allowed' : '']"
    @click="resetInputValue"
    type="file"
    @change="handleChange"
    :accept="accept"
    :disabled="fileConfig.number_limits && files.length >= fileConfig.number_limits"
    :multiple="fileConfig.number_limits && fileConfig.number_limits > 1"
  />
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
// import { useFile } from './hooks';
// import type { FileUpload } from '@/app/components/base/features/types';
import { FILE_EXTS } from '@/components/base/prompt-editor/constants';
import { SupportUploadFileTypes } from '@/types';

type FileInputProps = {
  fileConfig: any;
  files: File[];
};

const props = defineProps<FileInputProps>();
const { fileConfig } = props;
// const store = useStore();
// const files = store.state.files;
// const { handleLocalFileUpload } = useFile(fileConfig);
const handleLocalFileUpload = (file?: File) => void 0;

const allowedFileTypes = fileConfig.allowed_file_types;
const isCustom = allowedFileTypes?.includes(SupportUploadFileTypes.custom);
const exts = isCustom? (fileConfig.allowed_file_extensions || []) : (allowedFileTypes?.map((type: SupportUploadFileTypes) => FILE_EXTS[type]) || []).flat().map((item: string) => `.${item}`);
const accept = ref(exts.join(','));

const handleChange = (e: Event) => {
  const targetFiles = (e.target as HTMLInputElement).files;
  if (targetFiles) {
    if (fileConfig.number_limits) {
      for (let i = 0; i < targetFiles.length; i++) {
        if (i + 1 + props.files.length <= fileConfig.number_limits) {
          handleLocalFileUpload(targetFiles[i]);
        }
      }
    } else {
      handleLocalFileUpload(targetFiles[0]);
    }
  }
};

const resetInputValue = (e: Event) => {
  (e.target as HTMLInputElement).value = '';
};
</script>

<style scoped lang="css">
/* 保留原有的CSS样式 */
</style>