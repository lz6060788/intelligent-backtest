<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t(`appDebug.variableConfig.${isCreate ? 'addModalTitle' : 'editModalTitle'}`)"
    class="custom-dialog"
    width="560px"
  >
    <div ref="modalRef" class="mb-8" tabindex="-1">
      <div class="space-y-2">
        <Field :title="t('appDebug.variableConfig.fieldType')">
          <TypeSelector :value="tempPayload.type" :items="selectOptions" @select="handleTypeChange" />
        </Field>

        <Field :title="t('appDebug.variableConfig.varName')">
          <el-input
            :model-value="tempPayload.variable"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
            @input="handleVarNameInput"
            @blur="handleVarKeyBlur"
          />
        </Field>

        <Field :title="t('appDebug.variableConfig.labelName')">
          <el-input
            :model-value="tempPayload.label as string"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
            @input="(val: string) => handlePayloadChange('label')(val)"
          />
        </Field>

        <Field v-if="isStringInput" :title="t('appDebug.variableConfig.maxLength')">
          <el-input-number
            :model-value="tempPayload.max_length"
            :min="1"
            :max="tempPayload.type === InputVarType.textInput ? TEXT_MAX_LENGTH : Infinity"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
            @input="(val: string) => handlePayloadChange('max_length')(val)"
          />
        </Field>

        <Field v-if="tempPayload.type === InputVarType.textInput" :title="t('appDebug.variableConfig.defaultValue')">
          <el-input
            :model-value="tempPayload.default || ''"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
            @input="(val: string) => handlePayloadChange('default')(val || undefined)"
          />
        </Field>

        <Field v-if="tempPayload.type === InputVarType.paragraph" :title="t('appDebug.variableConfig.defaultValue')">
          <el-input
            v-model="paragraphDefaultValue"
            type="textarea"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
          />
        </Field>

        <Field v-if="tempPayload.type === InputVarType.number" :title="t('appDebug.variableConfig.defaultValue')">
          <el-input
            :model-value="tempPayload.default || ''"
            type="number"
            :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
            @input="(val: string) => handlePayloadChange('default')(val || undefined)"
          />
        </Field>

        <Field v-if="tempPayload.type === InputVarType.checkbox" :title="t('appDebug.variableConfig.defaultValue')">
          <el-select
            :model-value="checkboxDefaultSelectValue"
            class="w-full"
            :placeholder="t('appDebug.variableConfig.selectDefaultValue')"
            @change="(val: string) => handlePayloadChange('default')(parseCheckboxSelectValue(val))"
          >
            <el-option
              :value="CHECKBOX_DEFAULT_TRUE_VALUE"
              :label="t('appDebug.variableConfig.startChecked')"
            />
            <el-option
              :value="CHECKBOX_DEFAULT_FALSE_VALUE"
              :label="t('appDebug.variableConfig.noDefaultSelected')"
            />
          </el-select>
        </Field>

        <template v-if="tempPayload.type === InputVarType.select">
          <Field :title="t('appDebug.variableConfig.options')">
            <ConfigSelect :options="tempPayload.options || []" @change="(val: string[]) => handlePayloadChange('options')(val)" />
          </Field>
          <Field v-if="tempPayload.options && tempPayload.options.length > 0" :title="t('appDebug.variableConfig.defaultValue')">
            <el-select
              :key="`default-select-${tempPayload.options.join('-')}`"
              :model-value="tempPayload.default || ''"
              class="w-full"
              :placeholder="t('appDebug.variableConfig.noDefaultValue')"
              @change="(val: string) => handlePayloadChange('default')(val === '' ? undefined : val)"
              clearable
            >
              <el-option
                v-for="option in tempPayload.options.filter(opt => opt.trim() !== '')"
                :key="option"
                :value="option"
                :label="option"
              />
            </el-select>
          </Field>
        </template>

        <template v-if="[InputVarType.singleFile, InputVarType.multiFiles].includes(tempPayload.type)">
          <FileUploadSetting
            :payload="tempPayload as UploadFileSetting"
            :is-multiple="tempPayload.type === InputVarType.multiFiles"
            @change="(p: UploadFileSetting) => tempPayload = (p as InputVar)"
          ></FileUploadSetting>
          <Field :title="t('appDebug.variableConfig.defaultValue')">
            <!-- <FileUploaderInAttachmentWrapper
              :value="(tempPayload.type === InputVarType.singleFile ? (tempPayload.default ? [tempPayload.default] : []) : (tempPayload.default || [])) as unknown as FileEntity[]"
              :file-config="{
                allowed_file_types: tempPayload.allowed_file_types || [SupportUploadFileTypes.document],
                allowed_file_extensions: tempPayload.allowed_file_extensions || [],
                allowed_file_upload_methods: tempPayload.allowed_file_upload_methods || [TransferMethod.remote_url],
                number_limits: tempPayload.type === InputVarType.singleFile ? 1 : tempPayload.max_length || 5,
              }"
              @change="handleFileChange"
            /> -->
            <el-Button
              :key="TransferMethod.local_file"
              variant="tertiary"
              class="relative grow"
              :disabled="!!(fileConfig.number_limits && (tempPayload.default as File[])?.length >= fileConfig.number_limits)"
            >
              <RiUploadCloud2Line class='h-4 w-4' />
              <span class="ml-1">{{t('appDebug.variableConfig.localUpload')}}</span>
              <FileInput :file-config="fileConfig" :files="tempPayload.default as File[] || []" />
            </el-Button>
          </Field>
        </template>

        <Field v-if="tempPayload.type === InputVarType.jsonObject" :title="t('appDebug.variableConfig.jsonSchema')" is-optional>
          <!-- <CodeEditor
            :language="CodeLanguage.json"
            :value="jsonSchemaStr"
            :no-wrapper="true"
            class="bg h-[80px] overflow-y-auto rounded-[10px] bg-components-input-bg-normal p-1"
            @change="handleJSONSchemaChange"
          >
            <template #placeholder>
              <div class="whitespace-pre">{{ jsonConfigPlaceHolder }}</div>
            </template>
          </CodeEditor> -->
        </Field>

        <div class="!mt-5 flex h-6 items-center space-x-2">
          <el-checkbox
            :model-value="tempPayload.required"
            :disabled="tempPayload.hide"
            @change="(val: boolean) => handlePayloadChange('required')(val)"
          />
          <span class="system-sm-semibold text-text-secondary">{{ t('appDebug.variableConfig.required') }}</span>
        </div>

        <div class="!mt-5 flex h-6 items-center space-x-2">
          <el-checkbox
            :model-value="tempPayload.hide"
            :disabled="tempPayload.required"
            @change="(val: boolean) => handlePayloadChange('hide')(val)"
          />
          <span class="system-sm-semibold text-text-secondary">{{ t('appDebug.variableConfig.hide') }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div className='flex justify-end gap-2'>
        <el-button @click="onClose">{{t('common.operation.cancel')}}</el-button>
        <el-button variant='primary' @click="handleConfirm">{{t('common.operation.save')}}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElNotification } from 'element-plus'
import ConfigSelect from '../config-select/index.vue'
import Field from '@/components/base/field.vue'
import { checkKeys, getNewVarInWorkflow, replaceSpaceWithUnderscoreInVarNameInput } from '@/utils/var'
import type { InputVar, MoreInfo, UploadFileSetting } from '@/types'
import { ChangeType, InputVarType, SupportUploadFileTypes, TransferMethod } from '@/types'
import FileUploadSetting from '@/components/workflow/nodes/_base/file-upload-setting/index.vue'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'
import type { Item as SelectItem } from './type-select.vue'
import TypeSelector from './type-select.vue'
import { jsonObjectWrap } from './config'
import { DEFAULT_FILE_UPLOAD_SETTING } from '@/components/workflow/constant'
import { RiUploadCloud2Line } from '@remixicon/vue'
import { cloneDeep } from 'lodash-es'

const TEXT_MAX_LENGTH = 256
const CHECKBOX_DEFAULT_TRUE_VALUE = 'true'
const CHECKBOX_DEFAULT_FALSE_VALUE = 'false'

/**
 * 获取复选框默认选择值
 */
const getCheckboxDefaultSelectValue = (value: InputVar['default']) => {
  if (typeof value === 'boolean')
    return value ? CHECKBOX_DEFAULT_TRUE_VALUE : CHECKBOX_DEFAULT_FALSE_VALUE
  if (typeof value === 'string')
    return value.toLowerCase() === CHECKBOX_DEFAULT_TRUE_VALUE ? CHECKBOX_DEFAULT_TRUE_VALUE : CHECKBOX_DEFAULT_FALSE_VALUE
  return CHECKBOX_DEFAULT_FALSE_VALUE
}

/**
 * 解析复选框选择值
 */
const parseCheckboxSelectValue = (value: string) =>
  value === CHECKBOX_DEFAULT_TRUE_VALUE

/**
 * ConfigModal 组件的属性定义
 */
interface ConfigModalProps {
  /** 是否为创建模式 */
  isCreate?: boolean
  /** 初始数据 */
  payload?: InputVar
  /** 是否显示 */
  isShow: boolean
  /** 变量键列表 */
  varKeys?: string[]
  /** 关闭回调 */
  onClose: () => void
  /** 确认回调 */
  onConfirm: (newValue: InputVar, moreInfo?: MoreInfo) => void
  /** 是否支持文件 */
  supportFile?: boolean
}

const props = withDefaults(defineProps<ConfigModalProps>(), {
  isCreate: false,
  payload: undefined,
  varKeys: () => [],
  supportFile: false,
})

const emit = defineEmits(['close', 'confirm'])

const { t } = useI18n()
const modalRef = ref<HTMLDivElement | null>(null)

// 对话框显示状态
const dialogVisible = ref(props.isShow)

// 监听 isShow 变化
watch(() => props.isShow, (newVal) => {
  dialogVisible.value = newVal
  nextTick(() => {
    if (modalRef.value) {
      modalRef.value.focus()
    }
  })
})

// 监听 dialogVisible 变化，触发关闭事件
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    props.onClose()
  }
})

// 临时数据
const tempPayload = ref<InputVar>(props.payload || getNewVarInWorkflow('') as any)

// 监听 payload 变化
watch(() => props.payload, (newPayload) => {
  if (newPayload) {
    tempPayload.value = newPayload
  }
}, { immediate: true })

// 段落默认值的响应式引用
const paragraphDefaultValue = computed({
  get: () => String(tempPayload.value.default ?? ''),
  set: (val: string) => {
    handlePayloadChange('default')(val || undefined)
  },
})

// JSON Schema 字符串
const jsonSchemaStr = computed(() => {
  const isJsonObject = tempPayload.value.type === InputVarType.jsonObject
  if (!isJsonObject || !tempPayload.value.json_schema)
    return ''
  try {
    return JSON.stringify(JSON.parse(tempPayload.value.json_schema).properties, null, 2)
  }
  catch {
    return ''
  }
})

// 当对话框显示时，聚焦到第一个元素
watch(() => props.isShow, (isShow) => {
  if (isShow) {
    nextTick(() => {
      modalRef.value?.focus()
    })
  }
})

const isStringInput = computed(() => tempPayload.value.type === InputVarType.textInput || tempPayload.value.type === InputVarType.paragraph)

/**
 * 检查变量名
 */
const checkVariableName = (value: string, canBeEmpty?: boolean) => {
  const { isValid, errorMessageKey } = checkKeys([value], canBeEmpty)
  if (!isValid) {
    ElMessage.error(t(`appDebug.varKeyError.${errorMessageKey}`, { key: t('appDebug.variableConfig.varName') }))
    return false
  }
  return true
}

/**
 * 处理数据变化
 */
const handlePayloadChange = (key: string) => {
  return (value: any) => {
    tempPayload.value = {
      ...tempPayload.value,
      [key]: value,
    }
    if (key === 'options' && !value?.includes(tempPayload.value.default)) {
      tempPayload.value.default = ''
    }
  }
}

/**
 * 处理 JSON Schema 变化
 */
const handleJSONSchemaChange = (value: string) => {
  try {
    const v = JSON.parse(value)
    const res = {
      ...jsonObjectWrap,
      properties: v,
    }
    handlePayloadChange('json_schema')(JSON.stringify(res, null, 2))
  }
  catch {
    return null
  }
}

/**
 * 选择选项列表
 */
const selectOptions = computed<SelectItem[]>(() => {
  const baseOptions: SelectItem[] = [
    {
      name: t('appDebug.variableConfig.text-input'),
      value: InputVarType.textInput,
    },
    {
      name: t('appDebug.variableConfig.paragraph'),
      value: InputVarType.paragraph,
    },
    {
      name: t('appDebug.variableConfig.select'),
      value: InputVarType.select,
    },
    {
      name: t('appDebug.variableConfig.number'),
      value: InputVarType.number,
    },
    {
      name: t('appDebug.variableConfig.checkbox'),
      value: InputVarType.checkbox,
    },
  ]

  // if (props.supportFile) {
  //   baseOptions.push(
  //     {
  //       name: t('appDebug.variableConfig.single-file'),
  //       value: InputVarType.singleFile,
  //     },
  //     {
  //       name: t('appDebug.variableConfig.multi-files'),
  //       value: InputVarType.multiFiles,
  //     },
  //   )
  // }

  // if (!isBasicApp.value && isSupportJSON) {
  //   baseOptions.push({
  //     name: t('appDebug.variableConfig.json'),
  //     value: InputVarType.jsonObject,
  //   })
  // }

  return baseOptions
})

/**
 * 处理类型变化
 */
const handleTypeChange = (item: SelectItem) => {
  const type = item.value as InputVarType
  const newPayload = cloneDeep(tempPayload.value)
  newPayload.type = type
  if ([InputVarType.singleFile, InputVarType.multiFiles].includes(type)) {
    (Object.keys(DEFAULT_FILE_UPLOAD_SETTING)).forEach((key) => {
      if (key !== 'max_length')
        (newPayload as any)[key] = (DEFAULT_FILE_UPLOAD_SETTING as any)[key]
    })
    if (type === InputVarType.multiFiles)
      newPayload.max_length = DEFAULT_FILE_UPLOAD_SETTING.max_length
  }
  if (type === InputVarType.paragraph)
    newPayload.max_length = DEFAULT_VALUE_MAX_LEN
  tempPayload.value = newPayload
}

/**
 * 处理变量名失焦
 */
const handleVarKeyBlur = (e: FocusEvent) => {
  const target = e.target as HTMLInputElement
  const varName = target.value
  if (!checkVariableName(varName, true) || tempPayload.value.label)
    return

  tempPayload.value = {
    ...tempPayload.value,
    label: varName,
  }
}

/**
 * 处理变量名输入
 */
const handleVarNameInput = (value: string) => {
  const input = document.createElement('input')
  input.value = value
  replaceSpaceWithUnderscoreInVarNameInput(input)
  const finalValue = input.value
  const { isValid, errorKey, errorMessageKey } = checkKeys([finalValue], true)
  if (!isValid) {
    ElNotification.error(t(`appDebug.varKeyError.${errorMessageKey}`, { key: errorKey }))
    return
  }
  handlePayloadChange('variable')(finalValue)
}

/**
 * 复选框默认选择值
 */
const checkboxDefaultSelectValue = computed(() => getCheckboxDefaultSelectValue(tempPayload.value.default))

/**
 * 处理文件变化
 */
// const handleFileChange = (files: FileEntity[]) => {
//   if (tempPayload.value.type === InputVarType.singleFile)
//     handlePayloadChange('default')(files?.[0] || undefined)
//   else
//     handlePayloadChange('default')(files || undefined)
// }

/**
 * 处理确认
 */
const handleConfirm = () => {
  console.log(tempPayload.value, props.payload)
  const moreInfo = tempPayload.value.variable === props.payload?.variable
    ? undefined
    : {
        type: ChangeType.changeVarName,
        payload: { beforeKey: props.payload?.variable || '', afterKey: tempPayload.value.variable },
      }

  const isVariableNameValid = checkVariableName(tempPayload.value.variable)
  console.log('isVariableNameValid',isVariableNameValid)
  if (!isVariableNameValid)
    return

  if (!tempPayload.value.label) {
    ElNotification.error(t('appDebug.variableConfig.errorMsg.labelNameRequired'))
    return
  }

  if (isStringInput.value || tempPayload.value.type === InputVarType.number) {
    emit('confirm', tempPayload.value, moreInfo)
  }
  else if (tempPayload.value.type === InputVarType.select) {
    if (tempPayload.value.options?.length === 0) {
      ElNotification.error(t('appDebug.variableConfig.errorMsg.atLeastOneOption'))
      return
    }
    const obj: Record<string, boolean> = {}
    let hasRepeatedItem = false
    tempPayload.value.options?.forEach((o) => {
      if (obj[o]) {
        hasRepeatedItem = true
        return
      }
      obj[o] = true
    })
    if (hasRepeatedItem) {
      ElNotification.error(t('appDebug.variableConfig.errorMsg.optionRepeat'))
      return
    }
    emit('confirm', tempPayload.value, moreInfo)
  }
  else if ([InputVarType.singleFile, InputVarType.multiFiles].includes(tempPayload.value.type)) {
    if (tempPayload.value.allowed_file_types?.length === 0) {
      const errorMessages = t('workflow.errorMsg.fieldRequired', { field: t('appDebug.variableConfig.file.supportFileTypes') })
      ElMessage.error(errorMessages)
      return
    }
    if (tempPayload.value.allowed_file_types?.includes(SupportUploadFileTypes.custom) && !tempPayload.value.allowed_file_extensions?.length) {
      const errorMessages = t('workflow.errorMsg.fieldRequired', { field: t('appDebug.variableConfig.file.custom.name') })
      ElMessage.error(errorMessages)
      return
    }
    emit('confirm', tempPayload.value, moreInfo)
  }
  else {
    emit('confirm', tempPayload.value, moreInfo)
  }
}


const fileConfig = computed(() => ({
  allowed_file_types: tempPayload.value.allowed_file_types || [SupportUploadFileTypes.document],
  allowed_file_extensions: tempPayload.value.allowed_file_extensions || [],
  allowed_file_upload_methods: tempPayload.value.allowed_file_upload_methods || [TransferMethod.remote_url],
  number_limits: tempPayload.value.type === InputVarType.singleFile ? 1 : tempPayload.value.max_length || 5,
}))
</script>

