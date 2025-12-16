<template>
  <div
    :key="data.id"
    class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 hover:border-teal/50 transition cursor-pointer group flex flex-col h-full min-h-[260px] relative"
    @click="loadStrategyDetail(data.id)"
  >
    <!-- 操作按钮组 -->
    <div
      class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <!-- 分享按钮 -->
      <button
        class="w-9 h-9 rounded-full bg-gray-900 text-gray-300 border-solid border border-gray-800 hover:text-teal hover:border-teal flex items-center justify-center text-xs shadow-sm"
        @click.stop="shareStrategyToMarketplace(data.id)"
      >
        <RiShare2Fill class="w-4 h-4" />
      </button>

      <!-- 连接按钮 -->
      <button
        class="w-9 h-9 rounded-full bg-teal/10 text-teal border-solid border border-teal hover:bg-teal/20 flex items-center justify-center text-xs shadow-sm"
        @click.stop="openConnectModal(data.id)"
      >
          <RiPlugFill class="w-4 h-4" />
      </button>

      <!-- 删除按钮 -->
      <button
        class="w-9 h-9 rounded-full bg-red-500/10 text-red-400 border-solid border border-red-500/40 hover:bg-red-500/20 flex items-center justify-center text-xs shadow-sm"
        @click.stop="removeFromLibrary(data.id)"
      >
        <RiDeleteBin2Fill class="w-4 h-4" />
      </button>
    </div>

    <!-- 卡片头部 -->
    <div class="flex justify-between items-start mb-4 mt-2">
      <div class="flex gap-3">
        <div
          class="w-10 h-10 rounded-lg bg-gray-900 border-solid border border-gray-800 flex items-center justify-center text-teal font-bold text-lg shadow-sm"
        >
          {{ data.symbol ? data.symbol[0] : "S" }}
        </div>
        <div>
          <h3
            class="font-bold text-white group-hover:text-teal transition text-sm"
          >
            {{ data.title }}
          </h3>
          <div
            class="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5"
          >
            <i class="fa-regular fa-comment-dots text-teal"></i>
            <span>{{ data.isMine ? t(`${i18nPrefix}.mine`) : t(`${i18nPrefix}.community`) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益曲线可视化 -->
    <div
      class="h-24 w-full bg-gray-900/30 rounded-lg relative overflow-hidden border-solid border-b border-gray-800/50 flex-shrink-0"
    >
      <svg
        viewBox="0 0 100 40"
        class="w-full h-full stroke-teal fill-none stroke-2 drop-shadow-[0_0_8px_rgba(0,219,195,0.2)]"
      >
        <path
          d="M0,35 C20,35 40,25 50,20 S80,5 100,2"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <div class="absolute bottom-1 right-2 text-lg font-bold text-green-400">
        {{ data.stats.profit || "--" }}
      </div>
    </div>

    <!-- 策略统计数据 -->
    <div
      class="grid grid-cols-4 gap-2 text-center bg-gray-900/40 p-2 rounded-lg mt-3 border-solid border border-gray-800/30"
    >
      <div>
        <div class="text-[9px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.drawdown`) }}</div>
        <div class="text-red-400 font-bold text-xs">
          {{ data.stats.drawdown || "--" }}
        </div>
      </div>
      <div>
        <div class="text-[9px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.winRate`) }}</div>
        <div class="text-blue-400 font-bold text-xs">
          {{ data.stats.winrate || "--" }}
        </div>
      </div>
      <div>
        <div class="text-[9px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.sharpe`) }}</div>
        <div class="text-white font-bold text-xs">
          {{ data.stats.sharpe || "1.2" }}
        </div>
      </div>
      <div>
        <div class="text-[9px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.trades`) }}</div>
        <div class="text-teal font-bold text-xs">
          {{ data.stats.trades || "--" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { RiShare2Fill, RiPlugFill, RiDeleteBin2Fill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";

const { t } = useI18n()

const i18nPrefix = 'strategy.card'

// Props
const props = defineProps<{
  data: any
  showShareBtn?: boolean
  showConnectBtn?: boolean
  showDeleteBtn?: boolean
}>();

const emit = defineEmits(['delete'])

const router = useRouter()

const loadStrategyDetail = (id: string) => {
  router.push(`/strategy-detail/${id}`)
};

const shareStrategyToMarketplace = (id: string) => {
  console.log(id);
};

const openConnectModal = (id: string) => {
  console.log(id);
};

const removeFromLibrary = (id: string) => {
  emit('delete', id);
};
</script>

<style scoped></style>
