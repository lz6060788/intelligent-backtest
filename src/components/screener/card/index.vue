<template>
  <div
    class="screener-card bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 hover:border-teal/50 transition group flex flex-col h-full min-h-[240px] relative cursor-pointer"
    @click="loadScreenerDetail(data.id)"
  >
    <!-- 操作按钮组 -->
    <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <!-- 分享按钮 -->
      <button
        v-if="showShareBtn"
        class="w-9 h-9 rounded-full bg-gray-900 text-gray-300 border border-gray-800 hover:text-teal hover:border-teal flex items-center justify-center text-xs shadow-sm cursor-pointer"
        @click.stop="shareScreenerToMarketplace(data.id)"
      >
        <RiShareLine class="w-4 h-4" />
      </button>

      <!-- 回测按钮 -->
      <button
        v-if="showBacktestBtn"
        class="w-9 h-9 rounded-full bg-teal text-gray-950 hover:bg-teal-hover font-bold flex items-center justify-center border border-teal shadow-sm cursor-pointer"
        @click.stop="startBacktestFromScreener(data.title || 'Screener')"
      >
        <RiPlayFill class="w-4 h-4" />
      </button>

      <!-- 删除按钮 -->
      <button
        v-if="showDeleteBtn"
        class="w-9 h-9 rounded-full bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 flex items-center justify-center text-xs shadow-sm cursor-pointer"
        @click.stop="emit('delete', data.id)"
      >
        <RiDeleteBin2Fill class="w-4 h-4" />
      </button>
    </div>

    <!-- 卡片头部 -->
    <div class="flex justify-between items-start mb-3 mt-1">
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-teal font-bold text-lg shadow-sm">
          {{ data.title ? data.title[0] : 'S' }}
        </div>
        <div>
          <h3 class="font-bold text-white group-hover:text-teal transition text-sm">{{ data.title }}</h3>
          <div class="text-[10px] text-gray-500 mt-0.5">{{ t(`${i18nPrefix}.lastRun`) }}：{{ data.lastRun || '--' }}</div>
        </div>
      </div>
      <span class="text-[11px] text-gray-500">{{ data.size || data.symbols.length }} {{ t(`${i18nPrefix}.symbols`) }}</span>
    </div>

    <!-- 预览区域 -->
    <div class="bg-gray-900/40 border border-gray-800 rounded-lg p-3 mb-3">
      <div class="text-teal text-sm font-semibold mb-2">{{ t(`${i18nPrefix}.preview`) }}</div>
      <div class="grid grid-cols-3 gap-1 text-xs text-gray-200">
        <span v-for="(symbol, idx) in data.symbols" :key="idx" class="truncate">{{ symbol }}</span>
      </div>
    </div>

    <!-- 标签区域 -->
    <div class="flex items-center gap-2 text-[11px] text-gray-400 flex-wrap">
      <span
        v-for="(tag, idx) in data.tags"
        :key="idx"
        class="px-2 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-200"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiPlayFill, RiDeleteBin2Fill, RiShareLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const i18nPrefix = 'screener.card'

// Props
const props = defineProps<{
  data: any;
  showShareBtn?: boolean;
  showBacktestBtn?: boolean;
  showDeleteBtn?: boolean;
}>()

const emit = defineEmits(['delete'])

const router = useRouter()

const loadScreenerDetail = (id: string) => {
  router.push(`/screener-detail/${id}`)
};

const shareScreenerToMarketplace = (id: string) => {
  console.log(id);
};

const startBacktestFromScreener = (title: string) => {
  console.log(title);
};
</script>