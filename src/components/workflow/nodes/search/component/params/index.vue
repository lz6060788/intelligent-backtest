<template>
  <Empty v-if="!items.length" />
  <template v-else>
    <Item
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      :readonly="readonly"
      :node-id="nodeId"
      :show-delete-btn="index !== 0"
      @update-search-item="(updateData) => handleUpdateSearchItem(index, updateData)"
      @remove-search-item="handleRemoveSearchItem(index)"
    />
  </template>
</template>

<script setup lang="ts">
import Empty from './empty.vue'
import Item from './item.vue'
import type {
  SearchItem,
} from '../../types'

type props = {
  items: SearchItem[]
  nodeId: string
  readonly: boolean
}


const props = withDefaults(defineProps<props>(), {
  items: () => [],
  nodeId: '',
})

const emit = defineEmits<{
  (e: 'remove-search-item', index: number): void
  (e: 'update-search-item', index: number, updateData: Partial<SearchItem>): void
}>()

const handleRemoveSearchItem = (index: number) => {
  emit('remove-search-item', index)
}

const handleUpdateSearchItem = (index: number, updateData: Partial<SearchItem>) => {
  emit('update-search-item', index, updateData)
}
</script>

