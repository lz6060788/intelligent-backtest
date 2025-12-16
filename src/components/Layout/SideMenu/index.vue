<template>
  <div class="h-full w-[var(--width-sidemenu)] bg-[var(--sidemenu-background)] flex flex-col items-center py-4 px-2 space-y-1">
    <!-- 菜单项 -->
    <div
      class="w-full h-8 px-1 flex items-center justify-start font-bold text-white hover:text-teal
      hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer"
    >
      <router-link to="/" class="no-underline">{{ t(`${i18nPrefix}.home`) }}</router-link>
    </div>
    <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-white hover:text-teal
      hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer">
      <router-link to="/test" class="no-underline">{{ t(`${i18nPrefix}.test`) }}</router-link>
    </div>
    <router-link to="/screener" class="no-underline w-full">
      <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
        hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer"
        :class="{ 'text-teal': isActive('/screener') }"
      >
        <RiFilter2Fill class="w-5 h-5 mr-2" />
        <span>{{ t(`${i18nPrefix}.screener`) }}</span>
      </div>
    </router-link>
    <router-link to="/strategy-list" class="no-underline w-full">
      <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
        hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer"
        :class="{ 'text-teal': isActive('/strategy-') }"
      >
        <RiLineChartFill class="w-5 h-5 mr-2" />
        <span>{{ t(`${i18nPrefix}.strategyList`) }}</span>
      </div>
    </router-link>
    <router-link to="/trading" class="no-underline w-full">
      <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
        hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer"
        :class="{ 'text-teal': isActive('/trading') }"
      >
        <RiPieChart2Fill class="w-5 h-5 mr-2" />
        <span>{{ t(`${i18nPrefix}.trading`) }}</span>
      </div>
    </router-link>
    <router-link to="/community" class="no-underline w-full">
      <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
        hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer"
        :class="{ 'text-teal': isActive('/community') }"
      >
        <RiCommunityFill class="w-5 h-5 mr-2" />
        <span>{{ t(`${i18nPrefix}.community`) }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { RiFilter2Fill, RiLineChartFill, RiPieChart2Fill, RiCommunityFill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const i18nPrefix = 'layout.sideMenu'

const { t } = useI18n()

const route = useRoute()
const isActive = (path: string) => route.path.startsWith(path)
</script>
