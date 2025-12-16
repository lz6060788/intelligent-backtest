<template>
  <div class="w-[240px] rounded-lg border-[0.5px] border-gray-500 bg-gray-800 shadow-xl">
    <template v-if="!nodesReadOnly">
      <template v-if="!nodeMetaData.isSingleton">
        <div class="p-1">
          <div
            class="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-gray-700"
            @click="handleCopy"
          >
            {{ t('workflow.common.copy') }}
          </div>
          <div
            class="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-gray-700"
            @click="handleDuplicate"
          >
            {{ t('workflow.common.duplicate') }}
          </div>
        </div>
        <div class="h-px bg-divider-regular"></div>
      </template>
      <template v-if="canEditCalculatorDetail">
        <div class="p-1">
          <div
            class="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-gray-700"
            @click="handleEditCalculatorDetail"
          >
            {{ t('workflow.panel.editCalculatorDetail') }}
          </div>
        </div>
        <div class="h-px bg-divider-regular"></div>
      </template>
      <template v-if="!nodeMetaData.isUndeletable">
        <div class="p-1">
          <div
            class="
              flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary
              hover:bg-red-500 hover:text-white
            "
            @click="handleDelete"
          >
            {{ t('common.operation.delete') }}
          </div>
        </div>
        <!-- <div class="h-px bg-divider-regular"></div> -->
      </template>
    </template>
    <template v-if="showHelpLink && nodeMetaData.helpLinkUri">
      <div class="p-1">
        <a
          :href="nodeMetaData.helpLinkUri"
          target="_blank"
          class="flex h-8 cursor-pointer items-center rounded-lg px-3 text-sm text-text-secondary hover:bg-gray-700"
        >
          {{ t('workflow.panel.helpLink') }}
        </a>
      </div>
      <div class="h-px bg-divider-regular"></div>
    </template>
    <!-- <div class="p-1">
      <div class="px-3 py-2 text-xs text-text-tertiary">
        <div class="mb-1 flex h-[22px] items-center font-medium">
          {{ t('workflow.panel.about').toLocaleUpperCase() }}
        </div>
        <div class="mb-1 leading-[18px] text-text-secondary">{{ nodeMetaData.description }}</div>
        <div class="leading-[18px]">
          {{ t('workflow.panel.createdBy') }} {{ nodeMetaData.author }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVueFlow } from '@vue-flow/core'
// import ChangeBlock from './change-block.vue'
import {
  canRunBySingle,
} from '@/components/workflow/utils'
import {
  useNodeDataUpdate,
  useNodesMetaData,
  useNodesInteractions,
  useNodesReadOnly,
  useNodesSyncDraft,
  useWorkflowInstance,
} from '@/components/workflow/hooks'
import { BlockEnum, type Node } from '@/types'

/** 面板操作弹窗 Props */
interface PanelOperatorPopupProps {
  /** 节点 ID */
  id: string
  /** 节点数据 */
  data: Node['data']
  /** 是否显示帮助链接 */
  showHelpLink?: boolean
}

const props = withDefaults(defineProps<PanelOperatorPopupProps>(), {
  showHelpLink: true,
})

const emit = defineEmits<{
  'close-popup': [],
  'edit-operator-detail': []
}>()

const { t } = useI18n()
const { instanceId } = useWorkflowInstance()
const store = useVueFlow(instanceId)
const edges = computed(() => store.edges.value)
const {
  handleNodeDelete,
  handleNodesDuplicate,
  handleNodeSelect,
  handleNodesCopy,
} = useNodesInteractions()
const { handleNodeDataUpdate } = useNodeDataUpdate()
// const { handleSyncWorkflowDraft } = useNodesSyncDraft()
const { nodesReadOnly } = useNodesReadOnly()
const { nodesMap } = useNodesMetaData()

/** 查找连接到当前节点的边 */
const edge = computed(() => {
  return edges.value.find(edge => edge.target === props.id)
})

/** 获取节点元数据 */
const nodeMetaData = computed(() => {
  const nodeType = props.data!.type
  const metaData = nodesMap![nodeType]
  return metaData?.metaData || {
    isTypeFixed: false,
    isSingleton: false,
    isUndeletable: false,
    helpLinkUri: '',
    description: '',
    author: '',
  }
})

/** 是否显示更改块选项 */
const showChangeBlock = computed(() => {
  return !nodeMetaData.value.isTypeFixed && !nodesReadOnly
})

/** 是否为子节点 */
const isChildNode = computed(() => {
  // return !!(props.data!.isInIteration || props.data!.isInLoop)
  return !!props.data!.isInLoop
})

/** 是否可以单独运行 */
const canRunBySingleValue = computed(() => {
  return canRunBySingle(props.data!.type, isChildNode.value)
})

/** 处理运行此步骤 */
const handleRunThisStep = () => {
  handleNodeSelect(props.id)
  handleNodeDataUpdate({ id: props.id, data: { _isSingleRun: true } })
  // handleSyncWorkflowDraft(true)
  emit('close-popup')
}

const canEditCalculatorDetail = computed(() => {
  return props.data!.type === BlockEnum.OperatorOverview
})

/** 处理复制 */
const handleCopy = () => {
  emit('close-popup')
  handleNodesCopy(props.id)
}

/** 处理复制 */
const handleDuplicate = () => {
  emit('close-popup')
  handleNodesDuplicate(props.id)
}

/** 处理删除 */
const handleDelete = () => {
  handleNodeDelete(props.id)
}

const handleEditCalculatorDetail = () => {
  emit('edit-operator-detail')
  emit('close-popup')
}
</script>

