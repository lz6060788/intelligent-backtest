import type {
  CredentialFormSchemaTextInput,
} from './declarations'
import {
  FormTypeEnum,
  MODEL_TYPE_TEXT,
  ModelTypeEnum,
} from './declarations'

export const MODEL_PROVIDER_QUOTA_GET_PAID = ['langgenius/anthropic/anthropic', 'langgenius/openai/openai', 'langgenius/azure_openai/azure_openai']

export const isNullOrUndefined = (value: any) => {
  return value === undefined || value === null
}

export const sizeFormat = (size: number) => {
  const remainder = Math.floor(size / 1000)
  if (remainder < 1)
    return `${size}`
  else
    return `${remainder}K`
}

export const modelTypeFormat = (modelType: ModelTypeEnum) => {
  if (modelType === ModelTypeEnum.textEmbedding)
    return 'TEXT EMBEDDING'

  return modelType.toLocaleUpperCase()
}

export const genModelTypeFormSchema = (modelTypes: ModelTypeEnum[]) => {
  return {
    type: FormTypeEnum.select,
    label: {
      zh_Hans: '模型类型',
      en_US: 'Model Type',
    },
    variable: '__model_type',
    default: modelTypes[0],
    required: true,
    show_on: [],
    options: modelTypes.map((modelType: ModelTypeEnum) => {
      return {
        value: modelType,
        label: {
          zh_Hans: MODEL_TYPE_TEXT[modelType],
          en_US: MODEL_TYPE_TEXT[modelType],
        },
        show_on: [],
      }
    }),
  } as any
}

export const genModelNameFormSchema = (model?: Pick<CredentialFormSchemaTextInput, 'label' | 'placeholder'>) => {
  return {
    type: FormTypeEnum.textInput,
    label: model?.label || {
      zh_Hans: '模型名称',
      en_US: 'Model Name',
    },
    variable: '__model_name',
    required: true,
    show_on: [],
    placeholder: model?.placeholder || {
      zh_Hans: '请输入模型名称',
      en_US: 'Please enter model name',
    },
  } as any
}
