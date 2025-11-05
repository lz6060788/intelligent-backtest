<!-- GENERATE BY script -->
<!-- DO NOT EDIT IT MANUALLY -->
<template>
  <span 
    :class="[s.wrapper, className]" 
    v-bind="$attrs"
    ref="ref"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cn from '@/utils/classnames'
import s from './Tongyi.module.css'

const props = defineProps<{
  className?: string
  ref?: any
}>()
</script>

<script lang="ts">
export default {
  name: 'TongyiIcon'
}
</script>
