<template>
  <div
    :class="cn(
      'relative h-full min-h-[90px] w-full min-w-[240px] rounded-2xl bg-gray-900',
    )"
  >
    <Background
      :id="`iteration-background-${id}`"
      class="!z-0 rounded-2xl"
      :gap="[14 / zoom, 14 / zoom]"
      :size="2 / zoom"
      pattern-color="#fff"
    />
    <IterationStartNodeDumb v-if="data._isCandidate" />
    <AddBlock
      v-if="payload._children!.length === 1"
      :iteration-node-id="id"
      :iteration-node-data="data"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useVueFlow, useNodesInitialized } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { useI18n } from 'vue-i18n'
import { ElNotification } from 'element-plus'
import { IterationStartNodeDumb } from '../iteration-start/index'
import { useNodeIterationInteractions } from './use-interactions'
import type { IterationNodeType } from './types'
import AddBlock from './add-block.vue'
import cn from '@/utils/classnames'
import type { NodeProps } from '@/types/node'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

const i18nPrefix = 'workflow.nodes.iteration'

const props = defineProps<NodeProps<IterationNodeType>>()

const { id, data } = props
const { instanceId } = useWorkflowInstance()
const { viewport } = useVueFlow(instanceId)
const { handleNodeIterationRerender } = useNodeIterationInteractions()
const { t } = useI18n()
const nodesInitialized = useNodesInitialized()
const showTips = ref(data._isShowTips)

const zoom = computed(() => viewport.value.zoom)

const payload = computed(() => props.data)

watch([nodesInitialized], () => {
  if (nodesInitialized.value)
    handleNodeIterationRerender(id)
  if (data.is_parallel && showTips.value) {
    ElNotification({
      type: 'warning',
      message: t(`${i18nPrefix}.answerNodeWarningDesc`),
      duration: 5000,
    })
    showTips.value = false
  }
}, { immediate: true })
</script>

