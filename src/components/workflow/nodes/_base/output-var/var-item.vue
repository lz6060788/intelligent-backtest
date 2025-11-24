<script setup lang="ts">
import TreeIndentLine from '@/components/workflow/nodes/_base/variable/object-child-tree-panel/tree-indent-line.vue'
import cn from '@/utils/classnames'

interface SubItem {
  name: string
  type: string
  description: string
}

// 定义 Props
const props = defineProps<{
  name: string
  type: string
  description: string
  subItems?: SubItem[]
  isIndent?: boolean
}>()
</script>

<template>
  <div :class="cn('flex', isIndent && 'relative left-[-7px]')">
    <TreeIndentLine v-if="isIndent" :depth="1" />

    <div class="py-1">
      <div class="flex">
        <div class="flex items-center leading-[18px]">
          <div class="code-sm-semibold text-text-secondary">{{ name }}</div>
          <div class="system-xs-regular ml-2 text-text-tertiary text-sm">{{ type }}</div>
        </div>
      </div>

      <div class="system-xs-regular mt-0.5 text-text-tertiary text-sm">
        {{ description }}

        <!-- 递归渲染子项 -->
        <div v-if="subItems && subItems.length > 0" class="ml-2 border-l border-gray-200 pl-2">
          <VarItem
            v-for="(item, index) in subItems"
            :key="index"
            :name="item.name"
            :type="item.type"
            :description="item.description"
          />
        </div>
      </div>
    </div>
  </div>
</template>