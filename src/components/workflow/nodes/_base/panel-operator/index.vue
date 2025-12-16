<template>
  <el-popover
    v-model:visible="open"
    placement="right-start"
    :offset="4"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    trigger="click"
  >
    <template #reference>
      <div
        :class="`
          flex h-6 w-6 cursor-pointer items-center justify-center rounded-md
          hover:bg-gray-700
          ${open && 'bg-gray-700'}
          ${triggerClassName}
        `"
      >
        <RiMoreFill class="h-4 w-4 text-text-tertiary" />
      </div>
    </template>
    <PanelOperatorPopup
      :id="id"
      :data="data"
      :show-help-link="showHelpLink"
      @close-popup="handleClosePopup"
      @edit-operator-detail="emit('edit-operator-detail')"
    />
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RiMoreFill } from '@remixicon/vue'
import PanelOperatorPopup from './panel-operator-popup.vue'
import type { Node } from '@/types'

/** 面板操作组件 Props */
interface PanelOperatorProps {
  /** 节点 ID */
  id: string
  /** 节点数据 */
  data: Node['data']
  /** 触发器类名 */
  triggerClassName?: string
  /** 是否在节点内 */
  inNode?: boolean
  /** 是否显示帮助链接 */
  showHelpLink?: boolean
}

const emit = defineEmits<{
  'open-change': [open: boolean]
  'edit-operator-detail': []
}>()

const props = withDefaults(defineProps<PanelOperatorProps>(), {
  showHelpLink: false,
})

const open = ref(false)

const handleClosePopup = () => {
  open.value = false
}
</script>

