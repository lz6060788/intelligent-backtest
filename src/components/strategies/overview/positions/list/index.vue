<template>
  <div
    class="space-y-3 text-sm text-gray-300"
  >
    <div
      v-for="item in data"
      class="flex items-center justify-between bg-gray-900/40 border-solid border border-gray-800 rounded-lg px-3 py-2"
    >
      <div class="flex flex-col">
        <div class="text-white font-semibold">{{ item.symbol }}</div>
        <div class="text-[11px] text-gray-500">
          Avg: {{ item.avgPrice }}
        </div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-300">
          {{ item.qty }} · {{ item.allocation }}
        </div>
        <div
          class="text-sm"
          :class="{
            'text-red-400': item.pnl.startsWith('-'),
            'text-green-400': !item.pnl.startsWith('-'),
          }"
        >
          {{ item.pnl }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any;
}>();
</script>

<style scoped>
</style>