<template>
  <Handle
    :id="props.handleId"
    :class="props.handleClassName"
    type="target"
    :position="Position.Left"
  >
    <!-- <div class="custom-handle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div> -->
  </Handle>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { type HandleProps } from '@/types/node';

const props = withDefaults(defineProps<HandleProps>(), {});
</script>
