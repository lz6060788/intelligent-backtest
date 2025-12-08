<template>
  <el-select
    :model-value="value"
    @change="emit('change', $event)"
    :options="options"
    class="w-full"
    :offset="0"
    :show-arrow="false"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CalculatorArgumentValueTypeEnum } from '../../constant/enums'
import type { CalculatorArgument } from '../../types';


interface VariableTypeSelectProps {
  value?: string
  template: CalculatorArgument
}

const emit = defineEmits<{
  (e: 'change', value: CalculatorArgumentValueTypeEnum): void
}>()

const props = defineProps<VariableTypeSelectProps>()

const options = computed(() => {
  return props.template.valueType.map(item => {
    return {
      label: item,
      value: item,
    }
  })
})

</script>

