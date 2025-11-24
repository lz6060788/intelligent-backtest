<template>
    <ActionButton @click="handleClick">
      <RiCollapseDiagonalLine v-if="!isExpand" class="h-4 w-4" />
      <RiExpandDiagonalLine v-else class="h-4 w-4" />
    </ActionButton>
</template>

<script setup lang="ts">
import {
  RiCollapseDiagonalLine,
  RiExpandDiagonalLine,
} from '@remixicon/vue'
import ActionButton from '@/components/base/action-button/index.vue'

const props = defineProps<{
  isExpand: boolean
}>()

const emit = defineEmits<{
  expandChange: [expand: boolean]
}>()

const handleClick = () => {
  emit('expandChange', !props.isExpand)
}

</script>

<style scoped>
</style>