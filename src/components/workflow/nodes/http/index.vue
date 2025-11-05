<template>
  <div v-if="url" className='mb-1 py-1 w-60'>
    <div className='flex items-center justify-start rounded-md bg-gray-700 p-1'>
      <div className='flex h-4 shrink-0 items-center rounded bg-gray-500 px-1 text-xs font-semibold uppercase text-text-secondary'>{{ method }}</div>
      <div className='w-0 grow pl-1 pt-1'>
        <ReadonlyInputWithSelectVar
          className='text-text-secondary'
          :value="url"
          :node-id="id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReadonlyInputWithSelectVar from '@/components/workflow/nodes/_base/readonly-input-with-select-var/index.vue'
import type { HttpNodeType } from './types'
import type { NodeProps } from '@/types'
import { ref, reactive, computed, watch, onMounted } from 'vue'


const props = defineProps<NodeProps<HttpNodeType>>();

const method = computed(() => props.data.method)
const url = computed(() => props.data.url)

</script>

<style scoped>
</style>