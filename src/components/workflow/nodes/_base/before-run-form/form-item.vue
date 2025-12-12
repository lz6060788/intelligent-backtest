<template>
  <div :class="cn(className)">
    <div v-if="!isBooleanType" class="system-sm-semibold mb-1 flex h-6 items-center gap-1 text-text-secondary">
      <div class="truncate">
        {{ payload.label }}
      </div>
      <span
        v-if="payload.hide === true"
        class="text-xs text-text-tertiary"
      >
        {{ t('workflow.panel.optional_and_hidden') }}
      </span>
      <span
        v-else-if="!payload.required"
        class="text-xs text-text-tertiary"
      >
        {{ t('workflow.panel.optional') }}
      </span>
    </div>
    <div class="grow">
      <el-select
        v-if="type === InputVarType.select"
        v-model="selectValue"
        class="w-full"
        :filterable="false"
        @change="handleSelectChange"
      >
        <el-option
          v-for="option in selectOptions"
          :key="option.value"
          :label="option.name"
          :value="option.value"
        />
      </el-select>

      <el-input
        v-if="type === InputVarType.textInput"
        :model-value="value || ''"
        :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
        :autofocus="autoFocus"
        @update:model-value="handleInputChange"
      />

      <el-input
        v-if="type === InputVarType.number"
        type="number"
        :model-value="value || ''"
        :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
        :autofocus="autoFocus"
        @update:model-value="handleInputChange"
      />

      <el-input
        v-if="type === InputVarType.paragraph"
        type="textarea"
        :model-value="value || ''"
        :placeholder="t('appDebug.variableConfig.inputPlaceholder')"
        :autofocus="autoFocus"
        @update:model-value="handleInputChange"
      />

      <BoolInput
        v-if="isBooleanType"
        :name="payload.label as string"
        :value="!!value"
        :required="payload.required"
        @change="emit('change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { InputVar } from '@/types'
import { InputVarType } from '@/types'
import cn from '@/utils/classnames'
import BoolInput from './bool-input.vue'

interface Props {
  payload: InputVar
  value: any
  className?: string
  autoFocus?: boolean
  inStepRun?: boolean
}

const emit = defineEmits<{
  change: [value: any]
}>()

const props = withDefaults(defineProps<Props>(), {
  inStepRun: false,
})

const { t } = useI18n()
const { type } = props.payload

const isBooleanType = computed(() => type === InputVarType.checkbox)

const selectValue = computed({
  get: () => props.value || props.payload.default || '',
  set: (val) => emit('change', val),
})

const selectOptions = computed(() =>
  props.payload.options?.map(option => ({ name: option, value: option })) || []
)

const handleSelectChange = (val: any) => {
  emit('change', val)
}

const handleInputChange = (val: string) => {
  emit('change', val)
}
</script>

