<!-- GENERATE BY script -->
<!-- DO NOT EDIT IT MANUALLY -->
<template>
  <IconBase v-bind="$attrs" :data="data" />
</template>

<script setup lang="ts">
import IconBase from '@/components/base/icons/IconBase.vue'
import data from './ListFilter.json'
import type { IconData } from '@/components/base/icons/IconBase.vue'

const iconData = data as IconData
</script>

<script lang="ts">
export default {
  name: 'ListFilterIcon'
}
</script>
