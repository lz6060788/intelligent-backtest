<template>
  <div class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-white font-semibold text-sm">{{ t(`${i18nPrefix}.title`) }}</h3>
      <span class="text-xs text-gray-500">{{ t(`${i18nPrefix}.description`) }}</span>
    </div>
    <div class="overflow-hidden rounded-xl border-solid border border-gray-800">
      <table class="w-full text-sm text-gray-200 border-collapse">
        <thead class="bg-gray-900 text-[11px] uppercase text-gray-500">
          <tr>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.symbols`) }}</th>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.fullName`) }}</th>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.industry`) }}</th>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.sector`) }}</th>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.marketCap`) }}</th>
            <th class="py-2 px-4 text-left">{{ t(`${i18nPrefix}.relevance`) }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-850">
          <tr class="hover:bg-gray-900/60 border-solid border border-gray-800">
            <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
              <span
                class="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
                >AAPL</span
              >
              AAPL
            </td>
            <td class="py-3 px-4 text-gray-300">Apple</td>
            <td class="py-3 px-4 text-gray-300">Consumer Electronics</td>
            <td class="py-3 px-4 text-gray-300">Technology</td>
            <td class="py-3 px-4 text-gray-300">$3.3T</td>
            <td class="py-3 px-4">
              <div class="h-2 w-16 rounded-full bg-green-400"></div>
            </td>
          </tr>
          <tr class="hover:bg-gray-900/60 border-solid border border-gray-800">
            <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
              <span
                class="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
                >MSFT</span
              >
              MSFT
            </td>
            <td class="py-3 px-4 text-gray-300">Microsoft</td>
            <td class="py-3 px-4 text-gray-300">Software</td>
            <td class="py-3 px-4 text-gray-300">Technology</td>
            <td class="py-3 px-4 text-gray-300">$3.0T</td>
            <td class="py-3 px-4">
              <div class="h-2 w-14 rounded-full bg-green-400"></div>
            </td>
          </tr>
          <tr class="hover:bg-gray-900/60 border-solid border border-gray-800">
            <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
              <span
                class="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
                >NVDA</span
              >
              NVDA
            </td>
            <td class="py-3 px-4 text-gray-300">NVIDIA</td>
            <td class="py-3 px-4 text-gray-300">Semiconductors</td>
            <td class="py-3 px-4 text-gray-300">Technology</td>
            <td class="py-3 px-4 text-gray-300">$1.5T</td>
            <td class="py-3 px-4">
              <div class="h-2 w-12 rounded-full bg-green-400"></div>
            </td>
          </tr>
          <tr class="hover:bg-gray-900/60 border-solid border border-gray-800">
            <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
              <span
                class="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
                >LMT</span
              >
              LMT
            </td>
            <td class="py-3 px-4 text-gray-300">Lockheed Martin</td>
            <td class="py-3 px-4 text-gray-300">Aerospace & Defense</td>
            <td class="py-3 px-4 text-gray-300">Industrials</td>
            <td class="py-3 px-4 text-gray-300">$105.4B</td>
            <td class="py-3 px-4">
              <div class="h-2 w-10 rounded-full bg-green-400"></div>
            </td>
          </tr>
          <tr class="hover:bg-gray-900/60 border-solid border border-gray-800">
            <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
              <span
                class="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center"
                >AVGO</span
              >
              AVGO
            </td>
            <td class="py-3 px-4 text-gray-300">Broadcom</td>
            <td class="py-3 px-4 text-gray-300">Semiconductors</td>
            <td class="py-3 px-4 text-gray-300">Technology</td>
            <td class="py-3 px-4 text-gray-300">$600B</td>
            <td class="py-3 px-4">
              <div class="h-2 w-12 rounded-full bg-green-400"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'screener.detail.symbolPool'
</script>

<style scoped></style>
