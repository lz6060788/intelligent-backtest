<template>
  <div>
    <template v-if="!inFeaturePanel">
      <Field :title="t('appDebug.variableConfig.file.supportFileTypes')">
        <div class="space-y-1">
          <FileTypeItem
            v-for="type in [
              SupportUploadFileTypes.document,
              SupportUploadFileTypes.image,
              SupportUploadFileTypes.audio,
              SupportUploadFileTypes.video
            ]"
            :key="type"
            :type="type"
            :selected="allowed_file_types.includes(type)"
            @toggle="handleSupportFileTypeChange(type)"
          />
          <!-- <FileTypeItem
            :type="SupportUploadFileTypes.custom"
            :selected="allowed_file_types.includes(SupportUploadFileTypes.custom)"
            @toggle="handleSupportFileTypeChange(SupportUploadFileTypes.custom)"
            :customFileTypes="allowed_file_extensions"
            @custom-file-types-change="handleCustomFileTypesChange"
          /> -->
        </div>
      </Field>
    </template>

    <!-- 上传文件类型设置 -->
    <Field
      :title="t('appDebug.variableConfig.uploadFileTypes')"
      class="mt-4"
    >
      <div class="grid grid-cols-3 gap-2">
        <OptionCard
          :title="t('appDebug.variableConfig.localUpload')"
          :selected="allowed_file_upload_methods.length === 1 && allowed_file_upload_methods.includes(TransferMethod.local_file)"
          @select="handleUploadMethodChange(TransferMethod.local_file)"
        />
        <!-- <OptionCard
          title="URL"
          :selected="allowed_file_upload_methods.length === 1 && allowed_file_upload_methods.includes(TransferMethod.remote_url)"
          @select="handleUploadMethodChange(TransferMethod.remote_url)"
        />
        <OptionCard
          :title="t('appDebug.variableConfig.both')"
          :selected="allowed_file_upload_methods.includes(TransferMethod.local_file) && allowed_file_upload_methods.includes(TransferMethod.remote_url)"
          @select="handleUploadMethodChange(TransferMethod.all)"
        /> -->
      </div>
    </Field>

    <!-- 多文件上传数量限制 -->
    <template v-if="isMultiple">
      <Field
        class="mt-4"
        :title="t('appDebug.variableConfig.maxNumberOfUploads')"
      >
        <div>
          <div class="body-xs-regular mb-1.5 text-text-tertiary">
            {{ t('appDebug.variableConfig.maxNumberTip', {
              imgLimit: formatFileSize(imgSizeLimit),
              docLimit: formatFileSize(docSizeLimit),
              audioLimit: formatFileSize(audioSizeLimit),
              videoLimit: formatFileSize(videoSizeLimit),
            }) }}
          </div>

          <el-input-number
            :model-value="max_length"
            :min="1"
            :max="maxFileUploadLimit"
            @change="handleMaxUploadNumLimitChange"
          />
        </div>
      </Field>
    </template>

    <!-- 特性面板中的支持文件类型设置 -->
    <template v-if="inFeaturePanel && !hideSupportFileType">
      <Field
        :title="t('appDebug.variableConfig.file.supportFileTypes')"
        class="mt-4"
      >
        <div class="space-y-1">
          <FileTypeItem
            v-for="type in [
              SupportUploadFileTypes.document,
              SupportUploadFileTypes.image,
              SupportUploadFileTypes.audio,
              SupportUploadFileTypes.video
            ]"
            :key="type"
            :type="type"
            :selected="allowed_file_types.includes(type)"
            @toggle="handleSupportFileTypeChange(type)"
          />
          <FileTypeItem
            :type="SupportUploadFileTypes.custom"
            :selected="allowed_file_types.includes(SupportUploadFileTypes.custom)"
            @toggle="handleSupportFileTypeChange(SupportUploadFileTypes.custom)"
            :customFileTypes="allowed_file_extensions"
            @custom-file-types-change="handleCustomFileTypesChange"
          />
        </div>
      </Field>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { produce } from 'immer'
import OptionCard from '../option-card.vue' // 假设组件后缀为.vue
import FileTypeItem from './file-type-item.vue'
import Field from '@/components/base/field.vue'
import { InputVarType, TransferMethod } from '@/types'
import { useFileSizeLimit } from '@/hooks'
import { formatFileSize } from '@/utils/format.ts'
import type { UploadFileSetting } from '@/types'
import { SupportUploadFileTypes } from '@/types'

// 定义组件属性
const props = defineProps<{
  payload: UploadFileSetting
  isMultiple: boolean
  inFeaturePanel?: boolean
  hideSupportFileType?: boolean
  onChange: (payload: UploadFileSetting) => void
}>()


const allowed_file_upload_methods = computed(() => props.payload.allowed_file_upload_methods)
const max_length = computed(() => props.payload.max_length)
const allowed_file_types = computed(() => props.payload.allowed_file_types)
const allowed_file_extensions = computed(() => props.payload.allowed_file_extensions)

// 国际化
const { t } = useI18n()

// 文件大小限制
const {
  imgSizeLimit,
  docSizeLimit,
  audioSizeLimit,
  videoSizeLimit,
  maxFileUploadLimit,
} = useFileSizeLimit()

// 处理支持的文件类型变更
const handleSupportFileTypeChange = (type: SupportUploadFileTypes) => {
  const newPayload = produce(props.payload, (draft) => {
    if (type === SupportUploadFileTypes.custom) {
      if (!draft.allowed_file_types.includes(SupportUploadFileTypes.custom)) {
        draft.allowed_file_types = [SupportUploadFileTypes.custom]
      } else {
        draft.allowed_file_types = draft.allowed_file_types.filter(v => v !== type)
      }
    } else {
      // 移除自定义类型
      draft.allowed_file_types = draft.allowed_file_types.filter(
        v => v !== SupportUploadFileTypes.custom
      )
      // 切换当前类型
      if (draft.allowed_file_types.includes(type)) {
        draft.allowed_file_types = draft.allowed_file_types.filter(v => v !== type)
      } else {
        draft.allowed_file_types.push(type)
      }
    }
  })
  props.onChange(newPayload)
}

// 处理上传方式变更
const handleUploadMethodChange = (method: TransferMethod) => {
  const newPayload = produce(props.payload, (draft) => {
    if (method === TransferMethod.all) {
      draft.allowed_file_upload_methods = [
        TransferMethod.local_file,
        TransferMethod.remote_url
      ]
    } else {
      draft.allowed_file_upload_methods = [method]
    }
  })
  props.onChange(newPayload)
}

// 处理自定义文件类型变更
const handleCustomFileTypesChange = (customFileTypes: string[]) => {
  const newPayload = produce(props.payload, (draft) => {
    draft.allowed_file_extensions = customFileTypes.map(v => v)
  })
  props.onChange(newPayload)
}

// 处理最大上传数量变更
const handleMaxUploadNumLimitChange = (value: number) => {
  const newPayload = produce(props.payload, (draft) => {
    draft.max_length = value
  })
  props.onChange(newPayload)
}
</script>