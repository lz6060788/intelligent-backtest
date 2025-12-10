<template>
  <ActionButton :size='size' :custom-class="cn('group shrink-0 hover:!bg-red-500', customClass)" @click="clickHandle">
    <RiDeleteBinLine :class="cn('h-4 w-4 text-text-tertiary group-hover:text-white', iconClass)" />
  </ActionButton>
</template>

<script setup lang="ts">
import ActionButton from '@/components/base/action-button/index.vue'
import { RiDeleteBinLine } from '@remixicon/vue'
import cn from '@/utils/classnames'

interface Props {
  customClass?: string;
  iconClass?: string;
  size?: 'xs' | 'm' | 'l' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  iconClass: '',
  size: 'l',
})

const emit = defineEmits(['click'])

const clickHandle = (e: MouseEvent) => {
  emit('click', e)
}
</script>
