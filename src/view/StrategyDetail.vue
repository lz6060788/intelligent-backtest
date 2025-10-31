<template>
  <div class="w-full h-full panel-background-default">
    <workflow></workflow>
  </div>
</template>

<script setup lang="ts">
import workflow from '@/components/strategy-detail/workflow-main/index.vue'
import chart from '@/components/strategy-detail/chat/index.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.query.id;
console.log('id:', id)


const queryAppDetail = () => {}
</script>
