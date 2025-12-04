<template>
  <div class="relative">
    <div v-if="showLeftIcon" class="absolute left-3 top-1/2 -translate-y-1/2">
      <i class="i-ri-search-line h-4 w-4 text-text-tertiary" />
    </div>
    <input
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      :class="cn(
        'w-full rounded-lg border border-components-panel-border bg-components-panel-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-components-button-primary-bg',
        showLeftIcon && 'pl-9',
        showClearIcon && modelValue && 'pr-9'
      )"
      :autofocus="autoFocus"
      @input="handleInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
    {{ modelValue }}
    <button
      v-if="showClearIcon && modelValue"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2"
      @click="handleClear"
    >
      <i class="i-ri-close-line h-4 w-4 text-text-tertiary hover:text-text-primary" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cn from '@/utils/classnames'

interface InputProps {
  modelValue?: string
  placeholder?: string
  showLeftIcon?: boolean
  showClearIcon?: boolean
  autoFocus?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  placeholder: '',
  showLeftIcon: false,
  showClearIcon: false,
  autoFocus: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [event: Event]
  'clear': []
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', e)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

