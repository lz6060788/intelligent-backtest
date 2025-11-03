<template>
  <div @click.stop>
    <div
      v-if="!noBlocks"
      class="relative flex bg-background-section-burn pl-1 pt-1 text-white"
    >
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="cn(
          'system-sm-medium relative mr-0.5 flex h-8 cursor-pointer items-center rounded-t-lg px-3',
          activeTab === tab.key
            ? 'sm-no-bottom cursor-default bg-components-panel-bg text-text-accent'
            : 'text-text-tertiary',
        )"
        @click="handleActiveTabChange(tab.key)"
      >
        {{ tab.name }}
      </div>
    </div>
    <slot name="filter" />
    <div
      v-if="activeTab === TabsEnum.Blocks && !noBlocks"
      class="border-t border-divider-subtle"
    >
      <Blocks
        :search-text="searchText"
        :on-select="onSelect"
        :available-blocks-types="availableBlocksTypes"
        :blocks="blocks"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  BlockEnum,
  NodeDefault,
} from '@/types/node'
import type { OnSelectBlock } from './types'
import { TabsEnum } from './types'
import Blocks from './blocks.vue'
import cn from '@/utils/classnames'

interface TabsProps {
  activeTab: TabsEnum
  onActiveTabChange: (activeTab: TabsEnum) => void
  searchText: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  onSelect: OnSelectBlock
  availableBlocksTypes?: BlockEnum[]
  blocks: NodeDefault[]
  tabs: Array<{
    key: TabsEnum
    name: string
  }>
  noBlocks?: boolean
  noTools?: boolean
}

const props = defineProps<TabsProps>()

const handleActiveTabChange = (newActiveTab: TabsEnum) => {
  props.onActiveTabChange(newActiveTab)
}
</script>

