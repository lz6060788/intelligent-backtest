<script setup lang="ts">
import LayoutHeader from '@/components/Layout/Header/index.vue'
import LayoutSideMenu from '@/components/Layout/SideMenu/index.vue'
</script>

<template>
  <div class="w-screen h-screen bg-[var(--global-background)] text-color-default">
    <LayoutHeader></LayoutHeader>
    <div class="h-[calc(100%-var(--height-header))] w-full flex">
      <LayoutSideMenu></LayoutSideMenu>
      <div class="h-full flex-1 overflow-y-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
