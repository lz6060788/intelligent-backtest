<template>
  <div
    class="h-full bg-[var(--sidemenu-background)] flex flex-col items-center space-y-1 transition-all duration-300"
    :class="{ 'w-[var(--width-sidemenu-collapsed)]': isCollapsed, 'w-[var(--width-sidemenu)]': !isCollapsed }"
  >
    <div class="py-4 px-2 flex-1 w-full">
      <!-- 菜单项 -->
      <router-link to="/" class="no-underline w-full overflow-hidden">
        <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
          hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer shrink-0"
          :class="{ 'text-teal': isActive('/') }"
        >
          <RiFilter2Fill class="w-5 h-5 mr-2" />
          <div class="flex-1 w-0 overflow-hidden">
            <span v-if="!isCollapsed" class="shrink-0 whitespace-nowrap">{{ t(`${i18nPrefix}.home`) }}</span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="h-10 w-full flex items-center px-2 border-0 border-t border-solid border-gray-8 overflow-hidden">
      <div class="w-full h-8 px-1 flex items-center justify-start font-bold text-gray-400 hover:text-teal
        hover:bg-gray-800 rounded-md transition-colors duration-300 cursor-pointer shrink-0"
        @click="isCollapsed = !isCollapsed"
      >
        <RiListUnordered class="w-5 h-5 mr-2" />
        <div class="flex-1 w-0 overflow-hidden">
          <span v-if="!isCollapsed" class="shrink-0 whitespace-nowrap">{{ t(`common.operation.collapse`) }}</span>
        </div>
      </div>
    </div>
    <!-- <router-link to="/screener" class="no-underline w-full">
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
    </router-link> -->
  </div>
</template>

<script setup lang="ts">
import { RiFilter2Fill, RiLineChartFill, RiPieChart2Fill, RiCommunityFill,RiListUnordered } from '@remixicon/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const i18nPrefix = 'layout.sideMenu'

const { t } = useI18n()

const route = useRoute()
const isActive = (path: string) => route.path.startsWith(path)

const isCollapsed = ref(false)
</script>
