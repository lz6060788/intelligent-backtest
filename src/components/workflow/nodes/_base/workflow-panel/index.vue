<template>

  <!-- Single Run Form -->
  <!-- <div
    v-if="isShowSingleRun"
    :class="cn('relative mr-1 h-full')"
  >
    <div
      ref="containerRef"
      :class="cn('flex h-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-gray-800 shadow-lg', showSingleRunPanel ? 'overflow-hidden' : 'overflow-y-auto')"
      :style="{ width: `${nodePanelWidth}px` }"
    >
      <DataSourceBeforeRunForm
        v-if="isSupportCustomRunForm(props.data.type)"
        :node-id="props.id"
        :flow-id="configsMap?.flowId || ''"
        :flow-type="configsMap?.flowType || FlowType.appFlow"
        :payload="props.data"
        :set-run-result="setRunResult"
        :set-is-run-after-single-run="setIsRunAfterSingleRun"
        :is-paused="isPaused"
        :is-run-after-single-run="isRunAfterSingleRun"
        :on-success="handleAfterCustomSingleRun"
        :on-cancel="hideSingleRun"
        :append-node-inspect-vars="appendNodeInspectVars"
      />
      <BeforeRunForm
        v-else
        :node-name="props.data.title"
        :node-type="props.data.type"
        @hide="hideSingleRun"
        @run="handleRunWithParams"
        v-bind="{
            ...singleRunParams!,
            ...passedLogParams,
        }"
        :exist-var-values-in-forms="getExistVarValuesInForms(singleRunParams?.forms as any)"
        :filtered-exist-var-forms="getFilteredExistVarForms(singleRunParams?.forms as any)"
      />
    </div>
  </div> -->

  <!-- Main Panel -->
  <div
    :class="cn(
      'relative mr-1 h-full',
      'absolute z-0 mr-2 min-w-[400px] overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border shadow-lg transition-all',
    )"
    :style="{
      right: `${otherPanelWidth}px`,
    }"
  >
    <div
      ref="triggerRef"
      class="absolute -left-1 top-0 flex h-full w-1 cursor-col-resize resize-x items-center justify-center"
    >
      <div class="h-10 w-0.5 rounded-sm bg-state-base-handle hover:h-full hover:bg-state-accent-solid active:h-full active:bg-state-accent-solid" />
    </div>
    <div
      ref="containerRef"
      :class="cn('flex h-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-gray-800 shadow-lg transition-[width] ease-linear', showSingleRunPanel ? 'overflow-hidden' : 'overflow-y-auto')"
      :style="{ width: `${nodePanelWidth}px` }"
    >
      <div class="sticky top-0 z-10 shrink-0 border-0 border-b-[0.5px] border-b-gray-500 border-solid bg-gray-800">
        <div class="flex items-center px-4 pb-1 pt-4">
          <BlockIcon
            class="mr-1 shrink-0"
            :type="props.data!.type"
            size="md"
          />
          <!-- <TitleInput
            :value="props.data!.title || ''"
            @blur="handleTitleBlur"
          /> -->
          <h2 class="flex-1">{{ data!.title }}</h2>
          <div class="flex shrink-0 items-center text-text-tertiary">
            <el-tooltip
              v-if="isSupportSingleRun && !nodesReadOnly"
              :content="t('workflow.panel.runThisStep')"
              :disabled="isSingleRunning"
              popper-class="mr-1"
            >
              <template #default>
                <div
                  class="mr-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-state-base-hover"
                  @click="handleSingleRunClick"
                >
                  <Stop
                    v-if="isSingleRunning"
                    class="h-4 w-4 text-text-tertiary"
                  />
                  <RiPlayLargeLine
                    v-else
                    class="h-4 w-4 text-text-tertiary"
                  />
                </div>
              </template>
            </el-tooltip>
            <NodePosition :node-id="props.id" />
            <!-- <HelpLink :node-type="props.data.type" /> -->
            <!-- <PanelOperator
              :id="props.id"
              :data="props.data"
              :show-help-link="false"
            /> -->
            <div class="mx-3 h-3.5 w-[1px] bg-divider-regular" />
            <div
              class="flex h-6 w-6 cursor-pointer items-center justify-center"
              @click="handleNodeSelect(props.id, true)"
            >
              <RiCloseLine class="h-4 w-4 text-text-tertiary" />
            </div>
          </div>
        </div>
        <div class="p-2">
          <!-- <DescriptionInput
            :value="props.data!.desc || ''"
            @change="handleDescriptionChange"
          /> -->
        </div>
      </div>
      <div
        class="flex-1 overflow-y-auto"
      >
        <div>
          <slot :id="props.id" :data="props.data" />
        </div>
        <Split />
        <!-- <RetryOnPanel
          v-if="hasRetryNode(props.data.type)"
          :id="props.id"
          :data="props.data"
        />
        <ErrorHandleOnPanel
          v-if="hasErrorHandleNode(props.data.type)"
          :id="props.id"
          :data="props.data"
        /> -->
        <!-- <div
          v-if="!!availableNextBlocks.length"
          class="border-t-[0.5px] border-divider-regular p-4"
        >
          <div class="system-sm-semibold-uppercase mb-1 flex items-center text-text-secondary">
            {{ t('workflow.panel.nextStep').toLocaleUpperCase() }}
          </div>
          <div class="system-xs-regular mb-2 text-text-tertiary">
            {{ t('workflow.panel.addNextStep') }}
          </div>
          <NextStep :selected-node="{ id: props.id, data: props.data } as Node" />
        </div> -->
      </div>

      <!-- <LastRun
          v-if="tabType === TabType.lastRun"
          :app-id="appDetail?.id || ''"
          :node-id="props.id"
          :can-single-run="isSupportSingleRun"
          :running-status="runningStatus"
          :is-run-after-single-run="isRunAfterSingleRun"
          :update-node-running-status="updateNodeRunningStatus"
          :on-single-run-clicked="handleSingleRun"
          :node-info="nodeInfo!"
          :single-run-result="runResult!"
          :is-paused="isPaused"
          v-bind="passedLogParams"
      ></LastRun> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { RiCloseLine, RiPlayLargeLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash-es'
import { ElTooltip } from 'element-plus'
// import NextStep from '../next-step/index.vue'
// import PanelOperator from '../panel-operator/index.vue'
import NodePosition from '@/components/workflow/nodes/_base/node-position/index.vue'
// import HelpLink from '../help-link/index.vue'
// import { DescriptionInput, TitleInput } from '../title-description-input/index.vue'
// import ErrorHandleOnPanel from '../error-handle/error-handle-on-panel/index.vue'
// import RetryOnPanel from '../retry/retry-on-panel/index.vue'
// import { useResizePanel } from '@/components/workflow/hooks/use-resize-panel'
import cn from '@/utils/classnames'
import BlockIcon from '@/components/workflow/block-icon.vue'
// import Split from '@/app/components/workflow/nodes/_base/components/split/index.vue'
import {
//   WorkflowHistoryEvent,
  useAvailableBlocks,
  useNodeDataUpdate,
  useNodesInteractions,
  useNodesMetaData,
  useNodesReadOnly,
//   useToolIcon,
  useWorkflowHistory,
} from '@/components/workflow/hooks'
import {
  canRunBySingle,
  hasErrorHandleNode,
  hasRetryNode,
  isSupportCustomRunForm,
} from '@/components/workflow/utils'
import { BlockEnum, type Node, NodeRunningStatus } from '@/types/node'
// import { useStore as useAppStore } from '@/store'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
// import Tab, { TabType } from './tab/index.vue'
// import LastRun from './last-run/index.vue'
// import useLastRun from './last-run/use-last-run'
// import BeforeRunForm from '../before-run-form/index.vue'
// import { useLogs } from '@/app/components/workflow/run/hooks'
// import PanelWrap from '../before-run-form/panel-wrap/index.vue'
// import SpecialResultPanel from '@/app/components/workflow/run/special-result-panel/index.vue'
import { Stop } from '@/components/base/icons/src/vender/line/mediaAndDevices'
// import {
//   AuthorizedInDataSourceNode,
//   AuthorizedInNode,
//   PluginAuth,
//   PluginAuthInDataSourceNode,
// } from '@/components/plugins/plugin-auth'
// import { AuthCategory } from '@/components/plugins/plugin-auth'
import { canFindTool } from '@/utils'
// import type { CustomRunFormProps } from '@/components/workflow/nodes/data-source/types'
// import { DataSourceClassification } from '@/components/workflow/nodes/data-source/types'
// import { useModalContext } from '@/context/modal-context'
// import DataSourceBeforeRunForm from '@/app/components/workflow/nodes/data-source/before-run-form/index.vue'
// import useInspectVarsCrud from '@/components/workflow/hooks/use-inspect-vars-crud'
import { WorkflowHistoryEvent } from '@/components/workflow/hooks/use-workflow-history'
// import { useAllBuiltInTools } from '@/service/use-tools'

/**
 * 基础面板组件的 Props
 */
interface BasePanelProps {
  /** 子组件 */
  children?: any
  /** 节点 ID */
  id: Node['id']
  /** 节点数据 */
  data: Node['data']
}

const props = defineProps<BasePanelProps>()

const { t } = useI18n()
const { instance: workflowStore } = useWorkflowInstance()
// const { showMessageLogModal } = useAppStore()

const isSingleRunning = computed(() => props.data?._singleRunningStatus === NodeRunningStatus.Running)

const showSingleRunPanel = computed(() => workflowStore.showSingleRunPanel.value)
const workflowCanvasWidth = computed(() => workflowStore.workflowCanvasWidth.value)
const nodePanelWidth = computed(() => workflowStore.nodePanelWidth.value)
const otherPanelWidth = computed(() => workflowStore.otherPanelWidth.value)
const setNodePanelWidth = (width: number) => workflowStore.setNodePanelWidth(width)

const reservedCanvasWidth = 400 // 为画布保留的最小可见宽度

const maxNodePanelWidth = computed(() => {
  if (!workflowCanvasWidth.value)
    return 720

  const available = workflowCanvasWidth.value - (otherPanelWidth.value || 0) - reservedCanvasWidth
  return Math.max(available, 400)
})

const updateNodePanelWidth = (width: number, source: 'user' | 'system' = 'user') => {
  // 确保宽度在最小值和最大值范围内
  const newValue = Math.max(400, Math.min(width, maxNodePanelWidth.value))

  if (source === 'user')
    localStorage.setItem('workflow-node-panel-width', `${newValue}`)

  setNodePanelWidth(newValue)
}

const handleResize = (width: number) => {
  updateNodePanelWidth(width, 'user')
}

// const {
//   triggerRef,
//   containerRef,
// } = useResizePanel({
//   direction: 'horizontal',
//   triggerDirection: 'left',
//   minWidth: 400,
//   maxWidth: computed(() => maxNodePanelWidth.value),
//   onResize: debounce(handleResize, 300),
// })

const debounceUpdate = debounce((width: number) => {
  updateNodePanelWidth(width, 'system')
}, 300)

watch(
  [nodePanelWidth, otherPanelWidth, workflowCanvasWidth],
  () => {
    if (!workflowCanvasWidth.value)
      return

    // 如果三个面板的总宽度超过画布，将节点面板缩小到可用范围（至少 400px）
    const total = nodePanelWidth.value + otherPanelWidth.value + reservedCanvasWidth
    if (total > workflowCanvasWidth.value) {
      const target = Math.max(workflowCanvasWidth.value - otherPanelWidth.value - reservedCanvasWidth, 400)
      debounceUpdate(target)
    }
  },
  { immediate: true },
)

const { handleNodeSelect } = useNodesInteractions()
const { nodesReadOnly } = useNodesReadOnly()
const { availableNextBlocks } = useAvailableBlocks(props.data?.type, props.data?.isInLoop)
// const toolIcon = useToolIcon(props.data)

const { saveStateToHistory } = useWorkflowHistory()

const {
  handleNodeDataUpdate,
  handleNodeDataUpdateWithSyncDraft,
} = useNodeDataUpdate()

const handleTitleBlur = (title: string) => {
  handleNodeDataUpdateWithSyncDraft({ id: props.id, data: { title } })
  saveStateToHistory(WorkflowHistoryEvent.NodeTitleChange, { nodeId: props.id })
}

const handleDescriptionChange = (desc: string) => {
  handleNodeDataUpdateWithSyncDraft({ id: props.id, data: { desc } })
  saveStateToHistory(WorkflowHistoryEvent.NodeDescriptionChange, { nodeId: props.id })
}

const isChildNode = computed(() => !!(props.data?.isInLoop))
const isSupportSingleRun = computed(() => canRunBySingle(props.data!.type, isChildNode.value))
// const appDetail = computed(() => useAppStore().appDetail)

const hasClickRunning = ref(false)
const isPaused = ref(false)

watch(
  () => props.data,
  () => {
    if (props.data?._singleRunningStatus === NodeRunningStatus.Running) {
      hasClickRunning.value = true
      isPaused.value = false
    }
    else if (props.data?._isSingleRun && props.data?._singleRunningStatus === undefined && hasClickRunning.value) {
      isPaused.value = true
      hasClickRunning.value = false
    }
  },
  { deep: true },
)

const updateNodeRunningStatus = (status: NodeRunningStatus) => {
  handleNodeDataUpdate({
    id: props.id,
    data: {
      ...props.data,
      _singleRunningStatus: status,
    },
  })
}

watch(
  () => props.id,
  () => {
    hasClickRunning.value = false
  },
)

const {
  nodesMap,
} = useNodesMetaData()

// const configsMap = computed(() => useHooksStore().configsMap)
// const {
//   isShowSingleRun,
//   hideSingleRun,
//   runningStatus,
//   runInputData,
//   runInputDataRef,
//   runResult,
//   setRunResult,
//   getInputVars,
//   toVarInputs,
//   tabType,
//   isRunAfterSingleRun,
//   setIsRunAfterSingleRun,
//   setTabType,
//   handleAfterCustomSingleRun,
//   singleRunParams,
//   nodeInfo,
//   setRunInputData,
//   handleSingleRun,
//   handleRunWithParams,
//   getExistVarValuesInForms,
//   getFilteredExistVarForms,
// } = useLastRun<typeof props.data>({
//   id: props.id,
//   flowId: configsMap.value?.flowId || '',
//   flowType: configsMap.value?.flowType || FlowType.appFlow,
//   data: props.data,
//   defaultRunInputData: nodesMap.value?.[props.data.type]?.defaultRunInputData || {},
//   isPaused,
// })

// watch(tabType, () => {
//   isPaused.value = false
// })

// const logParams = useLogs()
// const passedLogParams = computed(() => {
//   if ([BlockEnum.Tool, BlockEnum.Agent, BlockEnum.Iteration, BlockEnum.Loop].includes(props.data.type))
//     return logParams

//   return {}
// })

// const { data: buildInTools } = useAllBuiltInTools()
// const currCollection = computed(() => {
//   return buildInTools.value?.find(item => canFindTool(item.id, props.data.provider_id))
// })
// const showPluginAuth = computed(() => {
//   return props.data.type === BlockEnum.Tool && currCollection.value?.allow_delete
// })
// const dataSourceList = computed(() => workflowStore.dataSourceList.value)
// const currentDataSource = computed(() => {
//   if (props.data.type === BlockEnum.DataSource && props.data.provider_type !== DataSourceClassification.localFile)
//     return dataSourceList.value?.find(item => item.plugin_id === props.data.plugin_id)
// })
// const handleAuthorizationItemClick = (credential_id: string) => {
//   handleNodeDataUpdateWithSyncDraft({
//     id: props.id,
//     data: {
//       credential_id,
//     },
//   })
// }
// const { setShowAccountSettingModal } = useModalContext()
// const handleJumpToDataSourcePage = () => {
//   setShowAccountSettingModal({ payload: 'data-source' })
// }

// const {
//   appendNodeInspectVars,
// } = useInspectVarsCrud()

const handleSingleRunClick = () => {
  if (isSingleRunning.value) {
    handleNodeDataUpdate({
      id: props.id,
      data: {
        _isSingleRun: false,
        _singleRunningStatus: undefined,
      },
    })
  }
  else {
    // handleSingleRun()
  }
}
</script>

