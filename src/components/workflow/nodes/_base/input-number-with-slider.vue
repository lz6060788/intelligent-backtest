<template>
  <div class="flex h-8 items-center justify-between space-x-2">
    <input
      :value="value"
      class="block h-8 w-12 shrink-0 appearance-none rounded-lg bg-components-input-bg-normal pl-3 text-[13px] text-components-input-text-filled outline-none"
      type="number"
      :min="min"
      :max="max"
      step="1"
      @change="handleChange"
      @blur="handleBlur"
      :disabled="readonly"
    />
    <Slider
      class="grow"
      :value="value"
      :min="min"
      :max="max"
      step="1"
      @change="onChange"
      :disabled="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import Slider from './base/slider.vue' // 假设Slider组件路径对应调整

interface InputNumberWithSliderProps {
  value: number
  defaultValue?: number
  min?: number
  max?: number
  readonly?: boolean
  onChange: (value: number) => void
}

const props = defineProps<InputNumberWithSliderProps>()

const handleBlur = () => {
  if (props.value === undefined || props.value === null) {
    props.onChange(props.defaultValue || 0)
    return
  }
  if (props.max !== undefined && props.value > props.max) {
    props.onChange(props.max)
    return
  }
  if (props.min !== undefined && props.value < props.min) {
    props.onChange(props.min)
  }
}

const handleChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  props.onChange(Number.parseFloat(input.value))
}
</script>