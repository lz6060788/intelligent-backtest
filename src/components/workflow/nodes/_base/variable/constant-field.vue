<template>
  <el-select
    v-if="(schema.type === FormTypeEnum.select || schema.type === FormTypeEnum.dynamicSelect)"
    v-model="selectValue"
    :disabled="readonly"
    :placeholder="schema.placeholder"
    :loading="isLoading"
    @update:modelValue="handleSelectChange"
    @open-change="onOpenChange"
    class="w-full h-8 flex items-center"
  >
    <el-option
      v-for="option in (schema as CredentialFormSchemaSelect).options"
      :key="option.value"
      :label="option.name"
      :value="option.value"
    />
  </el-select>
  <el-input-number
    v-if="schema.type === FormTypeEnum.textNumber"
    v-model="inputValue"
    :disabled="readonly"
    :placeholder="schema.placeholder"
    :min="(schema as CredentialFormSchemaNumberInput).min"
    :max="(schema as CredentialFormSchemaNumberInput).max"
    class="h-8 w-full overflow-hidden rounded-lg bg-workflow-block-parma-bg p-2 text-[13px] font-normal leading-8 text-text-secondary placeholder:text-gray-400 focus:outline-none"
    @change="handleStaticChange"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElSelect, ElOption, ElInputNumber } from 'element-plus'
import type { CredentialFormSchema, CredentialFormSchemaNumberInput, CredentialFormSchemaSelect } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { FormTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { VarKindType } from '@/types'
import type { Var } from '@/types'

interface Props {
  schema: Partial<CredentialFormSchema>
  readonly: boolean
  value: string
  onChange: (value: string | number, varKindType: VarKindType, varInfo?: Var) => void
  onOpenChange?: (open: boolean) => void
  isLoading?: boolean
}
const DEFAULT_SCHEMA = {} as CredentialFormSchema

const props = withDefaults(defineProps<Props>(), {
  schema: DEFAULT_SCHEMA
})
const selectValue = ref(props.value)
const inputValue = ref(props.value)

const handleStaticChange = (value?: string | number) => {
  const numValue = typeof value ==='string' && value!== ''? Number.parseFloat(value) : value
  props.onChange(numValue || '', VarKindType.constant)
}

const handleSelectChange = (value: string | number) => {
  const realValue = value === null? '' : value
  props.onChange(realValue as string, VarKindType.constant)
}
</script>
