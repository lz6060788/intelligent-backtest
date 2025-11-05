<template>
  <div
    :class="cn(
      'nopan nodrag',
      'absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 group-hover/insert:block',
      open && '!block',
    )"
  >
    <BlockSelector
      v-model:open="open"
      :on-select="handleInsert"
      :available-blocks-types="availableBlocksTypes"
      as-child
      :trigger-class-name="() => 'hover:scale-125 transition-all'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cn from 'classnames'
import { useNodesInteractions } from '../../hooks'
import type {
  BlockEnum,
  OnSelectBlock,
} from '@/types/node'
import BlockSelector from '../../block-selector/main.vue'

/**
 * 插入块组件的属性定义
 */
interface InsertBlockProps {
  /** 起始节点ID */
  startNodeId: string
  /** 可用块类型列表 */
  availableBlocksTypes: BlockEnum[]
}

const props = defineProps<InsertBlockProps>()

const open = ref(false)
const { handleNodeAdd } = useNodesInteractions()

const handleInsert: OnSelectBlock = (nodeType, toolDefaultValue) => {
  handleNodeAdd(
    {
      nodeType,
      toolDefaultValue,
    },
    {
      nextNodeId: props.startNodeId,
      nextNodeTargetHandle: 'target',
    },
  )
}
</script>

