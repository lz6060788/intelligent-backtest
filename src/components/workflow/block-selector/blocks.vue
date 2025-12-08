<template>
  <div class="max-h-[480px] overflow-y-auto p-1">
    <div
      v-if="isEmpty"
      class="flex h-[22px] items-center px-3 text-xs font-medium text-white"
    >
      {{ t('workflow.tabs.noResult') }}
    </div>
    <template v-else>
      <div
        v-for="classification in BLOCK_CLASSIFICATIONS"
        :key="classification"
        class="mb-1 last-of-type:mb-0"
      >
        <div
          v-if="classification !== '-' && !!groups[classification]?.length"
          class="flex h-[22px] items-start px-3 text-xs font-medium text-white"
        >
          {{ t(`workflow.tabs.${classification}`) }}
        </div>
        <div
          v-for="block in filteredListMap[classification]"
          :key="block.metaData.type"
          class="flex h-8 w-full cursor-pointer items-center rounded-lg px-3 hover:bg-gray-500"
          @click="handleSelect(block.metaData.type)"
        >
          <BlockIcon
            className="mr-2 shrink-0"
            :type="block.metaData.type"
          />
          <div class="grow text-sm text-white/70">{{ block.metaData.title }}</div>
          <Badge
            v-if="block.metaData.type === BlockEnum.LoopEnd"
            :text="t('workflow.nodes.loop.loopNode')"
            className="ml-2 shrink-0"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { groupBy } from 'lodash-es'
import BlockIcon from '../block-icon.vue'
import { BlockEnum } from '@/types/node'
import type { NodeDefault } from '@/types/node'
import { BLOCK_CLASSIFICATIONS } from './constants.ts'
import type { ToolDefaultValue } from './types'
import Badge from '@/components/base/badge/index.vue'

interface BlocksProps {
  searchText: string
  onSelect: (type: BlockEnum, tool?: ToolDefaultValue) => void
  availableBlocksTypes?: BlockEnum[]
  blocks: NodeDefault[]
}

const props = defineProps<BlocksProps>()

const { t } = useI18n()
// const { instanceId } = useWorkflowInstance()
// const { nodes } = useVueFlow(instanceId)

const groups = computed(() => {
  console.log('props.availableBlocksTypes', props.availableBlocksTypes)
  console.log('props.blocks', props.blocks.filter(block => block.metaData.type === BlockEnum.Calculator))
  return BLOCK_CLASSIFICATIONS.reduce((acc, classification) => {
    const list = (groupBy(props.blocks, 'metaData.classification')[classification] || []).filter((block) => {
      return block.metaData.title.toLowerCase().includes(props.searchText.toLowerCase()) && props.availableBlocksTypes?.includes(block.metaData.type)
    })

    return {
      ...acc,
      [classification]: list,
    }
  }, {} as Record<string, typeof props.blocks>)
})

const isEmpty = computed(() => Object.values(groups.value).every(list => !list.length))

const filteredListMap = computed(() => {
  const result: Record<string, NodeDefault[]> = {}

  BLOCK_CLASSIFICATIONS.forEach(classification => {
    const list = groups.value[classification]?.sort((a, b) => a.metaData.sort - b.metaData.sort) || []
    // TODO: 如果需要 KnowledgeBase 过滤逻辑，请添加相应的 BlockEnum
    result[classification] = list
  })

  return result
})

const handleSelect = (type: BlockEnum) => {
  props.onSelect(type)
}
</script>

