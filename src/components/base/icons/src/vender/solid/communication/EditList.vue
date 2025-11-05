<!-- GENERATE BY script -->
<!-- DO NOT EDIT IT MANUALLY -->
<template>
  <IconBase v-bind="$attrs" :data="data" />
</template>

<script setup lang="ts">
import IconBase from '@/components/base/icons/IconBase.vue'
import data from './EditList.json'
import type { IconData } from '@/components/base/icons/IconBase.vue'

const iconData = data as IconData
</script>

<script lang="ts">
export default {
  name: 'EditListIcon'
}
</script>
