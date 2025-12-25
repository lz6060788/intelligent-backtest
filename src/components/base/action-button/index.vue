<template>
  <button
    v-bind="props"
    :ref="ref"
    :class="cn(
      'inline-flex justify-center items-center cursor-pointer outline-none text-text-tertiary hover:bg-state-base-hover',
      actionButtonVariants({ size, className: customClass }),
      customClass
    )"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { cva } from 'class-variance-authority'
import cn from '@/utils/classnames'

type ActionButtonProps = {
  size?: 'xs' | 'm' | 'l' | 'xl';
  customClass?: string;
}

const actionButtonVariants = cva(
  'action-btn',
  {
    variants: {
      size: {
        xs: 'action-btn-xs',
        m: 'action-btn-m',
        l: 'action-btn-l',
        xl: 'action-btn-xl',
      },
    },
    defaultVariants: {
      size: 'm',
    },
  },
)

const props = withDefaults(defineProps<ActionButtonProps>(), {
  size: 'm',
});

</script>

