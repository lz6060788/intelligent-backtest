<template>
  <div class="nodrag group mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-workflow-block-border bg-blue-300 shadow-xs">
    <el-tooltip :content="t('workflow.blocks.iteration-start')" placement="top" :offset="20">
      <div class="flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-components-panel-border-subtle bg-util-colors-blue-brand-blue-brand-500">
        <RiHome5Fill class="h-3 w-3 text-text-primary-on-surface" />
      </div>
    </el-tooltip>
    <NodeSourceHandle
      :id="id"
      :data="data"
      handle-class-name="!top-1/2 !-right-[4px] !-translate-y-1/2"
      handle-id="source"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { NodeProps } from '@/types'
import { RiHome5Fill } from '@remixicon/vue'
import NodeSourceHandle from '@/components/workflow/nodes/_base/sourceHandle/index.vue'

const props = defineProps<NodeProps>()
const { t } = useI18n()
</script>
