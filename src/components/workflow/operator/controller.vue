<template>
  <div class="pointer-events-auto flex flex-col items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-gray-800 p-0.5 text-text-tertiary shadow-lg">
    <!-- <AddBlock /> -->

    <!-- <Divider class="my-1 w-3.5" /> -->

    <el-tooltip :content="formatTooltipContent(t('workflow.common.pointerMode'), ['v'])" placement="top">
      <div
        :class="cn(
          'mr-[1px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg',
          controlMode === ControlMode.Pointer ? 'bg-state-accent-active text-text-accent' : 'hover:bg-state-base-hover hover:text-text-secondary',
          nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleModePointer"
      >
        <RiCursorLine class="h-4 w-4" />
      </div>
    </el-tooltip>

    <el-tooltip :content="formatTooltipContent(t('workflow.common.handMode'), ['h'])" placement="top">
      <div
        :class="cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg',
          controlMode === ControlMode.Hand ? 'bg-state-accent-active text-text-accent' : 'hover:bg-state-base-hover hover:text-text-secondary',
          nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleModeHand"
      >
        <RiHand class="h-4 w-4" />
      </div>
    </el-tooltip>

    <!-- <Divider class="my-1 w-3.5" /> -->

    <!-- <ExportImage /> -->

    <el-tooltip :content="formatTooltipContent(t('workflow.panel.organizeBlocks'), ['ctrl', 'o'])" placement="top">
      <div
        :class="cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover hover:text-text-secondary',
          nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleLayout"
      >
        <RiFunctionAddLine class="h-4 w-4" />
      </div>
    </el-tooltip>

    <el-tooltip
      :content="formatTooltipContent(maximizeCanvas ? t('workflow.panel.minimize') : t('workflow.panel.maximize'), ['f'])"
      placement="top"
    >
      <div
        :class="cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover hover:text-text-secondary',
          maximizeCanvas ? 'bg-state-accent-active text-text-accent hover:text-text-accent' : 'hover:bg-state-base-hover hover:text-text-secondary',
          nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleToggleMaximizeCanvas"
      >
        <RiAspectRatioFill class="h-4 w-4" v-if="maximizeCanvas" />
        <RiAspectRatioLine class="h-4 w-4" v-else />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  RiAspectRatioFill,
  RiAspectRatioLine,
  RiCursorLine,
  RiFunctionAddLine,
  RiHand
} from '@remixicon/vue'
import {
  useNodesReadOnly,
  useWorkflowCanvasMaximize,
  useWorkflowMoveMode,
  useWorkflowOrganize,
  useWorkflowInstance
} from '../hooks'
import { ControlMode } from '@/types'
// import AddBlock from '../add-block.vue'
import cn from '@/utils/classnames'
import { computed } from 'vue'

// 状态和方法获取
const { t } = useI18n()
const { instance: workflowStore } = useWorkflowInstance()
const controlMode = computed(() => workflowStore.controlMode.value)
const maximizeCanvas = computed(() => workflowStore.maximizeCanvas.value)
const { handleModePointer, handleModeHand } = useWorkflowMoveMode()
const { handleLayout } = useWorkflowOrganize()
const { nodesReadOnly } = useNodesReadOnly()
const { handleToggleMaximizeCanvas } = useWorkflowCanvasMaximize()

/**
 * 格式化工具提示内容，包含标题和快捷键信息
 * @param title 提示标题
 * @param shortcuts 快捷键数组，如 ['v'] 或 ['ctrl', 'o']
 * @returns 格式化后的提示内容，格式为 "标题 (快捷键)"
 */
const formatTooltipContent = (title: string, shortcuts: string[]): string => {
  if (!shortcuts || shortcuts.length === 0) {
    return title
  }
  // 将快捷键数组格式化为字符串，如 ['ctrl', 'o'] -> 'Ctrl+O'
  const shortcutStr = shortcuts
    .map(key => {
      // 将小写字母转换为大写
      if (key.length === 1) {
        return key.toUpperCase()
      }
      // 处理特殊键，首字母大写
      return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
    })
    .join('+')
  return `${title} (${shortcutStr})`
}
</script>
