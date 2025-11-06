<template>
  <el-popover
    v-model:visible="open"
    :placement="placement"
    :offset="offset"
    trigger="click"
    :width="width"
    teleported
    :show-arrow="false"
    :persistent="false"
    :popper-style="customPopperStyle"
  >
    <template #reference>
      <template v-if="triggerSlot">
        <slot name="trigger" :open="open" />
      </template>
      <template v-else>
        <div
          :class="cn(
            'z-10 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800',
            triggerClassName?.(open)
          )"
          :style="triggerStyle"
        >
          <div class="add-icon h-2.5 w-2.5" />
        </div>
      </template>
    </template>
    <template #default>
      <div :class="cn('rounded-lg border-[0.5px] border-solid border-gray-900 bg-gray-700 shadow-lg', popupClassName)">
        <Tabs
          :tabs="tabs"
          :active-tab="activeTab"
          :blocks="blocks"
          :no-blocks="noBlocks"
          :no-tools="noTools"
          :on-active-tab-change="handleActiveTabChange"
          :search-text="searchText"
          :tags="tags"
          :on-tags-change="setTags"
          :on-select="handleSelect"
          :available-blocks-types="availableBlocksTypes"
        >
          <template #filter>
            <div class="relative m-2" @click.stop>
              <Input
                v-if="activeTab === TabsEnum.Blocks"
                v-model="searchText"
                show-left-icon
                show-clear-icon
                auto-focus
                :placeholder="searchPlaceholder"
                @clear="searchText = ''"
              />
              <Input
                v-if="activeTab === TabsEnum.Sources"
                v-model="searchText"
                show-left-icon
                show-clear-icon
                auto-focus
                :placeholder="searchPlaceholder"
                @clear="searchText = ''"
              />
            </div>
          </template>
        </Tabs>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  OffsetOptions,
  Placement,
} from '@floating-ui/vue'
import type {
  BlockEnum,
  NodeDefault,
} from '@/types/node'
import type { OnSelectBlock } from './types'
import Tabs from './tabs.vue'
import { TabsEnum } from './types'
import { useTabs } from './hooks'
import Input from '@/components/base/input/index.vue'
import cn from '@/utils/classnames'

export interface NodeSelectorProps {
  onSelect: OnSelectBlock
  placement?: Placement
  offset?: OffsetOptions
  triggerStyle?: Record<string, any>
  triggerClassName?: (open: boolean) => string
  triggerInnerClassName?: string
  popupClassName?: string
  availableBlocksTypes?: BlockEnum[]
  disabled?: boolean
  blocks?: NodeDefault[]
  noBlocks?: boolean
  noTools?: boolean
  width?: number
}

const props = withDefaults(defineProps<NodeSelectorProps>(), {
  placement: 'right',
  offset: 6,
  disabled: false,
  blocks: () => [],
  noBlocks: false,
  noTools: false,
})

const { t } = useI18n()
const searchText = ref('')
const tags = ref<string[]>([])

const open = ref(false)

const emit = defineEmits<{
  (e: 'select', type: BlockEnum, toolDefaultValue: any): void
}>()
const handleSelect: OnSelectBlock = (type, toolDefaultValue) => {
  open.value = false;
  emit('select', type, toolDefaultValue)
}

const {
  activeTab,
  setActiveTab,
  tabs,
} = useTabs(props.noBlocks, true, true)

const handleActiveTabChange = (newActiveTab: TabsEnum) => {
  setActiveTab(newActiveTab)
}

const searchPlaceholder = computed(() => {
  return t('workflow.tabs.searchBlock')
})

const setTags = (newTags: string[]) => {
  tags.value = newTags
}

const customPopperStyle = `
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
`

const slots = useSlots();
const triggerSlot = computed(() => slots.trigger?.());
</script>

