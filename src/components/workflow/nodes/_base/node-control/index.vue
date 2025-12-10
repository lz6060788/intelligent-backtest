<template>
  <div
    class="
      absolute -top-7 right-0 hidden h-7 pb-1 group-hover:flex
      [&.data-selected]:!flex
      [&.open]:!flex
    "
    :class="{
      '!flex': data!.selected || open
    }"
  >
    <div
      class="flex h-6 items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg px-0.5 text-text-tertiary shadow-md backdrop-blur-[5px]"
      @click.stop
    >
      <!-- 单步运行按钮 -->
      <!-- <template v-if="canRunBySingle(data.type, isChildNode)">
        <div
          class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md hover:bg-state-base-hover"
          @click="handleRunClick"
        >
          <template v-if="isSingleRunning">
            <Stop class="h-3 w-3" />
          </template>
          <template v-else>
            <Tooltip :content="t('workflow.panel.runThisStep')">
              <RiPlayLargeLine class="h-3 w-3" />
            </Tooltip>
          </template>
        </div>
      </template> -->

      <!-- 面板操作组件 -->
      <PanelOperator
        :id="id"
        :data="data"
        trigger-class-name="!w-5 !h-5"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// 需确保图标组件已适配 Vue3（如 remixicon-vue 或自行封装）
import { RiPlayLargeLine } from '@remixicon/vue'
// 引入自定义 hooks、类型、工具函数（需保持路径与原项目一致）
import { useNodeDataUpdate, useNodesInteractions } from '../../../hooks'
import type { Node } from '@/types'
import { NodeRunningStatus } from '@/types'
import { canRunBySingle } from '../../../utils'
import PanelOperator from '../panel-operator/index.vue'
import Stop from '@/components/base/icons/src/vender/line/mediaAndDevices/Stop.vue'
// import Tooltip from '@/components/base/Tooltip.vue'

// 定义 Props
interface NodeControlProps {
  id: Node['id']
  data: Node['data']
}

const props = defineProps<NodeControlProps>()

// 国际化
const { t } = useI18n()

// 响应式状态
const open = ref(false)

const { handleNodeDataUpdate } = useNodeDataUpdate()
const { handleNodeSelect } = useNodesInteractions()

// 计算属性
const isSingleRunning = computed(() => {
  return props.data!._singleRunningStatus === NodeRunningStatus.Running
})

const isChildNode = computed(() => {
  // return !!props.data!.isInIteration || !!props.data!.isInLoop
  !!props.data!.isInLoop
})

// const handleRunClick = () => {
//   const nextData: Record<string, any> = {
//     _isSingleRun: !isSingleRunning.value
//   }
//   if (isSingleRunning.value) {
//     nextData._singleRunningStatus = undefined
//   }

//   handleNodeDataUpdate({
//     id: id.value,
//     data: nextData
//   })
//   handleNodeSelect(id.value)
// }

// 透传工具函数（保持与原逻辑一致）
defineExpose({ canRunBySingle })
</script>

<style scoped>
/* 如需补充样式可在此处添加，原 React 样式通过 class 直接复用 */
</style>