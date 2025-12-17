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
import { OperatorArgumentValueTypeEnum } from '../../constant/enums'
import type { OperatorArgument } from '../../types';


interface VariableTypeSelectProps {
  value?: string
  template: OperatorArgument
}

const emit = defineEmits<{
  (e: 'change', value: OperatorArgumentValueTypeEnum): void
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

