<template>
  <div v-if="false && !isRunAfterSingleRun" class="flex h-0 grow flex-col items-center justify-center">
    <RiLoader2Line class="size-4 animate-spin text-text-tertiary" />
  </div>
  <div v-else-if="false">暂未完成</div>
  <!-- <ResultPanel
    v-else-if="isRunning"
    status="running"
    :show-steps="false"
  ></ResultPanel> -->
  <NoData
    v-else-if="!isPaused && (false || !false)"
    :can-single-run="canSingleRun"
    @single-run="onSingleRunClicked"
  ></NoData>
  <div v-else>
    <div>暂未完成</div>
    <!-- <ResultPanel
      v-bind="{
        ...runResult,
        ...otherResultPanelProps,
      }"
      :status="isPaused ? NodeRunningStatus.Stopped : (runResult.status || otherResultPanelProps.status)"
      :total-tokens="runResult.execution_metadata?.total_tokens || otherResultPanelProps?.total_tokens"
      :created-by="runResult.created_by_account?.created_by || otherResultPanelProps?.created_by"
      :node-info="runResult"
      :show-steps="false"
    ></ResultPanel> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
// import type { ResultPanelProps } from '@/app/components/workflow/run/result-panel'
// import ResultPanel from '@/app/components/workflow/run/result-panel'
import { NodeRunningStatus } from '@/types'
import { RiLoader2Line } from '@remixicon/vue'
import type { NodeTracing } from '@/types/workflow'
import NoData from './no-data.vue'

/**
 * LastRun 组件的属性定义
 */
interface Props {
  /** 应用 ID */
  appId: string
  /** 节点 ID */
  nodeId: string
  /** 是否可以单独运行 */
  canSingleRun: boolean
  /** 是否在单独运行之后 */
  isRunAfterSingleRun: boolean
  /** 更新节点运行状态的函数 */
  updateNodeRunningStatus: (status: NodeRunningStatus) => void
  /** 节点信息 */
  nodeInfo?: NodeTracing
  /** 运行状态 */
  runningStatus?: NodeRunningStatus
  /** 单独运行点击回调 */
  onSingleRunClicked: () => void
  /** 单独运行结果 */
  singleRunResult?: NodeTracing
  /** 是否暂停 */
  isPaused?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPaused: false,
})

// 提取 otherResultPanelProps
const { appId: _appId, nodeInfo: _nodeInfo, runningStatus: oneStepRunRunningStatus, ...otherResultPanelProps } = props

// const configsMap = computed(() => useHooksStore().configsMap)
// const isOneStepRunSucceed = computed(() => oneStepRunRunningStatus === NodeRunningStatus.Succeeded)
// const isOneStepRunFailed = computed(() => oneStepRunRunningStatus === NodeRunningStatus.Failed)

// // hide page and return to page would lost the oneStepRunRunningStatus
// const hidePageOneStepFinishedStatus = ref<NodeRunningStatus | null>(null)
// const pageHasHide = ref(false)
// const pageShowed = ref(false)

// const hidePageOneStepRunFinished = computed(() => 
//   [NodeRunningStatus.Succeeded, NodeRunningStatus.Failed].includes(hidePageOneStepFinishedStatus.value!)
// )

// const canRunLastRun = computed(() => 
//   !props.isRunAfterSingleRun || 
//   isOneStepRunSucceed.value || 
//   isOneStepRunFailed.value || 
//   (pageHasHide.value && hidePageOneStepRunFinished.value)
// )

// const { data: lastRunResult, isFetching, error } = useLastRun(
//   computed(() => configsMap.value?.flowType || FlowType.appFlow),
//   computed(() => configsMap.value?.flowId || ''),
//   computed(() => props.nodeId),
//   canRunLastRun
// )

// const isRunning = computed(() => {
//   if (props.isPaused)
//     return false

//   if (!props.isRunAfterSingleRun)
//     return isFetching.value
  
//   return [NodeRunningStatus.Running, NodeRunningStatus.NotStart].includes(oneStepRunRunningStatus!)
// })

// const noLastRun = computed(() => (error.value as any)?.status === 404)
// const runResult = computed(() => 
//   (canRunLastRun.value ? lastRunResult.value : props.singleRunResult) || lastRunResult.value || {}
// )

// const resetHidePageStatus = () => {
//   pageHasHide.value = false
//   pageShowed.value = false
//   hidePageOneStepFinishedStatus.value = null
// }

// watch(
//   [pageShowed, hidePageOneStepFinishedStatus, oneStepRunRunningStatus],
//   () => {
//     if (pageShowed.value && hidePageOneStepFinishedStatus.value && (!oneStepRunRunningStatus || oneStepRunRunningStatus === NodeRunningStatus.NotStart)) {
//       props.updateNodeRunningStatus(hidePageOneStepFinishedStatus.value)
//       resetHidePageStatus()
//     }
//   }
// )

// watch(
//   () => oneStepRunRunningStatus,
//   () => {
//     if ([NodeRunningStatus.Succeeded, NodeRunningStatus.Failed].includes(oneStepRunRunningStatus!))
//       hidePageOneStepFinishedStatus.value = oneStepRunRunningStatus!
//   }
// )

// watch(
//   () => props.nodeId,
//   () => {
//     resetHidePageStatus()
//   }
// )

// const handlePageVisibilityChange = () => {
//   if (document.visibilityState === 'hidden')
//     pageHasHide.value = true
//   else
//     pageShowed.value = true
// }

// onMounted(() => {
//   document.addEventListener('visibilitychange', handlePageVisibilityChange)
// })

// onUnmounted(() => {
//   document.removeEventListener('visibilitychange', handlePageVisibilityChange)
// })
</script>

