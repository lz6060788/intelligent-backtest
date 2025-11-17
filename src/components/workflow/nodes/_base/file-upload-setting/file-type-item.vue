<template>
  <div
    :class="[
      'cursor-pointer select-none rounded-lg border border-solid',
      isCustomSelected? 'pb-0' : 'px-3 py-2',
      selected? 'border-[1.5px] border-blue-5' : 'border-gray-5',
      !selected? 'hover:border-components-option-card-option-border-hover hover:bg-components-option-card-option-bg-hover' : ''
    ]"
    @click="handleOnSelect"
  >
    <template v-if="isCustomSelected">
      <div class="flex items-center border-b border-divider-subtle p-3 pb-2">
        <FileTypeIcon class="shrink-0" :type="type as any" size="lg" />
        <div class="system-sm-medium mx-2 grow text-text-primary">{{ $t(`appDebug.variableConfig.file.${type}.name`) }}</div>
        <el-checkbox class="shrink-0" :model-value="selected" />
      </div>
      <!-- <div class="p-3" @click.stop>
        <TagInput
          :items="customFileTypes"
          @change="onCustomFileTypesChange"
          :placeholder="$t('appDebug.variableConfig.file.custom.createPlaceholder')"
        />
      </div> -->
    </template>
    <template v-else>
      <div class="flex items-center">
        <FileTypeIcon class="shrink-0" :type="type as any" size="lg" />
        <div class="mx-2 grow">
          <div class="system-sm-medium text-xs">{{ $t(`appDebug.variableConfig.file.${type}.name`) }}</div>
          <div class="system-2xs-regular-uppercase mt-1 text-xs text-gray-4">
            {{ FILE_EXTS[type]?.join(', ') }}
          </div>
        </div>
        <el-checkbox class="shrink-0" :model-value="selected" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import TagInput from '@/components/base/tag-input.vue'
import FileTypeIcon from '@/components/base/file-type-icon/index.vue'
import { SupportUploadFileTypes } from '@/types'
import { FILE_EXTS } from '@/components/base/prompt-editor/constants'
import { noop } from 'lodash-es'

type Props = {
  type: SupportUploadFileTypes.image | SupportUploadFileTypes.document | SupportUploadFileTypes.audio | SupportUploadFileTypes.video | SupportUploadFileTypes.custom
  selected: boolean
  onToggle: (type: SupportUploadFileTypes) => void
  onCustomFileTypesChange?: (customFileTypes: string[]) => void
  customFileTypes?: string[]
}

const props = defineProps<Props>()
const { onToggle, onCustomFileTypesChange = noop, customFileTypes = [] } = props
const { t } = useI18n()

const handleOnSelect = () => {
  onToggle(props.type)
}

const isCustomSelected = computed(() => props.type === SupportUploadFileTypes.custom && props.selected)
</script>

<style scoped lang="css">
</style>