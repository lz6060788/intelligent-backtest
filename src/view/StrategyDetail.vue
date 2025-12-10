<template>
  <div class="w-full h-full panel-background-default">
    <workflow></workflow>
  </div>
</template>

<script setup lang="ts">
import workflow from '@/components/strategy-detail/workflow-main/index.vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.query.id;


const queryAppDetail = () => {}
</script>
