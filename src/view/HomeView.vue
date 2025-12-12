<template>
  <div>
    <monaco :model-value="''" language="json"></monaco>
  </div>
</template>

<script setup lang="ts">
import monaco from '@/components/base/monaco/index.vue'
interface Props {
}

const props = withDefaults(defineProps<Props>(), {
});

</script>
