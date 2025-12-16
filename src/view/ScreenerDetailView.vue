<template>
<div class="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
    <DetailHeader />

    <div class="space-y-5">
        <SymbolPool />

        <FactorExposure />

        <HistoricalHitRate />
    </div>
</div>

</template>

<script setup lang="ts">
import SymbolPool from '@/components/screener/symbol-pool/index.vue'
import FactorExposure from '@/components/screener/factor-exposure/index.vue'
import HistoricalHitRate from '@/components/screener/historical-hit-rate/index.vue'
import DetailHeader from '@/components/screener/detail-header/index.vue'


</script>

<style scoped>
</style>