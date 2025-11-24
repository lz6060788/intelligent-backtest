<template>
  <ActionButton size='l' custom-class='group shrink-0 hover:!bg-red-500' @click="clickHandle">
    <RiDeleteBinLine class='h-4 w-4 text-text-tertiary group-hover:text-white' />
  </ActionButton>
</template>

<script setup lang="ts">
import ActionButton from '@/components/base/action-button/index.vue'
import { RiDeleteBinLine } from '@remixicon/vue'

interface Props {
  customClass?: string;
}

const emit = defineEmits(['click'])

const clickHandle = (e: MouseEvent) => {
  emit('click', e)
}
</script>
