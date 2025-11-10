<template>
  <div
    :class="[
      'flex rounded-2xl border-[2px]',
      showSelectedBorder ? 'border-components-option-card-option-selected-border' : 'border-transparent',
      data._waitingRun ? 'opacity-70' : ''
    ]"
    style="width: auto; height: auto"
  >
    <div
      :class="[
        'group relative pb-1 shadow-xs',
        'rounded-[15px] border border-transparent',
        'w-[240px] bg-gray-800',
        !data._runningStatus ? 'hover:shadow-lg' : '',
        showRunningBorder ? '!border-state-accent-solid' : '',
        showSuccessBorder ? '!border-state-success-solid' : '',
        showFailedBorder ? '!border-state-destructive-solid' : '',
        showExceptionBorder ? '!border-state-warning-solid' : '',
        data._isBundled ? '!shadow-lg' : ''
      ]"
    >
      <NodeTargetHandle
        v-if="!data._isCandidate"
        :id="id"
        :data="data"
        handle-class-name="!top-4 !-left-1 !translate-y-0"
        handle-id="target"
      />

      <!-- <NodeControl
        v-if="!data._runningStatus && !nodesReadOnly && !data._isCandidate"
        :id="id"
        :data="data"
      /> -->

      <div class="flex items-center rounded-t-2xl px-3 pb-2 pt-3">
        <BlockIcon
          class="mr-2 shrink-0"
          :type="data.type"
          size="md"
        />
        <div
          :title="data.title"
          class="system-sm-semibold-uppercase mr-1 flex grow items-center truncate text-text-primary"
        >
          <div>{{ data.title }}</div>
        </div>

        <RiLoader2Line
          v-if="data._runningStatus === NodeRunningStatus.Running || data._singleRunningStatus === NodeRunningStatus.Running"
          class="h-3.5 w-3.5 animate-spin text-text-accent"
        />
        <RiCheckboxCircleFill
          v-else-if="data._runningStatus === NodeRunningStatus.Succeeded"
          class="h-3.5 w-3.5 text-text-success"
        />
        <RiErrorWarningFill
          v-else-if="data._runningStatus === NodeRunningStatus.Failed"
          class="h-3.5 w-3.5 text-text-destructive"
        />
        <RiAlertFill
          v-else-if="data._runningStatus === NodeRunningStatus.Exception"
          class="h-3.5 w-3.5 text-text-warning-secondary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  RiAlertFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiLoader2Line
} from '@remixicon/vue'
import NodeTargetHandle from '../nodes/_base/targetHandle/index.vue'
// import NodeControl from '../nodes/_base/control/index.vue'
import BlockIcon from '../block-icon.vue'
import type { NodeProps } from '@/types'
import { NodeRunningStatus } from '@/types'
import { useNodesReadOnly } from '../hooks/use-nodes-readonly'

interface SimpleNodeProps extends NodeProps {}

const props = defineProps<SimpleNodeProps>()

const { nodesReadOnly } = useNodesReadOnly()

const showSelectedBorder = computed(() =>
  props.data.selected || props.data._isBundled || props.data._isEntering
)

const statusBorders = computed(() => ({
  showRunningBorder: props.data._runningStatus === NodeRunningStatus.Running && !showSelectedBorder.value,
  showSuccessBorder: props.data._runningStatus === NodeRunningStatus.Succeeded && !showSelectedBorder.value,
  showFailedBorder: props.data._runningStatus === NodeRunningStatus.Failed && !showSelectedBorder.value,
  showExceptionBorder: props.data._runningStatus === NodeRunningStatus.Exception && !showSelectedBorder.value
}))

const {
  showRunningBorder,
  showSuccessBorder,
  showFailedBorder,
  showExceptionBorder
} = statusBorders.value
</script>